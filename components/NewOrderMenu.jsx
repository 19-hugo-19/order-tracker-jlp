'use client'

import { useState } from "react"
import styles from "./NewOrderMenu.module.css"

export default function NewOrderMenu() {

    const [contactName, setContactName] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [email, setEmail] = useState("")
    const [deliveringInfo, setDeliveringInfo] = useState("")

    // order obj layout
    // order = [
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
    const [order, setOrder] = useState([])
    const [notes, setNotes] = useState("")
    const [employee, setEmployee] = useState("")

    const handleLoadCustomer = () => {

    }

    return (
        <div className={styles.menu}>
            <div className={styles.darkBackground}/>
            <div className={styles.mainContainer}>
                <div className={styles.customerSection}>
                    <div className={styles.customerSectionTitle}>
                        <h3>Infos Clients</h3>
                        <div className={styles.sub1RightSection}>
                            <btn className={styles.loadCustomer} onClick={handleLoadCustomer}>
                                Charger client
                            </btn>
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
                                    />
                                </div>
                                <div className={styles.fieldAndTitle}>
                                    <p>Compagnie</p>
                                    <input
                                        className={styles.normalInput}
                                        placeholder={"Compagnie"}
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                    />
                                </div>
                                <div className={styles.fieldAndTitle}>
                                    <p>Téléphone</p>
                                    <input
                                        className={styles.normalInput}
                                        placeholder={"Téléphone"}
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
                                <div className={styles.fieldAndTitle}>
                                    <p>Email</p>
                                    <input
                                        className={styles.normalInput}
                                        placeholder={"Email"}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                {order.map((product, ind) => {
                                    return (
                                        <div key={ind} className={styles.productRow}>
                                            <input
                                                className={styles.productInput}
                                                placeholder={"Nom et/ou numéro de produit"}
                                                value={product.productName}
                                                onChange={(e) => {
                                                    const newOrder = [...order]
                                                    newOrder[ind] = {
                                                        ...newOrder[ind],
                                                        productName: e.target.value
                                                    }
                                                    setOrder(newOrder)
                                                }}
                                            />
                                            <input
                                                className={styles.qtyInput}
                                                placeholder={"Quantité"}
                                                value={product.qty}
                                                onChange={(e) => {
                                                    const newOrder = [...order]
                                                    newOrder[ind] = {
                                                        ...newOrder[ind],
                                                        qty: e.target.value
                                                    }
                                                    setOrder(newOrder)
                                                }}
                                            />
                                        </div>
                                    )
                                })}
                                {/* New line to add products */}
                                <div className={styles.productRow}>
                                    <input
                                        className={styles.productInput}
                                        placeholder={"Nom et/ou numéro de produit"}
                                        value={tempProduct.productName}
                                        onChange={(e) => {
                                            setTempProduct({
                                                ...tempProduct,
                                                productName:e.target.value
                                            })
                                        }}
                                        onBlur={() => {
                                            setOrder([...order, tempProduct])
                                            setTempProduct(defaultTempProduct)
                                        }}
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
                            />
                        </div>
                        <div className={styles.employeeSection}>
                            <h4>Employé</h4>
                            <input
                                className={styles.normalInput}
                                placeholder={"Nom de l'employé"}
                                value={employee}
                                onChange={(e) => setEmployee(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}