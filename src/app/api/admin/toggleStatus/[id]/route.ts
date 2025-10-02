import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { HiringForm } from "@/models/HiringForm";

interface Params {
  params: { id: string };
}

export async function PATCH(req: Request, { params }: Params) {
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
  } catch (err: any) {
    console.error("❌ Error updating application status:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
