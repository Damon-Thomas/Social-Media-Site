"use client";

import { use } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  // const [createCommentParentId, setCreateCommentParentId] = useState<
  //   string | null
  // >(null);
  const [comment, setComment] = useState<EssentialComment | null>(null);
  const [commentCount, setCommentCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [optimisticReplies, setOptimisticReplies] = useState<
    EssentialComment[]
  >([]);
  const [initialReplies, setInitialReplies] = useState<
    EssentialComment[] | null
  >(null);
  const [initialCursor, setInitialCursor] = useState<string | null>(null);
  const [expandedCommentId, setExpandedCommentId] = useState<string>("");

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

  useEffect(() => {
    let isMounted = true;
    async function fetchInitialReplies() {
      try {
        const { replies, nextCursor } = await getCommentReplies(commentId);
        console.log("Initial replies:", replies);
        if (isMounted) {
          setInitialReplies((prev) =>
            JSON.stringify(prev) === JSON.stringify(replies) ? prev : replies
          );
          setInitialCursor((prev) => (prev === nextCursor ? prev : nextCursor));
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

  const fetchMoreReplies = useCallback(
    async (cursor: string | null) => {
      console.log("Fetching more replies with cursor:", cursor);
      const { replies, nextCursor } = await getCommentReplies(
        commentId,
        cursor ?? undefined
      );
      console.log("Fetched replies:", replies);
      return { items: replies, nextCursor };
    },
    [commentId]
  );

  const memoizedInitialReplies = useMemo(
    () => initialReplies,
    [initialReplies]
  );
  const memoizedInitialCursor = useMemo(() => initialCursor, [initialCursor]);

  const {
    items: replies,
    loading,
    observerTarget,
  } = useInfiniteScroll(
    memoizedInitialReplies ?? [],
    memoizedInitialCursor,
    fetchMoreReplies
  );

  // const handleAddReply = (newReply: EssentialComment) => {
  //   setOptimisticReplies((prev) => [newReply, ...prev]);
  // };

  function isLastReply(index: number, arr: EssentialComment[]) {
    return index === arr.length - 1;
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl px-4 border-x-[1px] border-[var(--borderc)] py-8">
      {comment ? (
        <div>
          <CommentOnly
            comment={comment}
            likeCount={likeCount}
            setLikeCount={setLikeCount}
            commentCount={commentCount}
            setCommentCount={setCommentCount}
          />
          <CommentCreator
            postId={comment?.postId}
            parentId={commentId}
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
          {optimisticReplies.map((reply, idx) =>
            reply ? (
              <PostFlow
                key={`optimistic-${reply.id}`}
                comment={reply}
                postId={comment?.postId}
                setExpandedCommentId={setExpandedCommentId}
                isLast={isLastReply(idx, optimisticReplies)}
                setCommentsInOrder={setOptimisticReplies}
                expandedCommentId={expandedCommentId}
                setTopCommentCount={setCommentCount}
              />
            ) : null
          )}
          {replies.map((reply, idx) =>
            reply ? (
              <PostFlow
                key={reply.id}
                comment={reply}
                postId={comment?.postId}
                setExpandedCommentId={setExpandedCommentId}
                isLast={isLastReply(idx, replies)}
                setCommentsInOrder={setOptimisticReplies}
                expandedCommentId={expandedCommentId}
                setTopCommentCount={setCommentCount}
              />
            ) : null
          )}
          {loading && (
            <p className="text-center text-gray-400">Loading more replies...</p>
          )}
          <div ref={observerTarget} className="h-1" />
        </div>
      </div>
    </div>
  );
}
