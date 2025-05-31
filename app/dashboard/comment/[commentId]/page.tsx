"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { useComment, useCommentReplies } from "@/app/hooks/useSWR";
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
  const [expandedCommentId, setExpandedCommentId] = useState<string>("");

  // Use SWR hooks for data fetching
  const {
    comment,
    isLoading: commentLoading,
    error: commentError,
  } = useComment(commentId);
  const {
    replies,
    isLoading: repliesLoading,
    error: repliesError,
  } = useCommentReplies(commentId);

  // Local state for UI
  const [commentCount, setCommentCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);

  // Update counts when comment data changes
  useEffect(() => {
    if (comment) {
      setCommentCount(comment._count?.replies || 0);
      setLikeCount(comment._count?.likedBy || 0);
    }
  }, [comment]);

  // Loading state
  if (commentLoading) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-3xl px-4 border-x-[1px] border-[var(--borderc)] py-8">
        <div className="text-center text-gray-500">Loading comment...</div>
      </div>
    );
  }

  // Error state
  if (commentError) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-3xl px-4 border-x-[1px] border-[var(--borderc)] py-8">
        <div className="text-center text-red-500">Error loading comment</div>
      </div>
    );
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
            setCommentCount={setCommentCount}
          />
        </div>
      ) : (
        <div className="text-center text-gray-500">Comment not found</div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-2">Replies</h2>
        <div className="flex flex-col gap-2">
          {replies.map((reply: EssentialComment, idx: number) =>
            reply ? (
              <PostFlow
                key={reply.id}
                comment={reply}
                postId={comment?.postId}
                setExpandedCommentId={setExpandedCommentId}
                isLast={idx === replies.length - 1}
                setCommentsInOrder={() => {
                  // Handle updates for nested replies
                  // SWR will handle the updates automatically
                }}
                expandedCommentId={expandedCommentId}
                setTopCommentCount={setCommentCount}
              />
            ) : null
          )}
          {repliesLoading && (
            <p className="text-center text-gray-400">Loading replies...</p>
          )}
          {repliesError && (
            <p className="text-center text-red-400">Error loading replies</p>
          )}
        </div>
      </div>
    </div>
  );
}
