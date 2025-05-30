"use client";

import type { User, Post, Comment, ActivityItem } from "@/app/lib/definitions";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import PersInfo from "@/app/ui/profile/ProfileComponents/PersInfo";
import ProfileRemote from "@/app/ui/profile/ProfileRemote/ProfileRemote";

// Use the same type as ProfileRemote's activeTab state
type ActiveProfileTab = "activity" | "posts" | "comments" | "liked";

export interface ProfileProps {
  userData: User;
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
  activeTab: ActiveProfileTab;
  setActiveTab: Dispatch<SetStateAction<ActiveProfileTab>>; // Updated type
  ownProfile?: boolean; // Optional prop to indicate if it's the user's own profile
  refreshProfileData?: () => Promise<void>; // Optional refresh function
}

export default function ProfileSection({
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
  ownProfile = false, // Default to false if not provided
  refreshProfileData,
}: ProfileProps) {
  const NAVIGATOR_HEIGHT = 64;

  // Shared state for managing which comment dropdown is open across all sections
  const [openPostComment, setOpenPostComment] = useState("");

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold">User not found</h1>
        <p className="mt-2 text-gray-600">
          The user you are looking for does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[1fr] gap-6 w-full ">
      <div className="flex flex-col min-w-0">
        <PersInfo
          ownProfile={ownProfile}
          userData={userData}
          refreshProfileData={refreshProfileData}
        />
        <ProfileRemote
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
          navigatorHeight={NAVIGATOR_HEIGHT}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openPostComment={openPostComment}
          setOpenPostComment={setOpenPostComment}
        />
      </div>
    </div>
  );
}
