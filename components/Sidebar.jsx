'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styles from "./Sidebar.module.css"
import { faAnglesLeft, faAnglesRight, faBars, faBoxArchive, faBuildingUser, faChess, faClipboardList, faGaugeHigh, faGear, faHouse, faPaperclip, faPeopleLine, faTimes } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export default function Sidebar() {

    const pathname = usePathname()
    const currentPage = pathname.split("/")[1]

    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 900)
            if (window.innerWidth > 900) {
                setIsMobileMenuOpen(false)
            }
        }
        
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handleCollapseSidebar = () => {
        setIsCollapsed(!isCollapsed)
    }

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const closeMobileMenu = () => {
        if (isMobile) {
            setIsMobileMenuOpen(false)
        }
    }

    return (
        <>
            {/* Mobile Hamburger Button */}
            {isMobile && (
                <button 
                    className={styles.mobileMenuButton} 
                    onClick={handleMobileMenuToggle}
                    aria-label="Toggle menu"
                >
                    <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
                </button>
            )}

            {/* Overlay for mobile */}
            {isMobile && isMobileMenuOpen && (
                <div 
                    className={styles.mobileOverlay} 
                    onClick={closeMobileMenu}
                />
            )}

            {/* Sidebar */}
            <div className={`${styles.sidebarContainer} ${isMobile && isMobileMenuOpen ? styles.mobileOpen : ''}`}>
                <div className={styles.topSection}>
                    <FontAwesomeIcon
                        icon={isCollapsed ? faAnglesRight : faAnglesLeft}
                        onClick={handleCollapseSidebar}
                    />
                </div>
                <div className={styles.entreprisesSection}>
                    <div className={styles.sectionTitle}>
                        <FontAwesomeIcon icon={faBuildingUser}/>
                        {!isCollapsed && <h3>Entreprises</h3>}
                    </div>
                    <div className={styles.sectionLinks}>
                        <Link 
                            className={currentPage === "dashboard" ? styles.currentPage : ""} 
                            href="/dashboard"
                            onClick={closeMobileMenu}
                        >
                            <FontAwesomeIcon icon={faGaugeHigh}/>
                            {!isCollapsed && <span>Dashboard</span>}
                        </Link>
                        <Link 
                            className={currentPage === "commandes" ? styles.currentPage : ""} 
                            href="/commandes"
                            onClick={closeMobileMenu}
                        >
                            <FontAwesomeIcon icon={faClipboardList}/>
                            {!isCollapsed && <span>Commandes</span>}
                        </Link>
                        <Link 
                            className={currentPage === "archive" ? styles.currentPage : ""} 
                            href="/archive"
                            onClick={closeMobileMenu}
                        >
                            <FontAwesomeIcon icon={faBoxArchive}/>
                            {!isCollapsed && <span>Archive</span>}
                        </Link>
                    </div>
                </div>
                <div className={styles.particuliersSection}>
                    <div className={styles.sectionTitle}>
                        <FontAwesomeIcon icon={faPeopleLine}/>
                        {!isCollapsed && <h3>Particuliers</h3>}
                    </div>
                    <div className={styles.sectionLinks}>
                        <Link 
                            className={currentPage === "papeterie" ? styles.currentPage : ""} 
                            href="/papeterie"
                            onClick={closeMobileMenu}
                        >
                            <FontAwesomeIcon icon={faPaperclip}/>
                            {!isCollapsed && <span>Papeterie</span>}
                        </Link>
                        <Link 
                            className={currentPage === "jeux" ? styles.currentPage : ""} 
                            href="/jeux"
                            onClick={closeMobileMenu}
                        >
                            <FontAwesomeIcon icon={faChess}/>
                            {!isCollapsed && <span>Jeux & puzzles</span>}
                        </Link>
                    </div>
                </div>
                <div className={styles.settingsSection}>
                    <Link href="/" onClick={closeMobileMenu}>
                        <FontAwesomeIcon icon={faHouse}/>
                        {!isCollapsed && <h4>Page d'accueil</h4>}
                    </Link>
                    <Link href="/settings" onClick={closeMobileMenu}>
                        <FontAwesomeIcon icon={faGear}/>
                        {!isCollapsed && <h4>Paramètres</h4>}
                    </Link>
                </div>
            </div>
        </>
    )
}
