// src/app/api/admin/toggleStatus/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { HiringForm } from "@/models/HiringForm";
import { Resend } from 'resend';

// Initialize Resend with your API key from .env file
const resend = new Resend(process.env.RESEND_API_KEY);

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // The params object is a Promise
) {
  try {
    await connectDB();

    // FIX: Await the params object before accessing its properties
    const { id } = await context.params;

    const application = await HiringForm.findById(id);
    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }
    
    const originalStatus = application.status;
    let emailSent = false; // Flag to track if the email was sent

    // Toggle the status
    application.status =
      application.status === "pending" ? "approved" : "pending";
    await application.save();

    // Conditionally send email only when approving
    if (originalStatus === "pending" && application.status === "approved") {
      try {
        await resend.emails.send({
          // FIX: Use the required format for testing or a verified domain
          from: 'onboarding@resend.dev',
          to: [application.chitkaraEmail],
          subject: 'Welcome Aboard! Your Application is Approved 🎉',
          html: `
            <h1>Congratulations, ${application.name}!</h1>
            <p>We are thrilled to let you know that your application for the <strong>${application.position} (${application.role})</strong> role has been approved.</p>
            <p>Welcome to the team! We will contact you soon with the next steps.</p>
            <br/>
            <p>Best regards,</p>
            <p>The CN_CUIET Team</p>
          `,
        });
        emailSent = true; // Set flag to true on success
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // We log the error but don't stop the process
      }
    }

    // Return a success response, including the email status
    return NextResponse.json({ success: true, status: application.status, emailSent });
  } catch (err: unknown) {
    let message = "Unknown error occurred";
    if (err instanceof Error) message = err.message;

    console.error("❌ Error updating application status:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
