// src/app/api/admin/applications/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { HiringForm } from "@/models/HiringForm";

export async function GET() {
  try {
    await connectDB();

    const allForms = await HiringForm.find().sort({ createdAt: -1, _id: -1 }).lean();

const serialize = (docs: any[]) =>
  docs.map(d => ({
    ...d,
    _id: d._id.toString(),
    createdAt: d.createdAt || d._id.getTimestamp(),
    updatedAt: d.updatedAt || d._id.getTimestamp(),
    status: d.status || "pending", // fallback if missing
  }));

const pendingForms = serialize(allForms.filter(f => f.status === "pending"));
const completedForms = serialize(allForms.filter(f => f.status === "approved"));

    return NextResponse.json({ pendingForms, completedForms }, { status: 200 });
  } catch (err) {
    console.error("❌ Failed to fetch hiring forms:", err);
    return NextResponse.json(
      { pendingForms: [], completedForms: [], error: "Failed to fetch hiring forms" },
      { status: 500 }
    );
  }
}
