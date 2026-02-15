'use client'

import AlertComponent from "@/components/AlertComponent"
import styles from "./page.module.css"
import StatusComponent from "@/components/StatusComponent"
import { useState, useEffect } from "react"
import NewOrderMenu from "@/components/NewOrderMenu"
import { newComOrder, updateComOrder } from "@/lib/comOrder"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { deleteOldArchivedOrders } from "@/lib/ArchiveCleanup"

export default function DashboardPage() {

    const emptyOrderObj = {
        contactName:"",
        companyName:"",
        phoneNumber:"",
        email:"",
        deliveringInfo:"",
        orderProducts:[],
        notes:"",
        employee:"",
        status:"waiting"
    }

    const [newOderMenuVisible, setNewOrderMenuVisible] = useState(false)
    const [orderObjInUse, setOrderObjInUse] = useState(emptyOrderObj)
    const [newOrderMenuMode, setNewOrderMenuMode] = useState("new") // Modes: "new": new order, "see": see order, "edit": edit order

    // Run cleanup in background when dashboard loads
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Run cleanup silently in the background
                    const result = await deleteOldArchivedOrders(user.uid)
                    if (result.deleted > 0) {
                        console.log(`Background cleanup: ${result.deleted} old orders deleted`)
                    }
                } catch (error) {
                    // Fail silently - don't interrupt user experience
                    console.error("Background cleanup error:", error)
                }
            }
        })

        return () => unsubscribe()
    }, [])

    const toggleEmptyNewOrderMenu = () => {
        setNewOrderMenuMode("new")
        setOrderObjInUse(emptyOrderObj)
        setNewOrderMenuVisible(!newOderMenuVisible)
    }

    const addOrder = async (orderObj) =>{
        const user = auth.currentUser
        if (!user){
            return
        }
        await newComOrder(user.uid, orderObj)
        toggleEmptyNewOrderMenu()
    }

    const openOrder = (orderObj) => {
        setNewOrderMenuMode("see")
        setOrderObjInUse(orderObj)
        setNewOrderMenuVisible(true)
    }

    const openEditMode = () => {
        setNewOrderMenuMode("edit")
    }

    const updateOrder = async (orderObj) => {
        const user = auth.currentUser
        if (!user){
            return
        }
        const { id, creationDate, ...updateFields } = orderObj
        await updateComOrder(user.uid, orderObj.id, updateFields)
        toggleEmptyNewOrderMenu()
    }

    const handleStatusChange = async (orderId, newStatus) => {
        const user = auth.currentUser
        if (!user) {
            console.error("No authenticated user")
            return
        }
        
        try {
            await updateComOrder(user.uid, orderId, { status: newStatus })
        } catch (error) {
            console.error("Failed to update order status:", error)
            // The Firebase listener in StatusComponent will automatically 
            // revert the UI to the correct state if the update fails
        }
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
            toggleEmptyNewOrderMenu()
        } catch (error) {
            console.error("Error branching order:", error)
            alert("Erreur lors de la séparation de la commande")
        }
    }

    return (
        <div className={styles.dashboardPage}>
            <AlertComponent handleSeeOrder={openOrder}/>
            <StatusComponent
                handleOpenNewOrderMenu={toggleEmptyNewOrderMenu}
                handleOrderClick={openOrder}
                handleStatusChange={handleStatusChange}
                />
            {newOderMenuVisible ? <NewOrderMenu
                handleCloseMenu={toggleEmptyNewOrderMenu}
                handleSave={addOrder}
                handleEdit={openEditMode}
                handleSaveOnEdit={updateOrder}
                startingOrderObj={orderObjInUse}
                menuMode={newOrderMenuMode}
                handleBranch={handleBranch}
                /> : <></>}
        </div>
    )
}