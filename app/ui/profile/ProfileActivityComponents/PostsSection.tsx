"use client";

import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { fetchPaginatedPosts } from "@/app/actions/fetch";
import type { Post } from "@/app/lib/definitions";

const ITEMS_PER_PAGE = 5;

export default function PostsSection({
  userId,
  initialPosts = [],
  initialCursor = null,
}: {
  userId: string;
  initialPosts: Post[];
  initialCursor: string | null;
}) {
  const fetchMore = async (cursor: string | null) => {
    const { posts, nextCursor } = await fetchPaginatedPosts(
      userId,
      cursor ?? undefined,
      ITEMS_PER_PAGE
    );
    return { items: posts, nextCursor };
  };

  const {
    items: posts,
    loading,
    hasMore,
    observerTarget,
  } = useInfiniteScroll(initialPosts, initialCursor, fetchMore);

  if (posts.length === 0 && !loading) {
    return <div className="text-center py-4">No posts found</div>;
  }
  return (
    <div className="space-y-4 grow overflow-y-auto pr-2">
      {posts.map((post) => (
        <div key={`getPosts${post?.id}`} className="p-4 border rounded-lg">
          <p className="font-medium">{post?.author?.name}</p>
          <p className="mt-2">{post?.content}</p>
          <p className="text-sm text-gray-500 mt-2">
            {post?.createdAt && new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}

      {/* Only show observer when there's more content to load */}
      {hasMore && <div ref={observerTarget} className="h-10" />}

      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--dmono)]"></div>
        </div>
      )}
    </div>
  );
}
