"use client";

import { isLikedByUser, likeComment } from "@/app/actions/commentActions";
import { BasicComment, EssentialComment } from "@/app/lib/definitions";
import { useDefaultProfileImage } from "@/app/utils/defaultProfileImage";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import flame from "@/public/flame.svg";
import commentText from "@/public/comment.svg";
import ThemedIcon from "../core/ThemedIcon";
import { useCurrentUser } from "@/app/context/UserContext";
import { formatRelativeTime } from "@/app/utils/formatRelativeTime";
import PopDownComment from "./comments/PopDownComment";
import Link from "next/link";

function ReplyFlow({
  comment,
  setParentId,
  setExpandedCommentId,
  isLast = true,
  setCommentsInOrder,
  postId,
  setHidden,
  expandedCommentId,
  setCloseCreator,
  setTopCommentCount,
}: {
  comment: BasicComment | null;
  setParentId?: React.Dispatch<React.SetStateAction<string | null>>;
  setExpandedCommentId?: React.Dispatch<React.SetStateAction<string>>;
  isLast?: boolean;
  setCommentsInOrder?: React.Dispatch<React.SetStateAction<EssentialComment[]>>;
  postId: string | null | undefined;
  setHidden?: React.Dispatch<React.SetStateAction<boolean>>;
  expandedCommentId?: string | null;
  setCloseCreator?: React.Dispatch<React.SetStateAction<string>>;
  setTopCommentCount?: React.Dispatch<React.SetStateAction<number>>;
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
      setIsLiked(likedByUser || false);
    }

    checkIfLiked();
  }, [comment, user]); // Include full objects in the dependency array

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
    setParentId?.(comment?.id || "");
    if (expandedCommentId !== comment?.id) {
      setExpandedCommentId?.(comment?.id || "");
    } else {
      setExpandedCommentId?.("");
    }
  };

  return (
    <div className=" relative">
      <div
        className={`${
          isLast ? "z-10 bg-[var(--rdmono)]" : ""
        } w-[24px] sm:w-[32px] h-full z-10 absolute -left-[24px] sm:-left-[32px] top-0`}
      ></div>
      <div className="grid grid-cols-[24px_minmax(0,1fr)]  sm:grid-cols-[32px_minmax(0,1fr)]  relative">
        <div className="here absolute top-0 z-20 -left-[12px] sm:-left-[16px] w-[12px] sm:w-[16px] h-4 border-b-[1px] border-l-[1px] border-[var(--dull)] rounded-bl-xl"></div>

        <Link href={`/dashboard/profile/${comment?.authorId}`}>
          <Image
            src={comment?.author?.image || defaultProfileImage}
            alt="Post Image"
            width={24}
            height={24}
            className="rounded-full w-full h-auto"
          />
        </Link>
        <Link
          href={`/dashboard/comment/${comment?.id}`}
          className="flex items-center"
        >
          <h1 className="ml-4 flex items-center"> {comment?.author?.name}</h1>
        </Link>
      </div>
      <div className="grid grid-cols-[24px_1fr] relative sm:grid-cols-[32px_1fr] ">
        <div className=" grid grid-cols-2">
          {expandedCommentId === comment?.id && (
            <>
              <div className=""></div>
              <div className="border-l-[1px] border-[var(--dull)]"></div>
            </>
          )}
        </div>
        <div className={`commentContent px-2 pb-4  w-full h-full`}>
          <Link href={`/dashboard/comment/${comment?.id}`}>
            <p className="whitespace-pre-wrap">{comment?.content}</p>
          </Link>
          <div className="flex items-center gap-4 mt-2 justify-between">
            <div className="flex">
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
            <p className="text-[var(--dull)] text-sm">
              {comment?.createdAt &&
                formatRelativeTime(new Date(comment?.createdAt), true)}
            </p>
          </div>

          <div className=""> </div>
        </div>
      </div>
      <div className="grid grid-cols-[24px_1fr] relative sm:grid-cols-[32px_1fr]">
        <div className={` relative   grid grid-cols-2  `}></div>
        <div className="commentContent  z-10 w-full h-full">
          <PopDownComment
            setComment={setCommentsInOrder}
            postId={postId}
            parentId={comment?.id}
            setHidden={setHidden}
            hidden={expandedCommentId !== comment?.id} // Hide if not expanded
            creatorClassName="min-h-15 ml-8 pl-2"
            setCloseCreator={setCloseCreator}
            setCommentCount={setReplyCount}
            setTopCommentCount={setTopCommentCount}
            chained={true}
          />
        </div>
      </div>
    </div>
  );
}

