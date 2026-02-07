'use client'

import AlertComponent from "@/components/AlertComponent"
import styles from "./page.module.css"
import StatusComponent from "@/components/StatusComponent"
import { useState } from "react"
import NewOrderMenu from "@/components/NewOrderMenu"

export default function DashboardPage() {

    const [newOderMenuVisible, setNewOrderMenuVisible] = useState(false)

    const toggleNewOrderMenu = () => {
        setNewOrderMenuVisible(!newOderMenuVisible)
    }

    return (
        <div className={styles.dashboardPage}>
            <AlertComponent/>
            <StatusComponent/>
            <NewOrderMenu/>
        </div>
    )
}