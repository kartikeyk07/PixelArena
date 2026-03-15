import { db } from "../lib/firebase"
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from "firebase/firestore"

const zonesRef = collection(db, "zones")

export async function getZones() {
  const snapshot = await getDocs(zonesRef)

  const zones = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }))

  return zones
}

export async function createZone(zone) {
  return await addDoc(zonesRef, zone)
}

export async function deleteZone(zoneId) {
  return await deleteDoc(doc(db, "zones", zoneId))
}