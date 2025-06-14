"use client";

import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { fetchPaginatedActivity } from "@/app/actions/fetch";
import type { ActivityItem, Post, Comment } from "@/app/lib/definitions";
import type { Dispatch, SetStateAction } from "react";
import ActivityItemComponent from "../ProfileActivityComponents/ActivityItem";

const ITEMS_PER_PAGE = 10;

export default function ActivitySection({
  userId,
  initialActivities = [],
  initialCursor = null,
  openPostComment,
  setOpenPostComment,
  currentUserId, // Default to empty string if not provided
}: {
  userId: string;
  initialActivities: ActivityItem[];
  initialCursor: string | null;
  openPostComment?: string;
  setOpenPostComment?: Dispatch<SetStateAction<string>>;
  currentUserId?: string; // Default to empty string if not provided
}) {
  const fetchMore = async (cursor: string | null) => {
    const { activities, nextCursor } = await fetchPaginatedActivity(
      userId,
      ITEMS_PER_PAGE,
      currentUserId,
      cursor ?? undefined
    );
    console.log("Fetched more activities:", activities);

    return { items: activities, nextCursor };
  };

  console.log("ActivitySection rendered with activities:", initialActivities);

  const {
    items: activities,
    loading,
    observerTarget,
  } = useInfiniteScroll<ActivityItem>(
    initialActivities,
    initialCursor,
    fetchMore
  );

  if (activities.length === 0 && !loading) {
    return <div className="text-center py-4">No activity found</div>;
  }

  return (
    <div className=" grow overflow-y-auto ">
      {activities.map((act) => {
        switch (act?.type) {
          case "post": {
            const p = act.payload as Post;
            const activityData = {
              id: p?.id || "",
              cOrp: "post" as const,
              content: p?.content || "",
              likeCount: p?.likedBy?.length ?? 0,
              commentCount: p?.comments?.length ?? 0,
              createdAt: act?.createdAt.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              isLikedByUser: act?.isLikedByUser ?? false, // Use isLikedByUser from activity
            };
            return (
              <ActivityItemComponent
                key={`activity-section-post-${act.id}-${p?.id}`}
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
                openPostComment={openPostComment}
                setOpenPostComment={setOpenPostComment}
              />
            );
          }
          case "comment": {
            const c = act.payload as Comment;
            const activityData = {
              id: c?.id || "",
              cOrp: "comment" as const,
              content: c?.content || "",
              likeCount: c?.likedBy?.length ?? 0,
              commentCount: c?.replies?.length ?? 0,
              createdAt: act?.createdAt.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              postId: c?.postId || undefined, // Add postId for comments
              isLikedByUser: act?.isLikedByUser ?? false, // Use isLikedByUser from activity
            };
            return (
              <ActivityItemComponent
                key={`activity-section-comment-${act.id}-${c?.id}`}
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
                openPostComment={openPostComment}
                setOpenPostComment={setOpenPostComment}
              />
            );
          }
          case "likedPost": {
            const p = act.payload as Post;
            const activityData = {
              id: p?.id || "",
              cOrp: "post" as const,
              content: p?.content || "",
              likeCount: p?.likedBy?.length ?? 0,
              commentCount: p?.comments?.length ?? 0,
              createdAt: act?.createdAt.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              isLikedByUser: act?.isLikedByUser ?? false, // Use isLikedByUser from activity
            };
            return (
              <ActivityItemComponent
                key={`activity-section-liked-post-${act.id}-${p?.id}`}
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
                openPostComment={openPostComment}
                setOpenPostComment={setOpenPostComment}
              />
            );
          }
          case "likedComment": {
            const c = act.payload as Comment;
            const activityData = {
              id: c?.id || "",
              cOrp: "comment" as const,
              content: c?.content || "",
              likeCount: c?.likedBy?.length ?? 0,
              commentCount: c?.replies?.length ?? 0,
              createdAt: act?.createdAt.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              postId: c?.postId || undefined, // Add postId for comments
              isLikedByUser: act?.isLikedByUser ?? false, // Use isLikedByUser from activity
            };
            return (
              <ActivityItemComponent
                key={`activity-section-liked-comment-${act.id}-${c?.id}`}
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
                openPostComment={openPostComment}
                setOpenPostComment={setOpenPostComment}
              />
            );
          }
          default:
            return null;
        }
      })}

      {/* pagination trigger + spinner */}
      <div ref={observerTarget} className="h-10" />
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--dmono)]" />
        </div>
      )}
    </div>
  );
}
