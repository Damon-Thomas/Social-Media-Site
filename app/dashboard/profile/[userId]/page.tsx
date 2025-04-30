"use client"; // Add "use client" because we need useState and useEffect

import { useState, useEffect } from "react"; // Import hooks
import OtherProfile from "@/app/ui/profile/otherProfile/OtherProfile";
import {
  fetchUserById,
  fetchPaginatedActivity,
  fetchPaginatedPosts,
  fetchPaginatedComments,
  fetchPaginatedLikedPosts,
  fetchPaginatedLikedComments,
} from "@/app/actions/fetch";
import type {
  Post,
  Comment,
  ActivityItem,
  User, // Assuming User type is defined here or imported
} from "@/app/lib/definitions";
import Goats from "@/app/ui/dashboard/Goats";

interface PageParams {
  params: { userId: string };
}

const ITEMS_PER_PAGE = 10;

// Define a type for the active tab/section
type ActiveProfileTab = "activity" | "posts" | "comments" | "liked";

// Fetch data on the server side (keep this part)
async function getData(userId: string) {
  const [
    userData,
    activityResponse,
    postsResponse,
    commentsResponse,
    likedPostsResponse,
    likedCommentsResponse,
  ] = await Promise.all([
    fetchUserById(userId),
    fetchPaginatedActivity(userId, undefined, ITEMS_PER_PAGE),
    fetchPaginatedPosts(userId, undefined, ITEMS_PER_PAGE),
    fetchPaginatedComments(userId, undefined, ITEMS_PER_PAGE),
    fetchPaginatedLikedPosts(userId, undefined, ITEMS_PER_PAGE),
    fetchPaginatedLikedComments(userId, undefined, ITEMS_PER_PAGE),
  ]);

  return {
    userData,
    initialActivity: (activityResponse.activities || []) as ActivityItem[],
    activityCursor: activityResponse.nextCursor,
    initialPosts: (postsResponse.posts || []) as Post[],
    postsCursor: postsResponse.nextCursor,
    initialComments: (commentsResponse.comments || []) as Comment[],
    commentsCursor: commentsResponse.nextCursor,
    initialLikedPosts: (likedPostsResponse.posts || []) as Post[],
    likedPostsCursor: likedPostsResponse.nextCursor,
    initialLikedComments: (likedCommentsResponse.comments || []) as Comment[],
    likedCommentsCursor: likedCommentsResponse.nextCursor,
  };
}

// Client component to handle state and effects
export default function ProfilePageClient({ params }: PageParams) {
  const userId = params.userId;
  const [initialData, setInitialData] = useState<Awaited<
    ReturnType<typeof getData>
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveProfileTab>("activity"); // Default to 'posts'

  useEffect(() => {
    // Fetch initial data on the client
    getData(userId)
      .then((data) => {
        setInitialData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch profile data:", error);
        setLoading(false); // Handle error state appropriately
      });
  }, [userId]);

  // Effect to scroll to top when activeTab changes
  useEffect(() => {
    // Only scroll if not the initial load (or handle initial load differently if needed)
    const scrollContainer = document.getElementById(
      "dashboard-scroll-container"
    );
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" }); // Use 'auto' for instant scroll
    }
  }, [activeTab]); // Dependency array includes activeTab

  if (loading) {
    return <div className="p-6 text-center">Loading profile...</div>; // Or a spinner
  }

  if (!initialData?.userData) {
    return <div className="p-6 text-center">User not found.</div>;
  }

  // Destructure data after loading and checking for user
  const {
    userData,
    initialActivity,
    activityCursor,
    initialPosts,
    postsCursor,
    initialComments,
    commentsCursor,
    initialLikedPosts,
    likedPostsCursor,
    initialLikedComments,
    likedCommentsCursor,
  } = initialData;

  return (
    <div className="max-w-5xl relative flex justify-end p-2 md:pr-64 w-full scroll-auto">
      <OtherProfile
        userData={userData}
        initialActivity={initialActivity}
        activityCursor={activityCursor}
        initialPosts={initialPosts}
        postsCursor={postsCursor}
        initialComments={initialComments}
        commentsCursor={commentsCursor}
        initialLikedPosts={initialLikedPosts}
        likedPostsCursor={likedPostsCursor}
        initialLikedComments={initialLikedComments}
        likedCommentsCursor={likedCommentsCursor}
        // Pass state and setter down
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {/* Right Column - This entire div sticks */}
      <div
        className={`absolute right-2 top-5 sideContent max-w-2xs hidden md:block`}
      >
        {/* Content within the sticky right column */}
        <div className="space-y-6">
          <Goats />
          <Goats />
          <Goats />
          {/* ... other sticky content ... */}
        </div>
      </div>
    </div>
  );
}

// Keep the original async function signature for Next.js data fetching patterns if needed,
// but render the client component.
export async function ProfilePage({ params }: PageParams) {
  // You might still pre-fetch some data here if desired,
  // but the state management happens in the client component.
  // For simplicity now, we just render the client component directly.
  return <ProfilePageClient params={params} />;
}
