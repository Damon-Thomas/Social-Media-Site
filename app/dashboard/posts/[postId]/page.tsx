"use client";

import { getfullPost } from "@/app/actions/postActions";
import { EssentialComment, FullPost } from "@/app/lib/definitions";
import CommentCreator from "@/app/ui/posts/comments/CommentCreator";
import CommentItem from "@/app/ui/posts/comments/CommentItem";
import CommentModal from "@/app/ui/posts/comments/CommentModal";
import PostOnly from "@/app/ui/posts/PostOnly";
import { useEffect, useState } from "react";
import { use } from "react";
// import { set } from "zod";

// Removed ExtendedPost in favor of FullPost

// Explicitly type `comment` and `reply` in map functions
// const transformToFullPost = (post: FullPost | null): FullPost | null => {
//   if (!post) return null;
//   return {
//     ...post,
//     authorId: post.authorId || "", // Ensure authorId is a string
//     comments: post.comments.map((comment: FullPost["comments"][number]) => ({
//       ...comment,
//       authorId: comment.authorId || "", // Ensure authorId is a string
//       author: comment.author || { id: "", name: "", image: null },
//       replies: comment.replies.map(
//         (reply: FullPost["comments"][number]["replies"][number]) => ({
//           ...reply,
//           authorId: reply.authorId || "", // Ensure authorId is a string
//           author: reply.author || { id: "", name: "", image: null },
//         })
//       ),
//     })),
//   };
// };

// Adjust transformation logic to ensure compatibility
// const transformToFullPostBack = (post: FullPost | null): FullPost | null => {
//   if (!post) return null;
//   return {
//     ...post,
//     authorId: post.authorId || null, // Convert empty string back to null
//     comments: post.comments.map((comment) => ({
//       ...comment,
//       authorId: comment.authorId || null, // Convert empty string back to null
//       author: comment.author || null,
//       replies: comment.replies.map((reply) => ({
//         ...reply,
//         authorId: reply.authorId || null, // Convert empty string back to null
//         author: reply.author || null,
//       })),
//     })),
//   };
// };

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
  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await getfullPost(postId);
        // const transformedPost = transformToFullPost(data);
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
        />
        <h3 className="text-xl font-bold my-4">Comments</h3>
        <div className="overflow-auto">
          {Array.isArray(commentsInOrder) && commentsInOrder.length > 0 ? (
            commentsInOrder.map((comment: EssentialComment) => (
              <CommentItem
                setParentId={setParentId}
                comment={comment}
                key={comment?.id}
              />
            ))
          ) : (
            <p className="text-[var(--dull)]">No comments yet.</p>
          )}
        </div>
        <CommentModal
          postId={postId}
          setPost={setPost}
          hidden={modalHidden}
          setHidden={setModalHidden}
          parentId={parentId || undefined} // Explicitly convert null to undefined
        ></CommentModal>
      </div>
    </div>
  );
}
