// src/app/api/admin/toggleStatus/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { HiringForm } from "@/models/HiringForm";

// PATCH handler for toggling status of a hiring form
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Await the params because Next.js 15 defines it as a Promise
    const { id } = await context.params;

    // Find the hiring form by ID
    const application = await HiringForm.findById(id);
    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    // Toggle status
    application.status =
      application.status === "pending" ? "approved" : "pending";
    await application.save();

    // Return the new status
    return NextResponse.json({ success: true, status: application.status });
  } catch (err: unknown) {
    let message = "Unknown error occurred";
    if (err instanceof Error) message = err.message;

    console.error("❌ Error updating application status:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
