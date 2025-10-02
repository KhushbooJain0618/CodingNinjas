import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { HiringForm } from "@/models/HiringForm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } } // correct for Next.js 15+
) {
  try {
    await connectDB();

    const { id } = params;

    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ success: false, error: "Status not provided" }, { status: 400 });
    }

    const application = await HiringForm.findById(id);
    if (!application) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    // Toggle or set status
    application.status = status;
    await application.save();

    return NextResponse.json({ success: true, status: application.status });
  } catch (err: unknown) {
    let message = "Unknown error occurred";
    if (err instanceof Error) message = err.message;

    console.error("❌ Error updating application status:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
