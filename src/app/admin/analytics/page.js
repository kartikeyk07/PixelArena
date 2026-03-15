"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore"
import { useRouteGuard } from "@/hooks/useRouteGuard"
import AdminSidebar from "@/components/AdminSidebar"
import { FaChartBar, FaUsers, FaGamepad, FaUtensils, FaDollarSign, FaCalendarAlt } from "react-icons/fa"

export default function AdminAnalytics() {
  useRouteGuard(true) // Admin-only route
  const [zones, setZones] = useState([])
  const [games, setGames] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [bookings, setBookings] = useState([])
  const [selectedZone, setSelectedZone] = useState("")
  const [loading, setLoading] = useState(true)

  async function loadData() {
    setLoading(true)
    try {
      const [zonesSnap, gamesSnap, menuSnap, bookingsSnap] = await Promise.all([
        getDocs(collection(db, "zones")),
        getDocs(collection(db, "games")),
        getDocs(collection(db, "menu")),
        getDocs(collection(db, "bookings"))
      ])

      const zonesData = zonesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      const gamesData = gamesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      const menuData = menuSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      const bookingsData = bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

      setZones(zonesData)
      setGames(gamesData)
      setMenuItems(menuData)
      setBookings(bookingsData)
    } catch (error) {
      console.error("Error loading analytics data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Calculate overall statistics
  const totalRevenue = bookings.reduce((sum, booking) => {
    const game = games.find(g => g.id === booking.gameId)
    if (game && game.pricePerHour) {
      return sum + game.pricePerHour
    }
    return sum
  }, 0)

  const totalBookings = bookings.length
  const uniqueUsers = new Set(bookings.map(b => b.userId)).size
  const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0

  // Zone-specific analytics
  const zoneAnalytics = zones.map(zone => {
    const zoneGames = games.filter(game => game.zoneId === zone.id)
    const zoneMenu = menuItems.filter(item => item.zoneId === zone.id)
    const zoneBookings = bookings.filter(booking => {
      const game = games.find(g => g.id === booking.gameId)
      return game && game.zoneId === zone.id
    })

    const zoneRevenue = zoneBookings.reduce((sum, booking) => {
      const game = games.find(g => g.id === booking.gameId)
      if (game && game.pricePerHour) {
        return sum + game.pricePerHour
      }
      return sum
    }, 0)

    return {
      ...zone,
      gamesCount: zoneGames.length,
      menuCount: zoneMenu.length,
      bookingsCount: zoneBookings.length,
      revenue: zoneRevenue,
      avgPrice: zoneGames.length > 0 ? zoneGames.reduce((sum, g) => sum + g.pricePerHour, 0) / zoneGames.length : 0
    }
  })

  const selectedZoneData = selectedZone ? zoneAnalytics.find(z => z.id === selectedZone) : null

  // Recent bookings (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const recentBookings = bookings.filter(booking => {
    const bookingDate = booking.createdAt?.toDate?.() || new Date(booking.createdAt)
    return bookingDate >= sevenDaysAgo
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-slate-400">Loading analytics...</div>
          </div>
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
          <h1 className="text-3xl font-bold text-slate-100 mb-8">
            Analytics Dashboard
          </h1>

          {/* Zone Selection - First Priority */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-8">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Select Zone to View Analytics</h2>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Choose a Zone</label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full md:w-96 p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Zones (Combined)</option>
                {zones.map(zone => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} - {zone.location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Statistics Cards - Show for selected zone or all zones */}
          {selectedZoneData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <div className="flex items-center">
                  <div className="p-3 bg-green-600 rounded-lg">
                    <FaDollarSign className="text-white text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-slate-400 text-sm">Zone Revenue</p>
                    <p className="text-2xl font-bold text-slate-100">${selectedZoneData.revenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-600 rounded-lg">
                    <FaCalendarAlt className="text-white text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-slate-400 text-sm">Zone Bookings</p>
                    <p className="text-2xl font-bold text-slate-100">{selectedZoneData.bookingsCount}</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-600 rounded-lg">
                    <FaGamepad className="text-white text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-slate-400 text-sm">Games Available</p>
                    <p className="text-2xl font-bold text-slate-100">{selectedZoneData.gamesCount}</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-600 rounded-lg">
                    <FaUtensils className="text-white text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-slate-400 text-sm">Menu Items</p>
                    <p className="text-2xl font-bold text-slate-100">{selectedZoneData.menuCount}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <div className="flex items-center">
                  <div className="p-3 bg-green-600 rounded-lg">
                    <FaDollarSign className="text-white text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-slate-400 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-slate-100">${totalRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-600 rounded-lg">
                    <FaCalendarAlt className="text-white text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-slate-400 text-sm">Total Bookings</p>
                    <p className="text-2xl font-bold text-slate-100">{totalBookings}</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-600 rounded-lg">
                    <FaUsers className="text-white text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-slate-400 text-sm">Unique Users</p>
                    <p className="text-2xl font-bold text-slate-100">{uniqueUsers}</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-600 rounded-lg">
                    <FaChartBar className="text-white text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-slate-400 text-sm">Avg Booking Value</p>
                    <p className="text-2xl font-bold text-slate-100">${avgBookingValue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Zone Performance Table */}
          {!selectedZone && (
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden mb-8">
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl font-semibold text-slate-100">All Zones Performance</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="p-4 text-left text-slate-300 font-medium">Zone Name</th>
                      <th className="p-4 text-left text-slate-300 font-medium">Location</th>
                      <th className="p-4 text-left text-slate-300 font-medium">Games</th>
                      <th className="p-4 text-left text-slate-300 font-medium">Menu Items</th>
                      <th className="p-4 text-left text-slate-300 font-medium">Bookings</th>
                      <th className="p-4 text-left text-slate-300 font-medium">Revenue</th>
                      <th className="p-4 text-left text-slate-300 font-medium">Avg Game Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zoneAnalytics.map(zone => (
                      <tr key={zone.id} className="border-t border-slate-700 hover:bg-slate-750">
                        <td className="p-4 text-slate-100 font-medium">{zone.name}</td>
                        <td className="p-4 text-slate-300">{zone.location}</td>
                        <td className="p-4 text-slate-100">{zone.gamesCount}</td>
                        <td className="p-4 text-slate-100">{zone.menuCount}</td>
                        <td className="p-4 text-slate-100">{zone.bookingsCount}</td>
                        <td className="p-4 text-slate-100">${zone.revenue.toFixed(2)}</td>
                        <td className="p-4 text-slate-100">${zone.avgPrice.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100 mb-6">
              Recent Activity {selectedZone && selectedZoneData && `- ${selectedZoneData.name}`} (Last 7 Days)
            </h2>
            <div className="space-y-4">
              {(() => {
                const filteredBookings = selectedZone
                  ? recentBookings.filter(booking => {
                      const game = games.find(g => g.id === booking.gameId)
                      return game && game.zoneId === selectedZone
                    })
                  : recentBookings
                
                return filteredBookings.length > 0 ? (
                  filteredBookings.slice(0, 10).map(booking => {
                    const game = games.find(g => g.id === booking.gameId)
                    const zone = game ? zones.find(z => z.id === game.zoneId) : null
                    return (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-600 rounded-lg">
                            <FaGamepad className="text-white text-sm" />
                          </div>
                          <div>
                            <p className="text-slate-100 font-medium">
                              {game?.name || 'Unknown Game'} - {zone?.name || 'Unknown Zone'}
                            </p>
                            <p className="text-slate-400 text-sm">
                              {booking.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown Date'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-100 font-medium">
                            ${game && booking.duration ? (game.pricePerHour * booking.duration).toFixed(2) : '0.00'}
                          </p>
                          <p className="text-slate-400 text-sm">
                            {booking.duration || 0} hours
                          </p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    No recent bookings in the last 7 days
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}