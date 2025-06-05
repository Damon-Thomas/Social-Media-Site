import { NextRequest, NextResponse } from "next/server";
import { deleteAccount } from "@/app/actions/destructive";

export async function POST(request: NextRequest) {
  try {
    const { userId } = (await request.json()) as { userId: string };

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId", success: false },
        { status: 400 }
      );
    }

    const action = await deleteAccount(userId);

    if (action.success === false) {
      return NextResponse.json(
        { error: action.error || "Failed to delete account", success: false },
        { status: action.status || 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
