import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

//ComOrder stands for Company Order
export async function newComOrder(userId, orderData) {
    if (!userId) {
        throw new Error("newComOrder: userId is undefined")
    }

    try {
        const comOrderRef = collection(db, "users", userId, "comOrders")
        
        const docRef = await addDoc(comOrderRef, {
            ...orderData,
            creationDate: serverTimestamp(),
        })
        
        return docRef.id
    } catch (error) {
        console.error("Error creating order:", error)
        throw error
    }
}

export async function updateComOrder(userId, orderId, updatedFields) {
    if (!userId) {
        throw new Error("updateComOrder: userId is undefined")
    }

    try {
        const orderRef = doc(db, "users", userId, "comOrders", orderId)
        
        // Only update the specific fields provided, plus lastModified
        // This preserves creationDate and other fields
        await updateDoc(orderRef, {
            ...updatedFields,
            lastModified: serverTimestamp()
        })
        
        return true
    } catch (error) {
        console.error("Error updating order:", error)
        throw error
    }
}

export function listenToComOrders(userId, callback) {
    const comOrderRef = collection(db, "users", userId, "comOrders")
    const q = query(comOrderRef, orderBy("creationDate", "desc"))
    
    const unsubscribe = onSnapshot(
        q, 
        (snapshot) => {
            const orders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            callback(orders)
        },
        (error) => {
            console.error("Error listening to orders:", error)
            // Optionally call callback with empty array or previous data
            // callback([])
        }
    )
    
    return unsubscribe
}

export async function deleteComOrder(userId, orderId) {
    try {
        const comOrderRef = doc(db, "users", userId, "comOrders", orderId)
        await deleteDoc(comOrderRef)
    } catch (error) {
        throw error
    }
}