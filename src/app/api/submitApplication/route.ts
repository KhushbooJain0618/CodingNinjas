// src/app/api/submitApplication/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { HiringForm } from "@/models/HiringForm";
import { v2 as cloudinary } from "cloudinary";

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

    // Extract and trim fields
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
    const resumeFileEntry = formData.get("resume");
    const resumeFile = resumeFileEntry instanceof File ? resumeFileEntry : null;

    // --- Validation logic ---
    if (
      !name ||
      !rollNumber ||
      !contactNumber ||
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
    if (!GENDERS.includes(gender as (typeof GENDERS)[number])) {
      return NextResponse.json(
        { success: false, error: "Invalid gender selected" },
        { status: 400 }
      );
    }
    if (!HOSTELLER_TYPES.includes(hosteller as (typeof HOSTELLER_TYPES)[number])) {
      return NextResponse.json(
        { success: false, error: "Invalid hosteller type selected" },
        { status: 400 }
      );
    }

    // Handle resume file upload → Cloudinary
    let resumeUrl = "";
    if (resumeFile) {
      const arrayBuffer = await resumeFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Define a more specific type for the Cloudinary response
      interface CloudinaryUploadResult {
        secure_url: string;
        // Use 'unknown' instead of 'any' for better type safety
        [key: string]: unknown;
      }

      // Define a minimal type for the Cloudinary error object
      interface CloudinaryError {
        message: string;
        name: string;
        http_code: number;
      }

      const uploaded = await new Promise<CloudinaryUploadResult>(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "resumes",
              // Use 'image' resource_type for direct viewability.
              resource_type: "image",
              unique_filename: true,
            },
            // Explicitly type the callback parameters to avoid implicit 'any'
            (error?: CloudinaryError, result?: CloudinaryUploadResult) => {
              if (error) {
                console.error("Cloudinary Upload Error:", error);
                return reject(new Error(error.message || "Cloudinary upload failed"));
              }
              if (result) {
                return resolve(result);
              }
              // Handle the case where there's no error but also no result
              return reject(new Error("Cloudinary upload returned no result."));
            }
          );
          stream.end(buffer);
        }
      );

      resumeUrl = uploaded.secure_url;
    }

    // Create hiring form document with status "pending"
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

    const applicationData = application.toObject();
    delete applicationData.__v;

    return NextResponse.json(
      { success: true, application: applicationData },
      { status: 201 }
    );
  } catch (err: unknown) {
    let message = "An unknown error occurred during the process.";

    if (err instanceof Error) {
      message = err.message;
    } else if (typeof err === "object" && err !== null) {
      message = JSON.stringify(err);
    }

    console.error("❌ Top-level catch block error:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
