import { collection, query, where, getDocs, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";
import { getUserSettings } from "./settings";

/**
 * Delete archived orders older than the configured number of months
 * @param {string} userId - The user's UID
 * @returns {Promise<{deleted: number, errors: number}>} - Count of deleted and failed deletions
 */
export async function deleteOldArchivedOrders(userId) {
    try {
        // Get user settings to determine how old orders should be
        const settings = await getUserSettings(userId);
        const monthsToKeep = settings.archiveMonths;

        // Calculate the cutoff date
        const now = new Date();
        const cutoffDate = new Date(now);
        cutoffDate.setMonth(cutoffDate.getMonth() - monthsToKeep);
        const cutoffTimestamp = Timestamp.fromDate(cutoffDate);

        let deletedCount = 0;
        let errorCount = 0;

        // Delete from comOrders (company orders)
        const comOrdersRef = collection(db, "users", userId, "comOrders");
        const comOrdersQuery = query(
            comOrdersRef,
            where("status", "==", "delivered"),
            where("creationDate", "<", cutoffTimestamp)
        );

        const comOrdersSnapshot = await getDocs(comOrdersQuery);
        
        for (const orderDoc of comOrdersSnapshot.docs) {
            try {
                await deleteDoc(doc(db, "users", userId, "comOrders", orderDoc.id));
                deletedCount++;
            } catch (error) {
                console.error(`Error deleting comOrder ${orderDoc.id}:`, error);
                errorCount++;
            }
        }

        // Delete from indOrders (individual orders)
        const indOrdersRef = collection(db, "users", userId, "indOrders");
        const indOrdersQuery = query(
            indOrdersRef,
            where("status", "==", "delivered"),
            where("creationDate", "<", cutoffTimestamp)
        );

        const indOrdersSnapshot = await getDocs(indOrdersQuery);
        
        for (const orderDoc of indOrdersSnapshot.docs) {
            try {
                await deleteDoc(doc(db, "users", userId, "indOrders", orderDoc.id));
                deletedCount++;
            } catch (error) {
                console.error(`Error deleting indOrder ${orderDoc.id}:`, error);
                errorCount++;
            }
        }

        console.log(`Cleanup complete: ${deletedCount} orders deleted, ${errorCount} errors`);
        
        return {
            deleted: deletedCount,
            errors: errorCount
        };

    } catch (error) {
        console.error("Error in deleteOldArchivedOrders:", error);
        throw error;
    }
}

/**
 * Get count of archived orders that will be deleted
 * @param {string} userId - The user's UID
 * @returns {Promise<number>} - Count of orders that would be deleted
 */
export async function getOldArchivedOrdersCount(userId) {
    try {
        const settings = await getUserSettings(userId);
        const monthsToKeep = settings.archiveMonths;

        const now = new Date();
        const cutoffDate = new Date(now);
        cutoffDate.setMonth(cutoffDate.getMonth() - monthsToKeep);
        const cutoffTimestamp = Timestamp.fromDate(cutoffDate);

        // Count from comOrders
        const comOrdersRef = collection(db, "users", userId, "comOrders");
        const comOrdersQuery = query(
            comOrdersRef,
            where("status", "==", "delivered"),
            where("creationDate", "<", cutoffTimestamp)
        );
        const comOrdersSnapshot = await getDocs(comOrdersQuery);

        // Count from indOrders
        const indOrdersRef = collection(db, "users", userId, "indOrders");
        const indOrdersQuery = query(
            indOrdersRef,
            where("status", "==", "delivered"),
            where("creationDate", "<", cutoffTimestamp)
        );
        const indOrdersSnapshot = await getDocs(indOrdersQuery);

        return comOrdersSnapshot.size + indOrdersSnapshot.size;

    } catch (error) {
        console.error("Error getting old archived orders count:", error);
        throw error;
    }
}