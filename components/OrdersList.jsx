'use client'

import { useMemo, useState } from "react"
import styles from "./OrdersList.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowUp, faArrowDown, faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons"

export default function OrdersList({ orders = [], columns = [], onRowClick, defaultSortingDirection = "asc" }) {

    const [sortConfig, setSortConfig] = useState({
        key: columns[0].key,
        direction: defaultSortingDirection
    })

    const [searchQuery, setSearchQuery] = useState("")

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

    const matchesQuery = (value, query) => {
        if (value === null || value === undefined) return false

        // Firestore timestamp
        if (value?.toDate) {
            return value.toDate().toLocaleDateString().toLowerCase().includes(query)
        }

        // Array — recurse into each element
        if (Array.isArray(value)) {
            return value.some(item => matchesQuery(item, query))
        }

        // Plain object — recurse into each field
        if (typeof value === "object") {
            return Object.values(value).some(v => matchesQuery(v, query))
        }

        if (typeof value === "boolean") {
            return (value ? "oui" : "non").includes(query)
        }

        let normalized = String(value).toLowerCase()

        // Translate status slugs so searching "livrée" etc. works
        if (normalized === "waiting") normalized = "en attente"
        else if (normalized === "ready") normalized = "prête"
        else if (normalized === "delivered") normalized = "livrée"

        return normalized.includes(query)
    }

    const filteredOrders = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()
        if (!query) return orders

        return orders.filter(order =>
            Object.values(order).some(value => matchesQuery(value, query))
        )
    }, [orders, searchQuery])

    const sortedOrders = useMemo(() => {
        if (!sortConfig.key) return filteredOrders

        return [...filteredOrders].sort((a, b) => {
            let aValue = a[sortConfig.key]
            let bValue = b[sortConfig.key]

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

    }, [filteredOrders, sortConfig])

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
            <div className={styles.searchBarWrapper}>
                <div className={styles.searchBar}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Rechercher une commande…"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button className={styles.clearButton} onClick={() => setSearchQuery("")} aria-label="Effacer">
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    )}
                </div>
            </div>

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
                                <tr key={order.id} className={styles.row} onClick={() => { onRowClick(order) }}>
                                    {columns.map(col => (
                                        <td key={col.key} className={`${styles.cell} ${col.key === "companyName" || col.key === "product" ? styles.boldTableText : ""}`}>
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