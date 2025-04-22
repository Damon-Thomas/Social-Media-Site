import { authenticate } from "@/app/lib/action";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const result = await authenticate(undefined, formData);
  if (!result?.errors) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false, errors: result.errors });
}
