'use client'

import { useMemo, useState } from "react"
import styles from "./OrdersList.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons"

export default function OrdersList({ orders = [], columns = [], onRowClick, defaultSortingDirection = "asc" }) {

    const [sortConfig, setSortConfig] = useState({
        key: columns[0].key,
        direction: defaultSortingDirection
    })

    const handleSort = (key) => {
        setSortConfig(prev => {
            if (prev.key === key) {
                return {
                    key,
                    direction: prev.direction === "asc" ? "desc" : "asc"
                }
            }
            return { key, direction: "asc" }
        })
    }

    const sortedOrders = useMemo(() => {
        if (!sortConfig.key) return orders

        return [...orders].sort((a, b) => {
            let aValue = a[sortConfig.key]
            let bValue = b[sortConfig.key]

            // Handle Firestore timestamps
            if (aValue?.toDate) aValue = aValue.toDate()
            if (bValue?.toDate) bValue = bValue.toDate()

            if (aValue == null) return 1
            if (bValue == null) return -1

            if (typeof aValue === "string") {
                aValue = aValue.toLowerCase()
                bValue = bValue.toLowerCase()
            }

            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
            return 0
        })

    }, [orders, sortConfig])

    const formatValue = (value) => {
        if (!value) return "-"

        if (value?.toDate) {
            return value.toDate().toLocaleDateString()
        }

        if (typeof value === "boolean") {
            return value ? "Oui" : "Non"
        }

        if (value === "waiting")
            return "En attente"
        else if (value === "ready")
            return "Prête"
        else if (value === "delivered")
            return "Livrée"

        return value
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    onClick={() => handleSort(col.key)}
                                    className={styles.headerCell}
                                >
                                    <div className={styles.headerContent}>
                                        {col.label}
                                        {sortConfig.key === col.key && (
                                            <FontAwesomeIcon
                                                icon={sortConfig.direction === "desc" ? faArrowUp : faArrowDown}
                                                className={styles.sortIcon}
                                            />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {sortedOrders.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className={styles.empty}>
                                    Aucune commande trouvée
                                </td>
                            </tr>
                        ) : (
                            sortedOrders.map(order => (
                                <tr key={order.id} className={styles.row} onClick={() => {onRowClick(order)}}>
                                    {columns.map(col => (
                                        <td key={col.key} className={`${styles.cell} ${col.key === "companyName" ? styles.boldTableText : ""}`}>
                                            {formatValue(order[col.key])}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
