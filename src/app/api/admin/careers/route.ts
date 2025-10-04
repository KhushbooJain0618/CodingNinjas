import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Career } from "@/models/Career";

// Handles POST requests to /api/admin/careers to add a new career
export async function POST(req: Request) {
  try {
    const { title, role } = await req.json();

    if (!title || !role) {
      return NextResponse.json(
        { success: false, error: "Title and role are required fields" },
        { status: 400 }
      );
    }

    await connectDB();
    const newCareer = await Career.create({ title, role });

    return NextResponse.json({ success: true, career: newCareer }, { status: 201 });
  } catch (error) {
    let message = "An unknown server error occurred.";
    if (error instanceof Error) {
      message = error.message;
    }
    console.error("❌ Error creating career:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// Handles GET requests to /api/careers (and implicitly /api/admin/careers)
// This single endpoint can be used by both the public page and the admin panel.
export async function GET() {
  try {
    await connectDB();
    const careers = await Career.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, careers });
  } catch (error) {
    let message = "An unknown server error occurred.";
    if (error instanceof Error) {
      message = error.message;
    }
    console.error("❌ Error fetching careers:", message);
    return NextResponse.json(
      { success: false, error: "Server error fetching careers" },
      { status: 500 }
    );
  }
}