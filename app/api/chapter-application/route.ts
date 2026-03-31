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
    const role = String(formData.get("role") || "").trim();
    const publicDescription = String(formData.get("publicDescription") || "").trim();
    const networkDescription = String(formData.get("networkDescription") || "").trim();
    const conceptVision = String(formData.get("conceptVision") || "").trim();
    const portfolioLink = String(formData.get("portfolioLink") || "").trim();

    const cityPhoto = formData.get("cityPhoto");
    const proposalFile = formData.get("proposalFile");

    if (
      !fullName ||
      !email ||
      !city ||
      !country ||
      !role ||
      !publicDescription ||
      !networkDescription ||
      !conceptVision
    ) {
      return NextResponse.json(
        {
          error:
            "Full name, email, city, country, role, public description, network, and internal vision are required.",
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

    if (!(cityPhoto instanceof File)) {
      return NextResponse.json(
        { error: "City photo is required." },
        { status: 400 }
      );
    }

    const imageAsset = await sanityWriteClient.assets.upload(
      "image",
      cityPhoto,
      { filename: cityPhoto.name }
    );

    let proposalAsset:
      | {
          _id: string;
        }
      | undefined;

    if (proposalFile instanceof File && proposalFile.size > 0) {
      proposalAsset = await sanityWriteClient.assets.upload("file", proposalFile, {
        filename: proposalFile.name,
      });
    }

    await sanityWriteClient.create({
      _type: "chapterApplication",
      fullName,
      email,
      city,
      country,
      role,
      publicDescription,
      networkDescription,
      conceptVision,
      portfolioLink,
      cityPhoto: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAsset._id,
        },
      },
      ...(proposalAsset
        ? {
            proposalFile: {
              _type: "file",
              asset: {
                _type: "reference",
                _ref: proposalAsset._id,
              },
            },
          }
        : {}),
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

    const cityPhotoBuffer = Buffer.from(await cityPhoto.arrayBuffer());

    const attachments = [
      {
        filename: cityPhoto.name,
        content: cityPhotoBuffer,
        contentType: cityPhoto.type || "image/jpeg",
      },
    ] as Array<{
      filename: string;
      content: Buffer;
      contentType?: string;
    }>;

    if (proposalFile instanceof File && proposalFile.size > 0) {
      attachments.push({
        filename: proposalFile.name,
        content: Buffer.from(await proposalFile.arrayBuffer()),
        contentType: proposalFile.type || "application/octet-stream",
      });
    }

    const subject = `New Chapter Application — ${city}, ${country}`;

    const text = `
New Chapter application received

Name: ${fullName}
Email: ${email}
City: ${city}
Country: ${country}
Role: ${role}
Portfolio: ${portfolioLink || "Not provided"}

Public Chapter Description:
${publicDescription}

Local Network / Access:
${networkDescription}

Internal Vision / Why This Chapter Should Exist:
${conceptVision}

Attached:
- City photo
${proposalAsset ? "- Proposal file" : ""}
    `.trim();

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2>New Chapter application received</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>City:</strong> ${city}</p>
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Portfolio:</strong> ${portfolioLink || "Not provided"}</p>
        <p><strong>Public Chapter Description:</strong><br />${publicDescription.replace(
          /\n/g,
          "<br />"
        )}</p>
        <p><strong>Local Network / Access:</strong><br />${networkDescription.replace(
          /\n/g,
          "<br />"
        )}</p>
        <p><strong>Internal Vision / Why This Chapter Should Exist:</strong><br />${conceptVision.replace(
          /\n/g,
          "<br />"
        )}</p>
        <p><strong>Attachments:</strong> City photo${
          proposalAsset ? " and proposal file" : ""
        } included.</p>
      </div>
    `;

    await transporter.sendMail({
      from: smtpFrom,
      to: bookingEmailTo,
      replyTo: email,
      subject,
      text,
      html,
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Chapter application error:", error);

    return NextResponse.json(
      { error: "Something went wrong while saving the application." },
      { status: 500 }
    );
  }
}
