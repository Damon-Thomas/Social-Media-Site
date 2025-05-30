"use client";

import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { fetchPaginatedActivity } from "@/app/actions/fetch";
import type { ActivityItem, Post, Comment } from "@/app/lib/definitions";
import ActivityItemComponent from "../ProfileActivityComponents/ActivityItem";

const ITEMS_PER_PAGE = 10;

export default function ActivitySection({
  userId,
  initialActivities = [],
  initialCursor = null,
}: {
  userId: string;
  initialActivities: ActivityItem[];
  initialCursor: string | null;
}) {
  const fetchMore = async (cursor: string | null) => {
    const { activities, nextCursor } = await fetchPaginatedActivity(
      userId,
      cursor ?? undefined,
      ITEMS_PER_PAGE
    );

    return { items: activities, nextCursor };
  };

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
    <div className="space-y-4 grow overflow-y-auto ">
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
