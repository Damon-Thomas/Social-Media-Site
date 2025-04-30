"use client";

import type { User, Post, Comment } from "@/app/lib/definitions";
import PersInfo from "./PersInfo";
import PostsSection from "./PostsSection";
import CommentsSection from "./CommentsSection";
import LikedPostsSection from "./LikedPostsSection";
import LikedCommentsSection from "./LikedCommentsSection";
import { useEffect, useRef } from "react";

interface OtherProfileProps {
  userData: User;
  initialPosts?: Post[];
  postsCursor?: string | null;
  initialComments?: Comment[];
  commentsCursor?: string | null;
  initialLikedPosts?: Post[];
  likedPostsCursor?: string | null;
  initialLikedComments?: Comment[];
  likedCommentsCursor?: string | null;
}

export default function OtherProfile({
  userData,
  initialPosts = [],
  postsCursor = null,
  initialComments = [],
  commentsCursor = null,
  initialLikedPosts = [],
  likedPostsCursor = null,
  initialLikedComments = [],
  likedCommentsCursor = null,
}: OtherProfileProps) {
  const firstChildRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (firstChildRef.current) {
        firstChildRef.current.scrollTop = document.documentElement.scrollTop;
      }
    };

    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    <div className="grid grid-cols-[1fr] md:grid-cols-[1fr_300px] overflow-hidden gap-6 w-full h-full">
      {/* First child: Takes up remaining space */}
      <div className="flex flex-col gap-4 overflow-auto" ref={firstChildRef}>
        <PersInfo userData={userData} />
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-4">Posts</h2>
          <PostsSection
            userId={userData.id}
            initialPosts={initialPosts}
            initialCursor={postsCursor}
          />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-4">Comments</h2>
          <CommentsSection
            userId={userData.id}
            initialComments={initialComments}
            initialCursor={commentsCursor}
          />
        </div>
      </div>

      {/* Second child: Fixed height for Liked Posts and Liked Comments */}
      <div className="flex flex-col gap-2 h-full flex-shrink-0 overflow-hidden">
        <div className="h-1/2 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Liked Posts</h2>
          <LikedPostsSection
            userId={userData.id}
            initialPosts={initialLikedPosts}
            initialCursor={likedPostsCursor}
          />
        </div>
        <div className="h-1/2 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Liked Comments</h2>
          <LikedCommentsSection
            userId={userData.id}
            initialComments={initialLikedComments}
            initialCursor={likedCommentsCursor}
          />
        </div>
      </div>
    </div>
  );
}
