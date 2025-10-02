import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { HiringForm } from "@/models/HiringForm";

// Correct typing: context.params is { id: string }
interface Context {
  params: { id: string };
}

export async function PATCH(req: Request, { params }: Context) {
  try {
    const { id } = params;
    await connectDB();

    const application = await HiringForm.findById(id);
    if (!application) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    // Toggle status
    application.status = application.status === "pending" ? "approved" : "pending";
    await application.save();

    return NextResponse.json({ success: true, status: application.status });
  } catch (err: unknown) {
    let message = "An unknown error occurred";
    if (err instanceof Error) {
      message = err.message;
    }
    console.error("❌ Error updating application status:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
