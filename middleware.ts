import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // Skip middleware for auth routes
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ["/api/auth/:path*", "/admin/:path*"],
}
