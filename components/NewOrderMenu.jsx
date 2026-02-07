'use client'

import { useState } from "react"
import styles from "./NewOrderMenu.module.css"

export default function NewOrderMenu() {

    const [contactName, setContactName] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [email, setEmail] = useState("")
    const [deliveringInfo, setDeliveringInfo] = useState("")

    return (
        <div className={styles.mainContainer}>
            <div className={styles.customerSection}>
                <div className={styles.customerSectionTitle}>
                    <h3>Infos Clients</h3>
                </div>
                <div className={customerInfoSection}>
                    <div className={styles.customerInfoSubSection1}>
                        <div className={styles.fieldAndTitle}>
                            <p>Nom contact</p>
                            <input
                                className={styles.normalInput}
                                placeholder={Nom}
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                            />
                        </div>
                        <div className={styles.fieldAndTitle}>
                            <p>Compagnie</p>
                            <input
                                className={styles.normalInput}
                                placeholder={Compagnie}
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </div>
                        <div className={styles.fieldAndTitle}>
                            <p>Téléphone</p>
                            <input
                                className={styles.normalInput}
                                placeholder={Téléphone}
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.customerInfoSubSection2}>

                    </div>
                </div>
            </div>
        </div>
    )
}