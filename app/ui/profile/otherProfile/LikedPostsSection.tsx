"use client";

import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { fetchPaginatedLikedPosts } from "@/app/actions/fetch";
import type { Post } from "@/app/lib/definitions";
import Link from "next/link";

export default function LikedPostsSection({
  userId,
  initialPosts = [],
  initialCursor = null,
}: {
  userId: string;
  initialPosts: Post[];
  initialCursor: string | null;
}) {
  const ITEMS_PER_PAGE = 5;

  const fetchMore = async (cursor: string | null) => {
    const { posts, nextCursor } = await fetchPaginatedLikedPosts(
      userId,
      cursor ?? undefined,
      ITEMS_PER_PAGE
    );

    // Map properly to match Post type
    const mappedPosts = posts.map((post) => {
      if (!post) return null;

      // No need to transform fields - just return the post as is
      return post;
    }) as Post[];

    return { items: mappedPosts, nextCursor };
  };

  const {
    items: likedPosts,
    loading,
    observerTarget,
  } = useInfiniteScroll(initialPosts, initialCursor, fetchMore);

  if (likedPosts.length === 0 && !loading) {
    return <div className="text-center py-4">No liked posts found</div>;
  }

  return (
    <div className="space-y-4 overflow-auto grow">
      {likedPosts.map((post) => (
        <div key={`likedpost${post?.id}`} className="p-4 border rounded-lg">
          <Link
            href={`/dashboard/posts/${post?.id}`}
            className="block hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <p className="font-medium">By: {post?.author?.name}</p>
              <span className="text-red-500">❤</span>
            </div>
            <p className="mt-2">{post?.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              {post?.createdAt &&
                new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
            </p>
          </Link>
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
