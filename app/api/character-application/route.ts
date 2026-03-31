import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanity.write";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidOptionalUrl(value: string) {
  if (!value) return true;

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const fullName = String(formData.get("fullName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const country = String(formData.get("country") || "").trim();
    const cuisineStyle = String(formData.get("cuisineStyle") || "").trim();
    const publicBio = String(formData.get("publicBio") || "").trim();
    const portfolioLink = String(formData.get("portfolioLink") || "").trim();
    const story = String(formData.get("story") || "").trim();

    const characterPhoto = formData.get("characterPhoto");
    const cvFile = formData.get("cvFile");

    if (
      !fullName ||
      !email ||
      !city ||
      !country ||
      !cuisineStyle ||
      !publicBio ||
      !story
    ) {
      return NextResponse.json(
        {
          error:
            "Full name, email, city, country, cuisine/style, public bio, and story are required.",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!isValidOptionalUrl(portfolioLink)) {
      return NextResponse.json(
        { error: "Please provide a valid portfolio link." },
        { status: 400 }
      );
    }

    if (!(characterPhoto instanceof File)) {
      return NextResponse.json(
        { error: "Character photo is required." },
        { status: 400 }
      );
    }

    if (!(cvFile instanceof File)) {
      return NextResponse.json(
        { error: "CV file is required." },
        { status: 400 }
      );
    }

    const imageAsset = await sanityWriteClient.assets.upload(
      "image",
      characterPhoto,
      { filename: characterPhoto.name }
    );

    const cvAsset = await sanityWriteClient.assets.upload("file", cvFile, {
      filename: cvFile.name,
    });

    await sanityWriteClient.create({
      _type: "characterApplication",
      fullName,
      email,
      city,
      country,
      cuisineStyle,
      publicBio,
      portfolioLink,
      story,
      characterPhoto: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAsset._id,
        },
      },
      cvFile: {
        _type: "file",
        asset: {
          _type: "reference",
          _ref: cvAsset._id,
        },
      },
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
            "Application was saved, but email server is not configured correctly.",
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

    const characterPhotoBuffer = Buffer.from(
      await characterPhoto.arrayBuffer()
    );
    const cvFileBuffer = Buffer.from(await cvFile.arrayBuffer());

    const subject = `New Food Character Application — ${fullName}`;

    const text = `
New Food Character application received

Name: ${fullName}
Email: ${email}
City: ${city}
Country: ${country}
Cuisine / Style: ${cuisineStyle}
Portfolio: ${portfolioLink || "Not provided"}

Public Bio:
${publicBio}

Story / Why They Fit:
${story}

Attached:
- Character photo
- CV
    `.trim();

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2>New Food Character application received</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>City:</strong> ${city}</p>
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>Cuisine / Style:</strong> ${cuisineStyle}</p>
        <p><strong>Portfolio:</strong> ${portfolioLink || "Not provided"}</p>
        <p><strong>Public Bio:</strong><br />${publicBio.replace(/\n/g, "<br />")}</p>
        <p><strong>Story / Why They Fit:</strong><br />${story.replace(/\n/g, "<br />")}</p>
        <p><strong>Attachments:</strong> Character photo and CV included.</p>
      </div>
    `;

    await transporter.sendMail({
      from: smtpFrom,
      to: bookingEmailTo,
      replyTo: email,
      subject,
      text,
      html,
      attachments: [
        {
          filename: characterPhoto.name,
          content: characterPhotoBuffer,
          contentType: characterPhoto.type || "image/jpeg",
        },
        {
          filename: cvFile.name,
          content: cvFileBuffer,
          contentType: cvFile.type || "application/octet-stream",
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Character application error:", error);

    return NextResponse.json(
      { error: "Something went wrong while saving the application." },
      { status: 500 }
    );
  }
}
