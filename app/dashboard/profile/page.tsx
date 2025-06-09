"use client"; // Add "use client" because we need useState and useEffect

import { useState, useEffect, useRef } from "react"; // Import hooks and useRef
import React from "react"; // Import React
import {
  fetchUserById,
  fetchPaginatedActivity,
  fetchPaginatedPosts,
  fetchPaginatedComments,
  fetchPaginatedLikedPosts,
  fetchPaginatedLikedComments,
} from "@/app/actions/fetch";
import type { Post, Comment, ActivityItem } from "@/app/lib/definitions";
import Goats from "@/app/ui/dashboard/Goats";
import Noobs from "@/app/ui/dashboard/Noobs";
import { useCurrentUser } from "@/app/context/UserContext";
import ProfileSection from "@/app/ui/profile/ProfileActivityComponents/ProfileSection";

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
    fetchPaginatedActivity(userId, ITEMS_PER_PAGE, undefined),
    fetchPaginatedPosts(userId, ITEMS_PER_PAGE, undefined),
    fetchPaginatedComments(userId, ITEMS_PER_PAGE, undefined),
    fetchPaginatedLikedPosts(userId, ITEMS_PER_PAGE, undefined),
    fetchPaginatedLikedComments(userId, ITEMS_PER_PAGE, undefined),
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
export default function Profile() {
  const user = useCurrentUser();
  const [initialData, setInitialData] = useState<Awaited<
    ReturnType<typeof getData>
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveProfileTab>("activity"); // Default to 'posts'
  const sidebarRef = useRef<HTMLDivElement>(null); // Ref for the sidebar

  // const NAVIGATOR_HEIGHT_PX = 64; // Height of the Navigator component
  // const SIDEBAR_TOP_OFFSET_PX = 20; // Your original top-5 offset
  // const initialTop = NAVIGATOR_HEIGHT_PX + SIDEBAR_TOP_OFFSET_PX;

  const refreshProfileData = async () => {
    if (!user?.id) return;
    try {
      const data = await getData(user.id);
      setInitialData(data);
    } catch (error) {
      console.error("Failed to refresh profile data:", error);
    }
  };

  useEffect(() => {
    // Fetch initial data on the client
    getData(user?.id || "")
      .then((data) => {
        setInitialData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch profile data:", error);
        setLoading(false);
      });
  }, [user?.id]);

  if (loading || !initialData) {
    // Render your skeletons or loading UI here
    return (
      <div className="max-w-5xl flex items-start gap-6 p-2 sm:pt-6 w-full">
        <div className="flex-1 min-w-0 max-w-full ">
          <ProfileSection loading={true} />
        </div>
        <div className="sideContent w-fit hidden md:block sticky top-0 self-start z-10">
          <div className="space-y-6 flex flex-col grow w-full">
            <Noobs />
            <Goats />
          </div>
        </div>
      </div>
    );
  }

  // Now it's safe to destructure
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
    // Adjust parent layout: Use flex, items-start, gap-6. Remove justify-end and large right padding.
    <div className="max-w-5xl flex items-start gap-6 p-2 sm:pt-6 w-full">
      {/* Main Profile Content Area - Takes available space */}
      {/* Added max-width constraint to prevent overlap on medium screens */}
      <div className="flex-1 min-w-0 max-w-full ">
        <ProfileSection
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
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          ownProfile={true} // Pass the ownProfile prop
          refreshProfileData={refreshProfileData}
          loading={loading} // Pass the loading state
        />
      </div>
      {/* Right Sidebar - Use sticky positioning */}
      <div
        ref={sidebarRef}
        className={`sideContent w-fit hidden md:block sticky top-0 self-start z-10`}
        // style={{ top: `${initialTop}px` }}
      >
        <div className="space-y-6 flex flex-col grow w-full">
          <Noobs />
          <Goats />
        </div>
      </div>
    </div>
  );
}
