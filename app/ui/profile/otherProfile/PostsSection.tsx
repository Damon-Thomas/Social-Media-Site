"use client";

import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchPaginatedPosts } from "@/app/actions/fetch";

export default function PostsSection({
  userId,
  initialPosts,
}: {
  userId: string;
  initialPosts: any[];
}) {
  const [posts, setPosts] = useState(initialPosts || []);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialPosts.length > 0 ? initialPosts[initialPosts.length - 1].id : null
  );
  const [hasMore, setHasMore] = useState(initialPosts.length >= 10);
  const [loading, setLoading] = useState(false);

  const fetchMorePosts = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const { posts: newPosts, nextCursor: newCursor } =
        await fetchPaginatedPosts(userId, nextCursor);

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setNextCursor(newCursor);
        setHasMore(!!newCursor);
      }
    } catch (error) {
      console.error("Error fetching more posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Posts
      </h2>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMorePosts}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        }
        endMessage={
          <p className="text-center text-gray-500 dark:text-gray-400 p-4">
            No more posts to show
          </p>
        }
      >
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
            >
              <p className="text-gray-800 dark:text-gray-200">{post.content}</p>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {new Date(post.createdAt).toLocaleString()}
              </div>
              <div className="mt-2 flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{post.likes?.length || 0}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{post.comments?.length || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
