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

export default function StatusComponent({ handleOpenNewOrderMenu, handleOrderClick }) {
    const [waitingOrders, setWaitingOrders] = useState([])
    const [readyOrders, setReadyOrders] = useState([])
    const [deliveredOrders, setDeliveredOrders] = useState([])
    const [searchValue, setSearchValue] = useState("")
    
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

    return(
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
                    <div className={styles.waitingOrdersContainer}>
                        {
                        waitingOrders.map((order, ind) => {
                            return (
                                <StatusComponentOrder
                                key={order.lastModified ? `${order.id}-${order.lastModified.seconds}` : order.id}
                                orderObj={order}
                                handleClick={handleOrderClick}
                                />
                            )
                        })
                        }
                    </div>
                </div>
                <div className={styles.readyContainer}>
                    <div className={`${styles.headerReady} ${styles.header}`}>
                        <h4>Prêtes à livrer</h4>
                    </div>
                    <div className={styles.readyOrdersContainer}>
                        {
                        readyOrders.map((order, ind) => {
                            return (
                                <StatusComponentOrder
                                key={order.lastModified ? `${order.id}-${order.lastModified.seconds}` : order.id}
                                orderObj={order}
                                handleClick={handleOrderClick}
                                />
                            )
                        })
                        }
                    </div>
                </div>
                <div className={styles.deliveredContainer}>
                    <div className={`${styles.headerDelivered} ${styles.header}`}>
                        <h4>Livrées</h4>
                    </div>
                    <div className={styles.deliveredOrdersContainer}>
                        {
                        deliveredOrders.map((order, ind) => {
                            return (
                                <StatusComponentOrder
                                key={order.lastModified ? `${order.id}-${order.lastModified.seconds}` : order.id}
                                orderObj={order}
                                handleClick={handleOrderClick}
                                />
                            )
                        })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}