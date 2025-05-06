"use client";

import type { User, Post, Comment, ActivityItem } from "@/app/lib/definitions";
import type { Dispatch, SetStateAction } from "react";
import ProfileSelectors from "./ProfileSelectors";
import ProfileInfo from "./ProfileInfo";
import CombinedLikedSection from "../CombinedLikedSection";
import { useEffect } from "react";

// Define the type for the active tab
type ActiveProfileTab = "activity" | "posts" | "comments" | "liked";

interface ProfileRemoteProps {
  userData: User | null;
  initialActivity?: ActivityItem[];
  activityCursor?: string | null;
  initialPosts?: Post[];
  postsCursor?: string | null;
  initialComments?: Comment[];
  commentsCursor?: string | null;
  initialLikedPosts?: Post[];
  likedPostsCursor?: string | null;
  initialLikedComments?: Comment[];
  likedCommentsCursor?: string | null;
  navigatorHeight: number;
  activeTab: ActiveProfileTab;
  setActiveTab: Dispatch<SetStateAction<ActiveProfileTab>>; // Updated type
}

export default function ProfileRemote({
  userData,
  initialActivity = [],
  activityCursor = null,
  initialPosts = [],
  postsCursor = null,
  initialComments = [],
  commentsCursor = null,
  initialLikedPosts = [],
  likedPostsCursor = null,
  initialLikedComments = [],
  likedCommentsCursor = null,
  activeTab,
  setActiveTab,
}: ProfileRemoteProps) {
  useEffect(() => {
    const scrollContainer = document.getElementById(
      "dashboard-scroll-container"
    );
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeTab]);

  if (!userData) {
    return null; // or a fallback UI
  }

  return (
    <>
      <ProfileSelectors
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        className={`sticky top-0 z-10 bg-[var(--rdmono)] py-2`}
      />
      <div className="flex flex-col w-full mt-4">
        <div className="pt-4">
          {activeTab === "activity" && (
            <ProfileInfo
              type="activity"
              userData={userData}
              initialContent={initialActivity}
              cursor={activityCursor}
            />
          )}
          {activeTab === "posts" && (
            <ProfileInfo
              type="posts"
              userData={userData}
              initialContent={initialPosts}
              cursor={postsCursor}
            />
          )}
          {activeTab === "comments" && (
            <ProfileInfo
              type="comments"
              userData={userData}
              initialContent={initialComments}
              cursor={commentsCursor}
            />
          )}
          {activeTab === "liked" && (
            <CombinedLikedSection
              userId={userData.id}
              initialLikedPosts={initialLikedPosts}
              initialLikedComments={initialLikedComments}
              likedPostsCursor={likedPostsCursor}
              likedCommentsCursor={likedCommentsCursor}
            />
          )}
        </div>
      </div>
    </>
  );
}
