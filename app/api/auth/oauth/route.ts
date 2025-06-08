import { authenticate } from "@/app/lib/action";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const result = await authenticate(undefined, formData);

  // If authentication was successful, redirect to dashboard
  if (!result?.errors) {
    console.log("Authentication successful, redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // If there are errors, redirect to auth page with error param
  return NextResponse.redirect(new URL("/auth?error=oauth", req.nextUrl));
}
