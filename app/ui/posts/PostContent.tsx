import {
  getFollowingPosts,
  getGlobalFeedPosts,
} from "@/app/actions/postActions";
import { useEffect, useState } from "react";
import { EssentialPost } from "@/app/lib/definitions";
import { useCurrentUser } from "@/app/context/UserContext";
import Post from "@/app/ui/posts/Post";
import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";

export default function PostContent({
  selectedFeed,
}: {
  selectedFeed: string;
}) {
  const user = useCurrentUser(); // This gets the current user from context
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [initialPosts, setInitialPosts] = useState<EssentialPost[]>([]);
  const [initialCursor, setInitialCursor] = useState<string | null>(null);

  // Function to fetch more posts
  const fetchMore = async (cursor: string | null) => {
    if (selectedFeed === "global") {
      const { posts, nextCursor } = await getGlobalFeedPosts(
        cursor || undefined
      );
      return { items: posts ?? [], nextCursor };
    } else {
      const { posts, nextCursor } = await getFollowingPosts(
        user?.id,
        cursor || undefined
      );
      return { items: posts ?? [], nextCursor };
    }
  };

  // Initial data fetch when feed changes
  useEffect(() => {
    async function loadInitialData() {
      setInitialDataLoaded(false);
      try {
        let response;
        if (selectedFeed === "global") {
          response = await getGlobalFeedPosts();
        } else {
          response = await getFollowingPosts(user?.id);
        }
        console.log("Initial posts:", response.posts);
        setInitialPosts(response.posts);
        setInitialCursor(response.nextCursor);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setInitialPosts([]);
        setInitialCursor(null);
      } finally {
        setInitialDataLoaded(true);
      }
    }

    loadInitialData();
  }, [selectedFeed, user]);

  // Use infinite scroll hook with fetched initial data
  const {
    items: posts,
    loading,
    hasMore,
    observerTarget,
  } = useInfiniteScroll(initialPosts, initialCursor, fetchMore);

  // Filter out duplicate posts based on their IDs
  const uniquePosts = new Map();
  posts.forEach((post) => {
    if (post?.id) {
      uniquePosts.set(post.id, post);
    }
  });
  const filteredPosts = Array.from(uniquePosts.values());

  return (
    <div className="flex flex-col gap-2 ">
      <div className="flex gap-4 items-start pt-4 px-4">
        <h1 className="text-[var(--dmono)] font-extrabold">
          {selectedFeed === "global" ? "Global Feed" : "Following Feed"}
        </h1>
      </div>
      <div className="flex gap-4 w-full no-wrap my-2 pt-2 border-t-1 border-[var(--borderc)] min-h-full h-fit px-4">
        <div className="flex flex-col gap-4 w-full">
          {initialDataLoaded ? (
            filteredPosts && filteredPosts.length > 0 ? (
              <>
                {filteredPosts.map((post) => (
                  <Post key={`post-${selectedFeed}-${post?.id}`} post={post} />
                ))}
                {loading && (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--dmono)]"></div>
                  </div>
                )}
                {hasMore && <div ref={observerTarget} className="h-10" />}
              </>
            ) : (
              <div className="text-center py-4">No posts to display</div>
            )
          ) : (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--dmono)]"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
