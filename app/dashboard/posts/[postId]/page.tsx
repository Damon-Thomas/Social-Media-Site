"use client";

import { getfullPost } from "@/app/actions/postActions";
import { FullPost } from "@/app/lib/definitions";
import CommentCreator from "@/app/ui/posts/comments/CommentCreator";
import CommentItem from "@/app/ui/posts/comments/CommentItem";
import CommentModal from "@/app/ui/posts/comments/CommentModal";
import PostOnly from "@/app/ui/posts/PostOnly";
import { useEffect, useState } from "react";
import { use } from "react";

// Define a standalone type for ExtendedPost
interface ExtendedPost {
  id: string;
  content: string | null;
  authorId: string;
  author: {
    id: string;
    name: string;
    image: string | null;
  } | null;
  comments: {
    id: string;
    content: string;
    authorId: string;
    author: {
      id: string;
      name: string;
      image: string | null;
    };
    createdAt: Date;
    updatedAt: Date;
    _count: {
      likedBy: number;
      replies: number;
    };
    replies: {
      id: string;
      content: string;
      authorId: string;
      author: {
        id: string;
        name: string;
        image: string | null;
      };
      createdAt: Date;
      updatedAt: Date;
      _count: {
        likedBy: number;
        replies: number;
      };
    }[];
  }[];
  likedBy: {
    id: string;
    name: string;
    image: string | null;
  }[];
  _count: {
    comments: number;
    likedBy: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Transform FullPost to ExtendedPost before passing to CommentCreator
const transformToExtendedPost = (
  post: FullPost | null
): ExtendedPost | null => {
  if (!post) return null;
  return {
    ...post,
    authorId: post.authorId || "", // Ensure authorId is a string
    comments: post.comments.map((comment) => ({
      ...comment,
      authorId: comment.authorId || "", // Ensure authorId is a string
      author: comment.author || { id: "", name: "", image: null },
      replies: comment.replies.map((reply) => ({
        ...reply,
        authorId: reply.authorId || "", // Ensure authorId is a string
        author: reply.author || { id: "", name: "", image: null },
      })),
    })),
  };
};

// Adjust transformation logic to ensure compatibility
const transformToFullPost = (post: ExtendedPost | null): FullPost | null => {
  if (!post) return null;
  return {
    ...post,
    authorId: post.authorId || null, // Convert empty string back to null
    comments: post.comments.map((comment) => ({
      ...comment,
      authorId: comment.authorId || null, // Convert empty string back to null
      author: comment.author || null,
      replies: comment.replies.map((reply) => ({
        ...reply,
        authorId: reply.authorId || null, // Convert empty string back to null
        author: reply.author || null,
      })),
    })),
  };
};

export default function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = use(params); // Unwrap the params Promise

  const [post, setPost] = useState<ExtendedPost | null>(null);
  const [modalHidden, setModalHidden] = useState(true);
  const [parentId, setParentId] = useState<string | null>(null); // Update parentId to use null for compatibility

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await getfullPost(postId);
        console.log("Fetched post:", data);

        // Transform FullPost to ExtendedPost
        const transformedPost = data
          ? {
              ...data,
              authorId: data.authorId || "", // Ensure authorId is a string
              comments: data.comments.map((comment) => ({
                ...comment,
                authorId: comment.authorId || "", // Ensure authorId is a string
                author: comment.author || { id: "", name: "", image: null },
                replies: comment.replies.map((reply) => ({
                  ...reply,
                  authorId: reply.authorId || "", // Ensure authorId is a string
                  author: reply.author || { id: "", name: "", image: null },
                })),
              })),
            }
          : null;

        setPost(transformedPost as ExtendedPost | null); // Explicitly cast to ExtendedPost
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
          setPost={(updatedPost) => {
            setPost((prevPost) => {
              const transformedPost = transformToFullPost(updatedPost);
              if (!prevPost || !transformedPost) return prevPost;
              return {
                ...prevPost,
                ...transformedPost,
              };
            });
          }}
          parentId={parentId || undefined} // Convert null to undefined
          setHidden={setModalHidden}
        />
        <h3 className="text-xl font-bold my-4">Comments</h3>
        <div className="overflow-auto">
          {post?.comments?.length ? (
            post.comments.map((comment: ExtendedPost["comments"][number]) => (
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
          parentId={parentId}
        ></CommentModal>
      </div>
    </div>
  );
}
