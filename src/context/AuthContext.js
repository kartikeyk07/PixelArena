// "use client"

// import { createContext, useContext, useEffect, useState } from "react"
// import { onAuthStateChanged, signOut } from "firebase/auth"
// import { auth } from "../lib/firebase"
// import { useRouter } from "next/navigation"

// const AuthContext = createContext()

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user)
//       setLoading(false)
//     })

//     return () => unsubscribe()
//   }, [])

//   const logout = async () => {
//     try {
//       await signOut(auth)
//       router.push("/login")
//     } catch (error) {
//       console.error("Error logging out:", error)
//     }
//   }

//   return (
//     <AuthContext.Provider value={{ user, logout }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => useContext(AuthContext)

"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "../lib/firebase"

const AuthContext = createContext()

export function AuthProvider({ children }) {

  const [user,setUser] = useState(null)
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    const unsubscribe = onAuthStateChanged(auth,(user)=>{

      setUser(user)
      setLoading(false)

    })

    return ()=>unsubscribe()

  },[])

  const logout = async () => {

    try{

      await signOut(auth)

      window.location.href = "/"

    }
    catch(error){

      console.error("Error logging out:",error)

    }

  }

  return(

    <AuthContext.Provider value={{user,logout}}>

      {!loading && children}

    </AuthContext.Provider>

  )

}

export const useAuth = () => useContext(AuthContext)