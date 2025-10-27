// src/app/api/admin/toggleStatus/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { HiringForm } from "@/models/HiringForm";
import nodemailer from 'nodemailer';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const application = await HiringForm.findById(id);
    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }
    
    const originalStatus = application.status;
    let emailSent = false;

    application.status =
      application.status === "pending" ? "approved" : "pending";
    await application.save();

    if (originalStatus === "pending" && application.status === "approved") {
      try {
        const SMTP_USER = process.env.SMTP_USER;
        const SMTP_PASS = process.env.SMTP_PASS; // For Gmail, this is an App Password
        const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || 'The CN_CUIET Team';

        if (!SMTP_USER || !SMTP_PASS) {
           throw new Error("SMTP environment variables (SMTP_USER, SMTP_PASS) are not set.");
        }

        // Configure Nodemailer transporter (example uses Gmail)
        let transporter = nodemailer.createTransport({
          service: "gmail", // Use "gmail", "outlook", etc. or custom host/port
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
        });

        // Define email options
        let mailOptions = {
          from: `"${SMTP_FROM_NAME}" <${SMTP_USER}>`,
          to: application.chitkaraEmail,
          subject: 'Welcome Aboard! Your Application is Approved 🎉',
          html: `
            <h1>Congratulations, ${application.name}!</h1>
            <p>We are thrilled to let you know that your application for the <strong>${application.position} (${application.role})</strong> role has been approved.</p>
            <p>Welcome to the team! We will contact you soon with the next steps.</p>
            <br/>
            <p>Best regards,</p>
            <p>${SMTP_FROM_NAME}</p>
          `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        
        emailSent = true;
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
      }
    }

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