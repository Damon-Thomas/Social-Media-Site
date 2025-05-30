"use client";

import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { fetchPaginatedPosts } from "@/app/actions/fetch";
import type { Post } from "@/app/lib/definitions";
import ActivityItem from "./ActivityItem";

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
    <div className="space-y-4 grow overflow-y-auto ">
      {posts.map((post) => {
        if (!post) return null;

        return (
          <ActivityItem
            key={`posts-section-${userId}-${
              post.id
            }-${post.createdAt.getTime()}`}
            data={{
              id: post.id,
              cOrp: "post" as const,
              content: post.content || "",
              likeCount: post.likedBy?.length || 0,
              commentCount: post.comments?.length || 0,
              createdAt: post.createdAt.toISOString(),
            }}
            user={{
              id: post.authorId || "",
              name: post.author?.name || "Unknown User",
              profileImage: post.author?.image || undefined,
            }}
            pOrc="post"
          />
        );
      })}

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
