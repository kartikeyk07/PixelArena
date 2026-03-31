// "use client"

// import { useState, useEffect } from "react"
// import { checkSlotAvailability, getBookedSlots, createBooking, updateBooking } from "@/services/bookingService"
// import { useAuth } from "@/context/AuthContext"
// import { motion } from "framer-motion"
// import toast from "react-hot-toast"
// import { FaCheckCircle, FaCreditCard, FaMapMarkerAlt, FaArrowLeft } from "react-icons/fa"
// import CafeMenuModal from "./CafeMenuModal"

// export default function BookingModal({ game, zoneId, zoneName, zone, close }) {

//   const { user } = useAuth()

//   const [date, setDate] = useState("")
//   const [payment, setPayment] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [confirmationState, setConfirmationState] = useState(null) // null, 'processing', 'confirmed'
//   const [showCafeModal, setShowCafeModal] = useState(false)
//   const [createdBookingIds, setCreatedBookingIds] = useState([])
  
//   const [bookedSlots, setBookedSlots] = useState([])
//   const [selectedSlots, setSelectedSlots] = useState([])

//   useEffect(() => {
//   if (!date) {
//     setBookedSlots([])
//     setSelectedSlots([])
//     return
//   }

//   async function loadBooked() {
//     const arr = await getBookedSlots(game.id, date)
//     setBookedSlots(arr)
//     setSelectedSlots([])
//   }

//   loadBooked()
// }, [date, game.id])

//   // If cafe modal is open, only render the cafe modal
//   return (
//   <>
//     {showCafeModal ? (
//       <CafeMenuModal
//         isOpen={true}
//         onClose={() => {
//           setShowCafeModal(false)
//           toast.success("Booking Confirmed 🎮")
//           close()
//         }}
//         zoneId={zoneId}
//         zoneName={zoneName}
//         onConfirm={async (selectedMenuItems) => {
//           if (selectedMenuItems.length > 0) {
//             await Promise.all(
//               createdBookingIds.map((bookingId) =>
//                 updateBooking(bookingId, { menuItems: selectedMenuItems })
//               )
//             )
//             toast.success(`Booking Confirmed with ${selectedMenuItems.length} cafe item(s)! 🎮`)
//           } else {
//             toast.success("Booking Confirmed 🎮")
//           }
//           close()
//         }}
//         bookingData={{ game, zoneId, zoneName, date, selectedSlots, payment }}
//       />
//     ) : confirmationState === "processing" ? (
//       <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
//         <div>Processing...</div>
//       </div>
//     ) : confirmationState === "confirmed" ? (
//       <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
//         <div>Confirmed!</div>
//       </div>
//     ) : (
//       <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
//         {/* your existing booking UI */}
//       </div>
//     )}
//   </>
// )

//   // we track which slots are already taken for the selected date


//   const slots = [
//     "10AM - 11AM",
//     "11AM - 12PM",
//     "12PM - 1PM",
//     "1PM - 2PM",
//     "2PM - 3PM",
//     "3PM - 4PM",
//     "4PM - 5PM",
//     "5PM - 6PM",
//     "6PM - 7PM",
//     "7PM - 8PM"
//   ]

//   // Get today's date in YYYY-MM-DD format for min date
//   const getTodayDate = () => {
//     const today = new Date()
//     return today.toISOString().split('T')[0]
//   }

//   // Get max date (30 days from today)
//   const getMaxDate = () => {
//     const maxDate = new Date()
//     maxDate.setDate(maxDate.getDate() + 30)
//     return maxDate.toISOString().split('T')[0]
//   }

//   // when date changes, fetch already booked slots for this game
//   useEffect(() => {
//     if (!date) {
//     setBookedSlots([])
//     setSelectedSlots([])
//     return
//   }
//     async function loadBooked() {
//       const arr = await getBookedSlots(game.id, date)
//       setBookedSlots(arr)
//       setSelectedSlots([])
//     }
//     loadBooked()
//   }, [date, game.id])

//   async function handleBooking() {

//     if (!date || selectedSlots.length === 0 || !payment) {
//       return toast.error("Select date, time slot(s) and payment method")
//     }

//     if (!zoneId) {
//       return toast.error("Zone ID is missing")
//     }

//     setLoading(true)
//     setConfirmationState("processing")

//     try {
//       if (payment === "online") {
//         await new Promise((res) => setTimeout(res, 2500))
//       } else {
//         await new Promise((res) => setTimeout(res, 1500))
//       }

//       // double-check availability for each slot (race condition guard)
//       for (const slotValue of selectedSlots) {
//         const avail = await checkSlotAvailability(game.id, slotValue, date)
//         if (!avail) {
//           toast.error(`Slot ${slotValue} just got booked, please choose another`)
//           setLoading(false)
//           setConfirmationState(null)
//           return
//         }
//       }

//       // create a booking document for each selected slot
//       const bookingPromises = selectedSlots.map((slotValue) =>
//         createBooking({
//           userId: user.uid,
//           userEmail: user.email,
//           zoneId: zoneId,
//           zoneName: zoneName,
//           gameId: game.id,
//           gameName: game.name,
//           date,
//           slot: slotValue,
//           paymentMethod: payment,
//           status: "confirmed",
//           createdAt: new Date()
//         })
//       )

//       const bookingRefs = await Promise.all(bookingPromises)
//       const bookingIds = bookingRefs.map(ref => ref.id)
//       setCreatedBookingIds(bookingIds)

//       await fetch("/api/send-booking-email", {
//         method: "POST",
//         body: JSON.stringify({
//           email: user.email,
//           game: game.name,
//           date,
//           slots: selectedSlots
//         })
//       })

//       setConfirmationState("confirmed")
//       await new Promise((res) => setTimeout(res, 2000))
      
