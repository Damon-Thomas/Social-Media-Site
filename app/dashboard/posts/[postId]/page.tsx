"use client";

import { getfullPost } from "@/app/actions/postActions";
import { Post } from "@/app/lib/definitions";
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
    <div className="max-w-3xl mx-auto py-8">
      {/* Post content here */}
      <p className="text-gray-700 mb-4">
        {post?.content || "Post content here."}
      </p>
      <p className="text-gray-500 mb-4">
        Posted by {post?.author?.name || "Unkown Name"}
      </p>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Comments</h3>
        {post?.comments?.length ? (
          post.comments.map((comment) => (
            <div key={comment.id} className="mb-4 p-4 border rounded">
              <p className="text-gray-700">{comment.content}</p>
              <p className="text-gray-500">
                Commented by {comment.author?.name || "Unknown User"}
              </p>
              <p className="text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-500">{comment._count?.likedBy} Likes</p>
              <p className="text-gray-500">{comment._count?.replies} Replies</p>

              <div className="flex items-center mt-2">
                <button className="text-blue-500 hover:underline">Like</button>
                <button className="text-blue-500 hover:underline ml-4">
                  Reply
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>
    </div>
  );
}
