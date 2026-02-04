import AlertComponent from "@/components/AlertComponent"
import styles from "./page.module.css"
import StatusComponent from "@/components/StatusComponent"

export default function DashboardPage() {
    return (
        <div className={styles.dashboardPage}>
            <AlertComponent/>
            <StatusComponent/>
        </div>
    )
}