import { NextRequest, NextResponse } from "next/server";
import { deleteComment, deletePost } from "@/app/actions/destructive";

export async function POST(request: NextRequest) {
  try {
    const { userId, commentOrPost, itemId } = (await request.json()) as {
      userId: string;
      commentOrPost: "comment" | "post";
      itemId: string;
    };

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId", success: false },
        { status: 400 }
      );
    }

    if (!commentOrPost || !["comment", "post"].includes(commentOrPost)) {
      console.error("Invalid commentOrPost value:", commentOrPost);
      return NextResponse.json(
        { error: "Invalid commentOrPost value", success: false },
        { status: 400 }
      );
    }
    if (!itemId) {
      return NextResponse.json(
        { error: "Missing itemId", success: false },
        { status: 400 }
      );
    }

    let action;

    if (commentOrPost === "comment" && itemId) {
      action = await deleteComment(userId, itemId);
      if (action.success === false) {
        return NextResponse.json(
          { error: action.error || "Failed to delete comment", success: false },
          { status: action.status || 500 }
        );
      }
    } else if (commentOrPost === "post" && itemId) {
      action = await deletePost(userId, itemId);
      if (action.success === false) {
        return NextResponse.json(
          { error: action.error || "Failed to delete post", success: false },
          { status: action.status || 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Invalid request", success: false },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting content:", error);
    return NextResponse.json(
      { error: "Failed to delete content" },
      { status: 500 }
    );
  }
}
