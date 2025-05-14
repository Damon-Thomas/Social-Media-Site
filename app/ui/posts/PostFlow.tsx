"use client";

import { getEssentialComment, likeComment } from "@/app/actions/commentActions";
import { BasicComment, EssentialComment } from "@/app/lib/definitions";
import { useDefaultProfileImage } from "@/app/utils/defaultProfileImage";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import flame from "@/public/flame.svg";
import commentText from "@/public/comment.svg";
import ThemedIcon from "../core/ThemedIcon";
import { useCurrentUser } from "@/app/context/UserContext";
import { formatRelativeTime } from "@/app/utils/formatRelativeTime";

function ReplyFlow({
  reply,
  editing,
  setEditing,
  handleLike,
  handleReply,
  setExpandedCommentId,
  isLiked,
}: {
  reply: BasicComment;
  editing?: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const defaultProfile = useDefaultProfileImage();
  return (
    <div className=" h-full">
      <div className="grid grid-cols-[24px_minmax(0,1fr)]  sm:grid-cols-[32px_minmax(0,1fr)] bg-amber-300">
        <Image
          src={reply?.author?.image || defaultProfile}
          alt="Post Image"
          width={24}
          height={24}
          className="rounded-full w-full h-auto"
        />
        <h1 className="ml-4 flex items-center"> {reply?.author?.name}</h1>
      </div>
      <div className="grid grid-cols-[24px_1fr] relative sm:grid-cols-[32px_1fr] ">
        <div className="bg-amber-200 grid grid-cols-2">
          {editing && (
            <>
              <div className=""></div>
              <div className="border-l-[1px] border-[var(--dull)]"></div>
            </>
          )}
        </div>
        <div className="commentContent p-2 bg-cyan-300 w-full h-full">
          <p className="">{reply?.content}</p>
          <div className="flex items-center gap-4 mt-2 justify-between">
            <div className="flex">
              <ThemedIcon
                src={flame.src}
                alt="Likes"
                count={reply?._count?.likedBy ?? 0}
                onClick={handleLike}
                liked={isLiked}
              />
              <ThemedIcon
                src={commentText.src}
                alt="Replies"
                count={reply?._count?.replies ?? 0}
                onClick={handleReply}
              />
            </div>
            <p className="text-[var(--dull)] text-sm">
              {reply?.createdAt &&
                formatRelativeTime(new Date(reply?.createdAt), true)}
            </p>
          </div>
          <div className=""></div>
        </div>
      </div>
      <div className="grid grid-cols-[24px_1fr] relative sm:grid-cols-[32px_1fr]  min-h-96">
        <div className="bg-amber-100 relative  grid grid-cols-2">
          {editing && (
            <div className="absolute top-0 z-0 left-1/2 w-full h-5 border-b-[1px] border-l-[1px] border-[var(--dull)] rounded-bl-xl"></div>
          )}
        </div>
        <div className="commentContent bg-cyan-500 z-10 w-full h-full"></div>
      </div>
    </div>
  );
}

export default function PostFlow({ comment }: { comment: EssentialComment }) {
  const defaultProfile = useDefaultProfileImage();
  const [parentId, setParentId] = useState<string | null>(null);
  const user = useCurrentUser();
  const [likeCount, setLikeCount] = useState(comment?._count?.likedBy || 0);
  const [replyCount, setReplyCount] = useState(comment?._count?.replies || 0);
  const [isLiked, setIsLiked] = useState(false);
  const defaultProfileImage = useDefaultProfileImage();

  const handleLike = async () => {
    try {
      const likedByUser = await likeComment(comment?.id || "", user?.id);
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
    <div className="w-xl h-full">
      {" "}
      {/* <= temp container dimensions*/}
      <div className="grid grid-cols-[24px_minmax(0,1fr)]  sm:grid-cols-[32px_minmax(0,1fr)] bg-amber-300">
        <Image
          src={comment?.author?.image || defaultProfile}
          alt="Post Image"
          width={24}
          height={24}
          className="rounded-full w-full h-auto"
        />
        <h1 className="ml-4 flex items-center"> {comment?.author?.name}</h1>
      </div>
      <div className="grid grid-cols-[24px_1fr] relative sm:grid-cols-[32px_1fr] ">
        <div className="bg-amber-200 grid grid-cols-2">
          {(comment?.replies?.length ?? 0) > 0 && (
            <>
              <div className=""></div>
              <div className="border-l-[1px] border-[var(--dull)]"></div>
            </>
          )}
        </div>
        <div className="commentContent p-2 bg-cyan-300 w-full h-full">
          <div className="flex flex-col grow">
            <p className="">{comment?.content}</p>
            <div className="flex items-center gap-4 mt-2 justify-between">
              <div className="flex">
                <ThemedIcon
                  src={flame.src}
                  alt="Likes"
                  count={comment?.likedBy?.length || 0}
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
              <p className="text-[var(--dull)] text-sm">
                {comment?.createdAt &&
                  formatRelativeTime(new Date(comment?.createdAt), true)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[24px_1fr] relative sm:grid-cols-[32px_1fr]  min-h-96">
        <div className="bg-amber-100 relative  grid grid-cols-2">
          <div className="absolute top-0 z-0 left-1/2 w-full h-4 border-b-[1px] border-l-[1px] border-[var(--dull)] rounded-bl-xl"></div>
        </div>
        <div className="commentContent bg-cyan-500 z-10 w-full h-full">
          {comment?.replies?.map((reply: BasicComment) => (
            <ReplyFlow
              key={reply?.id}
              reply={reply}
              setEditing={() => {}}
              handleLike={handleLike}
              handleReply={handleReply}
              setExpandedCommentId={}
              isLiked={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
