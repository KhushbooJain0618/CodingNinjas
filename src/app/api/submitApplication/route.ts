// src/app/api/submitApplication/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { HiringForm } from "@/models/HiringForm";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

// Allowed enum values
const GENDERS = ["Male", "Female", "Other"] as const;
const HOSTELLER_TYPES = ["Hosteller", "Day Scholar"] as const;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();

    // Extract fields
    const name = (formData.get("name") as string)?.trim();
    const rollNumber = (formData.get("rollNumber") as string)?.trim();
    const contactNumber = (formData.get("contactNumber") as string)?.trim();
    const gender = (formData.get("gender") as string)?.trim();
    const chitkaraEmail = (formData.get("chitkaraEmail") as string)?.trim();
    const department = (formData.get("department") as string)?.trim();
    const group = (formData.get("group") as string)?.trim();
    const specialization = (formData.get("specialization") as string)?.trim();
    const hosteller = (formData.get("hosteller") as string)?.trim();
    const position = (formData.get("position") as string)?.trim();
    const role = (formData.get("role") as string)?.trim();
    const resumeFile = formData.get("resume") as File | null;

    // --- Validation ---
    // ... [your existing validation logic remains unchanged] ...

    // Handle resume file upload → Cloudinary
    let resumeUrl = "";
    if (resumeFile) {
      const arrayBuffer = await resumeFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const originalFilename = path.parse(resumeFile.name).name;
      const sanitizedFilename = originalFilename.replace(/[^a-zA-Z0-9_.-]/g, "_");

      const uploaded = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: "resumes",
            // ✅ FINAL FIX 1: Explicitly set resource_type to "raw" for documents.
            resource_type: "raw",
            // Use the original filename to ensure correct extension on download.
            public_id: sanitizedFilename,
            use_filename: true,
            unique_filename: true,
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error);
              return reject(error);
            }
            resolve(result);
          }
        ).end(buffer);
      });

      resumeUrl = uploaded.secure_url;
    }

    // --- Create hiring form document ---
    const application = await HiringForm.create({
      name,
      rollNumber,
      contactNumber,
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

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (err: any) {
    console.error("❌ Top-level catch block error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "An unknown error occurred." },
      { status: 500 }
    );
  }
}

