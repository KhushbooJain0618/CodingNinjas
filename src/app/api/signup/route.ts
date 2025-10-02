// src/app/api/signup/route.ts
import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User, isValidEmail, isValidPassword } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { fullname, email, password } = await req.json();

    // ✅ Validation
    if (!fullname || !fullname.trim()) {
      return NextResponse.json(
        { error: "Full name is required" },
        { status: 400 }
      );
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Only @chitkara.edu.in emails allowed" },
        { status: 400 }
      );
    }

    if (!password || !isValidPassword(password)) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // ✅ Connect to MongoDB
    await connectDB();

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Save user
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "Account created successfully!" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
