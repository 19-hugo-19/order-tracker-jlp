import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// Default settings
export const DEFAULT_SETTINGS = {
    daysUntilLate: 3,
    archiveMonths: 12
};

/**
 * Initialize settings for a new user
 * @param {string} userId - The user's UID
 */
export async function initializeUserSettings(userId) {
    try {
        await setDoc(doc(db, "users", userId, "settings", "preferences"), {
            ...DEFAULT_SETTINGS,
            updatedAt: new Date()
        });
    } catch (error) {
        console.error("Error initializing user settings:", error);
        throw error;
    }
}

/**
 * Get user settings from Firestore
 * @param {string} userId - The user's UID
 * @returns {Promise<Object>} Settings object
 */
export async function getUserSettings(userId) {
    try {
        const settingsRef = doc(db, "users", userId, "settings", "preferences");
        const settingsSnap = await getDoc(settingsRef);
        
        if (settingsSnap.exists()) {
            return settingsSnap.data();
        } else {
            // If settings don't exist, initialize with defaults
            await initializeUserSettings(userId);
            return DEFAULT_SETTINGS;
        }
    } catch (error) {
        console.error("Error getting user settings:", error);
        throw error;
    }
}

/**
 * Update user settings in Firestore
 * @param {string} userId - The user's UID
 * @param {Object} settings - Settings object to update
 */
export async function updateUserSettings(userId, settings) {
    try {
        const settingsRef = doc(db, "users", userId, "settings", "preferences");
        await updateDoc(settingsRef, {
            ...settings,
            updatedAt: new Date()
        });
    } catch (error) {
        console.error("Error updating user settings:", error);
        throw error;
    }
}

/**
 * Reset user settings to defaults
 * @param {string} userId - The user's UID
 */
export async function resetUserSettings(userId) {
    try {
        const settingsRef = doc(db, "users", userId, "settings", "preferences");
        await updateDoc(settingsRef, {
            ...DEFAULT_SETTINGS,
            updatedAt: new Date()
        });
    } catch (error) {
        console.error("Error resetting user settings:", error);
        throw error;
    }
}