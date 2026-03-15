// "use client"

// import { useAuth } from "@/context/AuthContext"
// import UserSidebar from "@/components/UserSidebar"
// import { useEffect, useState } from "react"
// import { db } from "@/lib/firebase"
// import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore"
// import Link from "next/link"
// import { FaGamepad, FaCalendarAlt, FaClock, FaTrophy } from "react-icons/fa"

// export default function Dashboard() {
//   const { user } = useAuth()
//   const [stats, setStats] = useState({
//     totalBookings: 0,
//     totalHours: 0,
//     favoriteGame: "None"
//   })
//   const [recentBookings, setRecentBookings] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function loadUserData() {
//       if (!user) return

//       try {
//         // Load user stats
//         const statsRef = doc(db, "userStats", user.uid)
//         const statsSnap = await getDoc(statsRef)
//         if (statsSnap.exists()) {
//           setStats(statsSnap.data())
//         }

//         // Load recent bookings
//         const bookingsQuery = query(
//           collection(db, "bookings"),
//           where("userId", "==", user.uid)
//         )
//         const bookingsSnap = await getDocs(bookingsQuery)
//         const bookingsData = bookingsSnap.docs
//           .map(doc => ({ id: doc.id, ...doc.data() }))
//           .sort((a, b) => {
//             const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt)
//             const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt)
//             return dateB - dateA
//           })
//           .slice(0, 5)

//         setRecentBookings(bookingsData)
//       } catch (error) {
//         console.error("Error loading user data:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadUserData()
//   }, [user])

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
//         <div className="text-slate-400">Loading dashboard...</div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-slate-900 text-slate-100 flex">
//       <UserSidebar />
//       <div className="flex-1">
//         <div className="max-w-7xl mx-auto p-8">
//           <h1 className="text-3xl font-bold text-slate-100 mb-8">
//             Welcome back, {user?.email?.split('@')[0]}!
//           </h1>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
//             <div className="flex items-center">
//               <div className="p-3 bg-blue-600 rounded-lg">
//                 <FaCalendarAlt className="text-white text-xl" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-slate-400 text-sm">Total Bookings</p>
//                 <p className="text-2xl font-bold text-slate-100">{stats.totalBookings}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
//             <div className="flex items-center">
//               <div className="p-3 bg-green-600 rounded-lg">
//                 <FaClock className="text-white text-xl" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-slate-400 text-sm">Hours Played</p>
//                 <p className="text-2xl font-bold text-slate-100">{stats.totalHours}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
//             <div className="flex items-center">
//               <div className="p-3 bg-purple-600 rounded-lg">
//                 <FaTrophy className="text-white text-xl" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-slate-400 text-sm">Favorite Game</p>
//                 <p className="text-lg font-bold text-slate-100">{stats.favoriteGame}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
//             <div className="flex items-center">
//               <div className="p-3 bg-orange-600 rounded-lg">
//                 <FaGamepad className="text-white text-xl" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-slate-400 text-sm">Quick Actions</p>
//                 <Link href="/zones" className="text-sm text-orange-400 hover:text-orange-300">
//                   Book a Game →
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Recent Bookings */}
//         <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-8">
//           <h2 className="text-xl font-semibold text-slate-100 mb-6">Recent Bookings</h2>
//           {recentBookings.length > 0 ? (
//             <div className="space-y-4">
//               {recentBookings.map(booking => (
//                 <div key={booking.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
//                   <div className="flex items-center space-x-4">
//                     <div className="p-2 bg-blue-600 rounded-lg">
//                       <FaGamepad className="text-white text-sm" />
//                     </div>
//                     <div>
//                       <p className="text-slate-100 font-medium">{booking.gameName || 'Game'}</p>
//                       <p className="text-slate-400 text-sm">
//                         {booking.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown Date'}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-slate-100 font-medium">{booking.duration || 0} hours</p>
//                     <p className="text-slate-400 text-sm">{booking.slot || 'No slot'}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8 text-slate-400">
//               No bookings yet. <Link href="/zones" className="text-purple-400 hover:text-purple-300">Book your first game!</Link>
//             </div>
//           )}
//         </div>

//         {/* Quick Actions */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <Link
//             href="/dashboard/bookings"
//             className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:bg-slate-750 transition-colors duration-200 block group"
//           >
//             <div className="flex items-center">
//               <div className="p-3 bg-purple-600 rounded-lg group-hover:scale-110 transition-transform duration-200">
//                 <FaCalendarAlt className="text-white text-xl" />
//               </div>
//               <div className="ml-4">
//                 <h3 className="text-lg font-semibold text-slate-100">View All Bookings</h3>
//                 <p className="text-slate-400 text-sm">Check your booking history and manage reservations</p>
//               </div>
//             </div>
//           </Link>

//           <Link
//             href="/dashboard/profile"
//             className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:bg-slate-750 transition-colors duration-200 block group"
//           >
//             <div className="flex items-center">
//               <div className="p-3 bg-green-600 rounded-lg group-hover:scale-110 transition-transform duration-200">
//                 <FaTrophy className="text-white text-xl" />
//               </div>
//               <div className="ml-4">
//                 <h3 className="text-lg font-semibold text-slate-100">My Profile</h3>
//                 <p className="text-slate-400 text-sm">View your gaming stats and achievements</p>
//               </div>
//             </div>
//           </Link>
//         </div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouteGuard } from "@/hooks/useRouteGuard"
import UserSidebar from "@/components/UserSidebar"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore"
import Link from "next/link"
import { FaGamepad, FaCalendarAlt, FaClock, FaTrophy } from "react-icons/fa"

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

