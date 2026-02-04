'use client'

import { useState } from "react"
import styles from "./StatusComponentOrder.module.css"

export default function StatusComponentOrder({orderObj}) {
    const [order, setOrder] = useState(orderObj)
    return(
        <div className={styles.mainContainer}>
            <p>{order.company}</p>
            <p>{order.nbProducts} produits</p>
            <p>{order.creationDate}</p>
        </div>
    )
}