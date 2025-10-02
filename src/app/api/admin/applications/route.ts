import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { HiringForm } from "@/models/HiringForm";

export async function GET() {
  try {
    await connectDB();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allForms: any[] = await HiringForm.find()
      .sort({ createdAt: -1, _id: -1 })
      .lean();

    const pendingForms = serialize(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      allForms.filter((f: any) => (f.status ?? "pending").toLowerCase() === "pending")
    );

    const completedForms = serialize(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      allForms.filter((f: any) => (f.status ?? "").toLowerCase() === "approved")
    );

    return NextResponse.json({ pendingForms, completedForms }, { status: 200 });
  } catch (err) {
    console.error("❌ Failed to fetch hiring forms:", err);
    return NextResponse.json(
      { pendingForms: [], completedForms: [], error: "Failed to fetch hiring forms" },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serialize = (docs: any[]) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  docs.map((d: any) => ({
    _id: d._id.toString(),
    name: d.name,
    rollNumber: d.rollNumber,
    gender: d.gender,
    chitkaraEmail: d.chitkaraEmail,
    department: d.department,
    group: d.group,
    specialization: d.specialization,
    hosteller: d.hosteller,
    position: d.position,
    role: d.role,
    resumeUrl: d.resumeUrl || "",
    status: d.status || "pending",
    createdAt: d.createdAt || new Date(),
    updatedAt: d.updatedAt || new Date(),
  }));
