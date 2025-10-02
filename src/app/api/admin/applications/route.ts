// src/app/api/admin/applications/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { HiringForm, IHiringForm } from "@/models/HiringForm"; // make sure IHiringForm is exported
import { Types } from "mongoose";

// Type-safe serializer
const serialize = (docs: IHiringForm[]) =>
  docs.map(d => ({
    ...d,
    _id: (d._id as Types.ObjectId).toString(),
    createdAt: d.createdAt ?? (d._id as Types.ObjectId).getTimestamp(),
    updatedAt: d.updatedAt ?? (d._id as Types.ObjectId).getTimestamp(),
    status: d.status ?? "pending",
  }));

export async function GET() {
  try {
    await connectDB();

    // Fetch all forms
    const allForms: IHiringForm[] = await HiringForm.find()
  .sort({ createdAt: -1, _id: -1 }); // no .lean()


    // Filter by status safely
    const pendingForms = serialize(
      allForms.filter(f => f.status === "pending" || !f.status)
    );
    const completedForms = serialize(
      allForms.filter(f => f.status === "approved")
    );

    return NextResponse.json({ pendingForms, completedForms }, { status: 200 });
  } catch (err: unknown) {
    let message = "Failed to fetch hiring forms";

    if (err instanceof Error) {
      message = err.message;
    }

    console.error("❌ Failed to fetch hiring forms:", message);

    return NextResponse.json(
      { pendingForms: [], completedForms: [], error: message },
      { status: 500 }
    );
  }
}
