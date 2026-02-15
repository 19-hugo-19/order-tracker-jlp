"use client"

import { useEffect, useState } from "react"
import styles from "./IndOrderMenu.module.css"

export default function IndOrderMenu({ menuMode, handleCloseMenu, handleSaveOrder, handleSetEditMode, handleSaveEditedOrder, defaultOrder }) {

    const [customerName, setCustomerName] = useState(defaultOrder.customerName)
    const [phone, setPhone] = useState(defaultOrder.phone)
    const [email, setEmail] = useState(defaultOrder.email)
    const [product, setProduct] = useState(defaultOrder.product)
    const [notes, setNotes] = useState(defaultOrder.notes)
    const [employee, setEmployee] = useState(defaultOrder.employee)
    const [id, setId] = useState(defaultOrder.id)
    const [type, setType] = useState(defaultOrder.type) // either "papeterie" or "jeux"

    const [mode, setMode] = useState(menuMode)

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === "Escape"){
                handleCloseMenu()
            }
        }

        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }

    }, [handleCloseMenu])

    useEffect(() => {
        setMode(menuMode)
    }, [menuMode])

    return (
        <div className={styles.totalComponent}>
            <div className={styles.background} onClick={handleCloseMenu}/>
            <div className={styles.mainContainer}>
                <div className={styles.customerSection}>
                    <div className={styles.sectionTitle}>
                        <h3>Infos client</h3>
                    </div>
                    <div className={styles.sectionInputs}>
                        <div className={styles.nameSection}>
                            <h4>Nom</h4>
                            <input
                                className={styles.standardInput}
                                placeholder={"Nom"}
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                disabled={mode === "see"}
                            />
                        </div>
                        <div className={styles.phoneSection}>
                            <h4>Téléphone</h4>
                            <input
                                className={styles.standardInput}
                                placeholder={"Téléphone"}
                                value={phone}
                                onChange={(e) => {setPhone(e.target.value)}}
                                disabled={mode === "see"}
                            />
                        </div>
                        <div className={styles.emailSection}>
                            <h4>{"Email (optionel)"}</h4>
                            <input
                                className={styles.standardInput}
                                placeholder={"Email"}
                                value={email}
                                onChange={(e) => {setEmail(e.target.value)}}
                                disabled={mode === "see"}
                            />
                        </div>
                    </div>
                    
                </div>
                <div className={styles.orderSection}>
                    <div className={styles.sectionTitle}>
                        <h3>Commande</h3>
                    </div>
                    <div className={styles.sectionInputs}>
                        <div className={styles.productSection}>
                            <h4>{"Produit (nom et numéro si applicable)"}</h4>
                            <input
                                className={styles.longInput}
                                placeholder={"Produit"}
                                value={product}
                                onChange={(e) => {setProduct(e.target.value)}}
                                disabled={mode === "see"}
                            />
                        </div>
                        <div className={styles.notesSection}>
                            <h4>Notes</h4>
                            <textarea
                                className={styles.notesArea}
                                placeholder={"Notes"}
                                value={notes}
                                onChange={(e) => {setNotes(e.target.value)}}
                                disabled={mode === "see"}
                            />
                        </div>
                        <div className={styles.employeeSection}>
                            <h4>Employé</h4>
                            <input
                                className={styles.standardInput}
                                placeholder={"Employé"}
                                value={employee}
                                onChange={(e) => {setEmployee(e.target.value)}}
                                disabled={mode === "see"}
                            />
                        </div>
                    </div>
                    <div className={styles.btnSection}>
                        <button
                            className={styles.cancelButton}
                            onClick={handleCloseMenu}
                        >{mode === "see" ? "Quitter" : "Annuler"}</button>
                        <button
                            className={styles.saveButton}
                            onClick={() => {
                            let orderObj = {
                                customerName: customerName,
                                phone: phone,
                                email: email,
                                product: product,
                                notes: notes,
                                employee: employee,
                                type: type
                            }
                            if(id !== "")
                                orderObj = {...orderObj, id:id}
                            switch (mode){
                                case "new":
                                    handleSaveOrder(orderObj)
                                    break
                                case "see":
                                    handleSetEditMode()
                                    break
                                case "edit":
                                    handleSaveEditedOrder(orderObj)
                                    break
                                default:
                                    handleSaveOrder(orderObj)
                                    break
                            }
                        }}
                        >{mode === "see" ? "Modifier" : "Sauvegarder"}</button>
                    </div>
                </div>
            </div>
        </div>
        
    )
}