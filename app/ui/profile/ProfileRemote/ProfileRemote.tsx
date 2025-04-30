"use client";

import { useState } from "react";
import type { OtherProfileProps } from "../otherProfile/OtherProfile";
import ProfileSelectors from "./ProfileSelectors";
import ProfileInfo from "./ProfileInfo";
import CombinedLikedSection from "../CombinedLikedSection";

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
}: OtherProfileProps) {
  const [activeTab, setActiveTab] = useState<
    "activity" | "posts" | "comments" | "liked"
  >("posts");

  return (
    <div className="flex flex-col h-full w-full flex-1">
      <ProfileSelectors activeTab={activeTab} setActiveTab={setActiveTab} />

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
  );
}
