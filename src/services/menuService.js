import { db } from "../lib/firebase"
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where
} from "firebase/firestore"

const menuRef = collection(db, "menu")

export async function getMenuByZone(zoneId) {

  const q = query(menuRef, where("zoneId", "==", zoneId))

  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

export async function createMenuItem(item) {

  return await addDoc(menuRef, item)
}

export async function deleteMenuItem(itemId) {

  return await deleteDoc(doc(db, "menu", itemId))
}