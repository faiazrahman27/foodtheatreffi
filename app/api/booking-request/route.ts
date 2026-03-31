import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanity.write";

type BookingPayload = {
  experienceTitle?: string;
  fullName?: string;
  email?: string;
  preferredDate?: string;
  guestCount?: string;
  message?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BookingPayload;

    const experienceTitle = body.experienceTitle?.trim() || "";
    const fullName = body.fullName?.trim() || "";
    const email = body.email?.trim() || "";
    const preferredDate = body.preferredDate?.trim() || "";
    const guestCount = body.guestCount?.trim() || "";
    const message = body.message?.trim() || "";

    if (!experienceTitle || !fullName || !email) {
      return NextResponse.json(
        { error: "Experience title, full name, and email are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!process.env.SANITY_API_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "Sanity write token is missing." },
        { status: 500 }
      );
    }

    await sanityWriteClient.create({
      _type: "bookingRequest",
      experienceTitle,
      fullName,
      email,
      preferredDate,
      guestCount,
      message,
      submittedAt: new Date().toISOString(),
      status: "new",
    });

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM;
    const bookingEmailTo = process.env.BOOKING_EMAIL_TO;

    if (
      !smtpHost ||
      !smtpUser ||
      !smtpPass ||
      !smtpFrom ||
      !bookingEmailTo
    ) {
      return NextResponse.json(
        {
          error:
            "Booking request was saved, but email server is not configured correctly.",
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: bookingEmailTo,
      replyTo: email,
      subject: `New Booking Request — ${experienceTitle}`,
      text: `
New booking request received

Experience: ${experienceTitle}
Name: ${fullName}
Email: ${email}
Preferred Date: ${preferredDate || "Not provided"}
Guests: ${guestCount || "Not provided"}

Message:
${message || "No message provided"}
      `.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Booking request error:", error);

    return NextResponse.json(
      { error: "Something went wrong while saving the booking request." },
      { status: 500 }
    );
  }
}
