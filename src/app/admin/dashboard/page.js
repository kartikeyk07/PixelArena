// "use client"

// import { useEffect, useState } from "react"
// import { db } from "@/lib/firebase"
// import {
//   collection,
//   getDocs
// } from "firebase/firestore"
// import AdminSidebar from "@/components/AdminSidebar"
// import { FaMapMarkerAlt, FaGamepad, FaUtensils, FaUsers, FaChartBar } from "react-icons/fa"

// export default function AdminDashboard() {
//   const [stats, setStats] = useState({
//     zones: 0,
//     games: 0,
//     menuItems: 0
//   })

//   async function loadStats() {
//     const [zonesSnap, gamesSnap, menuSnap] = await Promise.all([
//       getDocs(collection(db, "zones")),
//       getDocs(collection(db, "games")),
//       getDocs(collection(db, "menu"))
//     ])

//     setStats({
//       zones: zonesSnap.size,
//       games: gamesSnap.size,
//       menuItems: menuSnap.size
//     })
//   }

//   useEffect(() => {
//     loadStats()
//   }, [])

//   const statCards = [
//     {
//       title: "Total Zones",
//       value: stats.zones,
//       icon: FaMapMarkerAlt,
//       color: "bg-purple-600",
//       href: "/admin/zones"
//     },
//     {
//       title: "Total Games",
//       value: stats.games,
//       icon: FaGamepad,
//       color: "bg-blue-600",
//       href: "/admin/games"
//     },
//     {
//       title: "Menu Items",
//       value: stats.menuItems,
//       icon: FaUtensils,
//       color: "bg-green-600",
//       href: "/admin/menu"
//     }
//   ]

//   return (
//     <div className="min-h-screen bg-slate-900 text-slate-100 flex">
//       <AdminSidebar />

//       {/* Main Content */}
//       <div className="flex-1 p-8">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-3xl font-bold text-slate-100 mb-8">
//             Admin Dashboard
//           </h1>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             {statCards.map((card, index) => {
//               const Icon = card.icon
//               return (
//                 <a
//                   key={index}
//                   href={card.href}
//                   className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:bg-slate-750 transition-colors duration-200 block group"
//                 >
//                   <div className="flex items-center">
//                     <div className={`p-3 ${card.color} rounded-lg group-hover:scale-110 transition-transform duration-200`}>
//                       <Icon className="text-white text-xl" />
//                     </div>
//                     <div className="ml-4">
//                       <p className="text-slate-400 text-sm">{card.title}</p>
//                       <p className="text-2xl font-bold text-slate-100">{card.value}</p>
//                     </div>
//                   </div>
//                 </a>
//               )
//             })}
//           </div>
// {/* CHARTS */}

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

//             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">

//               <h3 className="text-lg font-semibold mb-4">
//                 Bookings Per Day
//               </h3>

//               <ResponsiveContainer width="100%" height={300}>

//                 <LineChart data={bookingData}>

//                   <CartesianGrid strokeDasharray="3 3"/>

//                   <XAxis dataKey="day"/>

//                   <YAxis/>

//                   <Tooltip/>

//                   <Line
//                     type="monotone"
//                     dataKey="bookings"
//                     stroke="#8b5cf6"
//                     strokeWidth={3}
//                   />

//                 </LineChart>

//               </ResponsiveContainer>

//             </div>


//             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">

//               <h3 className="text-lg font-semibold mb-4">
//                 Revenue
//               </h3>

//               <ResponsiveContainer width="100%" height={300}>

//                 <BarChart data={revenueData}>

//                   <CartesianGrid strokeDasharray="3 3"/>

//                   <XAxis dataKey="day"/>

//                   <YAxis/>

//                   <Tooltip/>

//                   <Bar dataKey="revenue" fill="#22c55e"/>

//                 </BarChart>

//               </ResponsiveContainer>

//             </div>

//           </div>


//           {/* POPULAR GAMES + ACTIVITY */}

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

//             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">

//               <h3 className="text-lg font-semibold mb-4">
//                 Popular Games
//               </h3>

