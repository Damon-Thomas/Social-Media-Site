"use client";

import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { fetchPaginatedActivity } from "@/app/actions/fetch";
import type { ActivityItem, Post, Comment } from "@/app/lib/definitions";
import Link from "next/link";

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
    <div className="space-y-4 grow overflow-y-auto pr-2">
      {activities.map((act) => {
        const when = act?.createdAt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        switch (act?.type) {
          case "post": {
            const p = act.payload as Post;
            return (
              <Link key={act.id} href={`/dashboard/posts/${p?.id}`}>
                <div className="p-4 border rounded-lg hover:bg-gray-50">
                  <p className="font-medium">
                    New post: {p?.content?.slice(0, 50)}…
                  </p>
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>{when}</span>
                    <span>
                      💬 {p?.comments?.length ?? 0}  ❤ {p?.likedBy?.length ?? 0}
                    </span>
                  </div>
                </div>
              </Link>
            );
          }
          case "comment": {
            const c = act.payload as Comment;
            return (
              <Link key={act.id} href={`/dashboard/posts/${c?.postId}`}>
                <div className="p-4 border rounded-lg hover:bg-gray-50">
                  <p className="font-medium">
                    New comment: {c?.content?.slice(0, 50)}…
                  </p>
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>{when}</span>
                    <span>❤ {c?.likedBy?.length ?? 0}</span>
                  </div>
                </div>
              </Link>
            );
          }
          case "likedPost": {
            const p = act.payload as Post;
            return (
              <Link key={act.id} href={`/dashboard/posts/${p?.id}`}>
                <div className="p-4 border rounded-lg hover:bg-gray-50">
                  <p className="font-medium">
                    Liked post: {p?.content?.slice(0, 50)}…
                  </p>
                  <p className="text-sm text-gray-500 mt-2">{when}</p>
                </div>
              </Link>
            );
          }
          case "likedComment": {
            const c = act.payload as Comment;
            return (
              <Link key={act.id} href={`/dashboard/posts/${c?.postId}`}>
                <div className="p-4 border rounded-lg hover:bg-gray-50">
                  <p className="font-medium">
                    Liked comment: {c?.content?.slice(0, 50)}…
                  </p>
                  <p className="text-sm text-gray-500 mt-2">{when}</p>
                </div>
              </Link>
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
