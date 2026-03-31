"use client"
import { useEffect, useState } from "react"
import { FaTimes, FaFileAlt, FaGamepad, FaUtensils, FaCalendarAlt, FaClock, FaCreditCard } from "react-icons/fa"

export default function BookingBillModal({ isOpen, onClose, booking, games, zones }) {
  const [game, setGame] = useState(null)
  const [zone, setZone] = useState(null)

  useEffect(() => {
    if (booking && games && zones) {
      const foundGame = games.find(g => g.id === booking.gameId)
      const foundZone = zones.find(z => z.id === booking.zoneId)
      setGame(foundGame)
      setZone(foundZone)
    }
  }, [booking, games, zones])

  if (!isOpen || !booking) return null

  const gameTotal = game ? game.pricePerHour : 0
  const menuTotal = booking.menuItems ? booking.menuItems.reduce((sum, item) => sum + item.total, 0) : 0
  const grandTotal = gameTotal + menuTotal

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 p-6 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-lg">
              <FaFileAlt className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Booking Bill</h2>
              <p className="text-slate-400 text-sm">Booking ID: {booking.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Bill Content */}
        <div className="p-6">
          {/* Customer Info */}
          <div className="bg-slate-700 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Email:</span>
                <p className="text-slate-100">{booking.userEmail}</p>
              </div>
              <div>
                <span className="text-slate-400">Zone:</span>
                <p className="text-slate-100">{booking.zoneName}</p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-slate-700 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-3">Booking Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaGamepad className="text-purple-400" />
                <div>
                  <p className="text-slate-100 font-medium">{booking.gameName}</p>
                  <p className="text-slate-400 text-sm">Game</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-blue-400" />
                <div>
                  <p className="text-slate-100 font-medium">
                    {booking.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown Date'}
                  </p>
                  <p className="text-slate-400 text-sm">Booking Date</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaClock className="text-green-400" />
                <div>
                  <p className="text-slate-100 font-medium">{booking.slot}</p>
                  <p className="text-slate-400 text-sm">Time Slot</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaCreditCard className="text-orange-400" />
                <div>
                  <p className="text-slate-100 font-medium capitalize">{booking.paymentMethod?.replace('_', ' ') || 'Unknown'}</p>
                  <p className="text-slate-400 text-sm">Payment Method</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bill Items */}
          <div className="bg-slate-700 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-3">Bill Items</h3>
            <div className="space-y-3">
              {/* Game Charge */}
              <div className="flex items-center justify-between p-3 bg-slate-600 rounded">
                <div>
                  <p className="text-slate-100 font-medium">{booking.gameName}</p>
                  <p className="text-slate-400 text-sm">Gaming Session (1 hour)</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-100 font-semibold">₹{gameTotal.toFixed(2)}</p>
                </div>
              </div>

              {/* Menu Items */}
              {booking.menuItems && booking.menuItems.length > 0 ? (
                booking.menuItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-600 rounded">
                    <div className="flex items-center gap-3">
                      <FaUtensils className="text-orange-400" />
                      <div>
                        <p className="text-slate-100 font-medium">{item.name}</p>
                        <p className="text-slate-400 text-sm">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-100 font-semibold">₹{item.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-slate-400">
                  No cafe items added to this booking
                </div>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="bg-slate-700 p-4 rounded-lg border-2 border-slate-600">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-slate-100">Total Amount</span>
              <div className="text-right">
                <div className="flex items-center gap-2 text-2xl font-bold text-green-400">
                  <span>₹</span>
                  <span>{grandTotal.toFixed(2)}</span>
                </div>
                <p className="text-slate-400 text-sm">
                  Game: ₹{gameTotal.toFixed(2)} | Cafe: ₹{menuTotal.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}