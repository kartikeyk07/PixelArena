
"use client"

import { useState, useEffect } from "react"
import {
  checkSlotAvailability,
  getBookedSlots,
  createBooking,
  updateBooking
} from "@/services/bookingService"
import { useAuth } from "@/context/AuthContext"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import {
  FaCheckCircle,
  FaCreditCard,
  FaMapMarkerAlt
} from "react-icons/fa"
import CafeMenuModal from "./CafeMenuModal"

export default function BookingModal({
  game,
  zoneId,
  zoneName,
  zone,
  close
}) {
  const { user } = useAuth()

  const [date, setDate] = useState("")
  const [payment, setPayment] = useState("")
  const [loading, setLoading] = useState(false)
  const [confirmationState, setConfirmationState] = useState(null)
  const [showCafeModal, setShowCafeModal] = useState(false)
  const [createdBookingIds, setCreatedBookingIds] = useState([])

  const [bookedSlots, setBookedSlots] = useState([])
  const [selectedSlots, setSelectedSlots] = useState([])
  const [numberOfPlayers, setNumberOfPlayers] = useState(1)

  const rawMaxPlayers = game?.maxPlayers
  const maxPlayers = Number.isInteger(rawMaxPlayers)
    ? rawMaxPlayers
    : Number.isInteger(Number(rawMaxPlayers))
      ? Number(rawMaxPlayers)
      : null

  const playerCountValid = maxPlayers !== null && numberOfPlayers > 0 && numberOfPlayers <= maxPlayers
  const canBook =
    !loading &&
    date &&
    selectedSlots.length > 0 &&
    payment &&
    playerCountValid

  // ✅ Single correct useEffect
  useEffect(() => {
    if (!date) {
      setBookedSlots([])
      setSelectedSlots([])
      return
    }

    async function loadBooked() {
      const arr = await getBookedSlots(game.id, date)
      setBookedSlots(arr)
      setSelectedSlots([])
    }

    loadBooked()
  }, [date, game.id])

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

  const availableSlots = slots.filter(s => !bookedSlots.includes(s))

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0]
  }

  const getMaxDate = () => {
    const d = new Date()
    d.setDate(d.getDate() + 30)
    return d.toISOString().split("T")[0]
  }

  async function handleBooking() {
    if (!user || !user.uid) {
      return toast.error("You must be logged in to book.")
    }

    if (!date || selectedSlots.length === 0 || !payment) {
      return toast.error("Select date, slots and payment")
    }

    if (maxPlayers === null) {
      return toast.error("Booking failed: this game has no max player limit configured.")
    }

    if (!playerCountValid) {
      return toast.error("Player limit exceeded for this game.")
    }

    const bookingZoneId = zoneId || game.zoneId
    const bookingZoneName = zoneName || zone?.name || game.zoneName || ""
    const bookingGameId = game.id || game.gameId
    const bookingNumberOfPlayers = Number(numberOfPlayers)

    const bookingPayload = {
      userId: user.uid,
      userEmail: user.email,
      zoneId: bookingZoneId,
      zoneName: bookingZoneName,
      gameId: bookingGameId,
      gameName: game.name,
      date,
      numberOfPlayers: bookingNumberOfPlayers,
      paymentMethod: payment,
      status: "confirmed",
      createdAt: new Date()
    }

    console.log("Booking payload", {
      bookingPayload,
      selectedSlots,
      authUid: user.uid,
      authEmail: user.email,
      maxPlayers,
      playerCountValid
    })

    if (!bookingZoneId || !bookingZoneName || !bookingGameId) {
      return toast.error("Booking failed: missing zone or game identifiers.")
    }

    setLoading(true)
    setConfirmationState("processing")

    try {
      await new Promise(res =>
        setTimeout(res, payment === "online" ? 2500 : 1500)
      )

      for (const slot of selectedSlots) {
        const avail = await checkSlotAvailability(game.id, slot, date)
        if (!avail) {
          toast.error(`Slot ${slot} already booked`)
          setLoading(false)
          setConfirmationState(null)
          return
        }
      }

      const bookingZoneId = zoneId || game.zoneId
      const bookingZoneName = zoneName || zone?.name || game.zoneName || ""
      const bookingGameId = game.id || game.gameId

      if (!bookingZoneId || !bookingZoneName || !bookingGameId) {
        toast.error("Booking failed: missing game or zone data.")
        setLoading(false)
        setConfirmationState(null)
        return
      }

      const refs = await Promise.all(
        selectedSlots.map(slot =>
          createBooking({
            userId: user.uid,
            userEmail: user.email,
            zoneId: bookingZoneId,
            zoneName: bookingZoneName,
            gameId: bookingGameId,
            gameName: game.name,
            date,
            slot,
            numberOfPlayers: Number(numberOfPlayers),
            paymentMethod: payment,
            status: "confirmed",
            createdAt: new Date()
          })
        )
      )

      setCreatedBookingIds(refs.map(r => r.id))

      setConfirmationState("confirmed")

      await new Promise(res => setTimeout(res, 1500))

      if (zone?.hasCafe) {
        setConfirmationState(null)
        setShowCafeModal(true)
      } else {
        toast.success("Booking Confirmed 🎮")
        close()
      }
    } catch (err) {
      console.error("Booking error:", err)
      toast.error(`Booking failed: ${err.message || "Please try again."}`)
      setLoading(false)
      setConfirmationState(null)
    }
  }

  // ✅ ONE RETURN ONLY
