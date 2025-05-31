import { NextRequest, NextResponse } from "next/server";
import { getPostComments } from "@/app/actions/commentActions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") || undefined;
    const limit = parseInt(searchParams.get("limit") || "10");

    const { comments, nextCursor } = await getPostComments(
      postId,
      cursor,
      limit
    );

    return NextResponse.json({ comments, nextCursor });
  } catch (error) {
    console.error("Error fetching post comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
