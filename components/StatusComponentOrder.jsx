'use client'

import styles from "./StatusComponentOrder.module.css"
import { useDraggable } from '@dnd-kit/core'

export default function StatusComponentOrder({ orderObj, handleClick }) {
    // Handle creationDate that might be null (serverTimestamp hasn't resolved yet)
    let creationDate = "En cours..."
    if (orderObj.creationDate) {
        try {
            creationDate = orderObj.creationDate.toDate().toLocaleDateString()
        } catch (error) {
            // If toDate() fails, creationDate might still be a serverTimestamp placeholder
            creationDate = "En cours..."
        }
    }

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({ id: orderObj.id })

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        //opacity: isDragging ? 0.5 : 1,
    } : undefined

    return(
        <div 
            ref={setNodeRef}
            style={{...style, opacity: isDragging ? 0 : 1}}
            {...attributes}
            {...listeners}
            className={`${styles.mainContainer} ${isDragging ? styles.dragging : ''}`}
            onClick={() => {handleClick(orderObj)}}
        >
            <p>{orderObj.companyName}</p>
            <p>{orderObj.nbProducts} produits</p>
            <p>{creationDate}</p>
        </div>
    )
}