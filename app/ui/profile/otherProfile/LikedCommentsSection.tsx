"use client";

import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { fetchPaginatedLikedComments } from "@/app/actions/fetch";
import type { Comment } from "@/app/lib/definitions";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

export default function LikedCommentsSection({
  userId,
  initialComments = [],
  initialCursor = null,
}: {
  userId: string;
  initialComments: Comment[];
  initialCursor: string | null;
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
    <div className="space-y-4 h-[400px] overflow-y-auto pr-2">
      {likedComments.map((comment) => (
        <div key={comment?.id} className="p-4 border rounded-lg">
          <div className="flex justify-between items-start">
            <p className="font-medium">By: {comment?.author?.name}</p>
            <span className="text-red-500">❤</span>
          </div>

          <Link
            href={`/dashboard/posts/${comment?.post?.id}`}
            className="text-blue-600 hover:underline block mt-1"
          >
            <p className="text-sm">
              On post: {comment?.post?.content?.substring(0, 30)}...
            </p>
          </Link>

          <p className="mt-2">{comment?.content}</p>

          <p className="text-sm text-gray-500 mt-2">
            {comment?.createdAt &&
              new Date(comment?.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
          </p>
        </div>
      ))}

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
