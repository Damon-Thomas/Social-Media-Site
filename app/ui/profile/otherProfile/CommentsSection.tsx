"use client";

import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { fetchPaginatedComments } from "@/app/actions/fetch";
import type { Comment } from "@/app/lib/definitions";
import Link from "next/link";

export default function CommentsSection({
  userId,
  initialComments = [],
  initialCursor = null,
}: {
  userId: string;
  initialComments: Comment[];
  initialCursor: string | null;
}) {
  const fetchMore = async (cursor: string | null) => {
    const { comments, nextCursor } = await fetchPaginatedComments(
      userId,
      cursor
    );
    return { items: comments, nextCursor };
  };

  const {
    items: comments,
    loading,
    observerTarget,
  } = useInfiniteScroll(initialComments, initialCursor, fetchMore);

  if (comments.length === 0 && !loading) {
    return <div className="text-center py-4">No comments found</div>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="p-4 border rounded-lg">
          <Link
            href={`/dashboard/posts/${comment.post?.id}`}
            className="text-blue-600 hover:underline"
          >
            <p className="text-sm font-medium">
              On post: {comment.post?.content?.substring(0, 50)}...
            </p>
          </Link>

          <p className="mt-2">{comment.content}</p>

          <p className="text-sm text-gray-500 mt-2">
            {new Date(comment.createdAt).toLocaleDateString("en-US", {
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
