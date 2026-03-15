"use client"

import { useState, useEffect } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useAuth } from "@/context/AuthContext"

export default function Register() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const register = async (e) => {
    e.preventDefault()

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = userCredential.user

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role: "user",
        createdAt: new Date(),
      })

      await fetch("/api/send-welcome", {
        method: "POST",
        body: JSON.stringify({ email, name }),
      })

      toast.success("Account created!")

      router.push("/dashboard")
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <form
        onSubmit={register}
        className="bg-[#111] p-8 rounded-xl border border-purple-500/20 w-[350px]"
      >
        <h2 className="text-2xl mb-6 text-purple-400">Create Account</h2>

        <input
          placeholder="Name"
          className="w-full mb-4 p-2 bg-black border border-gray-700 rounded"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          className="w-full mb-4 p-2 bg-black border border-gray-700 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 bg-black border border-gray-700 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-purple-600 py-2 rounded hover:bg-purple-700">
          Register
        </button>
      </form>
    </div>
  )
}