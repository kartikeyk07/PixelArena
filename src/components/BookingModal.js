"use client"

import { useState, useEffect } from "react"
import { checkSlotAvailability, getBookedSlots } from "@/services/bookingService"
import { createBooking } from "@/services/bookingService"
import { useAuth } from "@/context/AuthContext"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { FaCheckCircle, FaCreditCard, FaMapMarkerAlt, FaArrowLeft } from "react-icons/fa"

export default function BookingModal({ game, zoneId, zoneName, close }) {

  const { user } = useAuth()

  const [date, setDate] = useState("")
  const [payment, setPayment] = useState("")
  const [loading, setLoading] = useState(false)
  const [confirmationState, setConfirmationState] = useState(null) // null, 'processing', 'confirmed'

  // we track which slots are already taken for the selected date
  const [bookedSlots, setBookedSlots] = useState([])
  const [selectedSlots, setSelectedSlots] = useState([])

  const slots = [
    "10AM - 11AM",
    "11AM - 12PM",
    "12PM - 1PM",
    "1PM - 2PM",
    "2PM - 3PM",
    "3PM - 4PM",
    "4PM - 5PM",
    "5PM - 6PM",
    "6PM - 7PM",
    "7PM - 8PM"
  ]

  // Get today's date in YYYY-MM-DD format for min date
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // Get max date (30 days from today)
  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30)
    return maxDate.toISOString().split('T')[0]
  }

  // when date changes, fetch already booked slots for this game
  useEffect(() => {
    if (!date) return
    async function loadBooked() {
      const arr = await getBookedSlots(game.id, date)
      setBookedSlots(arr)
      setSelectedSlots([])
    }
    loadBooked()
  }, [date, game.id])

  async function handleBooking() {

    if (!date || selectedSlots.length === 0 || !payment) {
      return toast.error("Select date, time slot(s) and payment method")
    }

    if (!zoneId) {
      return toast.error("Zone ID is missing")
    }

    setLoading(true)
    setConfirmationState("processing")

    try {
      if (payment === "online") {
        await new Promise((res) => setTimeout(res, 2500))
      } else {
        await new Promise((res) => setTimeout(res, 1500))
      }

      // double-check availability for each slot (race condition guard)
      for (const slotValue of selectedSlots) {
        const avail = await checkSlotAvailability(game.id, slotValue, date)
        if (!avail) {
          toast.error(`Slot ${slotValue} just got booked, please choose another`)
          setLoading(false)
          setConfirmationState(null)
          return
        }
      }

      // create a booking document for each selected slot
      await Promise.all(
        selectedSlots.map((slotValue) =>
          createBooking({
            userId: user.uid,
            userEmail: user.email,
            zoneId: zoneId,
            zoneName: zoneName,
            gameId: game.id,
            gameName: game.name,
            date,
            slot: slotValue,
            paymentMethod: payment,
            status: "confirmed",
            createdAt: new Date()
          })
        )
      )

      await fetch("/api/send-booking-email", {
        method: "POST",
        body: JSON.stringify({
          email: user.email,
          game: game.name,
          date,
          slots: selectedSlots
        })
      })

      setConfirmationState("confirmed")
      await new Promise((res) => setTimeout(res, 2000))
      
      toast.success("Booking Confirmed 🎮")
      close()
    } catch (error) {
      console.error("Booking error:", error)
      toast.error("Booking failed. Please try again.")
      setLoading(false)
      setConfirmationState(null)
    }
  }

  if (confirmationState === "processing") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-900 p-8 rounded-lg border border-slate-700 w-[400px] text-center"
        >
          {payment === "online" ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mb-4 flex justify-center"
              >
                <FaCreditCard className="text-5xl text-purple-400" />
              </motion.div>
              <h2 className="text-2xl text-purple-400 mb-2">Processing Payment</h2>
              <p className="text-gray-400">Please wait while your payment is being processed...</p>
            </>
          ) : (
            <>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mb-4 flex justify-center"
              >
                <FaMapMarkerAlt className="text-5xl text-green-400" />
              </motion.div>
              <h2 className="text-2xl text-green-400 mb-2">Booking Confirmed</h2>
              <p className="text-gray-400">Pay at the zone when you arrive</p>
            </>
          )}
        </motion.div>
      </div>
    )
  }

  // available slots after filtering out booked ones
  const availableSlots = slots.filter(s => !bookedSlots.includes(s))

  if (confirmationState === "confirmed") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-900 p-8 rounded-lg border border-green-500/30 w-[400px] text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="mb-4 flex justify-center"
          >
            <FaCheckCircle className="text-6xl text-green-400" />
          </motion.div>
          <h2 className="text-2xl text-green-400 mb-4 font-bold">Booking Confirmed! 🎮</h2>
          <div className="bg-slate-800 p-4 rounded-lg mb-4 text-left border border-slate-700">
            <p className="text-slate-100 font-semibold mb-2">{game.name}</p>
            <p className="text-slate-300 text-sm mb-1">Date: {new Date(date).toLocaleDateString()}</p>
            <p className="text-slate-300 text-sm mb-1">
              Time: {selectedSlots.join(", ")}
            </p>
            <p className="text-slate-300 text-sm">Payment: {payment === "online" ? "Online" : "At Zone"}</p>
          </div>
          <p className="text-slate-400 text-sm">Confirmation email has been sent to {user?.email}</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-slate-900 p-6 rounded-lg border border-slate-700 w-[420px]"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-100">
            Book {game.name}
          </h2>
          <button
            onClick={close}
            className="text-slate-400 hover:text-slate-100 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Select Date</label>
            <input
              type="date"
              className="w-full p-2 bg-slate-800 border border-slate-700 text-slate-100 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={loading}
              min={getTodayDate()}
              max={getMaxDate()}
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Select Time Slot(s)</label>
            {date && availableSlots.length === 0 ? (
              <p className="text-red-400">All slots for this date are booked.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableSlots.map(s => (
                  <label key={s} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={s}
                      checked={selectedSlots.includes(s)}
                      onChange={(e) => {
                        const val = e.target.value
                        setSelectedSlots(prev =>
                          prev.includes(val)
                            ? prev.filter(x => x !== val)
                            : [...prev, val]
                        )
                      }}
                      disabled={loading}
                      className="form-checkbox h-4 w-4 text-purple-600"
                    />
                    <span className="text-slate-100">{s}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Payment Method</label>
            <select
              className="w-full p-2 bg-slate-800 border border-slate-700 text-slate-100 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              disabled={loading}
            >
              <option value="">Select payment method</option>
              <option value="pay_at_zone">Pay at Zone</option>
              <option value="online">Online Payment</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleBooking}
          disabled={loading}
          className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          {loading ? "Processing..." : "Confirm Booking"}
        </button>
      </motion.div>
    </div>
  )
}