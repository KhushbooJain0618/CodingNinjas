import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const USER_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecretkey");

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect user routes
  if (pathname.startsWith("/hiring-form") || pathname.startsWith("/careers")) {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.redirect(new URL("/signin", req.url));

    try {
      const verified = await jwtVerify(token, USER_SECRET);
      const payload = verified.payload as { userId?: string; email?: string; fullname?: string };
      const headers = new Headers(req.headers);
      if (payload.userId) headers.set("x-user-id", payload.userId);
      if (payload.email) headers.set("x-user-email", payload.email);
      if (payload.fullname) headers.set("x-user-fullname", payload.fullname);

      return NextResponse.next({ request: { headers } });
    } catch (err) {
      console.error("JWT invalid:", err);
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/hiring-form/:path*"],
};
