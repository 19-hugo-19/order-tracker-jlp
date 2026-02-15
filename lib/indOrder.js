import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore"
import { db } from "./firebase"

// indOrder stands for individual order
export async function newIndOrder(userId, orderData) {
    if (!userId) {
        throw new Error("newIndError: userId is undefined")
    }

    try {
        const indOrderRef = collection(db, "users", userId, "indOrders")
        
        const docRef = await addDoc(indOrderRef, {
            ...orderData,
            creationDate: serverTimestamp(),
            lastModified: serverTimestamp(),
        })

        return docRef.id
    } catch (error){
        console.error("Error creating order:", error)
        throw error
    }
}

export async function updateIndOrder(userId, orderId, updatedFields) {
    if (!userId) {
        throw new Error("updateComOrder: userId is undefined")
    }

    try {
        const orderRef = doc(db, "users", userId, "indOrders", orderId)

        await updateDoc(orderRef, {
            ...updatedFields,
            lastModified: serverTimestamp(),
        })

        return true
    } catch(error) {
        console.error("Error updating order", error)
        throw error
    }
}

export function listenToIndOrders(userId, callback) {
    const indOrderRef = collection(db, "users", userId, "indOrders")
    const q = query(indOrderRef, orderBy("creationDate", "desc"))

    const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
            const orders = snapshot.docs.map(doc => ({
                id:doc.id,
                ...doc.data()
            }))
            callback(orders)
        },
        (error) => {
            console.error("Error listening to orders:", error)
        }
    )

    return unsubscribe
}

export async function deleteIndOrder(userId, orderId) {
    try {
        const indOrderRef = doc(db, "users", userId, "indOrders", orderId)
        await deleteDoc(indOrderRef)
    } catch (error) {
            throw error
    }
}