import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

const USER_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecretkey");

// Define a more specific type for your JWT payload
interface UserJWTPayload extends JWTPayload {
  userId?: string;
  email?: string;
  fullname?: string;
  role?: 'user' | 'admin'; // It's paramount to include the role here
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // --- NEW: ADMIN ROUTE PROTECTION ---
  if (pathname.startsWith("/admin")) {
    if (!token) {
      // If no token exists, immediately redirect to signin
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    try {
      const { payload } = await jwtVerify<UserJWTPayload>(token, USER_SECRET);

      // Scrutinize the payload for the 'admin' role
      if (payload.role !== 'admin') {
        // User is authenticated but not authorized. Redirect to an "unauthorized" page.
        return NextResponse.redirect(new URL("/unauthorized", req.url)); 
      }

      // If the user is an admin, allow them to proceed
      return NextResponse.next();

    } catch (err) {
      console.error("JWT invalid for admin route:", err);
      // If token is malformed or expired, redirect to signin
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  // --- YOUR EXISTING USER ROUTE PROTECTION ---
  if (pathname.startsWith("/hiring-form") || pathname.startsWith("/careers")) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    try {
      const { payload } = await jwtVerify<UserJWTPayload>(token, USER_SECRET);
      
      const headers = new Headers(req.headers);
      if (payload.userId) headers.set("x-user-id", payload.userId);
      if (payload.email) headers.set("x-user-email", payload.email);
      if (payload.fullname) headers.set("x-user-fullname", payload.fullname);

      return NextResponse.next({ request: { headers } });
    } catch (err) {
      console.error("JWT invalid for user route:", err);
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  // If the route doesn't match any protected paths, continue
  return NextResponse.next();
}

// --- PIVOTAL CHANGE: UPDATE THE MATCHER ---
// The matcher must include all paths you want the middleware to run on.
export const config = {
  matcher: [
    "/admin/:path*",
    "/hiring-form/:path*",
    "/careers/:path*"
  ],
};