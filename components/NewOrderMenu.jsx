'use client'

import { useRef, useState } from "react"
import styles from "./NewOrderMenu.module.css"

export default function NewOrderMenu({ handleCloseMenu, handleSave, editMode, startingOrderObj }) {

    const [contactName, setContactName] = useState(startingOrderObj.contactName)
    const [companyName, setCompanyName] = useState(startingOrderObj.companyName)
    const [phoneNumber, setPhoneNumber] = useState(startingOrderObj.phoneNumber)
    const [email, setEmail] = useState(startingOrderObj.email)
    const [deliveringInfo, setDeliveringInfo] = useState(startingOrderObj.deliveringInfo)

    // orderProducts obj layout
    // orderProducts = [
    //     {
    //         productName:"value"
    //         qty:number
    //     }
    //     {
    //         productName:"value"
    //         qty:number
    //     }
    //     {
    //         productName:"value"
    //         qty:number
    //     }
    // ]

    const defaultTempProduct = {
        productName:"",
        qty:""
    }
    const [tempProduct, setTempProduct] = useState(defaultTempProduct)
    const [orderProducts, setOrderProducts] = useState(startingOrderObj.orderProducts)
    const [notes, setNotes] = useState(startingOrderObj.notes)
    const [employee, setEmployee] = useState(startingOrderObj.employee)

    const newProductRef = useRef(null)

    const handleLoadCustomer = () => {

    }

    return (
        <div className={styles.menu}>
            <div className={styles.darkBackground} onClick={handleCloseMenu}/>
            <div className={styles.mainContainer}>
                <div className={styles.customerSection}>
                    <div className={styles.customerSectionTitle}>
                        <h3>Infos Clients</h3>
                        <div className={styles.sub1RightSection}>
                            <button className={styles.loadCustomer} onClick={handleLoadCustomer}>
                                Charger client
                            </button>
                        </div>
                    </div>
                    <div className={styles.customerInfoSection}>
                        <div className={styles.customerInfoSubSection1}>
                            <div className={styles.sub1LeftSection}>
                                <div className={styles.fieldAndTitle}>
                                    <p>Nom contact</p>
                                    <input
                                        className={styles.normalInput}
                                        placeholder={"Nom"}
                                        value={contactName}
                                        onChange={(e) => setContactName(e.target.value)}
                                        disabled={!editMode}
                                    />
                                </div>
                                <div className={styles.fieldAndTitle}>
                                    <p>Compagnie</p>
                                    <input
                                        className={styles.normalInput}
                                        placeholder={"Compagnie"}
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        disabled={!editMode}
                                    />
                                </div>
                                <div className={styles.fieldAndTitle}>
                                    <p>Téléphone</p>
                                    <input
                                        className={styles.normalInput}
                                        placeholder={"Téléphone"}
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        disabled={!editMode}
                                    />
                                </div>
                                <div className={styles.fieldAndTitle}>
                                    <p>Email</p>
                                    <input
                                        className={styles.normalInput}
                                        placeholder={"Email"}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={!editMode}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.customerInfoSubSection2}>
                            <div className={styles.fieldAndTitle}>
                                <p>Infos livraison</p>
                                <textarea
                                    className={styles.largeInput}
                                    placeholder={"Informations de livraison"}
                                    value={deliveringInfo}
                                    onChange={(e) => setDeliveringInfo(e.target.value)}
                                    disabled={!editMode}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.orderSection}>
                    <div className={styles.leftOrderSection}>
                        <div className={styles.orderSectionTitle}>
                            <h3>Commande</h3>
                        </div>
                        <div className={styles.orderFieldsSection}>
                            <div className={styles.orderFieldsTitle}>
                                <p>Produit</p>
                                <p>Qté</p>
                            </div>
                            <div className={styles.orderFields}>
                                {orderProducts.map((product, ind) => {
                                    return (
                                        <div key={ind} className={styles.productRow}>
                                            <input
                                                className={styles.productInput}
                                                placeholder={"Nom et/ou numéro de produit"}
                                                value={product.productName}
                                                onChange={(e) => {
                                                    const newOrder = [...orderProducts]
                                                    newOrder[ind] = {
                                                        ...newOrder[ind],
                                                        productName: e.target.value
                                                    }
                                                    setOrderProducts(newOrder)
                                                }}
                                                disabled={!editMode}
                                            />
                                            <input
                                                className={styles.qtyInput}
                                                placeholder={"Quantité"}
                                                value={product.qty}
                                                onChange={(e) => {
                                                    const newOrder = [...orderProducts]
                                                    newOrder[ind] = {
                                                        ...newOrder[ind],
                                                        qty: e.target.value
                                                    }
                                                    setOrderProducts(newOrder)
                                                }}
                                                disabled={!editMode}
                                            />
                                        </div>
                                    )
                                })}
                                {/* New line to add products */}
                                <div className={styles.productRow}>
                                    <input
                                        ref={newProductRef}
                                        className={styles.productInput}
                                        placeholder={"Nom et/ou numéro de produit"}
                                        value={tempProduct.productName}
                                        onChange={(e) => {
                                            setTempProduct({
                                                ...tempProduct,
                                                productName:e.target.value
                                            })
                                        }}
                                        disabled={!editMode}
                                    />
                                    <input
                                        className={styles.qtyInput}
                                        placeholder={"Quantité"}
                                        value={tempProduct.qty}
                                        onChange={(e) => {
                                            setTempProduct({
                                                ...tempProduct,
                                                qty:e.target.value
                                            })
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Tab" || e.key === "Enter") {
                                            e.preventDefault()

                                            if (!tempProduct.productName) return

                                            setOrderProducts(prev => [...prev, tempProduct])
                                            setTempProduct(defaultTempProduct)

                                            // Wait for React to render the new row
                                            setTimeout(() => {
                                                newProductRef.current?.focus()
                                            }, 0)
                                            }
                                        }}
                                        disabled={!editMode}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.RightOrderSection}>
                        <div className={styles.notesSection}>
                            <h4>Notes</h4>
                            <textarea
                                className={styles.mediumInput}
                                placeholder={"Informations supplémentaires"}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                disabled={!editMode}
                            />
                        </div>
                        <div className={styles.employeeSection}>
                            <h4>Employé</h4>
                            <input
                                className={styles.normalInput}
                                placeholder={"Nom de l'employé"}
                                value={employee}
                                onChange={(e) => setEmployee(e.target.value)}
                                disabled={!editMode}
                            />
                        </div>
                        <div className={styles.buttonsSection}>
                            <button className={styles.cancelButton} onClick={handleCloseMenu}>Annuler</button>
                            <button className={styles.saveButton} onClick={() => {
                                    const orderObj = {
                                        contactName:contactName,
                                        companyName:companyName,
                                        phoneNumber:phoneNumber,
                                        email:email,
                                        deliveringInfo:deliveringInfo,
                                        orderProducts:orderProducts,
                                        notes:notes,
                                        employee:employee,
                                        status:"waiting",
                                        nbProducts:orderProducts.length
                                    }
                                    handleSave(orderObj)
                                }}>Sauvegarder</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}