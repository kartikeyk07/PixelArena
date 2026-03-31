"use client"

import { useEffect, useState } from "react"
import { getMenuByZone } from "@/services/menuService"
import { FaUtensils, FaTimes, FaPlus, FaMinus } from "react-icons/fa"

export default function CafeMenuModal({ isOpen, onClose, zoneId, zoneName, onConfirm, bookingData }) {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState({}) // itemId: quantity

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

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      const newSelected = { ...selectedItems }
      delete newSelected[itemId]
      setSelectedItems(newSelected)
    } else {
      setSelectedItems(prev => ({
        ...prev,
        [itemId]: quantity
      }))
    }
  }

  const getTotal = () => {
    return Object.entries(selectedItems).reduce((total, [itemId, quantity]) => {
      const item = menuItems.find(item => String(item.id) === String(itemId))
      return total + (item ? item.price * quantity : 0)
    }, 0)
  }

  const handleConfirm = () => {
    const selectedMenuItems = Object.entries(selectedItems).map(([itemId, quantity]) => {
      const item = menuItems.find(item => item.id === itemId)
      return {
        id: itemId,
        name: item.name,
        price: item.price,
        quantity,
        total: item.price * quantity
      }
    })

    onConfirm(selectedMenuItems)
    onClose()
  }

  const handleSkip = () => {
    onConfirm([])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 p-6 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-600 rounded-lg">
              <FaUtensils className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Add Cafe Items to Your Bill</h2>
              <p className="text-slate-400 text-sm">{zoneName} - Optional</p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="text-slate-400 hover:text-slate-200 transition-colors text-sm"
          >
            Skip
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-slate-400">Loading menu items...</div>
            </div>
          ) : menuItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-700 p-4 rounded-lg border border-slate-600 hover:border-orange-500 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
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
                      <div className="inline-block px-3 py-1 bg-slate-600 rounded text-xs text-slate-300 mb-3">
                        {item.category}
                      </div>
                    )}

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, (selectedItems[item.id] || 0) - 1)}
                        className="p-2 bg-slate-600 hover:bg-slate-500 rounded text-slate-300 hover:text-white transition-colors"
                      >
                        <FaMinus className="text-sm" />
                      </button>
                      <span className="px-3 py-2 bg-slate-800 rounded text-slate-100 min-w-[3rem] text-center">
                        {selectedItems[item.id] || 0}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, (selectedItems[item.id] || 0) + 1)}
                        className="p-2 bg-slate-600 hover:bg-slate-500 rounded text-slate-300 hover:text-white transition-colors"
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total and Confirm */}
              {Object.keys(selectedItems).length > 0 && (
                <div className="bg-slate-700 p-4 rounded-lg border border-slate-600 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-100 font-semibold">Cafe Items Total:</span>
                    <span className="text-orange-400 font-bold text-lg">
                      ₹{getTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleSkip}
                  className="flex-1 bg-slate-600 hover:bg-slate-500 text-slate-100 font-semibold px-4 py-3 rounded-lg transition-colors"
                >
                  No Thanks, Continue
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={Object.keys(selectedItems).length === 0}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-4 py-3 rounded-lg transition-colors"
                >
                  Add to Bill (₹{getTotal().toFixed(2)})
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <FaUtensils className="text-slate-500 text-5xl mb-4" />
              <p className="text-slate-400 text-lg mb-4">No menu items available</p>
              <button
                onClick={handleSkip}
                className="bg-slate-600 hover:bg-slate-500 text-slate-100 font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}