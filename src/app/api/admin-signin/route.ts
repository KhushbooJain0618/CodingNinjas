import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

// --- CHANGE #1: Use the same secret as your middleware ---
// This ensures the token can be verified correctly.
const USER_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecretkey");

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = await new SignJWT({ role: "admin", email })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("2h")
        .sign(USER_SECRET); // Use the unified secret here

      const res = NextResponse.json({ message: "Admin signed in successfully" }, { status: 200 });

      // --- CHANGE #2: Set the cookie name to "token" ---
      // This matches what your middleware is looking for.
      res.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 2 * 60 * 60, // 2 hours
        path: "/",
      });

      return res;
    }

    return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
  } catch (err) {
    console.error("Admin signin error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}