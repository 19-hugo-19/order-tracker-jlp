'use client'

import Link from "next/link";
import styles from "./page.module.css";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } finally {
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Chargement...</div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.logo}>Suivi des commandes - JLP</div>
        <div className={styles.navButtons}>
          {user ? (
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Se déconnecter
            </button>
          ) : (
            <>
              <Link href="/login" className={styles.loginBtn}>
                Connexion
              </Link>
              <Link href="/register" className={styles.registerBtn}>
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Gérez vos commandes <span className={styles.highlight}>efficacement</span>
          </h1>
          <p className={styles.subtitle}>
            Une solution professionnelle pour suivre et organiser toutes vos commandes commerciales en temps réel
          </p>
          <div className={styles.ctaButtons}>
            {user ? (
              <Link href="/dashboard" className={styles.primaryBtn}>
                Accéder au tableau de bord
              </Link>
            ) : (
              <>
                <Link href="/register" className={styles.primaryBtn}>
                  Commencer gratuitement
                </Link>
                <Link href="/login" className={styles.secondaryBtn}>
                  Se connecter
                </Link>
              </>
            )}
          </div>
        </div>

        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3>Suivi en temps réel</h3>
            <p>Suivez l'état de vos commandes instantanément</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔔</div>
            <h3>Alertes intelligentes</h3>
            <p>Soyez avertis lorsqu'une commandes est en retard selon les délais prévus</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📈</div>
            <h3>2 en 1</h3>
            <p>Suivez l'état de commandes commerciales et de particuliers à l'aide d'un seul et même outil</p>
          </div>
        </div>
      </main>
    </div>
  );
}