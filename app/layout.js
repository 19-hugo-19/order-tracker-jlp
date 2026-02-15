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
  manifest: "/manifest.json",
  themeColor: "#633493",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "JLP"
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#633493"
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="JLP" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
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