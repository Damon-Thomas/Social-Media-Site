"use client";

import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { fetchPaginatedLikedActivity } from "@/app/actions/fetch";
import type { Post, Comment } from "@/app/lib/definitions";
import Link from "next/link";

export type LikedItem =
  | { type: "likedPost"; payload: Post; createdAt: Date }
  | { type: "likedComment"; payload: Comment; createdAt: Date };

const ITEMS_PER_PAGE = 10;

export default function CombinedLikedSection({
  userId,
  initialLikedPosts,
  initialLikedComments,
  likedPostsCursor,
  likedCommentsCursor,
}: {
  userId: string;
  initialLikedPosts: Post[];
  initialLikedComments: Comment[];
  likedPostsCursor: string | null;
  likedCommentsCursor: string | null;
}) {
  // Merge initial data into a combined array sorted descending by createdAt.
  const initialItems: LikedItem[] = [
    ...initialLikedPosts.map((p) => ({
      type: "likedPost" as const,
      payload: p,
      createdAt: p.createdAt,
    })),
    ...initialLikedComments.map((c) => ({
      type: "likedComment" as const,
      payload: c,
      createdAt: c.createdAt,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // fetchMore should call a new unified endpoint that returns both liked posts and liked comments,
  // or you can combine individual fetches.
  // Here’s an example that calls a combined fetch function:
  const fetchMore = async (_cursor: any) => {
    const { items, nextCursors } = await fetchPaginatedLikedActivity(
      userId,
      likedPostsCursor,
      likedCommentsCursor,
      ITEMS_PER_PAGE
    );
    return { items, nextCursor: nextCursors };
  };

  const { items, loading, observerTarget } = useInfiniteScroll<LikedItem>(
    initialItems,
    null,
    fetchMore
  );

  return (
    <div className="space-y-4 overflow-y-auto grow pr-2">
      {items.map((item) => {
        const when = item.createdAt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        if (item.type === "likedPost") {
          const p = item.payload;
          return (
            <Link key={`likedPost-${p.id}`} href={`/dashboard/posts/${p.id}`}>
              <div className="p-4 border rounded-lg hover:bg-gray-50">
                <p className="font-medium">
                  Liked post: {p.content?.slice(0, 50)}…
                </p>
                <p className="text-sm text-gray-500 mt-2">{when}</p>
              </div>
            </Link>
          );
        } else {
          const c = item.payload;
          return (
            <Link
              key={`likedComment-${c.id}`}
              href={`/dashboard/posts/${c.postId}`}
            >
              <div className="p-4 border rounded-lg hover:bg-gray-50">
                <p className="font-medium">
                  Liked comment: {c.content?.slice(0, 50)}…
                </p>
                <p className="text-sm text-gray-500 mt-2">{when}</p>
              </div>
            </Link>
          );
        }
      })}
      <div ref={observerTarget} className="h-10" />
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--dmono)]" />
        </div>
      )}
    </div>
  );
}
