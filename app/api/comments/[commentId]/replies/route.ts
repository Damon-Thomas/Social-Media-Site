import { NextRequest, NextResponse } from "next/server";
import { getCommentReplies } from "@/app/actions/commentActions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") || undefined;
    const limit = parseInt(searchParams.get("limit") || "10");

    const { replies, nextCursor } = await getCommentReplies(
      commentId,
      cursor,
      limit
    );

    return NextResponse.json({ replies, nextCursor });
  } catch (error) {
    console.error("Error fetching comment replies:", error);
    return NextResponse.json(
      { error: "Failed to fetch replies" },
      { status: 500 }
    );
  }
}
