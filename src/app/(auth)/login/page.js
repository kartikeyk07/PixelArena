"use client"

import { signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function Login() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleLogin(e) {

    e.preventDefault()

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