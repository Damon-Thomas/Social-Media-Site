"use client";

import { use } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  getCommentReplies,
  getEssentialComment,
} from "@/app/actions/commentActions";
import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { EssentialComment } from "@/app/lib/definitions";
import CommentCreator from "@/app/ui/posts/comments/CommentCreator";
import PostFlow from "@/app/ui/posts/PostFlow";
import CommentOnly from "@/app/ui/posts/comments/CommentOnly";

export default function CommentPage({
  params,
}: {
  params: Promise<{ commentId: string }>;
}) {
  const commentId = use(params).commentId;
  const [createCommentParentId, setCreateCommentParentId] = useState<
    string | null
  >(null); // State to track the parentId for creating comments

  // Main comment state
  const [comment, setComment] = useState<EssentialComment | null>(null);
  const [commentCount, setCommentCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  //   const [modalHidden, setModalHidden] = useState(true);

  // Optimistic replies (not yet in the backend)
  const [optimisticReplies, setOptimisticReplies] = useState<
    EssentialComment[]
  >([]);

  // Initial replies/cursor state (set only once per commentId)
  const [initialReplies, setInitialReplies] = useState<
    EssentialComment[] | null
  >(null);
  const [initialCursor, setInitialCursor] = useState<string | null>(null);

  // UI state for expanded/hidden replies
  const [expandedCommentId, setExpandedCommentId] = useState<string>("");

  // Fetch the main comment
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const com = await getEssentialComment(commentId);
        if (isMounted) setComment(com);
      } catch (error) {
        console.error("Error fetching comment:", error);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [commentId]);

  useEffect(() => {
    if (comment) {
      setCommentCount(comment._count?.replies || 0);
      setLikeCount(comment._count?.likedBy || 0);
    }
  }, [comment]);

  // Fetch initial replies ONCE per commentId
  useEffect(() => {
    let isMounted = true;
    async function fetchInitialReplies() {
      try {
        const { replies, nextCursor } = await getCommentReplies(commentId);
        console.log("Initial replies:", replies);
        if (isMounted) {
          setInitialReplies(replies);
          setInitialCursor(nextCursor ?? null);
        }
      } catch (error) {
        console.error("Error fetching initial replies:", error);
      }
    }
    fetchInitialReplies();
    return () => {
      isMounted = false;
    };
  }, [commentId]);

  // Infinite scroll for replies (only activate after initial replies loaded)
  const fetchMoreReplies = useCallback(
    async (cursor: string | null) => {
      console.log("Pre fetchMoreReplies");
      const { replies, nextCursor } = await getCommentReplies(
        commentId,
        cursor ?? undefined
      );
      console.log("Fetched replies:", replies);
      return { items: replies, nextCursor };
    },
    [commentId]
  );

  // Only call useInfiniteScroll after initialReplies is loaded
  const {
    items: replies,
    loading,
    observerTarget,
  } = useInfiniteScroll(
    initialReplies ?? [],
    initialReplies === null ? null : initialCursor,
    fetchMoreReplies
  );

  // Optimistically add a new reply to the top of the replies list
  const handleAddReply = (newReply: EssentialComment) => {
    setOptimisticReplies((prev) => [newReply, ...prev]);
  };

  // Helper for isLast
  function isLastReply(index: number, arr: EssentialComment[]) {
    return index === arr.length - 1;
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl px-4 border-x-[1px] border-[var(--borderc)]  py-8">
      {comment ? (
        <div className="">
          <CommentOnly
            comment={comment}
            // setHidden={setModalHidden}
            likeCount={likeCount}
            setLikeCount={setLikeCount}
            commentCount={commentCount}
            setCommentCount={setCommentCount}
          />

          {/* <p className="mb-2 text-lg">{comment.content}</p>
          <p className="text-sm text-[var(--dull)]">
            By: {comment.author?.name || "Unknown"} &middot;{" "}
            {new Date(comment.createdAt).toLocaleString()}
          </p> */}
          <CommentCreator
            postId={comment?.postId}
            parentId={commentId}
            // setComment={handleAddReply}
            placeholder="Write your reply..."
            className="w-full border-b border-b-[var(--borderc)]"
          />
        </div>
      ) : (
        <div className="text-center text-gray-500">Loading comment...</div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-2">Replies</h2>
        <div className="flex flex-col gap-2">
          {/* Optimistic replies (not yet in backend) */}
          {optimisticReplies.map((reply, idx) =>
            reply ? (
              <PostFlow
                key={`optimistic-${reply.id}`}
                comment={reply}
                postId={comment?.postId}
                // setParentId={setCreateCommentParentId}
                setExpandedCommentId={setExpandedCommentId}
                isLast={isLastReply(idx, optimisticReplies)}
                setCommentsInOrder={setOptimisticReplies}
                expandedCommentId={expandedCommentId}
                setTopCommentCount={setCommentCount}
              />
            ) : null
          )}
          {/* Replies from backend */}
          {replies.length === 0 &&
            optimisticReplies.length === 0 &&
            !loading && <p className="text-gray-500">No replies yet.</p>}
          {replies.map(
            (reply, idx) =>
              reply && (
                <PostFlow
                  key={reply.id}
                  comment={reply}
                  postId={comment?.postId}
                  //   setParentId={setCreateCommentParentId}
                  setExpandedCommentId={setExpandedCommentId}
                  isLast={isLastReply(idx, optimisticReplies)}
                  setCommentsInOrder={setOptimisticReplies}
                  expandedCommentId={expandedCommentId}
                  setTopCommentCount={setCommentCount}
                />
              )
          )}
          {loading && (
            <p className="text-center text-gray-400">Loading more replies...</p>
          )}
          <div ref={observerTarget} className="h-1" />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Add a reply</h3>
      </div>
    </div>
  );
}
