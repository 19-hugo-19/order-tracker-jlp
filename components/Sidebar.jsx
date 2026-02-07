'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styles from "./Sidebar.module.css"
import { faAnglesLeft, faAnglesRight, faBars, faBoxArchive, faBuildingUser, faChess, faClipboardList, faGaugeHigh, faGear, faHotdog, faPaperclip, faPeopleLine } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { useState } from "react"

export default function Sidebar() {

    const [isCollapsed, setIsCollapsed] = useState(true)

    const handleCollapseSidebar = () => {
        setIsCollapsed(!isCollapsed)
    }

    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.topSection}>
                <FontAwesomeIcon
                icon={isCollapsed ? faAnglesRight : faAnglesLeft}
                onClick={handleCollapseSidebar}
                />
            </div>
            <div className={styles.entreprisesSection}>
                <div className={styles.sectionTitle}>
                    <FontAwesomeIcon icon={faBuildingUser}/>
                    {isCollapsed ? <></> :<h3>Entreprises</h3>}
                </div>
                <div className={styles.sectionLinks}>
                    <Link href="/dashboard">{isCollapsed ? <FontAwesomeIcon icon={faGaugeHigh}/> : "Dashboard"}</Link>
                    <Link href="/commandes">{isCollapsed ? <FontAwesomeIcon icon={faClipboardList}/> : "Commandes"}</Link>
                    <Link href="/archive">{isCollapsed ? <FontAwesomeIcon icon={faBoxArchive}/> : "Archive"}</Link>
                </div>
            </div>
            <div className={styles.particuliersSection}>
                <div className={styles.sectionTitle}>
                    <FontAwesomeIcon icon={faPeopleLine}/>
                    {isCollapsed ? <></> : <h3>Particuliers</h3>}
                </div>
                <div className={styles.sectionLinks}>
                    <Link href="/particuliers/papeterie">{isCollapsed ? <FontAwesomeIcon icon={faPaperclip}/> : "Papeterie"}</Link>
                    <Link href="/particuliers/archive">{isCollapsed ? <FontAwesomeIcon icon={faChess}/> : "Jeux & puzzles"}</Link>
                </div>
            </div>
            <div className={styles.settingsSection}>
                <Link href="/settings">
                    <FontAwesomeIcon icon={faGear}/>
                    {isCollapsed ? <></> : <h4>Paramètres</h4>}
                </Link>
            </div>
        </div>
    )
}