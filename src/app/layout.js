import "./globals.css"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "../context/AuthContext"

export const metadata = {
  title: "PixelArena",
  description: "Gaming Zone Booking Platform",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Toaster />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}