//               <div className="space-y-3">

//                 {popularGames.map(game=>(
//                   <div
//                     key={game.name}
//                     className="flex justify-between bg-slate-700 p-3 rounded-lg"
//                   >
//                     <span>{game.name}</span>
//                     <span className="text-purple-400">
//                       {game.count} bookings
//                     </span>
//                   </div>
//                 ))}

//               </div>

//             </div>


//             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">

//               <h3 className="text-lg font-semibold mb-4">
//                 Recent Activity
//               </h3>

//               <div className="space-y-3">

//                 {recentBookings.map(b=>(
//                   <div
//                     key={b.id}
//                     className="bg-slate-700 p-3 rounded-lg"
//                   >
//                     <p className="text-sm">
//                       {b.userEmail || "User"} booked{" "}
//                       <span className="text-purple-400">
//                         {b.gameName}
//                       </span>
//                     </p>
//                   </div>
//                 ))}

//               </div>

//             </div>

//           </div>

//           {/* Quick Actions */}
//           <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
//             <h2 className="text-xl font-semibold text-slate-100 mb-6">Quick Actions</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <a
//                 href="/admin/zones"
//                 className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
//               >
//                 <FaMapMarkerAlt />
//                 Manage Zones
//               </a>
//               <a
//                 href="/admin/games"
//                 className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
//               >
//                 <FaGamepad />
//                 Add Games
//               </a>
//               <a
//                 href="/admin/menu"
//                 className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
//               >
//                 <FaUtensils />
//                 Manage Menu
//               </a>
//             </div>
//           </div>

//           {/* Recent Activity Placeholder */}
//           <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mt-8">
//             <h2 className="text-xl font-semibold text-slate-100 mb-6">Recent Activity</h2>
//             <div className="text-slate-400 text-center py-8">
//               Activity feed will be implemented with real-time updates
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import {
  collection,
  getDocs,
  onSnapshot
} from "firebase/firestore"
import { useRouteGuard } from "@/hooks/useRouteGuard"
import AdminSidebar from "@/components/AdminSidebar"
import { FaMapMarkerAlt, FaGamepad, FaUtensils } from "react-icons/fa"

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

