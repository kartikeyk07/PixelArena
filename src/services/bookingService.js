import { db } from "../lib/firebase"
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  onSnapshot,
  addDoc
} from "firebase/firestore"

export function listenBookings(callback) {

  return onSnapshot(
    collection(db, "bookings"),
    (snapshot) => {

      const bookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      callback(bookings)
    }
  )
}

export async function checkSlotAvailability(gameId, slot, date) {

  const q = query(
    collection(db, "bookings"),
    where("gameId", "==", gameId),
    where("slot", "==", slot),
    where("date", "==", date)
  )

  const snapshot = await getDocs(q)

  return snapshot.empty
}

// return list of slots already booked for a specific game and date
export async function getBookedSlots(gameId, date) {
  const q = query(
    collection(db, "bookings"),
    where("gameId", "==", gameId),
    where("date", "==", date)
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => doc.data().slot)
}

export async function getUserBookings(userId) {

  const q = query(
    collection(db, "bookings"),
    where("userId", "==", userId)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

export async function getAllBookings() {

  const snapshot = await getDocs(collection(db, "bookings"))

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

export async function cancelBooking(id) {

  return await deleteDoc(doc(db, "bookings", id))
}

export async function createBooking(bookingData) {

  return await addDoc(collection(db, "bookings"), {
    ...bookingData,
    createdAt: new Date()
  })
}