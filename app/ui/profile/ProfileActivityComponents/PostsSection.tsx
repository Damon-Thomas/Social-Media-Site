"use client";

import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { fetchPaginatedPosts } from "@/app/actions/fetch";
import type { Post } from "@/app/lib/definitions";
import type { Dispatch, SetStateAction } from "react";
import ActivityItem from "./ActivityItem";
import { useCurrentUser } from "@/app/context/UserContext";

const ITEMS_PER_PAGE = 5;

export default function PostsSection({
  userId,
  initialPosts = [],
  initialCursor = null,
  openPostComment,
  setOpenPostComment,
}: {
  userId: string;
  initialPosts: Post[];
  initialCursor: string | null;
  openPostComment?: string;
  setOpenPostComment?: Dispatch<SetStateAction<string>>;
}) {
  const currentUser = useCurrentUser(); // Get current user for like status

  const fetchMore = async (cursor: string | null) => {
    const { posts, nextCursor } = await fetchPaginatedPosts(
      userId,
      cursor ?? undefined,
      ITEMS_PER_PAGE,
      currentUser?.id // Pass current user ID for like status
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
    <div className="">
      {posts.map((post, index) => {
        if (!post) return null;

        return (
          <ActivityItem
            key={`posts-section-${userId}-${
              post.id
            }-${post.createdAt.getTime()}-${index}`}
            data={{
              id: post.id,
              cOrp: "post" as const,
              content: post.content || "",
              likeCount: post.likedBy?.length || 0,
              commentCount: post.comments?.length || 0,
              createdAt: post.createdAt.toISOString(),
              isLikedByUser: post.isLikedByUser, // Pass pre-fetched like status
            }}
            user={{
              id: post.authorId || "",
              name: post.author?.name || "Unknown User",
              profileImage: post.author?.image || undefined,
            }}
            pOrc="post"
            openPostComment={openPostComment}
            setOpenPostComment={setOpenPostComment}
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
