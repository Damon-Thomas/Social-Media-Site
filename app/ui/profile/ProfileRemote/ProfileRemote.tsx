"use client";

import { useState } from "react";
import type { OtherProfileProps } from "../otherProfile/OtherProfile";
import ProfileSelectors from "./ProfileSelectors";
import ProfileInfo from "./ProfileInfo";

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
    "activity" | "posts" | "comments" | "likedPosts" | "likedComments"
  >("posts");

  return (
    <div className="flex flex-col items-center justify-center h-full">
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
      {activeTab === "likedPosts" && (
        <ProfileInfo
          type="likedPosts"
          userData={userData}
          initialContent={initialLikedPosts}
          cursor={likedPostsCursor}
        />
      )}
      {activeTab === "likedComments" && (
        <ProfileInfo
          type="likedComments"
          userData={userData}
          initialContent={initialLikedComments}
          cursor={likedCommentsCursor}
        />
      )}
    </div>
  );
}
