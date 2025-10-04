import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Career } from "@/models/Career";
import mongoose from "mongoose";

// Handles DELETE requests to /api/admin/careers/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

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
    let message = "An unknown server error occurred.";
    if (error instanceof Error) {
      message = error.message;
    }
    console.error("❌ Error deleting career:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}