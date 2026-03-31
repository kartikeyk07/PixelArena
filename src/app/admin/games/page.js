"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore"
import { useRouteGuard } from "@/hooks/useRouteGuard"
import AdminSidebar from "@/components/AdminSidebar"
import { FaPlus, FaTrash, FaGamepad, FaMapMarkerAlt, FaDollarSign } from "react-icons/fa"
import Link from "next/link"

export default function AdminGames() {
  useRouteGuard(true) // Admin-only route
  
  const [zones, setZones] = useState([])
  const [games, setGames] = useState([])
  const [name, setName] = useState("")
  const [zoneId, setZoneId] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState("")
  const [description, setDescription] = useState("")
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function loadZones() {
    const snapshot = await getDocs(collection(db, "zones"))
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setZones(data)
  }

  async function loadGames() {
    const snapshot = await getDocs(collection(db, "games"))
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setGames(data)
  }

  useEffect(() => {
    loadZones()
    loadGames()
  }, [])

  function validateForm() {
    const newErrors = {}

    if (!name.trim()) {
      newErrors.name = "Game name is required"
    } else if (name.trim().length < 2) {
      newErrors.name = "Game name must be at least 2 characters"
    }

    if (!zoneId) {
      newErrors.zoneId = "Please select a zone"
    }

    if (!price || isNaN(price) || Number(price) <= 0) {
      newErrors.price = "Price must be a positive number"
    } else if (Number(price) > 100) {
      newErrors.price = "Price cannot exceed ₹100 per hour"
    }

    if (image && !isValidUrl(image)) {
      newErrors.image = "Please enter a valid image URL"
    }

    if (description && description.length > 300) {
      newErrors.description = "Description must be less than 300 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function isValidUrl(string) {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  async function createGame(e) {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await addDoc(collection(db, "games"), {
        name: name.trim(),
        zoneId,
        pricePerHour: Number(price),
        image: image.trim(),
        description: description.trim(),
        createdAt: new Date()
      })

      // Reset form
      setName("")
      setZoneId("")
      setPrice("")
      setImage("")
      setDescription("")
      setErrors({})

      loadGames()
    } catch (error) {
      console.error("Error creating game:", error)
      setErrors({ submit: "Failed to create game. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function deleteGame(id) {
    if (confirm("Are you sure you want to delete this game?")) {
      await deleteDoc(doc(db, "games", id))
      loadGames()
    }
  }

  const getZoneName = (zoneId) => {
    const zone = zones.find(z => z.id === zoneId)
    return zone ? zone.name : 'Unknown Zone'
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-100 mb-8">
            Manage Games
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="flex items-center">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <FaGamepad className="text-white text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-slate-400 text-sm">Total Games</p>
                  <p className="text-2xl font-bold text-slate-100">{games.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="flex items-center">
                <div className="p-3 bg-green-600 rounded-lg">
                  <FaMapMarkerAlt className="text-white text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-slate-400 text-sm">Zones with Games</p>
                  <p className="text-2xl font-bold text-slate-100">
                    {new Set(games.map(g => g.zoneId)).size}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="flex items-center">
                <div className="p-3 bg-purple-600 rounded-lg">
                  <FaDollarSign className="text-white text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-slate-400 text-sm">Avg Price/Hour</p>
                  <p className="text-2xl font-bold text-slate-100">
                    ₹{games.length > 0 ? (games.reduce((sum, g) => sum + g.pricePerHour, 0) / games.length).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Create Game Form */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-8">
            <h2 className="text-xl font-semibold text-slate-100 mb-6">Add New Game</h2>
            {errors.submit && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
                {errors.submit}
              </div>
            )}
            <form onSubmit={createGame} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Game Name *</label>
                <input
                  placeholder="Game Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-3 bg-slate-700 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.name ? 'border-red-500' : 'border-slate-600'
                  }`}
                  required
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Zone *</label>
                <select
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className={`w-full p-3 bg-slate-700 border rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.zoneId ? 'border-red-500' : 'border-slate-600'
                  }`}
                  required
                >
                  <option value="">Select Zone</option>
                  {zones.map(zone => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} - {zone.location}
                    </option>
                  ))}
                </select>
                {errors.zoneId && <p className="text-red-400 text-sm mt-1">{errors.zoneId}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Price per Hour *</label>
                <input
                  type="number"
                  placeholder="Price per hour (₹0.01 - ₹100)"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={`w-full p-3 bg-slate-700 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.price ? 'border-red-500' : 'border-slate-600'
                  }`}
                  min="0.01"
                  max="100"
                  step="0.01"
                  required
                />
                {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Image URL</label>
                <input
                  placeholder="https://example.com/image.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className={`w-full p-3 bg-slate-700 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.image ? 'border-red-500' : 'border-slate-600'
                  }`}
                />
                {errors.image && <p className="text-red-400 text-sm mt-1">{errors.image}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <input
                  placeholder="Game description (max 300 chars)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full p-3 bg-slate-700 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.description ? 'border-red-500' : 'border-slate-600'
                  }`}
                  maxLength="300"
                />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 invisible">Submit</label>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white p-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <FaPlus />
                  {isSubmitting ? "Adding Game..." : "Add Game"}
                </button>
              </div>
            </form>
          </div>

          {/* Games Table */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-slate-100">All Games</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="p-4 text-left text-slate-300 font-medium">Game Name</th>
                    <th className="p-4 text-left text-slate-300 font-medium">Zone</th>
                    <th className="p-4 text-left text-slate-300 font-medium">Price/Hour</th>
                    <th className="p-4 text-left text-slate-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map(game => (
                    <tr key={game.id} className="border-t border-slate-700 hover:bg-slate-750">
                      <td className="p-4 text-slate-100 font-medium">{game.name}</td>
                      <td className="p-4 text-slate-300">
                        <Link
                          href={`/admin/zones/${game.zoneId}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        >
                          {getZoneName(game.zoneId)}
                        </Link>
                      </td>
                      <td className="p-4 text-slate-300">₹{game.pricePerHour}</td>
                      <td className="p-4">
                        <button
                          onClick={() => deleteGame(game.id)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200 flex items-center gap-2"
                        >
                          <FaTrash />
                          Delete
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
    </div>
  )
}