"use client";

import { getfullPost } from "@/app/actions/postActions";
import { Post } from "@/app/lib/definitions";
import CommentCreator from "@/app/ui/posts/comments/CommentCreator";
import CommentItem from "@/app/ui/posts/comments/CommentItem";
import PostOnly from "@/app/ui/posts/PostOnly";
import { useEffect, useState } from "react";
import { use } from "react";

export default function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = use(params); // Unwrap the params Promise

  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await getfullPost(postId);
        console.log("Fetched post:", data);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    }

    fetchPost();
  }, [postId]);

  return (
    <div className="max-w-3xl w-full mx-auto py-6">
      <PostOnly post={post} />
      <div className="">
        <CommentCreator setPost={setPost} postId={postId} />
        <h3 className="text-xl font-bold mb-4">Comments</h3>
        {post?.comments?.length ? (
          post.comments.map((comment) => (
            <CommentItem comment={comment} key={comment?.id} />
          ))
        ) : (
          <p className="text-[var(--dull)]">No comments yet.</p>
        )}
      </div>
    </div>
  );
}
