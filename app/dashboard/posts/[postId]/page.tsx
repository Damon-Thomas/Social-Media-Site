"use client";

import { Post } from "@/app/lib/definitions";
import { useEffect, useState } from "react";

export default function PostPage({ params }: { params: { postId: string } }) {
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/posts/${params.postId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    }

    fetchPost();
  }, [params.postId]);

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Post content here */}
      <h1 className="text-2xl font-bold mb-4">{post?.title || "Post Title"}</h1>
      <p className="text-gray-700 mb-4">
        {post?.content || "Post content here."}
      </p>
      <p className="text-gray-500 mb-4">
        Posted by {post?.author || "User Name"}
      </p>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Comments</h3>
        {/* Add your CommentSection component here */}
      </div>
    </div>
  );
}
