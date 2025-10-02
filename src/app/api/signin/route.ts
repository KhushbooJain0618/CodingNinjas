import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "supersecretkey"
);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (!existingUser) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = await new SignJWT({
      userId: existingUser._id.toString(),
      email: existingUser.email,
      fullname: existingUser.fullname,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2h")
      .sign(JWT_SECRET);

    const response = NextResponse.json({ message: "Signed in successfully!" }, { status: 200 });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ❌ use false in dev if needed
      sameSite: "strict",
      // maxAge: 2 * 60 * 60,
      path: "/",
    });

    return response;

  } catch (err: unknown) {
  let message = "Internal Server Error";

  if (err instanceof Error) {
    message = err.message;
  }

  console.error("Signin error:", message);
  return NextResponse.json({ error: message }, { status: 500 });
}

}


