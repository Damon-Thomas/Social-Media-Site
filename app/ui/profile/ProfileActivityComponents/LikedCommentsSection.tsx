"use client";

import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { fetchPaginatedLikedComments } from "@/app/actions/fetch";
import type { Comment } from "@/app/lib/definitions";
import type { Dispatch, SetStateAction } from "react";
import ActivityItem from "./ActivityItem";

const ITEMS_PER_PAGE = 10;

export default function LikedCommentsSection({
  userId,
  initialComments = [],
  initialCursor = null,
  openPostComment,
  setOpenPostComment,
}: {
  userId: string;
  initialComments: Comment[];
  initialCursor: string | null;
  openPostComment?: string;
  setOpenPostComment?: Dispatch<SetStateAction<string>>;
}) {
  const fetchMore = async (cursor: string | null) => {
    const { comments, nextCursor } = await fetchPaginatedLikedComments(
      userId,
      cursor ?? undefined,
      ITEMS_PER_PAGE
    );

    // Map properly to match Comment type
    const mappedComments = comments.map((comment) => {
      if (!comment) return null;

      return {
        id: comment.id,
        content: comment.content,
        authorId: comment.authorId || undefined,
        author: comment.author || undefined,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        postId: comment.postId || undefined,
        parentId: comment.parentId || undefined,
        likedBy: [],
        replies: [],
      };
    }) as Comment[];

    return { items: mappedComments, nextCursor };
  };

  const {
    items: likedComments,
    loading,
    observerTarget,
  } = useInfiniteScroll(initialComments, initialCursor, fetchMore);

  if (likedComments.length === 0 && !loading) {
    return <div className="text-center py-4">No liked comments found</div>;
  }

  return (
    <div className="">
      {likedComments.map((comment) => {
        if (!comment) return null;

        return (
          <ActivityItem
            key={`liked-comments-section-${comment.id}`}
            data={{
              id: comment.id,
              cOrp: "comment" as const,
              content: comment.content || "",
              likeCount: comment.likedBy?.length || 0,
              commentCount: comment.replies?.length || 0,
              createdAt: comment.createdAt.toISOString(),
              postId: comment.postId || undefined, // Add postId for comments
              isLikedByUser: true, // Always true for liked comments section
            }}
            user={{
              id: comment.authorId || "",
              name: comment.author?.name || "Unknown User",
              profileImage: comment.author?.image || undefined,
            }}
            pOrc="comment"
            showAsLiked={true}
            openPostComment={openPostComment}
            setOpenPostComment={setOpenPostComment}
          />
        );
      })}

      {/* Observer element */}
      <div ref={observerTarget} className="h-10" />

      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--dmono)]"></div>
        </div>
      )}
    </div>
  );
}
