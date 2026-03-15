"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaGamepad, FaCalendarAlt, FaUser, FaSignOutAlt } from "react-icons/fa"
import { useAuth } from "@/context/AuthContext"

export default function UserSidebar(){
  const pathname = usePathname()
  const { logout } = useAuth()

  const menuItems = [
    { href: "/zones", label: "Browse Games", icon: FaGamepad },
    { href: "/dashboard", label: "My Dashboard", icon: FaCalendarAlt },
    { href: "/dashboard/profile", label: "Profile", icon: FaUser },
    { href: "/dashboard/bookings", label: "My Bookings", icon: FaCalendarAlt },
  ]

  return(
    <div className="w-64 bg-slate-800 min-h-screen text-slate-100 p-6 border-r border-slate-700 flex flex-col">
      <h1 className="text-xl font-bold mb-10 text-slate-100">
        Gamer's Hub
      </h1>
      <ul className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'hover:bg-slate-700 text-slate-300 hover:text-slate-100'
                }`}
              >
                <Icon className="text-lg" />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 w-full text-left"
      >
        <FaSignOutAlt className="text-lg" />
        Logout
      </button>
    </div>
  )
}
