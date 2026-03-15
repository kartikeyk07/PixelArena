"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { FaMapMarkerAlt } from "react-icons/fa"

export default function ZoneCard({ zone }) {
  const router = useRouter()

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.2 }}
      onClick={() => router.push(`/zones/${zone.id}`)}
      className="cursor-pointer bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg overflow-hidden shadow-lg transition-all"
    >
      {zone.image && (
        <img
          src={zone.image}
          alt={zone.name}
          className="h-40 w-full object-cover"
        />
      )}
      {!zone.image && (
        <div className="h-40 w-full bg-gradient-to-br from-purple-900 to-purple-600 flex items-center justify-center">
          <span className="text-purple-300 text-sm">No Image</span>
        </div>
      )}

      <div className="p-4">
        <h3 className="text-lg font-bold text-slate-100 mb-2">{zone.name}</h3>

        <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
          <FaMapMarkerAlt className="text-purple-400" />
          {zone.location}
        </div>

        {zone.description && (
          <p className="text-slate-400 text-xs line-clamp-2">{zone.description}</p>
        )}
      </div>
    </motion.div>
  )
}