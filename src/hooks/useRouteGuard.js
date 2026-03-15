import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

/**
 * Hook to protect routes that require authentication
 * @param {boolean} adminOnly - If true, only allows admin users
 */
export function useRouteGuard(adminOnly = false) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    // No user logged in - redirect to login
    if (!user) {
      router.push("/login")
      return
    }

    // Admin-only route check
    if (adminOnly) {
      // Check if user is the designated admin
      const isAdmin = user.email === "kongekartikey007@gmail.com"
      if (!isAdmin) {
        router.push("/zones") // Redirect non-admins to user zone
      }
    }
  }, [user, loading, adminOnly, router])

  return { user, loading }
}
