"use client"

import { signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useAuth } from "@/context/AuthContext"

export default function Login() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    // Sign out any existing user when login page loads
    const signOutExistingUser = async () => {
      try {
        await signOut(auth)
      } catch (error) {
        console.error("Error signing out:", error)
      }
    }

    signOutExistingUser()
  }, [])

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleLogin(e) {

    e.preventDefault()

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = userCredential.user

      const docRef = doc(db, "users", user.uid)
      const docSnap = await getDoc(docRef)

      const role = docSnap.data().role

      if (role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      console.error("Login failed:", err)
      const code = err?.code || ""
      const message =
        code === "auth/invalid-email" ||
        code === "auth/wrong-password" ||
        code === "auth/user-not-found" ||
        code === "auth/invalid-credential"
          ? "Invalid email or password"
          : "Unable to login. Please try again."
      toast.error(message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">

      <form onSubmit={handleLogin} className="bg-[#111] p-8 rounded-xl">

        <h2 className="text-2xl mb-6">Login</h2>

        <input
          placeholder="Email"
          className="w-full p-2 mb-4 bg-black border border-gray-700"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 bg-black border border-gray-700"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button className="w-full bg-purple-600 py-2 rounded">
          Login
        </button>

      </form>

    </div>
  )
}