'use client'

import { useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { getUserSettings, updateUserSettings, resetUserSettings, DEFAULT_SETTINGS } from "@/lib/settings"
import styles from "./page.module.css"

export default function SettingsPage(){
    const [user, setUser] = useState(null)
    const [daysUntilLate, setDaysUntilLate] = useState(DEFAULT_SETTINGS.daysUntilLate)
    const [archiveMonths, setArchiveMonths] = useState(DEFAULT_SETTINGS.archiveMonths)
    const [isSaved, setIsSaved] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            if (!currentUser) {
                setIsLoading(false)
            }
        })

        return () => unsubscribe()
    }, [])

    // Load settings from Firestore when user is available
    useEffect(() => {
        async function loadSettings() {
            if (!user) {
                return
            }

            try {
                setIsLoading(true)
                const settings = await getUserSettings(user.uid)
                setDaysUntilLate(settings.daysUntilLate)
                setArchiveMonths(settings.archiveMonths)
                setError(null)
            } catch (err) {
                console.error("Error loading settings:", err)
                setError("Erreur lors du chargement des paramètres")
            } finally {
                setIsLoading(false)
            }
        }

        loadSettings()
    }, [user])

    const handleSave = async () => {
        if (!user) return

        try {
            await updateUserSettings(user.uid, {
                daysUntilLate,
                archiveMonths
            })
            
            setIsSaved(true)
            setError(null)
            setTimeout(() => setIsSaved(false), 2000)
        } catch (err) {
            console.error("Error saving settings:", err)
            setError("Erreur lors de la sauvegarde des paramètres")
        }
    }

    const handleReset = async () => {
        if (!user) return

        try {
            await resetUserSettings(user.uid)
            setDaysUntilLate(DEFAULT_SETTINGS.daysUntilLate)
            setArchiveMonths(DEFAULT_SETTINGS.archiveMonths)
            setError(null)
        } catch (err) {
            console.error("Error resetting settings:", err)
            setError("Erreur lors de la réinitialisation des paramètres")
        }
    }

    if (isLoading) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.loading}>Chargement des paramètres...</div>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.error}>Vous devez être connecté pour accéder aux paramètres</div>
                </div>
            </div>
        )
    }

    return(
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Paramètres</h1>
                    <p className={styles.subtitle}>Configurez le comportement de l'application</p>
                </div>

                {error && (
                    <div className={styles.errorBanner}>
                        {error}
                    </div>
                )}

                <div className={styles.settingsGrid}>
                    {/* Setting 1: Days until late */}
                    <div className={styles.settingCard}>
                        <div className={styles.settingHeader}>
                            <h3>Jours avant retard</h3>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={daysUntilLate}
                                    onChange={(e) => setDaysUntilLate(Number(e.target.value))}
                                    className={styles.numberInput}
                                />
                                <span className={styles.unit}>jours</span>
                            </div>
                        </div>
                        <p className={styles.description}>
                            Définit le nombre de jours après lequel une commande est considérée comme en retard. 
                            Les commandes dépassant ce délai seront marquées visuellement pour faciliter leur suivi.
                        </p>
                        <div className={styles.example}>
                            <span className={styles.exampleLabel}>Exemple:</span>
                            <span className={styles.exampleText}>
                                Une commande créée il y a {daysUntilLate} jour{daysUntilLate > 1 ? 's' : ''} sera marquée comme en retard
                            </span>
                        </div>
                    </div>

                    {/* Setting 2: Archive deletion */}
                    <div className={styles.settingCard}>
                        <div className={styles.settingHeader}>
                            <h3>Suppression automatique des archives</h3>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={archiveMonths}
                                    onChange={(e) => setArchiveMonths(Number(e.target.value))}
                                    className={styles.numberInput}
                                />
                                <span className={styles.unit}>mois</span>
                            </div>
                        </div>
                        <p className={styles.description}>
                            Les commandes archivées seront automatiquement supprimées après ce délai. 
                            Cela permet de garder la base de données propre tout en conservant un historique suffisant.
                        </p>
                        <div className={styles.example}>
                            <span className={styles.exampleLabel}>Exemple:</span>
                            <span className={styles.exampleText}>
                                Les commandes archivées depuis plus de {archiveMonths} mois seront définitivement supprimées
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className={styles.actions}>
                    <button 
                        className={styles.resetButton}
                        onClick={handleReset}
                    >
                        Réinitialiser
                    </button>
                    <button 
                        className={`${styles.saveButton} ${isSaved ? styles.saved : ''}`}
                        onClick={handleSave}
                    >
                        {isSaved ? '✓ Sauvegardé' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
            <p className={styles.devContact}>
              En cas de problème, communiquer avec le développeur :{" "}
              <a href="mailto:hugopelletier9@gmail.com">
                hugopelletier9@gmail.com
              </a>
            </p>
        </div>
    )
}
