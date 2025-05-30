"use client";

import { useCurrentUser } from "@/app/context/UserContext";
import { capitalize } from "@/app/utils/capitalize";
import Image from "next/image";
import Link from "next/link";
import ThemedIcon from "../../core/ThemedIcon";
import flame from "@/public/flame.svg";
import commentText from "@/public/comment.svg";
import { useEffect, useState } from "react";
import PopDownComment from "../../posts/comments/PopDownComment";
import { likePost, doesUserLikePost } from "@/app/actions/postActions";
import { likeComment, isLikedByUser } from "@/app/actions/commentActions";
import { useTheme } from "next-themes";

export type ActivityItem = {
  id: string;
  cOrp: "comment" | "post";
  content: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  postId?: string; // Added to support comments that need parent post ID
};

export default function ActivityItem({
  data,
  user: activityUser,
  pOrc,
  showAsLiked = false, // New prop to indicate this item is in a "liked" section
  openPostComment,
  setOpenPostComment,
}: {
  data: ActivityItem;
  user?: { id: string; name: string; profileImage?: string };
  pOrc?: "post" | "comment";
  showAsLiked?: boolean; // Optional prop to show "Liked Post/Comment" text
  openPostComment?: string;
  setOpenPostComment?: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { theme } = useTheme();
  const currentUser = useCurrentUser();

  // State management for ThemedIcon functionality
  const [likeCount, setLikeCount] = useState(data.likeCount || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [iconLoading, setIconLoading] = useState(true);
  const [iconSize, setIconSize] = useState(20);
  const [commentCount, setCommentCount] = useState(data.commentCount || 0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keep counts in sync with data prop
  useEffect(() => {
    setLikeCount(data.likeCount || 0);
  }, [data.likeCount]);

  useEffect(() => {
    setCommentCount(data.commentCount || 0);
  }, [data.commentCount]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIconSize(16);
      } else {
        setIconSize(20);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check if the current user has liked this item
  useEffect(() => {
    if (!currentUser || !data.id) return;

    async function checkIfLiked() {
      setIconLoading(true);
      try {
        let isLiked = false;
        if (pOrc === "post" || data.cOrp === "post") {
          isLiked = await doesUserLikePost(currentUser!.id, data.id);
        } else if (pOrc === "comment" || data.cOrp === "comment") {
          isLiked = await isLikedByUser(currentUser!.id, data.id);
        }
        setIsLiked(isLiked);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
      setIconLoading(false);
    }

    checkIfLiked();
  }, [currentUser, data.id, pOrc, data.cOrp]);

  const getHref = () => {
    if (pOrc === "post" || data.cOrp === "post") {
      return `/dashboard/posts/${data.id}`;
    } else if (pOrc === "comment" || data.cOrp === "comment") {
      return `/dashboard/comment/${data.id}`;
    }
    return "#"; // fallback
  };

  async function likePostHandler() {
    if (!currentUser) {
      console.error("User must be logged in to like an activity.");
      return;
    }

    const willBeLiked = !isLiked;
    let success = false;

    try {
      if (pOrc === "post" || data.cOrp === "post") {
        const res = await likePost(data.id, currentUser.id);
        success = !!res;
      } else if (pOrc === "comment" || data.cOrp === "comment") {
        const res = await likeComment(data.id, currentUser.id);
        success = !!res;
      }

      if (success) {
        // Update local state immediately for UI feedback
        setIsLiked(willBeLiked);
        setLikeCount((prevCount) =>
          willBeLiked ? prevCount + 1 : prevCount - 1
        );
      }
    } catch (error) {
      console.error("Error liking activity:", error);
    }
  }

  function commentHandler() {
    // Only proceed if we have the shared state management functions
    if (!setOpenPostComment) return;

    // Toggle comment visibility like in the dashboard
    if (openPostComment === data.id) {
      setOpenPostComment("");
      return;
    }
    setOpenPostComment(data.id || "");
  }

  return (
    <div className="py-2 md:py-4 border-b-1 border-[var(--borderc)]">
      <div className="flex w-full">
        <div className="flex-shrink-0 mr-2">
          <Link href={`/dashboard/profile/${activityUser?.id}`}>
            {mounted ? (
              <Image
                src={
                  activityUser?.profileImage &&
                  activityUser.profileImage.trim() !== ""
                    ? activityUser.profileImage
                    : theme === "light"
                    ? "/defaultProfileLight.svg"
                    : "/defaultProfileDark.svg"
                }
                alt={`${activityUser?.name || "User"}'s profile picture`}
                className="rounded-full h-8 w-8 flex-shrink-0"
                width={32}
                height={32}
                loading="lazy"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div style={{ width: 32, height: 32 }} />
            )}
          </Link>
        </div>

        <div className="flex flex-col flex-grow min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/dashboard/profile/${activityUser?.id}`}>
              <span className="inline-block font-extrabold hover:underline underline-offset-1 decoration-[var(--primary)] decoration-2 hover:scale-105 transition-transform">
                {activityUser?.name}
              </span>
            </Link>

            <p className="text-sm text-[var(--dull)]">
              {showAsLiked && "Liked "}
              {showAsLiked ? pOrc : pOrc ? capitalize(pOrc) : ""}
            </p>
          </div>
          <Link href={getHref()}>
            <p className="whitespace-pre-wrap  text-[var(--dmono)]">
              {data.content || "Content not available."}
            </p>
          </Link>
          <div className="flex items-center gap-4 mt-0.5 md:mt-1 pt-1 -translate-x-2 ">
            <div className="flex items-center gap-1">
              {iconLoading ? (
                <div className="w-5 h-5 bg-gray-300 animate-pulse rounded-full"></div>
              ) : (
                <ThemedIcon
                  count={likeCount}
                  src={flame.src}
                  alt="Likes"
                  size={iconSize}
                  liked={isLiked}
                  onClick={likePostHandler}
                  noTransition={true} // Disable transitions for initial render
                />
              )}
            </div>

            <div onClick={commentHandler} className="flex items-center gap-1">
              <ThemedIcon
                count={commentCount}
                src={commentText.src}
                alt="Comments"
                size={iconSize}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Show PopDownComment for both posts and comments when shared state is available */}
      {setOpenPostComment && (
        <PopDownComment
          postId={
            pOrc === "post" || data.cOrp === "post"
              ? data.id
              : data.postId || data.id
          }
          parentId={
            pOrc === "comment" || data.cOrp === "comment" ? data.id : undefined
          }
          hidden={openPostComment !== data.id}
          creatorClassName=" ml-8 pl-2 border-y-1 border-[var(--dull)]"
          narrow={true}
          setOpenPostComment={setOpenPostComment}
          setCommentCount={setCommentCount}
        />
      )}
    </div>
  );
}
