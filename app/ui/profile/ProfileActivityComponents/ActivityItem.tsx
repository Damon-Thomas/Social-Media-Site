"use client";

import { useCurrentUser } from "@/app/context/UserContext";
import { capitalize } from "@/app/utils/capitalize";
import Image from "next/image";
import Link from "next/link";
import ThemedIcon from "../../core/ThemedIcon";
import { useEffect, useState, useRef } from "react";
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
  isLikedByUser?: boolean; // Pre-fetched like status to avoid individual API calls
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

  // Add state and ref for overflow handling
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

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

    // Use pre-fetched like status if available, otherwise make API call
    if (data.isLikedByUser !== undefined) {
      setIsLiked(data.isLikedByUser);
      setIconLoading(false);
      return;
    }

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
  }, [currentUser, data.id, data.isLikedByUser, pOrc, data.cOrp]);

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(
        contentRef.current.scrollHeight > contentRef.current.clientHeight
      );
    }
  }, [data.content, expanded]);

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
    <div
      className="p-2 md:py-4 border-b-1 border-[var(--borderc)] hover:bg-[var(--rdmonoh)] transition-colors cursor-pointer"
      onClick={(e) => {
        // Prevent redirect if:
        // - a link was clicked
        // - a like/comment icon was clicked
        // - the popup is open for this item
        const target = e.target as HTMLElement;
        if (
          target.closest("a") ||
          target.closest('[data-interactive="true"]') ||
          openPostComment === data.id
        ) {
          return;
        }
        window.location.href = getHref();
      }}
    >
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
                className="rounded-full h-8 w-8 flex-shrink-0 hover:opacity-80 transition-opacity"
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
              <span className="inline-block font-extrabold hover:underline underline-offset-1 decoration-[var(--primary)] decoration-2 ">
                {activityUser?.name}
              </span>
            </Link>

            <p className="text-sm text-[var(--dull)]">
              {showAsLiked && "Liked "}
              {showAsLiked ? pOrc : pOrc ? capitalize(pOrc) : ""}
            </p>
          </div>

          <p
            ref={contentRef}
            className={`whitespace-pre-wrap text-[var(--dmono)] ${
              expanded ? "" : "max-h-[400px] overflow-hidden"
            } transition-all duration-300`}
            style={{
              WebkitMaskImage:
                !expanded && isOverflowing
                  ? "linear-gradient(180deg, #000 60%, transparent 100%)"
                  : undefined,
            }}
          >
            {data.content || "Content not available."}
          </p>
          {!expanded && isOverflowing && (
            <div className="absolute bottom-0 left-0 w-full h-16 pointer-events-none bg-gradient-to-b from-transparent to-[var(--rdmono-70)]" />
          )}
          {!expanded && isOverflowing && (
            <button
              className="my-2 text-xs text-[var(--dull)] hover:text-[var(--dmono)] font-bold underline underline-offset-2 decoration-[var(--primary)] opacity-80 transition-all"
              style={{
                textUnderlinePosition: "under",
                textDecorationColor: "transparent",
                transition: "text-decoration-color 0.2s",
              }}
              data-interactive="true"
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecorationColor = "var(--primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecorationColor = "transparent")
              }
              onClick={(e) => {
                e.preventDefault();
                setExpanded(true);
              }}
            >
              Show more
            </button>
          )}
          {expanded && (
            <button
              className="my-2 text-xs text-[var(--dull)] hover:text-[var(--dmono)] font-bold underline underline-offset-2 decoration-[var(--primary)] opacity-80 transition-all"
              style={{
                textUnderlinePosition: "under",
                textDecorationColor: "transparent",
                transition: "text-decoration-color 0.2s",
              }}
              data-interactive="true"
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecorationColor = "var(--primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecorationColor = "transparent")
              }
              onClick={(e) => {
                e.preventDefault();
                setExpanded(false);
              }}
            >
              Show less
            </button>
          )}
          <div className="flex items-center gap-4 mt-0.5 md:mt-1 pt-1 -translate-x-2 ">
            <div className="flex items-center gap-1" data-interactive="true">
              {iconLoading ? (
                <div className="w-12 h-5 bg-gray-300 animate-pulse rounded-full"></div>
              ) : (
                <ThemedIcon
                  count={likeCount}
                  src="/flame.svg"
                  alt="Likes"
                  size={iconSize}
                  liked={isLiked}
                  onClick={likePostHandler}
                  noTransition={true} // Disable transitions for initial render
                />
              )}
            </div>

            <div
              onClick={commentHandler}
              className="flex items-center gap-1"
              data-interactive="true"
            >
              <ThemedIcon
                count={commentCount}
                src="/comment.svg"
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
          creatorClassName=" ml-8 pl-2 border-y-1 border-[var(--borderc)]"
          narrow={true}
          setOpenPostComment={setOpenPostComment}
          setCommentCount={setCommentCount}
        />
      )}
    </div>
  );
}
