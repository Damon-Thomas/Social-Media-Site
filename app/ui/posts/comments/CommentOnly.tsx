import { likeComment } from "@/app/actions/commentActions";
import { useCurrentUser } from "@/app/context/UserContext";
import { EssentialComment } from "@/app/lib/definitions";
import { SWR_KEYS } from "@/app/lib/swr";
import { useDefaultProfileImage } from "@/app/utils/defaultProfileImage";
import formatDate from "@/app/utils/formatDate";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import WarningModal from "../../core/WarningModal";
import { useAddNotification } from "@/app/context/NotificationContext";
import { mutate } from "swr";

export default function CommentOnly({
  comment,
  className = "",
  likeCount = 0,
  setLikeCount,
  commentCount = 0,
  setCommentCount,
}: {
  comment: EssentialComment | null; // Update to accept FullPost
  className?: string;
  likeCount?: number;
  setLikeCount?: React.Dispatch<React.SetStateAction<number>>;
  commentCount?: number;
  setCommentCount?: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [liked, setLiked] = useState(false);
  // const [likeCount, setLikeCount] = useState(0);
  // const [commentCount, setCommentCount] = useState(0);
  const user = useCurrentUser(); // Get the current user
  const defaultProfile = useDefaultProfileImage();
  const [showWarning, setShowWarning] = useState(false);
  const addNotification = useAddNotification();

  const warningMessage =
    "Are you sure you want to delete this comment? This action cannot be undone.";
  // Format the date
  const formattedDate = formatDate(comment?.createdAt);

  useEffect(() => {
    if (user) {
      const currentUserId = user.id;
      const isLiked = comment?.likedBy?.some(
        (likedUser) => likedUser?.id === currentUserId
      );
      setLiked(!!isLiked);
      if (setLikeCount) {
        setLikeCount(comment?.likedBy?.length ?? 0);
      }
      if (setCommentCount) {
        setCommentCount(comment?.replies?.length ?? 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comment, user, setCommentCount]);

  async function handleLike() {
    if (!user) {
      console.error("User must be logged in to like a post.");
      return;
    }
    const currentUserId = user.id;
    const commentId = comment?.id || "";
    try {
      const liker = await likeComment(commentId, currentUserId);
      if (!liker) {
        console.error("Failed to like the comment.");
        return;
      }
      setLiked((prev) => !prev);
      if (setLikeCount) {
        setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  }

  async function deleteCommentHandler() {
    if (!user || !comment?.id) {
      console.error("User must be logged in and post must exist to delete.");
      addNotification("You must be logged in to delete a comment.");
      return;
    }
    let notificationMessage;
    try {
      const res = await fetch("/api/destructiveCAndP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          commentOrPost: "comment",
          itemId: comment.id,
        }),
      });
      const data = await res.json();
      console.log("Delete comment response:", data);
      if (!data.success || data.error) {
        console.error("Failed to delete comment:", data.error);
        notificationMessage =
          data.error || "Failed to delete comment. Please try again.";
      } else {
        notificationMessage = "Comment deleted successfully.";
        mutate(SWR_KEYS.COMMENT(comment.id)); // For comments
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      if (error instanceof Error) {
        notificationMessage = error.message;
      } else {
        notificationMessage =
          "An unknown error occurred while deleting the comment.";
      }
    } finally {
      setShowWarning(false);
      addNotification(
        notificationMessage || "Deleting comment experienced an unkown error."
      );
    }
  }

  return (
    <div className={`max-w-3xl flex flex-col w-full mx-auto ${className}`}>
      <div className="flex justify-between">
        <Link
          href={`/dashboard/profile/${comment?.author?.id}`}
          className="flex mb-4"
        >
          <Image
            src={comment?.author?.image || defaultProfile}
            alt="User profile picture"
            width={40}
            height={40}
            className="rounded-full flex-shrink-0 h-12 w-12"
          />

          <h6 className="ml-4 font-bold text-lg">
            {comment?.author?.name || "Unknown Name"}
          </h6>
        </Link>
        {user?.id === comment?.authorId && (
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
              typeVerificationText="Comment"
              onConfirm={deleteCommentHandler}
              onCancel={() => setShowWarning((prev) => !prev)}
            />
          </>
        )}
      </div>

      <Link href={`/dashboard/posts/${comment?.postId}`}>
        <p className="whitespace-pre-wrap mb-4">
          {comment?.content || "comment content here."}
        </p>
      </Link>

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
          <div className="flex gap-1 text-[var(--dull)] hover:cursor-pointer hover:text-[var(--primary)]">
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
