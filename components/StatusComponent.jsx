'use client'

import { useState } from "react"
import styles from "./StatusComponent.module.css"
import StatusComponentOrder from "./StatusComponentOrder"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import NewOrderBtn from "./NewOrderBtn"

export default function StatusComponent() {
    const defaultOrder = {
        company:"Gestionnaire de la Capitale",
        nbProducts:12,
        status:"Prêt à livrer",
        creationDate:"12 déc."
    }
    const [waitingOrders, setWaitingOrders] = useState([defaultOrder, defaultOrder])
    const [readyOrders, setReadyOrders] = useState([defaultOrder, defaultOrder])
    const [deliveredOrders, setDeliveredOrders] = useState([defaultOrder, defaultOrder])
    const [searchValue, setSearchValue] = useState("")


    return(
        <div className={styles.mainContainer}>
            <div className={styles.searchContainer}>
                <div className={styles.searchTitle}>
                    <h3>Commandes d'entreprises</h3>
                </div>
                <div className={styles.searchComponents}>
                    <p>Recherche : </p>
                    <input
                        className={styles.searchInput}
                        placeholder="Entrez un mot-clé"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <FontAwesomeIcon icon={faMagnifyingGlass}/>
                </div>
                <div className={styles.newOrder}>
                    <NewOrderBtn/>
                </div>
            </div>
            <div className={styles.statusSections}>
                <div className={styles.waitingContainer}>
                    <div className={`${styles.headerWaiting} ${styles.header}`}>
                        <h4>En attente de produits</h4>
                    </div>
                    <div className={styles.waitingOrdersContainer}>
                        {
                        waitingOrders.map((order, ind) => {
                            return (
                                <StatusComponentOrder key={ind} orderObj={order}/>
                            )
                        })
                        }
                    </div>
                </div>
                <div className={styles.readyContainer}>
                    <div className={`${styles.headerReady} ${styles.header}`}>
                        <h4>Prêtes à livrer</h4>
                    </div>
                    <div className={styles.readyOrdersContainer}>
                        {
                        readyOrders.map((order, ind) => {
                            return (
                                <StatusComponentOrder key={ind} orderObj={order}/>
                            )
                        })
                        }
                    </div>
                </div>
                <div className={styles.deliveredContainer}>
                    <div className={`${styles.headerDelivered} ${styles.header}`}>
                        <h4>Livrées</h4>
                    </div>
                    <div className={styles.deliveredOrdersContainer}>
                        {
                        deliveredOrders.map((order, ind) => {
                            return (
                                <StatusComponentOrder key={ind} orderObj={order}/>
                            )
                        })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}