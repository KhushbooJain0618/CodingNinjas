import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { HiringForm } from "@/models/HiringForm";

export async function GET() {
  try {
    await connectDB();

    // Fetch all forms sorted by newest
    const allForms = await HiringForm.find().sort({ createdAt: -1 }).lean();

    // Serialize _id to string
    const serialize = (docs: any[]) => docs.map((d) => ({ ...d, _id: d._id.toString() }));

    const pendingForms = serialize(allForms.filter((f) => f.status === "pending"));
    const completedForms = serialize(allForms.filter((f) => f.status === "approved"));

    return NextResponse.json({ completedForms, pendingForms }, { status: 200 });
  } catch (err) {
    console.error("❌ Failed to fetch hiring forms:", err);
    return NextResponse.json(
      { completedForms: [], pendingForms: [], error: "Failed to fetch hiring forms" },
      { status: 500 }
    );
  }
}
