// src/app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

const USER_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecretkey");
const ADMIN_SECRET = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || "anothersecretstring");

interface CustomJWTPayload extends JWTPayload {
  userId?: string;
  adminId?: string;
  email?: string;
  fullname?: string;
  role?: string;
}

export async function GET(req: NextRequest) {
  try {
    const userToken = req.cookies.get("token")?.value;
    const adminToken = req.cookies.get("admin_token")?.value;

    if (!userToken && !adminToken) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    let payload: CustomJWTPayload;
    let userRole = "user";
    let id: string | null = null;

    // ✅ Prioritize user token
    if (userToken) {
      const result = await jwtVerify(userToken, USER_SECRET);
      payload = result.payload as CustomJWTPayload;
      id = payload.userId || null;
    } else if (adminToken) {
      const result = await jwtVerify(adminToken, ADMIN_SECRET);
      payload = result.payload as CustomJWTPayload;
      userRole = "admin";
      id = payload.adminId || null;
    } else {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id,
        email: payload.email || "",
        fullname: payload.fullname || "",
        role: userRole,
      },
    });
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