export default function PostFlow({
  comment,
  setParentId,
  setExpandedCommentId,
  isLast = true,
  setCommentsInOrder,
  postId,
  setHidden,
  expandedCommentId,
  setTopCommentCount,
}: {
  comment: EssentialComment | null;
  setParentId?: React.Dispatch<React.SetStateAction<string | null>>;
  setExpandedCommentId?: React.Dispatch<React.SetStateAction<string>>;
  isLast?: boolean;
  setCommentsInOrder?: React.Dispatch<React.SetStateAction<EssentialComment[]>>;
  postId: string | null | undefined;
  hidden?: boolean;
  setHidden?: React.Dispatch<React.SetStateAction<boolean>>;
  expandedCommentId?: string | null;
  setTopCommentCount?: React.Dispatch<React.SetStateAction<number>>;
}) {
  const user = useCurrentUser();
  const [likeCount, setLikeCount] = useState(comment?._count?.likedBy || 0);
  const [replyCount, setReplyCount] = useState(comment?._count?.replies || 0);
  const [isLiked, setIsLiked] = useState(false);
  const defaultProfileImage = useDefaultProfileImage();
  const [activeCommentId, setActiveCommentId] = useState<boolean>(false);

  useEffect(() => {
    if (!comment || !user) return; // Early exit if dependencies are null

    async function checkIfLiked() {
      const likedByUser = await isLikedByUser(user?.id, comment?.id);
      setIsLiked(likedByUser || false);
    }

    checkIfLiked();
  }, [comment, user]); // Include full objects in the dependency array

  useEffect(() => {
    setLikeCount(comment?._count?.likedBy || 0);
    setReplyCount(comment?._count?.replies || 0);
  }, [comment]);

  useEffect(() => {
    setActiveCommentId(expandedCommentId === comment?.id);
  }, [expandedCommentId, comment?.id]);

  if (!comment) {
    return null; // Handle the case where comment is null or undefined
  }

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
    if (expandedCommentId !== comment?.id) {
      setExpandedCommentId?.(comment?.id || "");
    } else {
      setExpandedCommentId?.("");
    }
    // Add reply functionality here
  };

  return (
    <div className="w-full h-full">
      {" "}
      {/* <= temp container dimensions*/}
      <div className="grid grid-cols-[24px_minmax(0,1fr)]  sm:grid-cols-[32px_minmax(0,1fr)]">
        <Link href={`/dashboard/profile/${comment?.authorId}`}>
          <Image
            src={comment?.author?.image || defaultProfileImage}
            alt="Post Image"
            width={24}
            height={24}
            className="rounded-full w-full h-auto"
          />
        </Link>
        <Link
          href={`/dashboard/comment/${comment?.id}`}
          className="flex items-center"
        >
          <h1 className="ml-4 flex items-center"> {comment?.author?.name}</h1>
        </Link>
      </div>
      <div className="grid grid-cols-[24px_1fr] relative sm:grid-cols-[32px_1fr] ">
        <div
          className={`grid grid-cols-2 HERERER ${expandedCommentId === postId}`}
        >
          {((comment?.replies?.length ?? 0) > 0 || activeCommentId) && (
            <>
              <div className=""></div>
              <div className="border-l-[1px] border-[var(--dull)]"></div>
            </>
          )}
        </div>
        <div className="commentContent px-2 pb-4  w-full h-full">
          <div className="flex flex-col grow">
            <Link href={`/dashboard/comment/${comment?.id}`}>
              <p className="whitespace-pre-wrap">{comment?.content}</p>
            </Link>
            <div className="flex items-center gap-4 mt-2 justify-between">
              <div className="flex">
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
              <p className="text-[var(--dull)] text-sm">
                {comment?.createdAt &&
                  formatRelativeTime(new Date(comment?.createdAt), true)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[24px_1fr] relative sm:grid-cols-[32px_1fr]">
        <div className={` relative  grid grid-cols-2 `}>
          {(comment?.replies?.length ?? 0) > 0 && !isLast && (
            <>
              <div className=""></div>
              <div
                className={`${
                  isLast ? "" : "border-l-[1px] border-[var(--dull)]"
                }`}
              ></div>
              <div className="absolute top-0 z-0 left-1/2 w-full h-4 border-b-[1px] border-l-[1px] border-[var(--dull)] rounded-bl-xl"></div>
            </>
          )}
        </div>
        <div className="commentContent  z-10 w-full h-full">
          <PopDownComment
            setComment={setCommentsInOrder}
            postId={postId}
            parentId={comment?.id}
            setHidden={setHidden}
            hidden={expandedCommentId !== comment?.id} // Hide if not expanded
            creatorClassName="min-h-15 ml-8 pl-2"
            setCloseCreator={setExpandedCommentId}
            setCommentCount={setReplyCount}
            setTopCommentCount={setTopCommentCount}
            chained={true}
          />
          {comment?.replies?.map((reply: BasicComment, replyIndex: number) => (
            <ReplyFlow
              key={reply?.id}
              comment={reply}
              setParentId={setParentId}
              setCommentsInOrder={setCommentsInOrder}
              postId={postId}
              setHidden={setHidden}
              expandedCommentId={expandedCommentId}
              setExpandedCommentId={setExpandedCommentId}
              isLast={replyIndex === (comment?.replies?.length ?? 0) - 1}
              setCloseCreator={setExpandedCommentId}
              setTopCommentCount={setTopCommentCount}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
