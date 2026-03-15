"use client"

import { motion } from "framer-motion"

export default function Card({ children }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-[#0f172a] border border-purple-500/20 rounded-xl p-6 shadow-lg"
    >
      {children}
    </motion.div>
  )
}