return (
  <>
    {showCafeModal ? (
      <CafeMenuModal
        isOpen={true}
        zoneId={zoneId}
        zoneName={zoneName}
        onClose={close}
        onConfirm={async (items) => {
          if (items.length) {
            await Promise.all(
              createdBookingIds.map(id =>
                updateBooking(id, { menuItems: items })
              )
            )
          }
          close()
        }}
        bookingData={{ game, date, selectedSlots }}
      />
    ) : confirmationState === "processing" ? (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
        <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 text-center">
          <FaCreditCard className="text-5xl text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Processing your booking...</p>
        </div>
      </div>
    ) : confirmationState === "confirmed" ? (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
        <div className="bg-slate-900 p-8 rounded-xl border border-green-500/30 text-center">
          <FaCheckCircle className="text-6xl text-green-400 mx-auto mb-4" />
          <h2 className="text-xl text-green-400 font-bold mb-2">
            Booking Confirmed 🎮
          </h2>
          <p className="text-slate-400 text-sm">
            Check your email for details
          </p>
        </div>
      </div>
    ) : (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
        <div className="bg-slate-900 w-full max-w-md p-6 rounded-xl border border-slate-700 shadow-lg">

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-100">
              Book {game.name}
            </h2>
            <button onClick={close} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="block text-sm text-slate-300 mb-1">
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={getTodayDate()}
              max={getMaxDate()}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-slate-100 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Slots */}
          <div className="mb-4">
            <label className="block text-sm text-slate-300 mb-2">
              Select Time Slots
            </label>

            <div className="grid grid-cols-2 gap-2">
              {availableSlots.map((s) => {
                const active = selectedSlots.includes(s)

                return (
                  <button
                    key={s}
                    onClick={() =>
                      setSelectedSlots((prev) =>
                        prev.includes(s)
                          ? prev.filter((x) => x !== s)
                          : [...prev, s]
                      )
                    }
                    className={`p-2 rounded text-sm border transition
                      ${active
                        ? "bg-purple-600 border-purple-500 text-white"
                        : "bg-slate-800 border-slate-700 text-slate-300 hover:border-purple-500"
                      }`}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Payment */}
          <div className="mb-4">
            <label className="block text-sm text-slate-300 mb-1">
              Number of Players
            </label>
            {maxPlayers !== null ? (
              <>
                <select
                  value={numberOfPlayers}
                  onChange={(e) => setNumberOfPlayers(Number(e.target.value))}
                  className={`w-full p-2 bg-slate-800 border rounded text-slate-100 focus:ring-2 focus:ring-purple-500 outline-none ${
                    playerCountValid ? "border-slate-700" : "border-red-500"
                  }`}
                >
                  {Array.from({ length: maxPlayers }, (_, idx) => idx + 1).map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
                <p className="text-slate-400 text-sm mt-2">
                  Max players for this game: {maxPlayers}. {playerCountValid ? `You can book ${numberOfPlayers} player${numberOfPlayers === 1 ? "" : "s"}.` : "Player limit exceeded."}
                </p>
              </>
            ) : (
              <p className="text-red-400 text-sm mt-2">
                This game has no max players configured yet. Ask the admin to update the game.
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm text-slate-300 mb-1">
              Payment Method
            </label>
            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-slate-100 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">Select payment</option>
              <option value="pay_at_zone">Pay at Zone</option>
              <option value="online">Online Payment</option>
            </select>
          </div>

          {/* Button */}
          <button
            onClick={handleBooking}
            disabled={!canBook}
            className="w-full mt-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </button>

        </div>
      </div>
    )}
  </>
)
}