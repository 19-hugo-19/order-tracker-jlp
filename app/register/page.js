'use client'

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { registerUser } from "@/lib/registerUser";

export default function RegisterPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [waiting, setWaiting] = useState(false)
    const router = useRouter()

    const handleRegister = async (e) => {
        e.preventDefault()
        setWaiting(true)
        setError("")

        try {
            await registerUser(email, password)
            router.push("/dashboard")
        } catch (err) {
            switch (error.code) {
                case "auth/email-already-in-use":
                    setError("Un utilisateur avec cet email existe déjà.")
                    break
                case "auth/invalid-email":
                    setError("L'adresse email n'est pas valide.")
                    break
                case "auth/weak-password":
                    setError("Le mot de passe est trop faible.")
                    break
                default:
                    setError("Une erreur est survenue. Veuillez réessayer.")

            }
        } finally {
            setWaiting(false)
        }
    }

    const goToLogin = () => {
        router.push("/login")
    }

    // Redirect if already authentified
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user) {
                router.replace("/dashboard")
            }
        })

        return() => unsubscribe()
    }, [router])

    return(
        <div className={styles.loginPage}>
            <div className={styles.loginContainer}>
                {error !== "" && (
                <div className={styles.errorContainer}>
                    <p>Erreur: {error}</p>
                </div>)}
                <h2>Créer un compte</h2>
                <form onSubmit={handleRegister} className={styles.form}>
                    <input
                        className={styles.input}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button onClick={handleRegister} disabled={waiting}>
                        {waiting ? "Traitement en cours..." : "Créer un compte"}
                    </button>
                </form>
                <div className={styles.changeLoginRegister}>
                    <p>Déjà un compte ? </p>
                    <button onClick={goToLogin}>Se connecter</button>
                </div>
            </div>
        </div>
    )
}