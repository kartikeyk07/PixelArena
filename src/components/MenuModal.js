"use client"

import { useEffect, useState } from "react"
import { getMenuByZone } from "@/services/menuService"
import { FaUtensils, FaTimes } from "react-icons/fa"

export default function MenuModal({ isOpen, onClose, zoneId, zoneName }) {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isOpen || !zoneId) {
      setLoading(true)
      return
    }

    async function loadMenu() {
      try {
        const data = await getMenuByZone(zoneId)
        setMenuItems(data)
      } catch (error) {
        console.error("Error loading menu items:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMenu()
  }, [isOpen, zoneId])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-2xl w-full max-h-[80vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 p-6 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-600 rounded-lg">
              <FaUtensils className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Menu Items</h2>
              <p className="text-slate-400 text-sm">{zoneName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-slate-400">Loading menu items...</div>
            </div>
          ) : menuItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-700 p-4 rounded-lg border border-slate-600 hover:border-orange-500 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-100 flex-1">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-orange-600/20 px-3 py-1 rounded-lg">
                      <span className="text-orange-400 text-sm font-semibold">₹</span>
                      <span className="text-orange-400 font-semibold">
                        {item.price?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-slate-400 text-sm mb-3">
                      {item.description}
                    </p>
                  )}

                  {item.category && (
                    <div className="inline-block px-3 py-1 bg-slate-600 rounded text-xs text-slate-300">
                      {item.category}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <FaUtensils className="text-slate-500 text-5xl mb-4" />
              <p className="text-slate-400 text-lg">No menu items available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
