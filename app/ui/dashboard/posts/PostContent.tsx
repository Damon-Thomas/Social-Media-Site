import {
  getFollowingActivities,
  getGlobalFeedPosts,
} from "@/app/actions/postActions";
import { useEffect, useState } from "react";
import { ActivityItem, EssentialPost } from "@/app/lib/definitions";
import Image from "next/image";
import { formatRelativeTime } from "@/app/utils/formatRelativeTime";

export default function PostContent({
  selectedFeed,
}: {
  selectedFeed: string;
}) {
  const [posts, setPosts] = useState<EssentialPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // This prevents infinite loop and fetches data when feed selection changes
    const fetchFeedData = async () => {
      setLoading(true);
      try {
        if (selectedFeed === "global") {
          // Get global posts
          const response = await getGlobalFeedPosts();
          setPosts(response.posts);
        } else {
          // Get following activities
          const response = await getFollowingActivities("userId");
          // Ensure we're handling the correct data structure from getFollowingActivities
          // Assuming it returns a similar structure with posts property
          if (response && response.activities) {
            // Map activities to posts if needed
            const activityPosts = response.activities
              .filter((item: ActivityItem) => item?.type === "post")
              .map((item: ActivityItem) => item?.payload);
            setPosts(activityPosts);
          }
        }
      } catch (error) {
        console.error("Error fetching feed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedData();
  }, [selectedFeed]); // Only refetch when selectedFeed changes

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-start pt-4 px-4">
        <h1 className="text-[var(--dmono)]">
          {selectedFeed === "global" ? "Global Feed" : "Following Feed"}
        </h1>
      </div>
      <div className="flex gap-4 w-full no-wrap my-2 pt-2 border-t-1 border-[var(--borderc)] h-fit px-4">
        <div className="flex flex-col gap-4 w-full">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--dmono)]"></div>
            </div>
          ) : posts && posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post?.id}
                className="flex flex-col gap-2 border-b-1 border-[var(--borderc)] py-2"
              >
                <div className="flex items-center gap-2">
                  {post?.author?.image && (
                    <Image
                      src={post.author.image}
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                      width={40}
                      height={40}
                    />
                  )}
                  <span className="font-medium">{post?.author?.name}</span>
                </div>
                <p className="text-lg">{post?.content}</p>
                <p className="text-sm text-gray-500">
                  {post?.createdAt && formatRelativeTime(post.createdAt, true)}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-4">No posts to display</div>
          )}
        </div>
      </div>
    </div>
  );
}
