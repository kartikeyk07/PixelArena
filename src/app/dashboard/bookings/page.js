"use client"

import { useEffect, useState } from "react"
import { getUserBookings, cancelBooking } from "@/services/bookingService"
import { useAuth } from "@/context/AuthContext"
import { useRouteGuard } from "@/hooks/useRouteGuard"
import UserSidebar from "@/components/UserSidebar"
import MenuModal from "@/components/MenuModal"
import { FaGamepad, FaCalendarAlt, FaClock, FaCreditCard, FaUtensils } from "react-icons/fa"
import toast from "react-hot-toast"

export default function BookingHistory() {
  useRouteGuard()
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [menuModalOpen, setMenuModalOpen] = useState(false)
  const [selectedZoneForMenu, setSelectedZoneForMenu] = useState(null)
  const [selectedZoneName, setSelectedZoneName] = useState("")

  useEffect(() => {
    async function loadBookings() {
      if (!user) return

      try {
        const data = await getUserBookings(user.uid)
        setBookings(data)
      } catch (error) {
        console.error("Error loading bookings:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [user])

  // Group bookings by game + date
  const groupedBookings = bookings.reduce((acc, booking) => {
    const key = `${booking.gameName}|${booking.date}`
    if (!acc[key]) {
      acc[key] = {
        gameName: booking.gameName,
        date: booking.date,
        zoneId: booking.zoneId,
        zoneName: booking.zoneName,
        paymentMethod: booking.paymentMethod,
        createdAt: booking.createdAt,
        slots: []
      }
    }
    acc[key].slots.push(booking)
    return acc
  }, {})

  const groupedBookingsList = Object.values(groupedBookings)

  const handleViewMenu = (zoneId, zoneName) => {
    setSelectedZoneForMenu(zoneId)
    setSelectedZoneName(zoneName)
    setMenuModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <div className="text-slate-400">Loading bookings...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      <UserSidebar />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto p-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-8">
            My Bookings
          </h1>

        {bookings.length > 0 ? (
          <div className="space-y-6">
            {groupedBookingsList.map((group, idx) => (
              <div
                key={idx}
                className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:bg-slate-750 transition-colors duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-600 rounded-lg">
                      <FaGamepad className="text-white text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-100 mb-2">
                        {group.gameName || 'Unknown Game'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                        <div className="flex items-center text-slate-300">
                          <FaCalendarAlt className="mr-2 text-purple-400" />
                          <span>Date: {new Date(group.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-slate-300">
                          <FaClock className="mr-2 text-green-400" />
                          <span>Duration: {group.slots.length} hours</span>
                        </div>
                        <div className="flex items-center text-slate-300">
                          <FaCreditCard className="mr-2 text-orange-400" />
                          <span>Payment: {group.paymentMethod || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-slate-300">
                          <span className="text-slate-400">Status:</span>
                          <span className="ml-2 px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">
                            Confirmed
                          </span>
                        </div>
                      </div>

                      {/* Time Slots List */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-slate-300 mb-2">Time Slots:</p>
                        <div className="flex flex-wrap gap-2">
                          {group.slots.map((booking) => (
                            <div key={booking.id} className="flex items-center gap-2 bg-slate-700 px-3 py-1 rounded">
                              <span className="text-slate-100 text-sm">{booking.slot}</span>
                              <button
                                onClick={async () => {
                                  if (!window.confirm(`Cancel ${booking.slot}?`)) return
                                  try {
                                    await cancelBooking(booking.id)
                                    setBookings(prev => prev.filter(b => b.id !== booking.id))
                                    toast.success('Slot cancelled')
                                  } catch (err) {
                                    console.error('cancel error', err)
                                    toast.error('Failed to cancel slot')
                                  }
                                }}
                                className="hover:text-red-400 text-slate-400 transition-colors"
                                title="Cancel this slot"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {group.createdAt && (
                        <p className="text-slate-400 text-sm mb-4">
                          Booked on: {group.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown Date'}
                        </p>
                      )}

                      {/* View Menu Button */}
                      {group.zoneId && (
                        <button
                          onClick={() => handleViewMenu(group.zoneId, group.zoneName)}
                          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                        >
                          <FaUtensils className="text-lg" />
                          View Zone Menu
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800 p-12 rounded-lg border border-slate-700 text-center">
            <FaGamepad className="text-slate-400 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-100 mb-2">No bookings yet</h3>
            <p className="text-slate-400 mb-6">
              You haven't made any bookings yet. Start exploring our gaming zones!
            </p>
            <a
              href="/zones"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Browse Gaming Zones
            </a>
          </div>
        )}
        </div>
      </div>

      {/* Menu Modal */}
      <MenuModal
        isOpen={menuModalOpen}
        onClose={() => setMenuModalOpen(false)}
        zoneId={selectedZoneForMenu}
        zoneName={selectedZoneName}
      />
    </div>
  )
}