"use client";

import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { fetchPaginatedLikedActivity } from "@/app/actions/fetch";
import type { Post, Comment } from "@/app/lib/definitions";
import type { Dispatch, SetStateAction } from "react";
import ActivityItemComponent from "./ActivityItem";

export type LikedItem =
  | { type: "likedPost"; payload: Post; createdAt: Date }
  | { type: "likedComment"; payload: Comment; createdAt: Date };

const ITEMS_PER_PAGE = 10;

export default function CombinedLikedSection({
  userId,
  initialLikedPosts,
  initialLikedComments,
  openPostComment,
  setOpenPostComment,
}: // likedPostsCursor,
// likedCommentsCursor,
{
  userId: string;
  initialLikedPosts: Post[];
  initialLikedComments: Comment[];
  likedPostsCursor: string | null;
  likedCommentsCursor: string | null;
  openPostComment?: string;
  setOpenPostComment?: Dispatch<SetStateAction<string>>;
}) {
  // Merge initial data into a combined array sorted descending by createdAt.
  const initialItems: LikedItem[] = [
    ...initialLikedPosts
      .filter((p) => p !== null && p.createdAt !== null)
      .map((p) => ({
        type: "likedPost" as const,
        payload: p!,
        createdAt: p!.createdAt,
      })),
    ...initialLikedComments
      .filter((c) => c !== null && c.createdAt !== null)
      .map((c) => ({
        type: "likedComment" as const,
        payload: c!,
        createdAt: c!.createdAt,
      })),
  ].sort(
    (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
  );

  const fetchMore = async (cursor: string | null) => {
    // Split the combined cursor into individual cursors
    const [postsCursor, commentsCursor] = cursor
      ? cursor.split("|")
      : [null, null];

    const { items, nextCursors } = await fetchPaginatedLikedActivity(
      userId,
      postsCursor,
      commentsCursor,
      ITEMS_PER_PAGE
    );

    // Combine the next cursors into a single string
    const nextCursor = `${nextCursors.likedPostsCursor || ""}|${
      nextCursors.likedCommentsCursor || ""
    }`;

    return { items, nextCursor: nextCursor === "|" ? null : nextCursor };
  };

  const { items, loading, observerTarget } = useInfiniteScroll<LikedItem>(
    initialItems,
    null, // Initial cursor is null
    fetchMore
  );

  return (
    <div className="">
      {items.map((item) => {
        if (item?.type === "likedPost") {
          const p = item.payload;
          const activityData = {
            id: p?.id || "",
            cOrp: "post" as const,
            content: p?.content || "",
            likeCount: p?.likedBy?.length ?? 0,
            commentCount: p?.comments?.length ?? 0,
            createdAt:
              item?.createdAt?.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }) || "",
            isLikedByUser: true, // Always true for liked posts
          };
          return (
            <ActivityItemComponent
              key={`combined-liked-section-post-${userId}-${p?.id}`}
              data={activityData}
              user={
                p?.author
                  ? {
                      id: p.author.id,
                      name: p.author.name || "",
                      profileImage: p.author.image || undefined,
                    }
                  : undefined
              }
              pOrc="post"
              showAsLiked={true}
              openPostComment={openPostComment}
              setOpenPostComment={setOpenPostComment}
            />
          );
        } else {
          const c = item?.payload;
          const activityData = {
            id: c?.id || "",
            cOrp: "comment" as const,
            content: c?.content || "",
            likeCount: c?.likedBy?.length ?? 0,
            commentCount: c?.replies?.length ?? 0,
            createdAt:
              item?.createdAt?.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }) || "",
            postId: c?.postId || undefined, // Add postId for comments
            isLikedByUser: true, // Always true for liked comments
          };
          return (
            <ActivityItemComponent
              key={`combined-liked-section-comment-${userId}-${c?.id}`}
              data={activityData}
              user={
                c?.author
                  ? {
                      id: c.author.id,
                      name: c.author.name || "",
                      profileImage: c.author.image || undefined,
                    }
                  : undefined
              }
              pOrc="comment"
              showAsLiked={true}
              openPostComment={openPostComment}
              setOpenPostComment={setOpenPostComment}
            />
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
