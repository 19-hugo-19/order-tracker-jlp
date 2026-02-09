'use client'

import AlertComponent from "@/components/AlertComponent"
import styles from "./page.module.css"
import StatusComponent from "@/components/StatusComponent"
import { useState } from "react"
import NewOrderMenu from "@/components/NewOrderMenu"
import { newComOrder, updateComOrder } from "@/lib/comOrder"
import { auth } from "@/lib/firebase"

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
    }

    const [newOderMenuVisible, setNewOrderMenuVisible] = useState(false)
    const [orderObjInUse, setOrderObjInUse] = useState(emptyOrderObj)
    const [newOrderMenuMode, setNewOrderMenuMode] = useState("new") // Modes: "new": new order, "see": see order, "edit": edit order

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

    return (
        <div className={styles.dashboardPage}>
            <AlertComponent/>
            <StatusComponent handleOpenNewOrderMenu={toggleEmptyNewOrderMenu} handleOrderClick={openOrder}/>
            {newOderMenuVisible ? <NewOrderMenu
                handleCloseMenu={toggleEmptyNewOrderMenu}
                handleSave={addOrder}
                handleEdit={openEditMode}
                handleSaveOnEdit={updateOrder}
                startingOrderObj={orderObjInUse}
                menuMode={newOrderMenuMode}
                /> : <></>}
        </div>
    )
}