export default function Dashboard() {
  useRouteGuard()

  const { user } = useAuth()

  const [stats,setStats] = useState({
    totalBookings:0,
    totalHours:0,
    favoriteGame:"None"
  })

  const [recentBookings,setRecentBookings] = useState([])
  const [bookingData,setBookingData] = useState([])
  const [revenueData,setRevenueData] = useState([])
  const [popularGames,setPopularGames] = useState([])

  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    async function loadUserData(){

      if(!user) return

      try{

        /* USER STATS */

        const statsRef = doc(db,"userStats",user.uid)
        const statsSnap = await getDoc(statsRef)

        if(statsSnap.exists()){
          setStats(statsSnap.data())
        }

        /* BOOKINGS */

        const bookingsQuery = query(
          collection(db,"bookings"),
          where("userId","==",user.uid)
        )

        const bookingsSnap = await getDocs(bookingsQuery)

        const bookingsData = bookingsSnap.docs
          .map(doc=>({
            id:doc.id,
            ...doc.data()
          }))
          .sort((a,b)=>{
            const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt)
            const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt)
            return dateB - dateA
          })
          .slice(0,5)

        setRecentBookings(bookingsData)

        /* BOOKINGS PER DAY */

        const bookingsByDay = {}

        bookingsData.forEach(b=>{

          const day =
            b.createdAt?.toDate?.().toLocaleDateString() ||
            "Unknown"

          bookingsByDay[day] =
            (bookingsByDay[day] || 0) + 1

        })

        setBookingData(
          Object.entries(bookingsByDay).map(([day,value])=>({
            day,
            bookings:value
          }))
        )

        /* REVENUE */

        const revenueByDay = {}

        bookingsData.forEach(b=>{

          const day =
            b.createdAt?.toDate?.().toLocaleDateString() ||
            "Unknown"

          const price = b.price || 0

          revenueByDay[day] =
            (revenueByDay[day] || 0) + price

        })

        setRevenueData(
          Object.entries(revenueByDay).map(([day,value])=>({
            day,
            revenue:value
          }))
        )

        /* POPULAR GAMES */

        const games = {}

        bookingsData.forEach(b=>{

          const game = b.gameName || "Unknown"

          games[game] = (games[game] || 0) + 1

        })

        setPopularGames(
          Object.entries(games)
            .map(([name,count])=>({name,count}))
            .sort((a,b)=>b.count-a.count)
            .slice(0,5)
        )

      }

      catch(error){
        console.error("Error loading user data:",error)
      }

      finally{
        setLoading(false)
      }

    }

    loadUserData()

  },[user])

  if(loading){

    return(
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">
        Loading dashboard...
      </div>
    )

  }

  return(

    <div className="min-h-screen bg-slate-900 text-slate-100 flex">

      <UserSidebar/>

      <div className="flex-1">

        <div className="max-w-7xl mx-auto p-8">

          {/* HEADER */}

          <h1 className="text-3xl font-bold mb-8">
            Welcome back, {user?.email?.split("@")[0]}!
          </h1>


          {/* STATS CARDS */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-xl shadow-lg">
              <p className="text-sm opacity-80">Total Bookings</p>
              <h2 className="text-3xl font-bold">{stats.totalBookings}</h2>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-xl shadow-lg">
              <p className="text-sm opacity-80">Hours Played</p>
              <h2 className="text-3xl font-bold">{stats.totalHours}</h2>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-xl shadow-lg">
              <p className="text-sm opacity-80">Favorite Game</p>
              <h2 className="text-2xl font-bold">{stats.favoriteGame}</h2>
            </div>

            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 rounded-xl shadow-lg">
              <p className="text-sm opacity-80">Quick Action</p>
              <Link href="/zones" className="text-lg font-bold">
                Book Game →
              </Link>
            </div>

          </div>


          

          {/* RECENT BOOKINGS */}

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-8">

            <h2 className="text-xl font-semibold mb-6">
              Recent Bookings
            </h2>

            {recentBookings.length > 0 ? (

              <div className="space-y-4">

                {recentBookings.map(booking=>(
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-slate-700 rounded-lg"
                  >

                    <div className="flex items-center space-x-4">

                      <div className="p-2 bg-blue-600 rounded-lg">
                        <FaGamepad/>
                      </div>

                      <div>

                        <p className="font-medium">
                          {booking.gameName || "Game"}
                        </p>

                        <p className="text-slate-400 text-sm">
                          {booking.createdAt?.toDate?.()?.toLocaleDateString() || "Unknown"}
                        </p>

                      </div>

                    </div>

                    <div className="text-right">

                      <p className="font-medium">
                        {booking.duration || 0} hours
                      </p>

                      <p className="text-slate-400 text-sm">
                        {booking.slot || "No slot"}
                      </p>

                    </div>

                  </div>
                ))}

              </div>

            ) : (

              <div className="text-center text-slate-400">
                No bookings yet.
                <Link href="/zones" className="text-purple-400 ml-2">
                  Book your first game!
                </Link>
              </div>

            )}

          </div>

        </div>

      </div>

    </div>

  )

}