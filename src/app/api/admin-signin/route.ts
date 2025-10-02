import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
const ADMIN_SECRET = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || "adminsupersecret");

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // ✅ Validate admin credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = await new SignJWT({ role: "admin", email })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("2h")
        .sign(ADMIN_SECRET);

      // ✅ Set HTTP-only cookie
      const res = NextResponse.json({ message: "Admin signed in successfully" }, { status: 200 });
      res.cookies.set("admin_token", token, {
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


