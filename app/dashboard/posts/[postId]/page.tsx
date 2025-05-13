"use client";

import { getfullPost } from "@/app/actions/postActions";
import { EssentialComment, FullPost } from "@/app/lib/definitions";
import PopDownComment from "@/app/ui/posts/comments/PopDownComment";
import CommentCreator from "@/app/ui/posts/comments/CommentCreator";
import CommentItem from "@/app/ui/posts/comments/CommentItem";
import CommentModal from "@/app/ui/posts/comments/CommentModal";
import PostOnly from "@/app/ui/posts/PostOnly";
import { useEffect, useState } from "react";
import { use } from "react";

export default function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = use(params); // Unwrap the params Promise

  const [post, setPost] = useState<FullPost | null>(null);
  const [modalHidden, setModalHidden] = useState(true);
  const [parentId, setParentId] = useState<string | null>(null); // Update parentId to use null for compatibility
  const [commentsInOrder, setCommentsInOrder] = useState<EssentialComment[]>(
    []
  );

  // State to track the currently expanded PopDownComment
  const [expandedCommentId, setExpandedCommentId] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await getfullPost(postId);
        setPost(data);
        const comments = data?.comments || [];
        const sortedComments = comments.sort((a, b) => {
          const dateA = a && a.createdAt && new Date(a.createdAt).getTime();
          const dateB = b && b.createdAt && new Date(b.createdAt).getTime();
          if (!dateA || !dateB) return 0; // Handle null or undefined dates
          return dateB - dateA; // Sort in descending order
        });
        setCommentsInOrder(sortedComments);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    }
    fetchPost();
  }, [postId]);

  return (
    <div className="max-w-3xl h-full w-full mx-auto py-4 border-x-1 border-x-[var(--borderc)]">
      <div className="flex flex-col w-full h-full overflow-hidden px-2 md:px-4">
        <PostOnly post={post} setHidden={setModalHidden} />

        <CommentCreator
          postId={postId}
          setComment={setCommentsInOrder}
          parentId={undefined}
          setHidden={setModalHidden}
          className="border-b border-b-[var(--borderc)]"
        />
        <h3 className="text-xl font-bold my-4">Comments</h3>
        <div className="overflow-auto">
          {Array.isArray(commentsInOrder) && commentsInOrder.length > 0 ? (
            commentsInOrder.map((comment: EssentialComment) => (
              <div className="flex flex-col " key={comment?.id}>
                <CommentItem
                  setParentId={setParentId}
                  comment={comment}
                  setExpandedCommentId={setExpandedCommentId} // Pass the setter
                />
                <PopDownComment
                  setComment={setCommentsInOrder}
                  postId={postId}
                  parentId={comment?.id}
                  setHidden={setModalHidden}
                  hidden={expandedCommentId !== comment?.id} // Hide if not expanded
                  creatorClassName="min-h-15"
                />
              </div>
            ))
          ) : (
            <p className="text-[var(--dull)]">No comments yet.</p>
          )}
        </div>
        <CommentModal
          postId={postId}
          setComment={setCommentsInOrder}
          hidden={modalHidden}
          setHidden={setModalHidden}
          parentId={parentId || undefined}
        ></CommentModal>
      </div>
    </div>
  );
}
