import {
  getFollowingPosts,
  getGlobalFeedPosts,
} from "@/app/actions/postActions";
import { useEffect, useState } from "react";
import { EssentialPost } from "@/app/lib/definitions";
import { useCurrentUser } from "@/app/context/UserContext";
import Post from "@/app/ui/dashboard/posts/Post";

export default function PostContent({
  selectedFeed,
}: {
  selectedFeed: string;
}) {
  const [posts, setPosts] = useState<EssentialPost[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useCurrentUser(); // This gets the current user from context

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
          const response = await getFollowingPosts(user?.id);
          // Ensure we're handling the correct data structure from getFollowingActivities
          // Assuming it returns a similar structure with posts property
          if (response) {
            // Map activities to posts if needed
            setPosts(response.posts);
          }
        }
      } catch (error) {
        console.error("Error fetching feed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedData();
  }, [selectedFeed, user]); // Only refetch when selectedFeed changes

  return (
    <div className="flex flex-col gap-2 pt-12">
      {" "}
      {/* Added padding-top to prevent overlap */}
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
              <Post key={`${post?.authorId}${post?.id}`} post={post} />
            ))
          ) : (
            <div className="text-center py-4">No posts to display</div>
          )}
        </div>
      </div>
    </div>
  );
}
