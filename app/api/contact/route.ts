import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// --- Basic in-memory rate limiting ---
const RATE_LIMIT = 5; // max requests
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const ipHits = new Map<string, { count: number; first: number }>();

function getClientIp(req: Request) {
  // Try to get IP from headers (works with Vercel, etc.), fallback to remote address
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  // --- Rate limiting logic ---
  const ip = getClientIp(req);
  const now = Date.now();
  const entry = ipHits.get(ip);

  if (entry && now - entry.first < WINDOW_MS) {
    if (entry.count >= RATE_LIMIT) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
    entry.count += 1;
    ipHits.set(ip, entry);
  } else {
    ipHits.set(ip, { count: 1, first: now });
  }

  const { name, email, message } = await req.json();

  // Backend validation
  const errors: { name?: string; email?: string; message?: string } = {};
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }
  if (!email || typeof email !== "string" || !validateEmail(email)) {
    errors.email = "A valid email is required.";
  }
  if (!message || typeof message !== "string" || message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters.";
  }
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ success: false, errors }, { status: 400 });
  }

  // Configure your transporter (use environment variables for real projects)
  const transporter = nodemailer.createTransport({
    service: "gmail", // or your email provider
    auth: {
      user: process.env.CONTACT_EMAIL_USER, // your email address
      pass: process.env.CONTACT_EMAIL_PASS, // your email password or app password
    },
  });

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.PERSONAL_EMAIL, // your personal email
      subject: "New Contact Form Submission",
      text: message,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br/>${message}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email." },
      { status: 500 }
    );
  }
}
