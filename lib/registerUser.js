import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { initializeUserSettings } from "./settings";

export async function registerUser(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // Create user document
        await setDoc(doc(db, "users", user.uid), {
            userInfo: {email},
            createdAt: serverTimestamp()
        })

        // Initialize default settings
        await initializeUserSettings(user.uid)

        return user;

    } catch (error) {
        throw error
    }
}