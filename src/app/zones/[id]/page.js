"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useRouteGuard } from "@/hooks/useRouteGuard"
import { getGamesByZone } from "@/services/gameService"
import { getMenuByZone } from "@/services/menuService"
import UserSidebar from "@/components/UserSidebar"
import GameCard from "@/components/GameCard"
import MenuCard from "@/components/MenuCard"
import { FaArrowLeft, FaMapMarkerAlt, FaClock } from "react-icons/fa"

export default function ZoneDetails() {
  useRouteGuard()
  const { id } = useParams()
  const router = useRouter()

  const [zone, setZone] = useState(null)
  const [games, setGames] = useState([])
  const [menu, setMenu] = useState([])

  useEffect(() => {

    async function loadData() {

      const zoneRef = doc(db, "zones", id)
      const zoneSnap = await getDoc(zoneRef)

      setZone(zoneSnap.data())

      const gamesData = await getGamesByZone(id)
      const menuData = await getMenuByZone(id)

      setGames(gamesData)
      setMenu(menuData)
    }

    loadData()

  }, [id])

  if (!zone) return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      <UserSidebar />
      <div className="flex-1 flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      <UserSidebar />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto p-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-slate-100 transition-colors border border-slate-700 mb-8"
          >
            <FaArrowLeft /> Back to Zones
          </button>

          {zone.image ? (
            <img
              src={zone.image}
              alt={zone.name}
              className="rounded-lg w-full h-[300px] object-cover border border-slate-700 mb-8"
            />
          ) : (
            <div className="rounded-lg w-full h-[300px] bg-gradient-to-br from-purple-900 to-purple-600 flex items-center justify-center border border-slate-700 mb-8">
              <span className="text-slate-300">No Image Available</span>
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-100 mb-2">
              {zone.name}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-400">
                <FaMapMarkerAlt className="text-purple-400" />
                {zone.location}
              </div>
              {zone.openingHours && (
                <div className="flex items-center gap-2 text-slate-400">
                  <FaClock className="text-purple-400" />
                  {zone.openingHours}
                </div>
              )}
            </div>
          </div>

          {zone.description && (
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-12">
              <p className="text-slate-300">{zone.description}</p>
            </div>
          )}

          {/* Games Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
              Available Games
            </h2>

            {games.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map(game => (
                  <GameCard key={game.id} game={game} zoneId={id} zoneName={zone.name} />
                ))}
              </div>
            ) : (
              <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 text-center">
                <p className="text-slate-400">No games available in this zone</p>
              </div>
            )}
          </div>

          {/* Cafe Menu Section */}
          {menu.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-100 mb-6">
                Cafe Menu
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {menu.map(item => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}