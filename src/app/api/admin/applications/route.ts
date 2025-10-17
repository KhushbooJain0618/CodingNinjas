import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { HiringForm } from "@/models/HiringForm";

export async function GET() {
  try {
    // Establish a connection to the database.
    await connectDB();

    // Query for pending forms. By not using .select(), we command Mongoose
    // to retrieve every single field defined in the HiringFormSchema.
    const pendingForms = await HiringForm.find({ status: "pending" }).sort({
      createdAt: -1,
    });

    // Similarly, query for approved forms, retrieving all fields.
    const completedForms = await HiringForm.find({ status: "approved" }).sort({
      updatedAt: -1,
    });

    // This log is for definitive verification in your terminal.
    if (pendingForms.length > 0) {
    }

    // Return the complete data.
    return NextResponse.json({ success: true, pendingForms, completedForms });

  } catch (error) {
    // A robust error handler for diagnosing any unexpected issues.
    let message = "An unknown error occurred.";
    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      { success: false, error: "Server error while fetching applications." },
      { status: 500 }
    );
  }
}

