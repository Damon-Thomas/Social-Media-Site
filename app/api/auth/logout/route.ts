import { deleteSession } from "@/app/lib/session.server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await deleteSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete session." },
      { status: 500 }
    );
  }
}
