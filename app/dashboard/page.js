'use client'

import AlertComponent from "@/components/AlertComponent"
import styles from "./page.module.css"
import StatusComponent from "@/components/StatusComponent"
import { useState } from "react"
import NewOrderMenu from "@/components/NewOrderMenu"
import { newComOrder } from "@/lib/comOrder"
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

    const toggleEmptyNewOrderMenu = () => {
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
        setOrderObjInUse(orderObj)
        setNewOrderMenuVisible(true)
    }

    return (
        <div className={styles.dashboardPage}>
            <AlertComponent/>
            <StatusComponent handleOpenNewOrderMenu={toggleEmptyNewOrderMenu} handleOrderClick={openOrder}/>
            {newOderMenuVisible ? <NewOrderMenu
                handleCloseMenu={toggleEmptyNewOrderMenu}
                handleSave={addOrder}
                startingOrderObj={orderObjInUse}
                /> : <></>}
        </div>
    )
}