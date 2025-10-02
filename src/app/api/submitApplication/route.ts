// src/app/api/submitApplication/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { HiringForm } from "@/models/HiringForm";
import fs from "fs";
import path from "path";

// Allowed enum values
const GENDERS = ["Male", "Female", "Other"] as const;
const HOSTELLER_TYPES = ["Hosteller", "Day Scholar"] as const;

export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();

    // Extract fields and trim
    const name = (formData.get("name") as string)?.trim();
    const rollNumber = (formData.get("rollNumber") as string)?.trim();
    const gender = (formData.get("gender") as string)?.trim();
    const chitkaraEmail = (formData.get("chitkaraEmail") as string)?.trim();
    const department = (formData.get("department") as string)?.trim();
    const group = (formData.get("group") as string)?.trim();
    const specialization = (formData.get("specialization") as string)?.trim();
    const hosteller = (formData.get("hosteller") as string)?.trim();
    const position = (formData.get("position") as string)?.trim();
    const role = (formData.get("role") as string)?.trim();

    const resumeFileEntry = formData.get("resume");
    const resumeFile = resumeFileEntry instanceof File ? resumeFileEntry : null;

    // Validate required fields
    if (
      !name ||
      !rollNumber ||
      !gender ||
      !chitkaraEmail ||
      !department ||
      !group ||
      !specialization ||
      !hosteller ||
      !position ||
      !role
    ) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate enum values
    if (!GENDERS.includes(gender as typeof GENDERS[number])) {
      return NextResponse.json(
        { success: false, error: "Invalid gender selected" },
        { status: 400 }
      );
    }

    if (!HOSTELLER_TYPES.includes(hosteller as typeof HOSTELLER_TYPES[number])) {
      return NextResponse.json(
        { success: false, error: "Invalid hosteller type selected" },
        { status: 400 }
      );
    }

    // Handle resume file upload to /public/resumes
    let resumeUrl = "";
    if (resumeFile) {
      const resumesDir = path.join(process.cwd(), "public", "resumes");
      if (!fs.existsSync(resumesDir)) fs.mkdirSync(resumesDir, { recursive: true });

      const arrayBuffer = await resumeFile.arrayBuffer();
      const timestamp = Date.now();
      const safeFileName = `${timestamp}-${resumeFile.name}`;
      const filePath = path.join(resumesDir, safeFileName);

      fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

      // Public URL for frontend
      resumeUrl = `/resumes/${safeFileName}`;
      console.log("Resume saved at:", filePath);
    }

    // Create hiring form document with status "pending"
    const application = await HiringForm.create({
      name,
      rollNumber,
      gender,
      chitkaraEmail,
      department,
      group,
      specialization,
      hosteller,
      position,
      role,
      resumeUrl,
      status: "pending",
    });

    // Return response without internal fields
    const applicationData = application.toObject();
    delete applicationData.__v;

    return NextResponse.json({ success: true, application: applicationData }, { status: 201 });
  } catch (err: unknown) {
    let message = "An unknown error occurred";
    if (err instanceof Error) message = err.message;

    console.error("❌ Error saving application:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
