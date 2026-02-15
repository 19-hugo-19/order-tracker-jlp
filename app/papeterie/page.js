"use client"

import IndOrderMenu from "@/components/IndOrderMenu"
import styles from "./page.module.css"
import { useCallback, useEffect, useState } from "react"
import { deleteIndOrder, listenToIndOrders, newIndOrder, updateIndOrder } from "@/lib/indOrder"
import { auth } from "@/lib/firebase"
import OrdersList from "@/components/OrdersList"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"

export default function StationaryPage() {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    
    const emptyOrderObj = {
        customerName: "",
        phone: "",
        email: "",
        product: "",
        notes: "",
        employee: "",
        id: "",
        type:"stationary",
        supplier: ""
    }

    const [orders, setOrders] = useState([])
    const [orderMenuOpen, setOrderMenuOpen] = useState(false)
    const [menuMode, setMenuMode] = useState("new") // "new" | "see" | "edit"
    const [menuOrderObj, setMenuOrderObj] = useState(emptyOrderObj)

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

            unsubscribeOrders = listenToIndOrders(
                user.uid,
                handleOrdersSnapshot
            )
        })

        return () => {
            unsubscribeAuth()
            if (unsubscribeOrders) unsubscribeOrders()
        }
    }, [handleOrdersSnapshot, router])

    const openNewOrderMenu = () => {
        setMenuMode("new")
        setMenuOrderObj(emptyOrderObj)
        setOrderMenuOpen(true)
    }

    const openSeeOrderMenu = (order) => {
        setMenuMode("see")
        setMenuOrderObj(order)
        setOrderMenuOpen(true)
    }

    const handleCloseMenu = () => {
        setOrderMenuOpen(false)
    }

    const handleSaveOrder = async (order) => {
            const user = auth.currentUser
        if (!user) {
            return
        }
        await newIndOrder(user.uid, order)
        handleCloseMenu()
    }

    const handleSetEditMode = () => {
        setMenuMode("edit")
    }

    const handleSaveEditedOrder = async (order) => {
        const user = auth.currentUser
        if (!user){
            return
        }

        const {id, creationDate, ...orderObj} = order
        await updateIndOrder(user.uid, id, orderObj)
        handleCloseMenu()
    }

    const handleRowClick = (order) => {
        openSeeOrderMenu(order)
    }

    const handleDeleteOrder = async (orderId) => {
        const user = auth.currentUser
        if(!user){
            return
        }

        await deleteIndOrder(user.uid, orderId)
    }

    const activeOrders = orders.filter(order => order.type === "stationary")

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

            unsubscribeOrders = listenToIndOrders(
                user.uid,
                handleOrdersSnapshot
            )
        })

        return () => {
            unsubscribeAuth()
            if (unsubscribeOrders) unsubscribeOrders()
        }
    }, [handleOrdersSnapshot, router])

    return (
        <div className={styles.page}>
            <div className={styles.headerSection}>
                <div>
                    <h1 className={styles.title}>Commandes de papeterie</h1>
                    <p className={styles.subtitle}>
                        Liste des commandes de papeterie
                    </p>
                </div>

                <button
                    className={styles.newOrderButton}
                    onClick={openNewOrderMenu}
                >
                    + Nouvelle Commande
                </button>
            </div>

            <div className={styles.tableSection}>
                <OrdersList
                    orders={activeOrders}
                    columns={[
                        { key: "creationDate", label: "Date" },
                        { key: "product", label: "Produit" },
                        { key: "customerName", label: "Nom" },
                        { key: "phone", label: "Téléphone" },
                        { key: "notes", label: "Notes"},
                    ]}
                    onRowClick={handleRowClick}
                />
            </div>
            {orderMenuOpen && (
                <IndOrderMenu
                    menuMode={menuMode}
                    handleCloseMenu={handleCloseMenu}
                    handleSaveOrder={handleSaveOrder}
                    handleSetEditMode={handleSetEditMode}
                    handleSaveEditedOrder={handleSaveEditedOrder}
                    defaultOrder={menuOrderObj}
                    handleDeleteOrder={handleDeleteOrder}
                />
            )}
            
        </div>
    )
}