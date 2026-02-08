import { addDoc, collection, deleteDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

//ComOrder stands for Company Order
export async function newComOrder(userId, orderObj) {
    try {
        const comOrdersRef = collection(db, "users", userId, "comOrders")

        const newOrder = {
            ...orderObj,
            creationDate: serverTimestamp()
        }

        const docRef = await addDoc(comOrdersRef, newOrder);
        return docRef.id
    } catch (error) {
        throw error
    }
}

export async function updateComOrder(userId, orderId, updatedFields) {
    try {
        const comOrdersRef = collection(db, "users", userId, "comOrders")
        await updateDoc(comOrdersRef, updatedFields)
    } catch (error) {
        throw error
    }
}

export function listenToComOrders(userId, callback) {
    const comOrderRef = collection(db, "users", userId, "comOrders")
    const q = query(comOrderRef, orderBy("creationDate", "desc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        callback(orders)
    })
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