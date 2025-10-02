import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { HiringForm, IHiringForm } from "@/models/HiringForm";
import { Types } from "mongoose";

export async function GET() {
  try {
    await connectDB();

    const allForms: (IHiringForm & { _id: Types.ObjectId })[] = await HiringForm.find()
  .sort({ createdAt: -1, _id: -1 });

  
    // Type-safe serializer
    const serialize = (docs: IHiringForm[]) =>
      docs.map(d => ({
        ...d,
        _id: (d._id as Types.ObjectId).toString(),
      }));


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
