"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where
} from "firebase/firestore"
import toast from "react-hot-toast"
import { useRouteGuard } from "@/hooks/useRouteGuard"
import AdminSidebar from "@/components/AdminSidebar"
import { FaPlus, FaTrash, FaEye, FaMapMarkerAlt, FaImage, FaFileAlt } from "react-icons/fa"
import Link from "next/link"

const timeOptions = [
  "12:00 AM","1:00 AM","2:00 AM","3:00 AM","4:00 AM","5:00 AM",
  "6:00 AM","7:00 AM","8:00 AM","9:00 AM","10:00 AM","11:00 AM",
  "12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM",
  "6:00 PM","7:00 PM","8:00 PM","9:00 PM","10:00 PM","11:00 PM"
]

export default function AdminZones() {

  useRouteGuard(true) // Admin-only route

  const [zones, setZones] = useState([])

  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [capacity, setCapacity] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [hasCafe, setHasCafe] = useState(false)

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function loadZones() {

    const snapshot = await getDocs(collection(db,"zones"))

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    setZones(data)
  }

  useEffect(()=>{
    loadZones()
  },[])

  function validateForm(){

    const newErrors = {}

    if(!name.trim()){
      newErrors.name = "Zone name is required"
    }

    if(!location.trim()){
      newErrors.location = "Location is required"
    }

    if(capacity && (isNaN(capacity) || capacity < 1 || capacity > 1000)){
      newErrors.capacity = "Capacity must be between 1 and 1000"
    }

    if(image && !isValidUrl(image)){
      newErrors.image = "Invalid image URL"
    }

    if(startTime && endTime && startTime === endTime){
      newErrors.time = "Start and end time cannot be same"
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  function isValidUrl(string){

    try{
      new URL(string)
      return true
    }
    catch{
      return false
    }

  }

  async function createZone(e){

    e.preventDefault()

    if(!validateForm()) return

    setIsSubmitting(true)

    try{

      await addDoc(collection(db,"zones"),{

        name: name.trim(),
        location: location.trim(),
        description: description.trim(),
        image: image.trim(),
        capacity: capacity ? Number(capacity) : null,

        startTime,
        endTime,
        hasCafe,

        createdAt: new Date()

      })

      setName("")
      setLocation("")
      setDescription("")
      setImage("")
      setCapacity("")
      setStartTime("")
      setEndTime("")
      setHasCafe(false)
      setErrors({})

      loadZones()

    }
    catch(error){

      console.error(error)

      setErrors({
        submit: "Failed to create zone"
      })

    }
    finally{
      setIsSubmitting(false)
    }

  }

  async function deleteZone(id){

    if(!confirm("Are you sure you want to delete this zone? This action cannot be undone.")){
      return
    }

    const loadingToast = toast.loading("Deleting zone...")

    try {
      // Delete all games in this zone
      const gamesSnapshot = await getDocs(collection(db, "zones", id, "games"))
      for (const gameDoc of gamesSnapshot.docs) {
        await deleteDoc(doc(db, "zones", id, "games", gameDoc.id))
      }

      // Delete all cafe items in this zone
      const cafeSnapshot = await getDocs(collection(db, "zones", id, "cafe"))
      for (const cafeDoc of cafeSnapshot.docs) {
        await deleteDoc(doc(db, "zones", id, "cafe", cafeDoc.id))
      }

      // Delete the zone document
      await deleteDoc(doc(db, "zones", id))

      toast.dismiss(loadingToast)
      toast.success("Zone deleted successfully")
      loadZones()
    } catch (error) {
      toast.dismiss(loadingToast)
      console.error("Error deleting zone:", error)
      toast.error(`Failed to delete zone: ${error.message}`)
    }

  }

  return(

    <div className="min-h-screen bg-slate-900 text-slate-100 flex">

      <AdminSidebar/>

      <div className="flex-1 p-8">

        <div className="max-w-7xl mx-auto">

          <h1 className="text-3xl font-bold mb-8">
            Manage Zones
          </h1>

          {/* Stats */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">

              <div className="flex items-center">

                <div className="p-3 bg-purple-600 rounded-lg">
                  <FaMapMarkerAlt/>
                </div>

                <div className="ml-4">
                  <p className="text-slate-400 text-sm">
                    Total Zones
                  </p>

                  <p className="text-2xl font-bold">
                    {zones.length}
                  </p>
                </div>

              </div>

            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">

              <div className="flex items-center">

                <div className="p-3 bg-blue-600 rounded-lg">
                  <FaImage/>
                </div>

                <div className="ml-4">

                  <p className="text-slate-400 text-sm">
                    Active Zones
                  </p>

                  <p className="text-2xl font-bold">
                    {zones.filter(z => z.image).length}
                  </p>

                </div>

              </div>

            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">

              <div className="flex items-center">

                <div className="p-3 bg-green-600 rounded-lg">
                  <FaFileAlt/>
                </div>

                <div className="ml-4">

                  <p className="text-slate-400 text-sm">
                    Total Capacity
                  </p>

                  <p className="text-2xl font-bold">

                    {zones.reduce((sum,z)=>sum+(z.capacity||0),0)}

                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* Create Zone Form */}

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-8">

            <h2 className="text-xl font-semibold mb-6">
              Add New Zone
            </h2>

            <form
              onSubmit={createZone}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >

              <input
                placeholder="Zone Name"
                value={name}
                onChange={e=>setName(e.target.value)}
                className="p-3 bg-slate-700 border border-slate-600 rounded-lg"
              />

              <input
                placeholder="Location"
                value={location}
                onChange={e=>setLocation(e.target.value)}
                className="p-3 bg-slate-700 border border-slate-600 rounded-lg"
              />

              <input
                type="number"
                placeholder="Capacity"
                value={capacity}
                onChange={e=>setCapacity(e.target.value)}
                className="p-3 bg-slate-700 border border-slate-600 rounded-lg"
              />

              {/* START TIME */}

              <select
                value={startTime}
                onChange={e=>setStartTime(e.target.value)}
                className="p-3 bg-slate-700 border border-slate-600 rounded-lg"
              >

                <option value="">
                  Select Start Time
                </option>

                {timeOptions.map(time=>(
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}

              </select>

              {/* END TIME */}

              <select
                value={endTime}
                onChange={e=>setEndTime(e.target.value)}
                className="p-3 bg-slate-700 border border-slate-600 rounded-lg"
              >

                <option value="">
                  Select End Time
                </option>

                {timeOptions.map(time=>(
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}

              </select>

              <input
                placeholder="Image URL"
                value={image}
                onChange={e=>setImage(e.target.value)}
                className="p-3 bg-slate-700 border border-slate-600 rounded-lg"
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasCafe"
                  checked={hasCafe}
                  onChange={e=>setHasCafe(e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="hasCafe" className="text-slate-300">Has Cafe</label>
              </div>

              <textarea
                placeholder="Description"
                value={description}
                onChange={e=>setDescription(e.target.value)}
                className="p-3 bg-slate-700 border border-slate-600 rounded-lg col-span-full"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="col-span-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg flex items-center justify-center gap-2"
              >
                <FaPlus/>

                {isSubmitting
                  ? "Adding..."
                  : "Add Zone"}
              </button>

            </form>

          </div>

          {/* Zones Table */}

          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">

            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold">
                All Zones
              </h2>
            </div>

            <table className="w-full">

              <thead className="bg-slate-700">

                <tr>
                  <th className="p-4 text-left">Zone</th>
                  <th className="p-4 text-left">Location</th>
                  <th className="p-4 text-left">Capacity</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>

              </thead>

              <tbody>

                {zones.map(zone=>(
                  <tr key={zone.id} className="border-t border-slate-700">

                    <td className="p-4">{zone.name}</td>
                    <td className="p-4">{zone.location}</td>
                    <td className="p-4">{zone.capacity || "N/A"}</td>

                    <td className="p-4 flex gap-2">

                      <Link
                        href={`/admin/zones/${zone.id}`}
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded flex items-center gap-1"
                      >
                        <FaEye/> View
                      </Link>

                      <button
                        onClick={()=>deleteZone(zone.id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded flex items-center gap-1"
                      >
                        <FaTrash/> Delete
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  )

}