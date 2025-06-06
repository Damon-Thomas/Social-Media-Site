"use client";

import type { EssentialPost } from "@/app/lib/definitions";
import { formatRelativeTime } from "@/app/utils/formatRelativeTime";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import flame from "@/public/flame.svg";
import commentText from "@/public/comment.svg";
import ThemedIcon from "@/app/ui/core/ThemedIcon";
import { useCurrentUser } from "@/app/context/UserContext";
import { doesUserLikePost, likePost } from "@/app/actions/postActions";
import { useEffect, useState, useRef } from "react";
import PopDownComment from "./comments/PopDownComment";

export default function Post({
  post,
  setPostId,
  openPostComment,
  setOpenPostComment,
}: {
  post: EssentialPost;
  setPostId: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  openPostComment: string;
  setOpenPostComment: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const iconSize = 20;
  const userData = useCurrentUser();
  const [liked, setLiked] = useState(false); // Default to false instead of null
  const [likeCount, setLikeCount] = useState(post?._count?.likedBy || 0);
  const [commentCount, setCommentCount] = useState(post?._count?.comments || 0); // Initialize comment count
  const [iconLoading, setIconLoading] = useState(true); // Create a loading state specifically for the icon
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function likePostHandler() {
    const willBeLiked = !liked;
    const res = await likePost(post?.id, userData?.id);
    if (res) {
      // Update local state immediately for UI feedback
      setLiked(willBeLiked);
      setLikeCount((prevCount) =>
        willBeLiked ? prevCount + 1 : prevCount - 1
      );
    }
  }

  function commentHandler() {
    setPostId(post?.id);
    if (openPostComment === post?.id) {
      setOpenPostComment("");
      return;
    }
    setOpenPostComment(post?.id || "");
    return;
  }

  // This will update when userData changes due to the refreshUser() call
  useEffect(() => {
    if (!userData || !post) return; // Early exit if userData is not available

    // Use pre-fetched likedByUser field if available, otherwise fall back to API call
    if (post.likedByUser !== undefined) {
      setLiked(post.likedByUser);
      setIconLoading(false);
    } else {
      // Fallback for backward compatibility
      async function checkIfLiked() {
        setIconLoading(true);
        if (userData && post) {
          const isLiked = await doesUserLikePost(userData.id, post.id);
          setLiked(isLiked);
        } else {
          setLiked(false);
        }
        setIconLoading(false);
      }
      checkIfLiked();
    }
  }, [post, userData]);
  useEffect(() => {
    setLikeCount(post?._count?.likedBy || 0);
  }, [post?._count?.likedBy]);

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(
        contentRef.current.scrollHeight > contentRef.current.clientHeight
      );
    }
  }, [post?.content, expanded]);

  return (
    <div className="py-2 md:py-4 border-b-1 border-[var(--borderc)]">
      <div className="flex w-full  ">
        <div className="flex-shrink-0 mr-2">
          <Link href={`/dashboard/profile/${post?.authorId}`}>
            {mounted ? (
              <Image
                src={
                  post?.author?.image && post.author.image.trim() !== ""
                    ? post.author.image
                    : theme === "light"
                    ? "/defaultProfileLight.svg"
                    : "/defaultProfileDark.svg"
                }
                alt="Profile"
                className="w-8 h-8 rounded-full"
                width={32}
                height={32}
              />
            ) : (
              <div style={{ width: 32, height: 32 }} />
            )}
          </Link>
        </div>

        <div className="flex flex-col flex-grow min-w-0">
          <Link href={`dashboard/posts/${post?.id}`}>
            <div className="flex items-start justify-between gap-2">
              <span className="font-extrabold">
                {post?.author?.name || "Deleted Post"}
              </span>
              <p className="text-sm text-[var(--dull)] ">
                {post?.createdAt && formatRelativeTime(post.createdAt, true)}
              </p>
            </div>
            <div className="relative">
              <p
                ref={contentRef}
                className={`whitespace-pre-wrap text-[var(--dmono)] ${
                  expanded ? "" : "max-h-[400px] overflow-hidden"
                } transition-all duration-300 p-2 md:pb-4`}
                style={{
                  WebkitMaskImage:
                    !expanded && isOverflowing
                      ? "linear-gradient(180deg, #000 60%, transparent 100%)"
                      : undefined,
                }}
              >
                {post?.content}
              </p>
              {!expanded && isOverflowing && (
                <div className="absolute bottom-0 left-0 w-full h-16 pointer-events-none bg-gradient-to-b from-transparent to-[var(--rdmono-70)]" />
              )}
            </div>
            {!expanded && isOverflowing && (
              <button
                className="w-full my-2 text-xs text-[var(--dull)] hover:text-[var(--dmono)] font-bold underline underline-offset-2 decoration-[var(--primary)] opacity-80 transition-all"
                style={{
                  textUnderlinePosition: "under",
                  textDecorationColor: "transparent",
                  transition: "text-decoration-color 0.2s",
                }}
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
                className="w-full my-2 text-xs text-[var(--dull)] hover:text-[var(--dmono)] font-bold underline underline-offset-2 decoration-[var(--primary)] opacity-80 transition-all"
                style={{
                  textUnderlinePosition: "under",
                  textDecorationColor: "transparent",
                  transition: "text-decoration-color 0.2s",
                }}
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
          </Link>
          <div className="flex items-center gap-4 mt-0.5">
            <div className="flex items-center gap-1">
              {iconLoading ? (
                <div className="w-12 h-5 bg-gray-300 animate-pulse rounded-full"></div>
              ) : (
                <ThemedIcon
                  count={likeCount}
                  src={flame.src}
                  alt="Likes"
                  size={iconSize}
                  liked={liked}
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
      <PopDownComment
        postId={post?.id}
        hidden={openPostComment !== post?.id}
        creatorClassName=" ml-8 pl-2 border-y-1 border-[var(--dull)]"
        narrow={true}
        setOpenPostComment={setOpenPostComment}
        setCommentCount={setCommentCount}
      />
    </div>
  );
}
