'use client'

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    const handleLogin = async (e) => {
        e.preventDefault()
        setError("")

        try {
            await signInWithEmailAndPassword(auth, email, password)
            router.push("/dashboard")
        } catch {
            setError("Email ou mot de passe invalide")
        }
    }

    const goToRegister = () => {
        router.push("/register")
    }

    const handleForgotPassword = () => {

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
                <h2>Se connecter</h2>
                <form onSubmit={handleLogin} className={styles.form}>
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

                    <button onClick={handleLogin}>
                        Se connecter
                    </button>
                </form>
                <div className={styles.changeLoginRegister}>
                    <p>Pas de compte ? </p>
                    <button onClick={goToRegister}>Créer un compte</button>
                </div>
                <div className={styles.forgotPassword}>
                    <button onClick={handleForgotPassword}>J'ai oublié mon mot de passe</button>
                </div>
            </div>
        </div>
    )
}