"use client"

import { useEffect, useState } from "react"
import { getZones } from "@/services/zoneService"
import { useRouteGuard } from "@/hooks/useRouteGuard"
import UserSidebar from "@/components/UserSidebar"
import ZoneCard from "@/components/ZoneCard"
import { useRouter } from "next/navigation"
import { FaArrowLeft } from "react-icons/fa"

export default function ZonesPage() {
  useRouteGuard()
  const [zones, setZones] = useState([])
  const router = useRouter()

  useEffect(() => {
    async function loadZones() {
      const data = await getZones()
      setZones(data)
    }

    loadZones()
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      <UserSidebar />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto p-8">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-slate-100 transition-colors border border-slate-700"
            >
              <FaArrowLeft /> Back
            </button>
            <h1 className="text-4xl font-bold text-slate-100">
              Gaming Zones
            </h1>
          </div>

          {zones.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {zones.map((zone) => (
                <ZoneCard key={zone.id} zone={zone} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-800 p-12 rounded-lg border border-slate-700 text-center">
              <p className="text-slate-400">No gaming zones available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}