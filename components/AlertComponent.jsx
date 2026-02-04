'use client'
import { useEffect, useState } from "react"
import styles from "./AlertComponent.module.css"

export default function AlertComponent() {

    const defaultOrder = {
        company:"Gestionnaire de la Capitale",
        nbProduct:12,
        status:"Prêt à livrer"
    }
    const [daysConsideredLate, setDaysConsideredLate] = useState(3)
    const [lateOrders, setLateOrders] = useState([defaultOrder, defaultOrder])

    return (
        <div className={styles.mainContainer}>
            <div className={styles.titleContainer}>
                <h3>Alertes - Commandes en retard depuis plus de {daysConsideredLate} jours</h3>
            </div>
            <div className={styles.lateOrders}>
                {lateOrders.map((order, ind) => {
                    const daysElapsed = 0
                    return (
                        <div key={ind} className={styles.orderCard}>
                            <p>{`${order.company} (${order.nbProduct} produits)`}</p>
                            <p>{order.status}</p>
                            <p>{`Créé il y a ${daysElapsed} jour${daysElapsed < 2 ? '' : 's'}`}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}