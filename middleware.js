import { NextResponse } from "next/server"

export function middleware(request) {
  const url = request.nextUrl

  const protectedRoutes = ["/dashboard", "/admin"]

  const token = request.cookies.get("token")

  if (
    protectedRoutes.some((path) => url.pathname.startsWith(path)) &&
    !token
  ) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}