export default function AdminDashboard() {

  useRouteGuard(true) // Admin-only route

  const [stats,setStats] = useState({
    zones:0,
    games:0,
    menuItems:0
  })

  const [bookingData,setBookingData] = useState([])
  const [revenueData,setRevenueData] = useState([])
  const [popularGames,setPopularGames] = useState([])
  const [zoneAnalytics,setZoneAnalytics] = useState([])
  const [heatmap,setHeatmap] = useState([])
  const [recentBookings,setRecentBookings] = useState([])

  async function loadStats(){

    const [zonesSnap,gamesSnap,menuSnap] = await Promise.all([
      getDocs(collection(db,"zones")),
      getDocs(collection(db,"games")),
      getDocs(collection(db,"menu"))
    ])

    setStats({
      zones:zonesSnap.size,
      games:gamesSnap.size,
      menuItems:menuSnap.size
    })

  }

  useEffect(()=>{

    loadStats()

    /* REAL TIME BOOKINGS LISTENER */

    const unsubscribe = onSnapshot(
      collection(db,"bookings"),
      (snapshot)=>{

        const bookings = snapshot.docs.map(doc=>({
          id:doc.id,
          ...doc.data()
        }))

        setRecentBookings(bookings.slice(0,5))

        /* BOOKINGS PER DAY */

        const bookingsByDay = {}

        bookings.forEach(b=>{

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

        bookings.forEach(b=>{

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

        bookings.forEach(b=>{

          const game = b.gameName || "Unknown"

          games[game] = (games[game] || 0) + 1

        })

        setPopularGames(
          Object.entries(games)
            .map(([name,count])=>({name,count}))
            .sort((a,b)=>b.count-a.count)
            .slice(0,5)
        )

        /* ZONE ANALYTICS */

        const zones = {}

        bookings.forEach(b=>{

          const zone = b.zoneName || "Unknown"

          zones[zone] = (zones[zone] || 0) + 1

        })

        setZoneAnalytics(
          Object.entries(zones).map(([name,count])=>({
            name,
            bookings:count
          }))
        )

        /* GAME HEATMAP */

        const heat = {}

        bookings.forEach(b=>{

          const game = b.gameName || "Unknown"

          heat[game] = (heat[game] || 0) + 1

        })

        setHeatmap(
          Object.entries(heat).map(([name,count])=>({
            name,
            usage:count
          }))
        )

      }
    )

    return ()=>unsubscribe()

  },[])

  const statCards = [
    {
      title:"Total Zones",
      value:stats.zones,
      icon:FaMapMarkerAlt,
      color:"bg-purple-600",
      href:"/admin/zones"
    },
    {
      title:"Total Games",
      value:stats.games,
      icon:FaGamepad,
      color:"bg-blue-600",
      href:"/admin/games"
    },
    {
      title:"Menu Items",
      value:stats.menuItems,
      icon:FaUtensils,
      color:"bg-green-600",
      href:"/admin/menu"
    }
  ]

  return(

    <div className="min-h-screen bg-slate-900 text-slate-100 flex">

      <AdminSidebar/>

      <div className="flex-1 p-8">

        <div className="max-w-7xl mx-auto">

          <h1 className="text-3xl font-bold mb-8">
            Admin Dashboard
          </h1>


          {/* STATS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            {statCards.map((card,index)=>{

              const Icon = card.icon

              return(

                <a
                  key={index}
                  href={card.href}
                  className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:bg-slate-700 transition block"
                >

                  <div className="flex items-center">

                    <div className={`p-3 ${card.color} rounded-lg`}>
                      <Icon className="text-white text-xl"/>
                    </div>

                    <div className="ml-4">
                      <p className="text-slate-400 text-sm">
                        {card.title}
                      </p>

                      <p className="text-2xl font-bold">
                        {card.value}
                      </p>
                    </div>

                  </div>

                </a>

              )

            })}

          </div>


          {/* BOOKINGS CHART */}

          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">

              <h3 className="text-lg font-semibold mb-4">
                Bookings Per Day
              </h3>

              <ResponsiveContainer width="100%" height={300}>

                <LineChart data={bookingData}>

                  <CartesianGrid strokeDasharray="3 3"/>

                  <XAxis dataKey="day"/>

                  <YAxis/>

                  <Tooltip/>

                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>


            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">

              <h3 className="text-lg font-semibold mb-4">
                Revenue Dashboard
              </h3>

              <ResponsiveContainer width="100%" height={300}>

                <BarChart data={revenueData}>

                  <CartesianGrid strokeDasharray="3 3"/>

                  <XAxis dataKey="day"/>

                  <YAxis/>

                  <Tooltip/>

                  <Bar dataKey="revenue" fill="#22c55e"/>

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div> */}


          {/* ZONE ANALYTICS */}

          {/* <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-10">

            <h3 className="text-lg font-semibold mb-4">
              Zone-wise Analytics
            </h3>

            <ResponsiveContainer width="100%" height={300}>

              <BarChart data={zoneAnalytics}>

                <CartesianGrid strokeDasharray="3 3"/>

                <XAxis dataKey="name"/>

                <YAxis/>

                <Tooltip/>

                <Bar dataKey="bookings" fill="#3b82f6"/>

              </BarChart>

            </ResponsiveContainer>

          </div> */}


          {/* GAME HEATMAP */}

          {/* <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">

            <h3 className="text-lg font-semibold mb-4">
              Game Usage Heatmap
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {heatmap.map(game=>(

                <div
                  key={game.name}
                  className="bg-purple-600/20 border border-purple-600 p-4 rounded-lg text-center"
                >

                  <p className="font-semibold">
                    {game.name}
                  </p>

                  <p className="text-sm text-purple-400">
                    {game.usage} plays
                  </p>

                </div>

              ))}

            </div>

          </div> */}

        </div>

      </div>

    </div>

  )

}