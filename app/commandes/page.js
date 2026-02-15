'use client'

import { useEffect, useState, useCallback } from "react"
import OrdersList from "@/components/OrdersList"
import NewOrderMenu from "@/components/NewOrderMenu"
import styles from "./page.module.css"
import { auth } from "@/lib/firebase"
import { listenToComOrders, newComOrder, updateComOrder } from "@/lib/comOrder"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"

export default function OrdersPage() {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    const emptyOrderObj = {
        contactName: "",
        companyName: "",
        phoneNumber: "",
        email: "",
        deliveringInfo: "",
        orderProducts: [],
        notes: "",
        employee: "",
        status: "waiting"
    }

    // ----- State -----
    const [orders, setOrders] = useState([])
    const [newOrderMenuVisible, setNewOrderMenuVisible] = useState(false)
    const [orderInUse, setOrderInUse] = useState(emptyOrderObj)
    const [menuMode, setMenuMode] = useState("new") // "new" | "see" | "edit"

    // ----- Auth + Listener -----
    const handleOrdersSnapshot = useCallback((ordersFromDb) => {
        setOrders(ordersFromDb)
    }, [])

    useEffect(() => {
        let unsubscribeOrders

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!user) {
                // User is not logged in, redirect to login
                router.push('/login')
                return
            }

            // User is logged in
            setIsLoading(false)

            unsubscribeOrders = listenToComOrders(
                user.uid,
                handleOrdersSnapshot
            )
        })

        return () => {
            unsubscribeAuth()
            if (unsubscribeOrders) unsubscribeOrders()
        }
    }, [handleOrdersSnapshot, router])

    // ----- Handlers -----
    const toggleNewOrderMenu = () => {
        setNewOrderMenuVisible(prev => !prev)
        if (!newOrderMenuVisible) {
            // If opening, reset to new order mode
            setMenuMode("new")
            setOrderInUse(emptyOrderObj)
        }
    }

    const addOrder = async (orderObj) => {
        const user = auth.currentUser
        if (!user) return

        await newComOrder(user.uid, orderObj)
        toggleNewOrderMenu()
    }

    const updateOrder = async (orderObj) => {
        const user = auth.currentUser
        if (!user) return

        const { id, creationDate, ...updateFields } = orderObj
        await updateComOrder(user.uid, orderObj.id, updateFields)
        toggleNewOrderMenu()
    }

    const handleRowClick = (order) => {
        setOrderInUse(order)
        setMenuMode("see")
        setNewOrderMenuVisible(true)
    }

    const handleEdit = () => {
        setMenuMode("edit")
    }

    const handleBranch = async (deliveredOrder, remainingOrder) => {
        const user = auth.currentUser
        if (!user) return

        try {
            // Create the delivered order as a new order
            await newComOrder(user.uid, deliveredOrder)
            
            // Update the existing order with remaining products
            const { id, creationDate, ...updateFields } = remainingOrder
            await updateComOrder(user.uid, remainingOrder.id, updateFields)
            
            // Close the menu
            toggleNewOrderMenu()
        } catch (error) {
            console.error("Error branching order:", error)
            alert("Erreur lors de la séparation de la commande")
        }
    }

    // ----- Filter active orders -----
    const activeOrders = orders.filter(order => order.status !== "delivered")

    // ----- Render -----
    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                color: '#633493'
            }}>
                Chargement...
            </div>
        )
    }

    return (
        <div className={styles.pageWrapper}>

            <div className={styles.headerSection}>
                <div>
                    <h1 className={styles.title}>Commandes commerciales</h1>
                    <p className={styles.subtitle}>
                        Liste des commandes commerciales en cours
                    </p>
                </div>

                <button
                    className={styles.newOrderButton}
                    onClick={toggleNewOrderMenu}
                >
                    + Nouvelle Commande
                </button>
            </div>

            <div className={styles.tableSection}>
                <OrdersList
                    orders={activeOrders}
                    columns={[
                        { key: "creationDate", label: "Date" },
                        { key: "companyName", label: "Compagnie" },
                        { key: "status", label: "Statut" },
                        { key: "nbProducts", label: "Nombre de produits" },
                    ]}
                    onRowClick={handleRowClick}
                />
            </div>

            {newOrderMenuVisible && (
                <NewOrderMenu
                    handleCloseMenu={toggleNewOrderMenu}
                    handleSave={addOrder}
                    handleSaveOnEdit={updateOrder}
                    handleEdit={handleEdit}
                    startingOrderObj={orderInUse}
                    menuMode={menuMode}
                    handleBranch={handleBranch}
                />
            )}

        </div>
    )
}
