'use client'
import { useEffect, useState } from "react"
import styles from "./AlertComponent.module.css"
import { auth } from "@/lib/firebase"
import { listenToComOrders } from "@/lib/comOrder"
import { onAuthStateChanged } from "firebase/auth"

export default function AlertComponent({ handleSeeOrder }) {
    const [daysConsideredLate, setDaysConsideredLate] = useState(3)
    const [lateOrders, setLateOrders] = useState([])

    useEffect(() => {
        let unsubscribeOrders

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!user) {
                setLateOrders([])
                return
            }

            // Listen to all orders and filter for late ones
            unsubscribeOrders = listenToComOrders(user.uid, (orders) => {
                const now = new Date()
                const millisecondsPerDay = 1000 * 60 * 60 * 24
                
                // Filter orders that are:
                // 1. Not delivered yet (waiting or ready)
                // 2. Created more than daysConsideredLate days ago
                const late = orders.filter(order => {
                    if (order.status === 'delivered') return false
                    
                    if (!order.creationDate) return false
                    
                    try {
                        const creationDate = order.creationDate.toDate()
                        const daysElapsed = Math.floor((now - creationDate) / millisecondsPerDay)
                        return daysElapsed >= daysConsideredLate
                    } catch (error) {
                        // If creationDate isn't synced yet, skip it
                        return false
                    }
                })
                
                setLateOrders(late)
            })
        })

        return () => {
            unsubscribeAuth()
            if (unsubscribeOrders) unsubscribeOrders()
        }
    }, [daysConsideredLate])

    // Calculate days elapsed for display
    const calculateDaysElapsed = (creationDate) => {
        if (!creationDate) return 0
        
        try {
            const created = creationDate.toDate()
            const now = new Date()
            const millisecondsPerDay = 1000 * 60 * 60 * 24
            return Math.floor((now - created) / millisecondsPerDay)
        } catch (error) {
            return 0
        }
    }

    // Map status to French display text
    const getStatusText = (status) => {
        switch(status) {
            case 'waiting':
                return 'En attente de produits'
            case 'ready':
                return 'Prêt à livrer'
            case 'delivered':
                return 'Livré'
            default:
                return status
        }
    }

    // Don't render if no late orders
    if (lateOrders.length === 0) {
        return null
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.titleContainer}>
                <div className={styles.warningIcon}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 6V11M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"/>
                    </svg>
                </div>
                <h3>
                    {lateOrders.length} commande{lateOrders.length > 1 ? 's' : ''} en retard depuis plus de {daysConsideredLate} jour{daysConsideredLate > 1 ? 's' : ''}
                </h3>
            </div>
            <div className={styles.lateOrders}>
                {lateOrders.map((order) => {
                    const daysElapsed = calculateDaysElapsed(order.creationDate)
                    return (
                        <div key={order.id} className={styles.orderCard} onClick={() => {handleSeeOrder(order)}}>
                            <div className={styles.orderInfo}>
                                <p className={styles.companyName}>
                                    {order.companyName || 'Sans nom'}
                                </p>
                                <p className={styles.productCount}>
                                    {order.nbProducts} produit{order.nbProducts > 1 ? 's' : ''}
                                </p>
                            </div>
                            <div className={styles.orderStatus}>
                                <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                                    {getStatusText(order.status)}
                                </span>
                            </div>
                            <div className={styles.orderTime}>
                                <p className={styles.daysElapsed}>
                                    {daysElapsed} jour{daysElapsed > 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}