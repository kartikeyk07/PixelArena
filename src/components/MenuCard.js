"use client"

import { motion } from "framer-motion"
import { FaUtensils } from "react-icons/fa"

export default function MenuCard({ item }) {

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className="bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg overflow-hidden shadow-lg transition-all"
    >

      {item.image && (
        <img
          src={item.image}
          className="h-32 w-full object-cover"
        />
      )}
      {!item.image && (
        <div className="h-32 w-full bg-gradient-to-br from-orange-900 to-orange-600 flex items-center justify-center">
          <FaUtensils className="text-orange-300 text-2xl" />
        </div>
      )}

      <div className="p-4">

        <h3 className="text-slate-100 text-sm font-bold">
          {item.name}
        </h3>

        <p className="text-slate-400 text-sm mt-2">
          ₹{item.price}
        </p>

      </div>

    </motion.div>
  )
}