import { authenticate } from "@/app/lib/action";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const result = await authenticate(undefined, formData);

  // If authentication was successful, return success JSON
  if (!result?.errors) {
    console.log("Authentication successful");
    return NextResponse.json({ success: true });
  }

  // If there are errors, return error JSON
  return NextResponse.json(
    {
      success: false,
      error: "Authentication failed",
      errors: result.errors,
    },
    { status: 400 }
  );
}
