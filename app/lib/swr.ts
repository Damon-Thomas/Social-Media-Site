// SWR configuration and utilities
import { SWRConfiguration } from "swr";

// Default fetcher function
export const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  });

// SWR default configuration
export const swrConfig: SWRConfiguration = {
  fetcher,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  refreshInterval: 0, // Disable automatic refresh by default
  dedupingInterval: 2000, // Dedupe requests within 2 seconds
  errorRetryCount: 3,
  errorRetryInterval: 5000,
};

// SWR keys for consistent cache management
export const SWR_KEYS = {
  // Posts
  POST: (postId: string) => `/api/posts/${postId}`,
  POSTS: "/api/posts",
  POST_COMMENTS: (postId: string) => `/api/posts/${postId}/comments`,

  // Comments
  COMMENT: (commentId: string) => `/api/comments/${commentId}`,
  COMMENT_REPLIES: (commentId: string) => `/api/comments/${commentId}/replies`,

  // Users
  USER: (userId: string) => `/api/users/${userId}`,
  CURRENT_USER: "/api/me",

  // Profiles
  PROFILE: (userId: string) => `/api/profiles/${userId}`,
} as const;
