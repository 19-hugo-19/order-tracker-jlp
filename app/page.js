import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Link href="/login">Login</Link>
    </div>
  );
}
