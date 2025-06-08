"use client";

import type { User, Post, Comment, ActivityItem } from "@/app/lib/definitions";
import type { Dispatch, SetStateAction } from "react";
import ProfileSelectors from "./ProfileSelectors";
import ProfileInfo from "./ProfileInfo";
import CombinedLikedSection from "../ProfileActivityComponents/CombinedLikedSection";
import { useEffect } from "react";

// Define the type for the active tab
type ActiveProfileTab = "activity" | "posts" | "comments" | "liked";

interface ProfileRemoteProps {
  userData: User | null;
  currentUserId?: string;
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
  openPostComment?: string;
  setOpenPostComment?: Dispatch<SetStateAction<string>>;
}

export default function ProfileRemote({
  userData,
  currentUserId,
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
  openPostComment,
  setOpenPostComment,
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
      <div className="flex flex-col w-full">
        <div className="">
          {activeTab === "activity" && (
            <ProfileInfo
              type="activity"
              userData={userData}
              currentUserId={currentUserId}
              initialContent={initialActivity}
              cursor={activityCursor}
              openPostComment={openPostComment}
              setOpenPostComment={setOpenPostComment}
            />
          )}
          {activeTab === "posts" && (
            <ProfileInfo
              type="posts"
              userData={userData}
              currentUserId={currentUserId}
              initialContent={initialPosts}
              cursor={postsCursor}
              openPostComment={openPostComment}
              setOpenPostComment={setOpenPostComment}
            />
          )}
          {activeTab === "comments" && (
            <ProfileInfo
              type="comments"
              userData={userData}
              currentUserId={currentUserId}
              initialContent={initialComments}
              cursor={commentsCursor}
              openPostComment={openPostComment}
              setOpenPostComment={setOpenPostComment}
            />
          )}
          {activeTab === "liked" && (
            <CombinedLikedSection
              userId={userData.id}
              currentUserId={currentUserId || ""}
              initialLikedPosts={initialLikedPosts}
              initialLikedComments={initialLikedComments}
              likedPostsCursor={likedPostsCursor}
              likedCommentsCursor={likedCommentsCursor}
              openPostComment={openPostComment}
              setOpenPostComment={setOpenPostComment}
            />
          )}
        </div>
      </div>
    </>
  );
}
