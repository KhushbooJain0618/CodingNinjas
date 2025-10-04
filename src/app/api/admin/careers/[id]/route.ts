import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Career } from "@/models/Career";
import mongoose from "mongoose";

// Handles DELETE requests to /api/admin/careers/[id]
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await because it's a Promise

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid career ID format" },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const deletedCareer = await Career.findByIdAndDelete(id);

    if (!deletedCareer) {
      return NextResponse.json(
        { success: false, error: "Career not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Career deleted successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unknown server error occurred.";

    console.error("❌ Error deleting career:", message);

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
