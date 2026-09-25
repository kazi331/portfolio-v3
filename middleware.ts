import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

const admin_auth_paths = ["/admin/login", "/admin/register"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const sessionCookie = getSessionCookie(request, {
        cookiePrefix: process.env.BETTER_AUTH_COOKIE_PREFIX,
    });

    // If the path is an admin auth path, check if the user is logged in
    if (admin_auth_paths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
        if (sessionCookie) {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
        return NextResponse.next();
    }

    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin", "/admin/:path*"],
};
