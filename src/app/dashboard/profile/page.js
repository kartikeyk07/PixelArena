"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouteGuard } from "@/hooks/useRouteGuard"
import UserSidebar from "@/components/UserSidebar"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { FaUser, FaCalendarAlt, FaClock, FaTrophy, FaGamepad } from "react-icons/fa"

export default function ProfilePage() {
  useRouteGuard()
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      if (!user) return

      try {
        const ref = doc(db, "userStats", user.uid)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          setStats(snap.data())
        } else {
          // Default stats if none exist
          setStats({
            totalBookings: 0,
            totalHours: 0,
            favoriteGame: "None"
          })
        }
      } catch (error) {
        console.error("Error loading stats:", error)
        setStats({
          totalBookings: 0,
          totalHours: 0,
          favoriteGame: "None"
        })
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <div className="text-slate-400">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      <UserSidebar />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto p-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-8">
            My Profile
          </h1>

          {/* User Info Card */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-4 bg-purple-600 rounded-lg">
              <FaUser className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-100">
                {user?.email?.split('@')[0] || 'User'}
              </h2>
              <p className="text-slate-400">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center">
              <div className="p-3 bg-blue-600 rounded-lg">
                <FaCalendarAlt className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-slate-400 text-sm">Total Bookings</p>
                <p className="text-2xl font-bold text-slate-100">{stats?.totalBookings || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center">
              <div className="p-3 bg-green-600 rounded-lg">
                <FaClock className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-slate-400 text-sm">Hours Played</p>
                <p className="text-2xl font-bold text-slate-100">{stats?.totalHours || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center">
              <div className="p-3 bg-orange-600 rounded-lg">
                <FaTrophy className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-slate-400 text-sm">Favorite Game</p>
                <p className="text-lg font-bold text-slate-100">{stats?.favoriteGame || 'None'}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center">
              <div className="p-3 bg-purple-600 rounded-lg">
                <FaGamepad className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-slate-400 text-sm">Member Since</p>
                <p className="text-sm font-bold text-slate-100">
                  {user?.metadata?.creationTime ?
                    new Date(user.metadata.creationTime).toLocaleDateString() :
                    'Unknown'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Section */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h3 className="text-xl font-semibold text-slate-100 mb-6">Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${
              (stats?.totalBookings || 0) > 0
                ? 'bg-green-600/20 border-green-600/50'
                : 'bg-slate-700 border-slate-600'
            }`}>
              <div className="flex items-center space-x-3">
                <FaCalendarAlt className={`text-xl ${
                  (stats?.totalBookings || 0) > 0 ? 'text-green-400' : 'text-slate-400'
                }`} />
                <div>
                  <h4 className="font-semibold text-slate-100">First Booking</h4>
                  <p className="text-sm text-slate-400">
                    {(stats?.totalBookings || 0) > 0 ? 'Unlocked!' : 'Book your first game'}
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${
              (stats?.totalHours || 0) >= 10
                ? 'bg-blue-600/20 border-blue-600/50'
                : 'bg-slate-700 border-slate-600'
            }`}>
              <div className="flex items-center space-x-3">
                <FaClock className={`text-xl ${
                  (stats?.totalHours || 0) >= 10 ? 'text-blue-400' : 'text-slate-400'
                }`} />
                <div>
                  <h4 className="font-semibold text-slate-100">Gaming Enthusiast</h4>
                  <p className="text-sm text-slate-400">
                    {(stats?.totalHours || 0) >= 10 ? '10+ hours played!' : 'Play 10+ hours'}
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${
              (stats?.totalBookings || 0) >= 5
                ? 'bg-purple-600/20 border-purple-600/50'
                : 'bg-slate-700 border-slate-600'
            }`}>
              <div className="flex items-center space-x-3">
                <FaTrophy className={`text-xl ${
                  (stats?.totalBookings || 0) >= 5 ? 'text-purple-400' : 'text-slate-400'
                }`} />
                <div>
                  <h4 className="font-semibold text-slate-100">Regular Gamer</h4>
                  <p className="text-sm text-slate-400">
                    {(stats?.totalBookings || 0) >= 5 ? '5+ bookings made!' : 'Make 5+ bookings'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}