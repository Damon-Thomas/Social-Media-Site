"use client";

import { use } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  getBasicComment,
  getCommentReplies,
} from "@/app/actions/commentActions";
import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { BasicComment, EssentialComment } from "@/app/lib/definitions";
import CommentCreator from "@/app/ui/posts/comments/CommentCreator";
import PostFlow from "@/app/ui/posts/PostFlow";

export default function CommentPage({
  params,
}: {
  params: Promise<{ commentId: string }>;
}) {
  // Unwrap params and get commentId
  const commentId = use(params).commentId;

  // State for the main comment
  const [comment, setComment] = useState<BasicComment | null>(null);

  // Optimistic replies (not yet in the backend)
  const [optimisticReplies, setOptimisticReplies] = useState<
    EssentialComment[]
  >([]);

  // Infinite scroll for replies
  const [initialReplies] = useState<BasicComment[]>([]);
  const [initialCursor] = useState<string | null>(null);

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

  const {
    items: replies,
    loading,
    observerTarget,
  } = useInfiniteScroll(initialReplies, initialCursor, fetchMoreReplies);

  // Fetch the main comment on mount or when commentId changes
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const com = await getBasicComment(commentId);
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

  // Optimistically add a new reply to the top of the replies list
  const handleAddReply = (newReply: EssentialComment) => {
    setOptimisticReplies((prev) => [newReply, ...prev]);
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold">Comment</h1>
      {comment ? (
        <div className="border rounded p-4 bg-white">
          <p className="mb-2 text-lg">{comment.content}</p>
          <p className="text-sm text-gray-500">
            By: {comment.author?.name || "Unknown"} &middot;{" "}
            {new Date(comment.createdAt).toLocaleString()}
          </p>
        </div>
      ) : (
        <div className="text-center text-gray-500">Loading comment...</div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-2">Replies</h2>
        <div className="flex flex-col gap-2">
          {/* Optimistic replies (not yet in backend) */}
          {optimisticReplies.map((reply) =>
            reply ? (
              <PostFlow
                key={`optimistic-${reply.id}`}
                comment={reply}
                postId={comment?.postId}
              />
            ) : null
          )}
          {/* Replies from backend */}
          {replies.length === 0 &&
            optimisticReplies.length === 0 &&
            !loading && <p className="text-gray-500">No replies yet.</p>}
          {replies.map(
            (reply) =>
              reply && (
                <PostFlow
                  key={reply.id}
                  comment={reply}
                  postId={comment?.postId}
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
        <CommentCreator
          postId={comment?.postId}
          parentId={commentId}
          setComment={handleAddReply}
          placeholder="Write your reply..."
          className="w-full"
        />
      </div>
    </div>
  );
}
