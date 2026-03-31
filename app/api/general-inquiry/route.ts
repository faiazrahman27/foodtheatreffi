import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanity.write";
import { sanityClient } from "@/lib/sanity.client";

type InquiryPayload = {
  inquiryType?: string;
  subject?: string;
  contextLabel?: string;
  characterSlug?: string;
  fullName?: string;
  email?: string;
  message?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InquiryPayload;

    const inquiryType = body.inquiryType?.trim() || "general-contact";
    const subject = body.subject?.trim() || "General Inquiry";
    const contextLabel = body.contextLabel?.trim() || "";
    const characterSlug = body.characterSlug?.trim() || "";
    const fullName = body.fullName?.trim() || "";
    const email = body.email?.trim() || "";
    const message = body.message?.trim() || "";

    if (!subject || !fullName || !email || !message) {
      return NextResponse.json(
        { error: "Subject, full name, email, and message are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    let characterEmail = "";
    let characterName = "";

    if (inquiryType === "character-connection" && characterSlug) {
      const character = await sanityClient.fetch(
        `*[_type == "foodCharacter" && slug.current == $slug][0]{
          name,
          email
        }`,
        { slug: characterSlug }
      );

      characterEmail = character?.email || "";
      characterName = character?.name || "";
    }

    await sanityWriteClient.create({
      _type: "generalInquiry",
      inquiryType,
      subject,
      contextLabel,
      fullName,
      email,
      message,
      submittedAt: new Date().toISOString(),
      status: "new",
      priority: "medium",
      decision: "pending",
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
            "Inquiry was saved, but email server is not configured correctly.",
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
      subject: `New Inquiry — ${subject}`,
      text: `
New inquiry received

Type: ${inquiryType}
Subject: ${subject}
Context: ${contextLabel || "Not provided"}
Character Slug: ${characterSlug || "Not provided"}
Name: ${fullName}
Email: ${email}

Message:
${message}
      `.trim(),
    });

    if (inquiryType === "character-connection" && characterEmail) {
      await transporter.sendMail({
        from: smtpFrom,
        to: characterEmail,
        replyTo: email,
        subject: `New connection request via Food Theatre`,
        text: `
You have received a new connection request through Food Theatre

Character: ${characterName || contextLabel || "Food Character"}
From: ${fullName}
Sender Email: ${email}

Message:
${message}
        `.trim(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("General inquiry error:", error);

    return NextResponse.json(
      { error: "Something went wrong while sending the inquiry." },
      { status: 500 }
    );
  }
}