//       // Check if zone has cafe and show cafe menu modal
//       if (zone?.hasCafe === true) {
//         setConfirmationState(null) // Hide confirmation message
//         setShowCafeModal(true)
//       } else {
//         toast.success("Booking Confirmed 🎮")
//         close()
//       }
//     } catch (error) {
//       console.error("Booking error:", error)
//       toast.error("Booking failed. Please try again.")
//       setLoading(false)
//       setConfirmationState(null)
//     }
//   }

//   if (confirmationState === "processing") {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
//         <motion.div
//           initial={{ scale: 0.8, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           className="bg-slate-900 p-8 rounded-lg border border-slate-700 w-[400px] text-center"
//         >
//           {payment === "online" ? (
//             <>
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                 className="mb-4 flex justify-center"
//               >
//                 <FaCreditCard className="text-5xl text-purple-400" />
//               </motion.div>
//               <h2 className="text-2xl text-purple-400 mb-2">Processing Payment</h2>
//               <p className="text-gray-400">Please wait while your payment is being processed...</p>
//             </>
//           ) : (
//             <>
//               <motion.div
//                 animate={{ scale: [1, 1.1, 1] }}
//                 transition={{ duration: 1.5, repeat: Infinity }}
//                 className="mb-4 flex justify-center"
//               >
//                 <FaMapMarkerAlt className="text-5xl text-green-400" />
//               </motion.div>
//               <h2 className="text-2xl text-green-400 mb-2">Booking Confirmed</h2>
//               <p className="text-gray-400">Pay at the zone when you arrive</p>
//             </>
//           )}
//         </motion.div>
//       </div>
//     )
//   }

//   // available slots after filtering out booked ones
//   const availableSlots = slots.filter(s => !bookedSlots.includes(s))

//   if (confirmationState === "confirmed") {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
//         <motion.div
//           initial={{ scale: 0.8, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           className="bg-slate-900 p-8 rounded-lg border border-green-500/30 w-[400px] text-center"
//         >
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ type: "spring", stiffness: 200, damping: 10 }}
//             className="mb-4 flex justify-center"
//           >
//             <FaCheckCircle className="text-6xl text-green-400" />
//           </motion.div>
//           <h2 className="text-2xl text-green-400 mb-4 font-bold">Booking Confirmed! 🎮</h2>
//           <div className="bg-slate-800 p-4 rounded-lg mb-4 text-left border border-slate-700">
//             <p className="text-slate-100 font-semibold mb-2">{game.name}</p>
//             <p className="text-slate-300 text-sm mb-1">Date: {new Date(date).toLocaleDateString()}</p>
//             <p className="text-slate-300 text-sm mb-1">
//               Time: {selectedSlots.join(", ")}
//             </p>
//             <p className="text-slate-300 text-sm">Payment: {payment === "online" ? "Online" : "At Zone"}</p>
//           </div>
//           <p className="text-slate-400 text-sm">Confirmation email has been sent to {user?.email}</p>
//         </motion.div>
//       </div>
//     )
//   }

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
//       <motion.div
//         initial={{ scale: 0.8 }}
//         animate={{ scale: 1 }}
//         className="bg-slate-900 p-6 rounded-lg border border-slate-700 w-[420px]"
//       >
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-bold text-slate-100">
//             Book {game.name}
//           </h2>
//           <button
//             onClick={close}
//             className="text-slate-400 hover:text-slate-100 text-xl"
//           >
//             ✕
//           </button>
//         </div>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-slate-300 text-sm font-medium mb-2">Select Date</label>
//             <input
//               type="date"
//               className="w-full p-2 bg-slate-800 border border-slate-700 text-slate-100 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               disabled={loading}
//               min={getTodayDate()}
//               max={getMaxDate()}
//             />
//           </div>

//           <div>
//             <label className="block text-slate-300 text-sm font-medium mb-2">Select Time Slot(s)</label>
//             {date && availableSlots.length === 0 ? (
//               <p className="text-red-400">All slots for this date are booked.</p>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                 {availableSlots.map(s => (
//                   <label key={s} className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       value={s}
//                       checked={selectedSlots.includes(s)}
//                       onChange={(e) => {
//                         const val = e.target.value
//                         setSelectedSlots(prev =>
//                           prev.includes(val)
//                             ? prev.filter(x => x !== val)
//                             : [...prev, val]
//                         )
//                       }}
//                       disabled={loading}
//                       className="form-checkbox h-4 w-4 text-purple-600"
//                     />
//                     <span className="text-slate-100">{s}</span>
//                   </label>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div>
//             <label className="block text-slate-300 text-sm font-medium mb-2">Payment Method</label>
//             <select
//               className="w-full p-2 bg-slate-800 border border-slate-700 text-slate-100 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//               value={payment}
//               onChange={(e) => setPayment(e.target.value)}
//               disabled={loading}
//             >
//               <option value="">Select payment method</option>
//               <option value="pay_at_zone">Pay at Zone</option>
//               <option value="online">Online Payment</option>
//             </select>
//           </div>
//         </div>

//         <button
//           onClick={handleBooking}
//           disabled={loading}
//           className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-lg transition-colors"
//         >
//           {loading ? "Processing..." : "Confirm Booking"}
//         </button>
//       </motion.div>
//     </div>
//   )
// }

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
    if (!date || selectedSlots.length === 0 || !payment) {
      return toast.error("Select date, slots and payment")
    }

    if (!zoneId) {
      return toast.error("Zone ID missing")
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

      const refs = await Promise.all(
        selectedSlots.map(slot =>
          createBooking({
            userId: user.uid,
            userEmail: user.email,
            zoneId,
            zoneName,
            gameId: game.id,
            gameName: game.name,
            date,
            slot,
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
      toast.error("Booking failed")
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
            disabled={loading}
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