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
import { 
    DndContext, 
    DragOverlay, 
    closestCorners, 
    PointerSensor, 
    useSensor, 
    useSensors, 
    useDroppable 
} from '@dnd-kit/core'

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

    const [allOrders, setAllOrders] = useState([])
    const [waitingOrders, setWaitingOrders] = useState([])
    const [readyOrders, setReadyOrders] = useState([])
    const [deliveredOrders, setDeliveredOrders] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [activeOrder, setActiveOrder] = useState(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    )

    // Listen to Firestore
    const handleOrdersSnapshot = useCallback((orders) => {
        setAllOrders(orders)
    }, [])

    useEffect(() => {
        let unsubscribeOrders

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!user) return
            unsubscribeOrders = listenToComOrders(user.uid, handleOrdersSnapshot)
        })

        return () => {
            unsubscribeAuth()
            if (unsubscribeOrders) unsubscribeOrders()
        }
    }, [handleOrdersSnapshot])

    // Search logic
    const orderMatchesSearch = (order, searchTerm) => {
        if (!searchTerm) return true

        const value = searchTerm.toLowerCase()

        const fieldsToSearch = [
            order.contactName,
            order.companyName,
            order.phoneNumber,
            order.email,
            order.deliveringInfo,
            order.notes,
            order.employee
        ]

        // Basic fields
        const basicMatch = fieldsToSearch.some(field =>
            field?.toLowerCase().includes(value)
        )

        if (basicMatch) return true

        // Product names
        if (order.orderProducts && Array.isArray(order.orderProducts)) {
            const productMatch = order.orderProducts.some(product =>
                product.productName?.toLowerCase().includes(value)
            )

            if (productMatch) return true
        }

        return false
    }

    function getLastMonday() {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday, go back 6 days, else go back to Monday
        
        const lastMonday = new Date(now);
        lastMonday.setDate(now.getDate() - daysToSubtract); // Go back to last week's Monday
        lastMonday.setHours(0, 0, 0, 0); // Set to start of day
        
        return lastMonday;
    }

    // Filter + Split by status
    useEffect(() => {
        const filtered = allOrders.filter(order =>
            orderMatchesSearch(order, searchValue)
        )

        const tempWaiting = []
        const tempReady = []
        const tempDelivered = []

        filtered.forEach(order => {
            switch (order.status) {
                case "waiting":
                    tempWaiting.push(order)
                    break
                case "ready":
                    tempReady.push(order)
                    break
                case "delivered":
                    const lastMonday = getLastMonday()
                    const orderDate = order.lastModified.toDate();
                    if (orderDate >= lastMonday) {
                        tempDelivered.push(order)
                    }
                    break
                default:
                    tempWaiting.push(order)
            }
        })

        setWaitingOrders(tempWaiting)
        setReadyOrders(tempReady)
        setDeliveredOrders(tempDelivered)

    }, [allOrders, searchValue])

    const handleDragStart = (event) => {
        const { active } = event
        const order = allOrders.find(o => o.id === active.id)
        setActiveOrder(order)
    }

    const handleDragEnd = (event) => {
        const { active, over } = event
        setActiveOrder(null)

        if (!over) return

        const order = allOrders.find(o => o.id === active.id)
        if (!order) return

        let newStatus = null

        if (over.id === 'waiting-zone') newStatus = 'waiting'
        if (over.id === 'ready-zone') newStatus = 'ready'
        if (over.id === 'delivered-zone') newStatus = 'delivered'

        if (!newStatus || newStatus === order.status) return

        setAllOrders(prev =>
            prev.map(o =>
                o.id === order.id ? { ...o, status: newStatus } : o
            )
        )

        handleStatusChange(order.id, newStatus).catch(error => {
            console.error('Failed to update order status:', error)
            // Firestore listener will correct state automatically if needed
        })
    }


    const handleDragCancel = () => {
        setActiveOrder(null)
    }

    return (
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
                        <p>Recherche :</p>
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

                    {/* Waiting */}
                    <div className={styles.waitingContainer}>
                        <div className={`${styles.headerWaiting} ${styles.header}`}>
                            <h4>En attente de produits</h4>
                        </div>

                        <DroppableContainer id="waiting-zone" className={styles.waitingOrdersContainer}>
                            {waitingOrders.map((order) => (
                                <StatusComponentOrder
                                    key={order.lastModified 
                                        ? `${order.id}-${order.lastModified.seconds}` 
                                        : order.id}
                                    orderObj={order}
                                    handleClick={handleOrderClick}
                                />
                            ))}
                        </DroppableContainer>
                    </div>

                    {/* Ready */}
                    <div className={styles.readyContainer}>
                        <div className={`${styles.headerReady} ${styles.header}`}>
                            <h4>Prêtes à livrer</h4>
                        </div>

                        <DroppableContainer id="ready-zone" className={styles.readyOrdersContainer}>
                            {readyOrders.map((order) => (
                                <StatusComponentOrder
                                    key={order.lastModified 
                                        ? `${order.id}-${order.lastModified.seconds}` 
                                        : order.id}
                                    orderObj={order}
                                    handleClick={handleOrderClick}
                                />
                            ))}
                        </DroppableContainer>
                    </div>

                    {/* Delivered */}
                    <div className={styles.deliveredContainer}>
                        <div className={`${styles.headerDelivered} ${styles.header}`}>
                            <h4>Livrées cette semaine</h4>
                        </div>

                        <DroppableContainer id="delivered-zone" className={styles.deliveredOrdersContainer}>
                            {deliveredOrders.map((order) => (
                                <StatusComponentOrder
                                    key={order.lastModified 
                                        ? `${order.id}-${order.lastModified.seconds}` 
                                        : order.id}
                                    orderObj={order}
                                    handleClick={handleOrderClick}
                                />
                            ))}
                        </DroppableContainer>
                    </div>

                </div>
            </div>

            {/* Drag Overlay */}
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
