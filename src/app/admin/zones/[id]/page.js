"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc
} from "firebase/firestore"
import { useRouteGuard } from "@/hooks/useRouteGuard"
import AdminSidebar from "@/components/AdminSidebar"
import { FaPlus, FaTrash, FaEdit, FaGamepad, FaUtensils, FaChartBar, FaMapMarkerAlt, FaClock, FaUsers, FaSave } from "react-icons/fa"
import Link from "next/link"

const openingHoursOptions = [
  "6 AM - 12 AM",
  "7 AM - 1 AM",
  "8 AM - 2 AM",
  "9 AM - 3 AM",
  "9 AM - 11 PM",
  "10 AM - 12 AM",
  "11 AM - 1 AM",
  "12 PM - 12 AM",
  "1 PM - 1 AM",
  "2 PM - 2 AM",
  "24/7"
]

export default function ZoneDetail() {

  useRouteGuard(true) // Admin-only route

  // grab the dynamic segment from the URL
  const { id: zoneId } = useParams();

  // loading / data states
  const [zone, setZone] = useState(null);
  const [games, setGames] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // add‑game form
  const [gameName, setGameName] = useState("");
  const [gamePrice, setGamePrice] = useState("");
  const [gameImage, setGameImage] = useState("");
  const [gameDescription, setGameDescription] = useState("");

  // add‑menu‑item form
  const [menuName, setMenuName] = useState("");
  const [menuPrice, setMenuPrice] = useState("");
  const [menuImage, setMenuImage] = useState("");
  const [menuCategory, setMenuCategory] = useState("");

  // editing zone metadata
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editCapacity, setEditCapacity] = useState("");
  const [editOpeningHours, setEditOpeningHours] = useState("");

  async function loadZoneData() {
    try {
      // Load zone details
      const zoneDoc = await getDocs(query(collection(db, "zones"), where("__name__", "==", zoneId)))
      if (!zoneDoc.empty) {
        const zoneData = { id: zoneDoc.docs[0].id, ...zoneDoc.docs[0].data() }
        setZone(zoneData)
        setEditName(zoneData.name)
        setEditLocation(zoneData.location)
        setEditDescription(zoneData.description || "")
        setEditImage(zoneData.image || "")
        setEditCapacity(zoneData.capacity || "")
        setEditOpeningHours(zoneData.openingHours || "")
      }

      // Load games for this zone
      const gamesSnap = await getDocs(query(collection(db, "games"), where("zoneId", "==", zoneId)))
      setGames(gamesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))

      // Load menu items for this zone
      const menuSnap = await getDocs(query(collection(db, "menu"), where("zoneId", "==", zoneId)))
      setMenuItems(menuSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))

      // Load bookings for this zone
      const bookingsSnap = await getDocs(query(collection(db, "bookings"), where("zoneId", "==", zoneId)))
      setBookings(bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))

      setLoading(false)
    } catch (error) {
      console.error("Error loading zone data:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (zoneId) {
      loadZoneData()
    }
  }, [zoneId])

  async function addGame(e) {
    e.preventDefault()
    await addDoc(collection(db, "games"), {
      name: gameName,
      zoneId,
      pricePerHour: Number(gamePrice),
      image: gameImage,
      description: gameDescription,
      createdAt: new Date()
    })
    setGameName("")
    setGamePrice("")
    setGameImage("")
    setGameDescription("")
    loadZoneData()
  }

  async function addMenuItem(e) {
    e.preventDefault()
    await addDoc(collection(db, "menu"), {
      name: menuName,
      zoneId,
      price: Number(menuPrice),
      image: menuImage,
      category: menuCategory,
      createdAt: new Date()
    })
    setMenuName("")
    setMenuPrice("")
    setMenuImage("")
    setMenuCategory("")
    loadZoneData()
  }

  async function deleteGame(id) {
    await deleteDoc(doc(db, "games", id))
    loadZoneData()
  }

  async function deleteMenuItem(id) {
    await deleteDoc(doc(db, "menu", id))
    loadZoneData()
  }

  async function deleteBooking(id) {
    if (confirm("Cancel this booking?")) {
      await deleteDoc(doc(db, "bookings", id))
      loadZoneData()
    }
  }

  async function updateZone() {
    await updateDoc(doc(db, "zones", zoneId), {
      name: editName,
      location: editLocation,
      description: editDescription,
      image: editImage,
      capacity: Number(editCapacity),
      openingHours: editOpeningHours
    })
    setIsEditing(false)
    loadZoneData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    )
  }

  if (!zone) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl">Zone not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/admin/zones" className="text-sm text-purple-400 hover:text-purple-300 mb-4 inline-block">
           Back to zones
          </Link>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-100">{zone.name}</h1>
              <p className="text-slate-400 mt-2">{zone.location}</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <FaEdit />
              {isEditing ? 'Cancel Edit' : 'Edit Zone'}
            </button>
          </div>

          {/* Zone Info Cards */}
          <div className="flex flex-col md:flex-row md:justify-evenly gap-6 mb-8">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <FaGamepad className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Games</p>
                  <p className="text-2xl font-bold text-slate-100">{games.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-600 rounded-lg">
                  <FaUtensils className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Menu Items</p>
                  <p className="text-2xl font-bold text-slate-100">{menuItems.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-600 rounded-lg">
                  <FaChartBar className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Bookings</p>
                  <p className="text-2xl font-bold text-slate-100">{bookings.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-600 rounded-lg">
                  <FaUsers className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Capacity</p>
                  <p className="text-2xl font-bold text-slate-100">{zone.capacity || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Zone Form */}
          {isEditing && (
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-8">
              <h2 className="text-xl font-semibold text-slate-100 mb-6">Edit Zone Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Zone Name</label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                  <input
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Capacity</label>
                  <input
                    type="number"
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(e.target.value)}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Opening Hours</label>
                  <select
                    value={editOpeningHours}
                    onChange={(e) => setEditOpeningHours(e.target.value)}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Opening Hours</option>
                    {openingHoursOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Image URL</label>
                  <input
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows="1"
                  />
                </div>
              </div>
              <button
                onClick={updateZone}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <FaSave />
                Save Changes
              </button>
            </div>
          )}

          {/* Zone Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Zone Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-slate-400" />
                  <span className="text-slate-300">{zone.location}</span>
                </div>
                {zone.openingHours && (
                  <div className="flex items-center gap-3">
                    <FaClock className="text-slate-400" />
                    <span className="text-slate-300">{zone.openingHours}</span>
                  </div>
                )}
                {zone.capacity && (
                  <div className="flex items-center gap-3">
                    <FaUsers className="text-slate-400" />
                    <span className="text-slate-300">Capacity: {zone.capacity}</span>
                  </div>
                )}
                {zone.description && (
                  <div className="mt-4">
                    <p className="text-slate-400 text-sm mb-2">Description</p>
                    <p className="text-slate-300">{zone.description}</p>
                  </div>
                )}
              </div>
            </div>

            {zone.image && (
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Zone Image</h3>
                <img
                  src={zone.image}
                  alt={zone.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Add Game Form */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-8">
            <h2 className="text-xl font-semibold text-slate-100 mb-6">Add Game to {zone.name}</h2>
            <form onSubmit={addGame} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Game Name</label>
                <input
                  placeholder="Game Name"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Price per Hour</label>
                <input
                  type="number"
                  placeholder="Price"
                  value={gamePrice}
                  onChange={(e) => setGamePrice(e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Image URL</label>
                <input
                  placeholder="Image URL"
                  value={gameImage}
                  onChange={(e) => setGameImage(e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <input
                  placeholder="Game description"
                  value={gameDescription}
                  onChange={(e) => setGameDescription(e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-4">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                  <FaPlus />
                  Add Game
                </button>
              </div>
            </form>
          </div>

          {/* Games List */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-slate-100">Games in {zone.name}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="p-4 text-left text-slate-300 font-medium">Game Name</th>
                    <th className="p-4 text-left text-slate-300 font-medium">Price/Hour</th>
                    <th className="p-4 text-left text-slate-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map(game => (
                    <tr key={game.id} className="border-t border-slate-700 hover:bg-slate-750">
                      <td className="p-4 text-slate-100 font-medium">{game.name}</td>
                      <td className="p-4 text-slate-300">${game.pricePerHour}</td>
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

          {/* Add Menu Item Form */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-8">
            <h2 className="text-xl font-semibold text-slate-100 mb-6">Add Menu Item to {zone.name}</h2>
            <form onSubmit={addMenuItem} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Item Name</label>
                <input
                  placeholder="Item Name"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Price</label>
                <input
                  type="number"
                  placeholder="Price"
                  value={menuPrice}
                  onChange={(e) => setMenuPrice(e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                <select
                  value={menuCategory}
                  onChange={(e) => setMenuCategory(e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Category</option>
                  <option value="Food">Food</option>
                  <option value="Beverage">Beverage</option>
                  <option value="Snack">Snack</option>
                  <option value="Dessert">Dessert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Image URL</label>
                <input
                  placeholder="Image URL"
                  value={menuImage}
                  onChange={(e) => setMenuImage(e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-4">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                  <FaPlus />
                  Add Menu Item
                </button>
              </div>
            </form>
          </div>

          {/* Menu Items List */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-slate-100">Menu Items in {zone.name}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="p-4 text-left text-slate-300 font-medium">Item Name</th>
                    <th className="p-4 text-left text-slate-300 font-medium">Category</th>
                    <th className="p-4 text-left text-slate-300 font-medium">Price</th>
                    <th className="p-4 text-left text-slate-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map(item => (
                    <tr key={item.id} className="border-t border-slate-700 hover:bg-slate-750">
                      <td className="p-4 text-slate-100 font-medium">{item.name}</td>
                      <td className="p-4 text-slate-300">{item.category}</td>
                      <td className="p-4 text-slate-300">${item.price}</td>
                      <td className="p-4">
                        <button
                          onClick={() => deleteMenuItem(item.id)}
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

          {/* Bookings List */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-slate-100">Bookings for {zone.name}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="p-4 text-left text-slate-300 font-medium">Customer</th>
                    <th className="p-4 text-left text-slate-300 font-medium">Game</th>
                    <th className="p-4 text-left text-slate-300 font-medium">Date</th>
                    <th className="p-4 text-left text-slate-300 font-medium">Time Slot</th>
                    <th className="p-4 text-left text-slate-300 font-medium">Status</th>
                    <th className="p-4 text-left text-slate-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id} className="border-t border-slate-700 hover:bg-slate-750">
                      <td className="p-4 text-slate-100">{b.userEmail || b.userId}</td>
                      <td className="p-4 text-slate-300">{b.gameName}</td>
                      <td className="p-4 text-slate-300">{b.date}</td>
                      <td className="p-4 text-slate-300">{b.slot}</td>
                      <td className="p-4 text-slate-300">{b.status}</td>
                      <td className="p-4">
                        <button
                          onClick={() => deleteBooking(b.id)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200 flex items-center gap-2"
                        >
                          <FaTrash />
                          Cancel
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