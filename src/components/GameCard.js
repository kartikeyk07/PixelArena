"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import BookingModal from "./BookingModal"
import { FaGamepad } from "react-icons/fa"

export default function GameCard({ game, zoneId, zoneName }) {

  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg overflow-hidden shadow-lg transition-all"
      >

        {game.image && (
          <img
            src={game.image}
            className="h-36 w-full object-cover"
          />
        )}
        {!game.image && (
          <div className="h-36 w-full bg-gradient-to-br from-purple-900 to-purple-600 flex items-center justify-center">
            <FaGamepad className="text-purple-300 text-3xl" />
          </div>
        )}

        <div className="p-4">

          <h3 className="text-lg font-bold text-slate-100">
            {game.name}
          </h3>

          <p className="text-slate-400 text-sm mt-2">
            ₹{game.pricePerHour} / hour
          </p>

          <button
            onClick={()=>setOpen(true)}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Book Now
          </button>

        </div>

      </motion.div>

      {open && (
        <BookingModal
          game={game}
          zoneId={zoneId}
          zoneName={zoneName}
          close={()=>setOpen(false)}
        />
      )}
    </>
  )
}