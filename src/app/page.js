"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FaGamepad, FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaStar, FaArrowRight } from "react-icons/fa"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
}

const features = [
  {
    icon: FaMapMarkerAlt,
    title: "Multiple Zones",
    description: "Explore gaming zones across the city with different games and amenities"
  },
  {
    icon: FaGamepad,
    title: "Diverse Games",
    description: "Choose from a wide variety of gaming machines and consoles"
  },
  {
    icon: FaCalendarAlt,
    title: "Easy Booking",
    description: "Book your slots in advance with our simple and intuitive booking system"
  },
  {
    icon: FaUsers,
    title: "Community",
    description: "Join a community of gaming enthusiasts and make new friends"
  }
]

const stats = [
  { number: "50+", label: "Active Games" },
  { number: "12", label: "Gaming Zones" },
  { number: "5k+", label: "Happy Gamers" }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Navigation Bar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaGamepad className="text-purple-500 text-2xl" />
            <span className="text-2xl font-bold text-slate-100">PixelArena</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <button className="px-6 py-2 text-slate-300 hover:text-slate-100 border border-slate-700 rounded-lg hover:border-slate-500 transition-all duration-200">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/50">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-900 to-slate-900 pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative max-w-7xl mx-auto px-8 py-24 text-center"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Title */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-1 w-12 bg-purple-500 rounded-full" />
                <span className="text-purple-400 font-semibold tracking-wider">WELCOME TO</span>
                <div className="h-1 w-12 bg-purple-500 rounded-full" />
              </div>
              <h1 className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600">
                PixelArena
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
            >
              Experience the ultimate gaming adventure. Book premium gaming zones, discover incredible games, and join a vibrant community of gaming enthusiasts.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
            >
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(168, 85, 247, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-xl"
                >
                  Get Started
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-purple-500 text-slate-100 font-bold rounded-xl hover:bg-purple-500/10 transition-all duration-200"
                >
                  Sign In
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats Section
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative max-w-7xl mx-auto px-8 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-xl p-8 text-center hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="text-4xl font-bold text-purple-400 mb-2">{stat.number}</div>
              <div className="text-slate-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div> */}

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative max-w-7xl mx-auto px-8 py-24"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose PixelArena?</h2>
          <p className="text-xl text-slate-400">Discover what makes us the ultimate gaming destination</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8, borderColor: "#a855f7" }}
                className="group bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-xl p-8 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
              >
                <div className="mb-4 inline-block p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                  <Icon className="text-purple-400 text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative max-w-4xl mx-auto px-8 py-24"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative bg-gradient-to-r from-purple-600/20 via-purple-500/10 to-purple-600/20 border border-purple-500/30 rounded-2xl p-12 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/0 via-purple-500/10 to-purple-900/0 pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Level Up?</h3>
            <p className="text-lg text-slate-300 mb-8">Join thousands of gamers enjoying premium gaming experiences</p>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/50 inline-flex items-center gap-2"
              >
                Start Playing Now
                <FaArrowRight />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </motion.section>

      {/* Footer */}
      {/* <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative border-t border-slate-700 bg-slate-900/50 py-12"
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FaGamepad className="text-purple-500 text-xl" />
                <span className="font-bold text-slate-100">PixelArena</span>
              </div>
              <p className="text-slate-400">The ultimate gaming zone booking platform</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-100 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/login" className="hover:text-purple-400 transition">Login</a></li>
                <li><a href="/register" className="hover:text-purple-400 transition">Register</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-100 mb-4">Contact</h4>
              <p className="text-slate-400 text-sm">support@zonegaming.com</p>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-500 text-sm">
            <p>&copy; 2026 PixelArena. All rights reserved.</p>
          </div>
        </div>
      </motion.footer> */}
    </div>
  )
}