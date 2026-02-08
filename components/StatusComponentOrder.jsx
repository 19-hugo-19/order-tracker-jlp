'use client'

import { useState } from "react"
import styles from "./StatusComponentOrder.module.css"

export default function StatusComponentOrder({ orderObj, handleClick }) {
    const [order, setOrder] = useState(orderObj)
    const creationDate = order.creationDate ? order.creationDate.toDate().toLocaleDateString() : "—"

    return(
        <div className={styles.mainContainer} onClick={() => {handleClick(order)}}>
            <p>{order.companyName}</p>
            <p>{order.nbProducts} produits</p>
            <p>{creationDate}</p>
        </div>
    )
}