"use client";

import { EssentialComment } from "@/app/lib/definitions";
import { formatRelativeTime } from "@/app/utils/formatRelativeTime";
import ThemedIcon from "@/app/ui/core/ThemedIcon";
import flame from "@/public/flame.svg";
import commentText from "@/public/comment.svg";
import { isLikedByUser, likeComment } from "@/app/actions/commentActions";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/app/context/UserContext";
import Image from "next/image";
import { useDefaultProfileImage } from "@/app/utils/defaultProfileImage";
import PopDownComment from "./PopDownComment";
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
  setExpandedCommentId,
  isLast = true,
  setCommentsInOrder,
  postId,
  setHidden,
  expandedCommentId,
  continueLink = false,
  anotherReply = false,
}: {
  comment: CommentWithCount | null;
  setParentId?: React.Dispatch<React.SetStateAction<string | null>>;
  setExpandedCommentId?: React.Dispatch<React.SetStateAction<string | null>>;
  isLast?: boolean;
  setCommentsInOrder?: React.Dispatch<React.SetStateAction<EssentialComment[]>>;
  postId: string | null | undefined;
  hidden?: boolean;
  setHidden?: React.Dispatch<React.SetStateAction<boolean>>;
  expandedCommentId?: string | null;
  continueLink?: boolean;
  anotherReply?: boolean;
}) {
  const user = useCurrentUser();
  const [likeCount, setLikeCount] = useState(comment?._count?.likedBy || 0);
  const [replyCount, setReplyCount] = useState(comment?._count?.replies || 0);
  const [isLiked, setIsLiked] = useState(false);
  const defaultProfileImage = useDefaultProfileImage();

  useEffect(() => {
    if (!comment || !user) return; // Early exit if dependencies are null

    async function checkIfLiked() {
      const likedByUser = await isLikedByUser(user?.id, comment?.id);
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
    setExpandedCommentId?.(comment.id);
    console.log("Reply button clicked for comment", comment.id);
    // Add reply functionality here
  };

  return (
    <>
      <div key={comment.id} className={`py-2 px-4 flex w-full items-center`}>
        <div className="w-fit relative shrink-0">
          <Image
            src={comment.author?.image || defaultProfileImage}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full mx-2 h-fit z-10 relative"
          />
          {(!isLast || expandedCommentId === comment?.id) && (
            <div className="z-0 absolute -bottom-17 left-1/2 h-18 w-5 border-l-1 border-b-1 border-[var(--dull)] rounded-bl-lg"></div>
          )}
        </div>
        <div className="flex flex-col grow">
          <div className="flex gap-4 items-center mt-2 ">
            <p className="text-[var(--dull)] text-sm font-bold">
              {comment.author?.name || "Unknown User"}
            </p>

            <p className="text-[var(--dull)] text-sm">
              {formatRelativeTime(new Date(comment.createdAt), true)}
            </p>
          </div>
          <p className="">{comment.content}</p>
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
      </div>
      <div className="">
        <PopDownComment
          setComment={setCommentsInOrder}
          postId={postId}
          parentId={comment?.id}
          setHidden={setHidden}
          hidden={expandedCommentId !== comment?.id} // Hide if not expanded
          creatorClassName="min-h-15 ml-8 pl-2"
          continueLink={continueLink}
          anotherReply={anotherReply}
        />
      </div>
    </>
  );
}
