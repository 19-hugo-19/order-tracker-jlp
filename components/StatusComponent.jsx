'use client'

import { useCallback, useEffect, useState } from "react"
import styles from "./StatusComponent.module.css"
import StatusComponentOrder from "./StatusComponentOrder"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import NewOrderBtn from "./NewOrderBtn"
import { auth } from "@/lib/firebase"
import { listenToComOrders } from "@/lib/comOrder"
import { onAuthStateChanged } from "firebase/auth"
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core'

function DroppableContainer({ id, children, className }) {
    const { setNodeRef, isOver } = useDroppable({ id })
    
    return (
        <div 
            ref={setNodeRef} 
            className={`${className} ${isOver ? styles.dropActive : ''}`}
        >
            {children}
        </div>
    )
}

export default function StatusComponent({ handleOpenNewOrderMenu, handleOrderClick, handleStatusChange }) {
    const [waitingOrders, setWaitingOrders] = useState([])
    const [readyOrders, setReadyOrders] = useState([])
    const [deliveredOrders, setDeliveredOrders] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [activeOrder, setActiveOrder] = useState(null)
    
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )
    
    const filterOrders = useCallback((orders) => {
        const tempWaiting = []
        const tempReady = []
        const tempDelivered = []
        
        orders.forEach(order => {
            switch(order.status){
                case "waiting":
                    tempWaiting.push(order)
                    break
                case "ready":
                    tempReady.push(order)
                    break
                case "delivered":
                    tempDelivered.push(order)
                    break  
                default:
                    tempWaiting.push(order)
                    break
            }
        })
        
        setWaitingOrders(tempWaiting)
        setReadyOrders(tempReady)
        setDeliveredOrders(tempDelivered)
    }, [])

    useEffect(() => {
        let unsubscribeOrders

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!user) return

            unsubscribeOrders = listenToComOrders(user.uid, filterOrders)
        })

        return () => {
            unsubscribeAuth()
            if (unsubscribeOrders) unsubscribeOrders()
        }
    }, [filterOrders])

    const handleDragStart = (event) => {
        const { active } = event
        const allOrders = [...waitingOrders, ...readyOrders, ...deliveredOrders]
        const order = allOrders.find(o => o.id === active.id)
        setActiveOrder(order)
    }

    const handleDragEnd = (event) => {
        const { active, over } = event
        setActiveOrder(null)
        
        if (!over) return
        
        const allOrders = [...waitingOrders, ...readyOrders, ...deliveredOrders]
        const order = allOrders.find(o => o.id === active.id)
        
        if (!order) return
        
        // Determine the new status based on the drop zone
        let newStatus = null
        
        if (over.id === 'waiting-zone') {
            newStatus = 'waiting'
        } else if (over.id === 'ready-zone') {
            newStatus = 'ready'
        } else if (over.id === 'delivered-zone') {
            newStatus = 'delivered'
        }
        
        // Only update if status actually changed
        if (newStatus && newStatus !== order.status) {
            handleStatusChange(order.id, newStatus)
        }
    }

    const handleDragCancel = () => {
        setActiveOrder(null)
    }

    return(
        <DndContext 
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <div className={styles.mainContainer}>
                <div className={styles.searchContainer}>
                    <div className={styles.searchTitle}>
                        <h3>Commandes d'entreprises</h3>
                    </div>
                    <div className={styles.searchComponents}>
                        <p>Recherche : </p>
                        <input
                            className={styles.searchInput}
                            placeholder="Entrez un mot-clé"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    </div>
                    <div className={styles.newOrder}>
                        <NewOrderBtn clickFct={handleOpenNewOrderMenu}/>
                    </div>
                </div>
                <div className={styles.statusSections}>
                    <div className={styles.waitingContainer}>
                        <div className={`${styles.headerWaiting} ${styles.header}`}>
                            <h4>En attente de produits</h4>
                        </div>
                        <DroppableContainer id="waiting-zone" className={styles.waitingOrdersContainer}>
                            {waitingOrders.map((order) => (
                                <StatusComponentOrder
                                    key={order.lastModified ? `${order.id}-${order.lastModified.seconds}` : order.id}
                                    orderObj={order}
                                    handleClick={handleOrderClick}
                                />
                            ))}
                        </DroppableContainer>
                    </div>
                    <div className={styles.readyContainer}>
                        <div className={`${styles.headerReady} ${styles.header}`}>
                            <h4>Prêtes à livrer</h4>
                        </div>
                        <DroppableContainer id="ready-zone" className={styles.readyOrdersContainer}>
                            {readyOrders.map((order) => (
                                <StatusComponentOrder
                                    key={order.lastModified ? `${order.id}-${order.lastModified.seconds}` : order.id}
                                    orderObj={order}
                                    handleClick={handleOrderClick}
                                />
                            ))}
                        </DroppableContainer>
                    </div>
                    <div className={styles.deliveredContainer}>
                        <div className={`${styles.headerDelivered} ${styles.header}`}>
                            <h4>Livrées</h4>
                        </div>
                        <DroppableContainer id="delivered-zone" className={styles.deliveredOrdersContainer}>
                            {deliveredOrders.map((order) => (
                                <StatusComponentOrder
                                    key={order.lastModified ? `${order.id}-${order.lastModified.seconds}` : order.id}
                                    orderObj={order}
                                    handleClick={handleOrderClick}
                                />
                            ))}
                        </DroppableContainer>
                    </div>
                </div>
            </div>
            <DragOverlay>
                {activeOrder ? (
                    <div className={styles.dragOverlay}>
                        <StatusComponentOrder
                            orderObj={activeOrder}
                            handleClick={() => {}}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}