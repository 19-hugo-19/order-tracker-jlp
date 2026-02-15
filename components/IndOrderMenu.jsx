"use client"

import { useEffect, useState } from "react"
import styles from "./IndOrderMenu.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"

export default function IndOrderMenu({ menuMode, handleCloseMenu, handleSaveOrder, handleSetEditMode, handleSaveEditedOrder, defaultOrder, handleDeleteOrder }) {

    const [customerName, setCustomerName] = useState(defaultOrder.customerName)
    const [phone, setPhone] = useState(defaultOrder.phone)
    const [email, setEmail] = useState(defaultOrder.email)
    const [product, setProduct] = useState(defaultOrder.product)
    const [notes, setNotes] = useState(defaultOrder.notes)
    const [employee, setEmployee] = useState(defaultOrder.employee)
    const [id, setId] = useState(defaultOrder.id)
    const [type, setType] = useState(defaultOrder.type) // either "stationary" or "games"
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [supplier, setSupplier] = useState("")

    const [mode, setMode] = useState(menuMode)

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === "Escape"){
                if(deleteModalOpen){
                    setDeleteModalOpen(false)
                }
                else{
                    handleCloseMenu()
                }
            }
        }

        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }

    }, [handleCloseMenu, deleteModalOpen])

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
                            <div className={styles.productSectionProduct}>
                                <h4>
                                    {"Produit (nom et numéro si applicable)"}
                                    <abbr
                                        className={styles.infoIcon}
                                        title={type === "games" ? "Indiquer le nom du jeux ou du puzzle ainsi que le code de produit si applicable" :
                                            "Indiquer le code de produit Hamster et une description du produit"
                                        }
                                    >
                                        <FontAwesomeIcon icon={faCircleInfo}/>
                                    </abbr>
                                </h4>
                                <input
                                    className={styles.longInput}
                                    placeholder={"Produit"}
                                    value={product}
                                    onChange={(e) => {setProduct(e.target.value)}}
                                    disabled={mode === "see"}
                                />
                            </div>
                            <div className={styles.productSectionSupplier}>
                                <h4>Fournisseur</h4>
                                <input
                                    className={styles.standardInput}
                                    placeholder={"Fournisseur"}
                                    value={supplier}
                                    onChange={(e) => {setSupplier(e.target.value)}}
                                    disabled={mode === "see"}
                                />
                            </div>
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
                        {(mode === "see" || mode === "edit") &&
                        (<button className={styles.deleteButton} onClick={() => {setDeleteModalOpen(true)}}>Supprimer</button>)
                        }
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
                                type: type,
                                supplier: supplier
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
            <div className={`${styles.deleteModal} ${deleteModalOpen ? styles.open : ''}`}>
                <div className={styles.deleteModalBackground}/>
                <div className={styles.deleteModalContainer}>
                    <h3>Voulez-vous réellement supprimer cette commande ?</h3>
                    <h4>{product} - {customerName}</h4>
                    <div className={styles.deleteModalButtons}>
                        <button onClick={() => {setDeleteModalOpen(false)}}>Annuler</button>
                        <button onClick={() => {
                            handleDeleteOrder(id)
                            setDeleteModalOpen(false)
                            handleCloseMenu()
                            }}>Supprimer</button>
                    </div>
                </div>
            </div>
        </div>
        
    )
}