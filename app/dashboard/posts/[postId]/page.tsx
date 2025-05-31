"use client";

import { EssentialComment } from "@/app/lib/definitions";
import CommentCreator from "@/app/ui/posts/comments/CommentCreator";
import PostFlow from "@/app/ui/posts/PostFlow";
import PostOnly from "@/app/ui/posts/PostOnly";
import { useState, useEffect, useMemo } from "react";
import { use } from "react";
import { usePost } from "@/app/hooks/useSWR";

export default function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = use(params); // Unwrap the params Promise

  // Use SWR hook for post data
  const { post, isLoading, error } = usePost(postId);

  // Local state for UI interactions
  const [commentCount, setCommentCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [expandedCommentId, setExpandedCommentId] = useState<string>("");

  // Derived state from SWR data
  const commentsInOrder = useMemo(() => {
    if (!post?.comments) return [];

    const topLevelComments = post.comments.filter(
      (comment: EssentialComment) => comment?.parentId === null
    );

    return topLevelComments.sort((a, b) => {
      const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // Sort in descending order
    });
  }, [post?.comments]);

  // Update counts when post data changes
  useEffect(() => {
    if (post) {
      setCommentCount(post.comments?.length || 0);
      setLikeCount(post.likedBy?.length || 0);
    }
  }, [post]);

  if (isLoading) {
    return (
      <div className="max-w-3xl h-full w-full mx-auto py-4 border-x-1 border-x-[var(--borderc)]">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--dmono)]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl h-full w-full mx-auto py-4 border-x-1 border-x-[var(--borderc)]">
        <div className="flex justify-center py-8">
          <p className="text-red-500">Error loading post: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl h-full w-full mx-auto py-4 border-x-1 border-x-[var(--borderc)]">
      <div className="flex flex-col w-full px-2 md:px-4">
        <PostOnly
          post={post || null}
          likeCount={likeCount}
          setLikeCount={setLikeCount}
          commentCount={commentCount}
          setCommentCount={setCommentCount}
        />

        <CommentCreator
          postId={postId}
          parentId={undefined}
          className="border-b border-b-[var(--borderc)]"
          setCommentCount={setCommentCount}
        />
        <h3 className="text-xl font-bold my-4">Comments</h3>
        <div className="overflow-auto">
          {Array.isArray(commentsInOrder) && commentsInOrder.length > 0 ? (
            commentsInOrder.map((comment: EssentialComment) => (
              <div className="flex flex-col" key={comment?.id}>
                <PostFlow
                  comment={comment}
                  setExpandedCommentId={setExpandedCommentId}
                  isLast={(comment?.replies?.length ?? 0) === 0}
                  postId={postId}
                  expandedCommentId={expandedCommentId}
                  setTopCommentCount={setCommentCount}
                />
              </div>
              // <div className="flex flex-col" key={comment?.id}>
              //   <CommentItem
              //     setParentId={setParentId}
              //     comment={comment}
              //     setExpandedCommentId={setExpandedCommentId} // Pass the setter
              //     isLast={(comment?.replies?.length ?? 0) === 0} // Pass the "isLast" prop
              //     setCommentsInOrder={setCommentsInOrder}
              //     postId={postId}
              //     expandedCommentId={expandedCommentId}
              //     anotherReply={
              //       replyIndex === 0 && (comment?.replies?.length ?? 0) > 1
              //     }
              //   />

              //   {comment?.replies && comment?.replies.length > 0 && (
              //     <div className="ml-8">
              //       {comment.replies.map(
              //         (reply: BasicComment, replyIndex: number) => (
              //           <CommentItem
              //             key={reply?.id}
              //             setParentId={setParentId}
              //             comment={reply}
              //             setExpandedCommentId={setExpandedCommentId} // Pass the setter
              //             isLast={
              //               replyIndex === (comment.replies?.length ?? 0) - 1
              //             } // Pass the "isLast" prop for replies
              //             setCommentsInOrder={setCommentsInOrder}
              //             postId={postId}
              //             setHidden={setModalHidden}
              //             expandedCommentId={expandedCommentId}
              //             continueLink={
              //               replyIndex < (comment.replies?.length ?? 0) - 1
              //             } // Simplified logic
              //           />
              //         )
              //       )}
              //     </div>
              //   )}
              // </div>
            ))
          ) : (
            <p className="text-[var(--dull)]">No comments yet.</p>
          )}
        </div>
        {/* <CommentModal
          postId={postId}
          setComment={setCommentsInOrder}
          hidden={modalHidden}
          setHidden={setModalHidden}
          parentId={parentId || undefined}
        ></CommentModal> */}
      </div>
    </div>
  );
}
