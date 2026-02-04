'use client'

import Link from "next/link";
import styles from "./page.module.css";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function Home() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } finally {
      router.push("/");
    }
  };


  return (
    <div className={styles.page}>
      <Link href="/login">Login</Link>
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>
  );
}
