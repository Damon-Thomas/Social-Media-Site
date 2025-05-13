"use client";

import { EssentialComment } from "@/app/lib/definitions";
import { formatRelativeTime } from "@/app/utils/formatRelativeTime";
import ThemedIcon from "@/app/ui/core/ThemedIcon";
import flame from "@/public/flame.svg";
import commentText from "@/public/comment.svg";
import { isLikedByUser, likeComment } from "@/app/actions/commentActions";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/app/context/UserContext";
// import { set } from "zod";

// Extend EssentialComment to include _count
type CommentWithCount = EssentialComment & {
  _count?: {
    likedBy: number;
    replies: number;
  };
};

export default function CommentItem({
  comment,
  setParentId,
}: {
  comment: CommentWithCount | null;
  setParentId?: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const user = useCurrentUser();
  const [likeCount, setLikeCount] = useState(comment?._count?.likedBy || 0);
  const [replyCount, setReplyCount] = useState(comment?._count?.replies || 0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!comment || !user) return; // Early exit if dependencies are null

    async function checkIfLiked() {
      const likedByUser = await isLikedByUser(user.id, comment.id);
      console.log("Liked by user:", likedByUser);
      setIsLiked(likedByUser || false);
    }

    checkIfLiked();
  }, [comment, user]); // Include full objects in the dependency array

  useEffect(() => {
    setLikeCount(comment?._count?.likedBy || 0);
    setReplyCount(comment?._count?.replies || 0);
  }, [comment]);

  if (!comment) {
    return null; // Handle the case where comment is null or undefined
  }

  const handleLike = async () => {
    try {
      const likedByUser = await likeComment(comment.id, user?.id);
      if (likedByUser) {
        setIsLiked((prev) => !prev); // Toggle the like state
        setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1)); // Correctly update the like count based on the new state
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleReply = () => {
    setParentId?.(comment.id);
    console.log("Reply button clicked for comment", comment.id);
    // Add reply functionality here
  };

  return (
    <div key={comment.id} className="mb-4 p-4 ">
      <p className="">{comment.content}</p>
      <p className="text-[var(--dull)] text-sm">
        {comment.author?.name || "Unknown User"}
      </p>
      <p className="text-gray-500">
        {formatRelativeTime(new Date(comment.createdAt), true)}
      </p>
      <div className="flex items-center gap-4 mt-2">
        <ThemedIcon
          src={flame.src}
          alt="Likes"
          count={likeCount}
          onClick={handleLike}
          liked={isLiked}
        />
        <ThemedIcon
          src={commentText.src}
          alt="Replies"
          count={replyCount}
          onClick={handleReply}
        />
      </div>
    </div>
  );
}
