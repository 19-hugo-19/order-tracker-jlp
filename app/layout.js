import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '../lib/fontawesome'
import styles from "./layout.module.css"
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Commandes JLP",
  description: "Outil de suivi des commandes JLP",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className={styles.appContainer}>
        <Sidebar/>
        <div className={styles.mainContent}>
          {children}
        </div>
        </div>
      </body>
    </html>
  );
}
