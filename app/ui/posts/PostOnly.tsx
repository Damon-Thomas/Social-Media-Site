import { likePost } from "@/app/actions/postActions";
import { mutate } from "swr";
import { useRouter } from "next/navigation";

import { SWR_KEYS } from "@/app/lib/swr";
import { useCurrentUser } from "@/app/context/UserContext";
import { FullPost } from "@/app/lib/definitions";
import { useDefaultProfileImage } from "@/app/utils/defaultProfileImage";
import formatDate from "@/app/utils/formatDate";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import WarningModal from "../core/WarningModal";
import { useAddNotification } from "@/app/context/NotificationContext";

export default function PostOnly({
  post,
  className = "",
  // setHidden,
  likeCount = 0,
  setLikeCount,
  commentCount = 0,
  setCommentCount,
}: {
  post: FullPost | null; // Update to accept FullPost
  className?: string;
  // setHidden?: React.Dispatch<React.SetStateAction<boolean>>;
  likeCount?: number;
  setLikeCount?: React.Dispatch<React.SetStateAction<number>>;
  commentCount?: number;
  setCommentCount?: React.Dispatch<React.SetStateAction<number>>;
}) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const user = useCurrentUser(); // Get the current user
  const defaultProfile = useDefaultProfileImage();
  const addNotification = useAddNotification();
  const [showWarning, setShowWarning] = useState(false);
  const warningMessage =
    "Are you sure you want to delete this post? This action cannot be undone.";
  // Format the date
  const formattedDate = formatDate(post?.createdAt);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user && mounted) {
      const currentUserId = user.id;
      const isLiked = post?.likedBy?.some(
        (likedUser) => likedUser?.id === currentUserId
      );
      setLiked(!!isLiked);
      if (setLikeCount) {
        setLikeCount(post?.likedBy?.length ?? 0);
      }
      if (setCommentCount) {
        setCommentCount(post?.comments?.length ?? 0);
      }
    }
  }, [post, user, setLikeCount, setCommentCount, mounted]);

  async function handleLike() {
    if (!user) {
      console.error("User must be logged in to like a post.");
      return;
    }
    const currentUserId = user.id;
    const postId = post?.id;
    try {
      const liker = await likePost(postId, currentUserId);
      if (!liker) {
        console.error("Failed to like the post.");
        return;
      }
      setLiked((prev) => !prev);
      if (setLikeCount) {
        setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }

  async function deletePostHandler() {
    if (!user || !post?.id) {
      console.error("User must be logged in and post must exist to delete.");
      return;
    }
    let notificationMessage;
    try {
      const res = await fetch("/api/destructiveCAndP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          commentOrPost: "post",
          itemId: post.id,
        }),
      });
      const data = await res.json();
      console.log("Delete post response:", data);
      if (!data.success || data.error) {
        console.error("Failed to delete post:", data.error);
        notificationMessage =
          data.error || "Failed to delete post. Please try again.";
      } else {
        notificationMessage = "Post deleted successfully.";
        mutate(SWR_KEYS.POST(post.id));
        console.log("HEHHEHRERR", data, data.deleted);
        if (data.deleted) {
          router.push("/dashboard");
          return;
        }
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      if (error instanceof Error) {
        notificationMessage = error.message;
      } else {
        notificationMessage =
          "An unknown error occurred while deleting the post.";
      }
    } finally {
      setShowWarning(false);
      addNotification(
        notificationMessage || "Deleting post experienced an unkown error."
      );
    }
  }

  // function commentHandler() {
  //   // Handle comment action here
  //   console.log("Comment button clicked");
  //   if (setHidden) {
  //     setHidden(false);
  //   }
  // }

  return (
    <div className={`max-w-3xl flex flex-col w-full mx-auto ${className}`}>
      <div className="flex justify-between">
        <Link
          href={`/dashboard/profile/${post?.author?.id}`}
          className="flex mb-4"
        >
          {mounted ? (
            <Image
              src={post?.author?.image || defaultProfile}
              alt="User profile picture"
              width={40}
              height={40}
              className="rounded-full flex-shrink-0 h-12 w-12"
            />
          ) : (
            <div style={{ width: 40, height: 40 }} />
          )}
          <h6 className="ml-4 font-bold text-lg">
            {post?.author?.name || "Unknown Name"}
          </h6>
        </Link>
        {user?.id === post?.authorId && (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-[var(--danger)] h-8 w-8 hover:cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out"
              onClick={() => setShowWarning((prev) => !prev)}
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5z" />
              <path d="M12 10l4 4m0 -4l-4 4" />
            </svg>
            <WarningModal
              hidden={!showWarning}
              setHidden={setShowWarning}
              warningMessage={warningMessage}
              typeVerificationText="Post"
              onConfirm={deletePostHandler}
              onCancel={() => setShowWarning((prev) => !prev)}
            />
          </>
        )}
      </div>

      <p className="whitespace-pre-wrap mb-4">
        {post?.content || "Post content here."}
      </p>

      <div className="flex items-center justify-between gap-4 border-y-1 border-[var(--dull)] w-full mt-2 h-10">
        <p className="flex text-[var(--dull)]">{formattedDate}</p>
        <div className="flex gap-8">
          <div
            onClick={handleLike}
            className={`${
              liked ? "text-[var(--primary)]" : "text-[var(--dull)]"
            } flex gap-1  hover:cursor-pointer hover:text-[var(--primary)]`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 16 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
            <p className="">{likeCount}</p>
          </div>
          <div
            // onClick={commentHandler}
            // className="flex gap-1 text-[var(--dull)] hover:cursor-pointer hover:text-[var(--primary)]"
            className="flex gap-1 text-[var(--dull)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            </svg>
            <p className="">{commentCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
