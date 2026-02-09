'use client'

import { useState } from "react"
import styles from "./StatusComponentOrder.module.css"
import { useDraggable } from '@dnd-kit/core'

export default function StatusComponentOrder({ orderObj, handleClick }) {
    const [order, setOrder] = useState(orderObj)
    const creationDate = order.creationDate ? order.creationDate.toDate().toLocaleDateString() : "—"

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({ id: order.id })

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
    } : undefined

    return(
        <div 
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`${styles.mainContainer} ${isDragging ? styles.dragging : ''}`}
            onClick={() => {handleClick(order)}}
        >
            <p>{order.companyName}</p>
            <p>{order.nbProducts} produits</p>
            <p>{creationDate}</p>
        </div>
    )
}