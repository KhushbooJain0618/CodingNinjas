import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { HiringForm } from "@/models/HiringForm";
import mongoose from "mongoose";

// This function handles DELETE requests to /api/admin/applications/[id]
export async function DELETE(
  request: NextRequest,
  // Correctly type context to show that params is a Promise
  context: { params: Promise<{ id: string }> }
) {
  // Await the promise to resolve the params and then destructure the id
  const { id } = await context.params;

  // Validate that the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid application ID format" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    // Find the document by its ID and delete it
    const deletedApplication = await HiringForm.findByIdAndDelete(id);

    // If no document was found with that ID
    if (!deletedApplication) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    // Respond with a success message
    return NextResponse.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    let message = "An unknown server error occurred.";
    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

