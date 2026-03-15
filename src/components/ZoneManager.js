"use client"

import { useState } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"

export default function ZoneManager({ zone }){

 const [game,setGame] = useState("")
 const [price,setPrice] = useState("")

 const [item,setItem] = useState("")
 const [itemPrice,setItemPrice] = useState("")

 async function addGame(){

  await addDoc(
    collection(db,"zones",zone.id,"games"),
    {
      name: game,
      pricePerHour: Number(price)
    }
  )

 }

 async function addCafe(){

  await addDoc(
    collection(db,"zones",zone.id,"cafe"),
    {
      name: item,
      price: Number(itemPrice)
    }
  )

 }

 return(

  <div className="bg-[#111] p-6 rounded-xl mt-6">

   <h2 className="text-lg mb-4">Manage {zone.name}</h2>

   <div className="grid grid-cols-2 gap-6">

    <div>

     <h3 className="mb-2">Add Game</h3>

     <input
      placeholder="Game name"
      onChange={e=>setGame(e.target.value)}
      className="p-2 bg-black border border-gray-700"
     />

     <input
      placeholder="Price per hour"
      onChange={e=>setPrice(e.target.value)}
      className="p-2 bg-black border border-gray-700 mt-2"
     />

     <button
      onClick={addGame}
      className="bg-purple-600 px-4 py-2 mt-2"
     >
      Add Game
     </button>

    </div>

    <div>

     <h3 className="mb-2">Add Cafe Item</h3>

     <input
      placeholder="Item name"
      onChange={e=>setItem(e.target.value)}
      className="p-2 bg-black border border-gray-700"
     />

     <input
      placeholder="Price"
      onChange={e=>setItemPrice(e.target.value)}
      className="p-2 bg-black border border-gray-700 mt-2"
     />

     <button
      onClick={addCafe}
      className="bg-green-600 px-4 py-2 mt-2"
     >
      Add Item
     </button>

    </div>

   </div>

  </div>

 )
}