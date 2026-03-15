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

const gamesRef = collection(db, "games")

export async function getGamesByZone(zoneId) {

  const q = query(gamesRef, where("zoneId", "==", zoneId))

  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

export async function createGame(game) {

  return await addDoc(gamesRef, game)
}

export async function deleteGame(gameId) {

  return await deleteDoc(doc(db, "games", gameId))
}