import { createComment } from "@/app/actions/commentActions";
import { useCurrentUser } from "@/app/context/UserContext";
import { Post, Comment } from "@/app/lib/definitions";

import { useActionState } from "react";

export default function CommentCreator({
  postId,
  setPost,
  parentId,
}: {
  postId: string;
  setPost?: React.Dispatch<React.SetStateAction<Post | null>>;
  parentId?: string; // Optional parentId for nested comments
}) {
  const user = useCurrentUser(); // Get the current user from context

  const createCommentWrapper = async (
    state: { errors?: { content?: string[] }; message?: string } | undefined,
    payload: FormData
  ) => {
    if (!user?.id) {
      throw new Error("User ID is required");
    }

    // Add postId, userId, and parentId to the FormData
    payload.append("postId", postId);
    payload.append("userId", user.id);
    if (parentId) {
      payload.append("parentId", parentId);
    }

    const result = await createComment({ state, payload, userId: user.id });

    // If the comment is successfully created, update the post state
    if (!result?.errors && setPost) {
      const newComment: Comment = {
        id: crypto.randomUUID(), // Temporary ID until the server returns the real one
        content: payload.get("content")?.toString() || "",
        author: {
          id: user.id,
          name: user.name,
          image: user.image,
          email: "", // Add missing properties to match the Comment type
          createdAt: new Date(),
          updatedAt: new Date(),
          bio: null, // Add missing properties to match the Comment type
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        likedBy: [],
        replies: [],
        parentId: parentId || null,
        postId: postId, // Ensure postId is included
      };

      // Update the post's comments
      setPost((prevPost) => {
        if (!prevPost) return prevPost;
        return {
          ...prevPost,
          comments: [newComment, ...(prevPost.comments || [])], // Add the new comment at the beginning
        } as Post; // Explicitly cast to Post to resolve type error
      });
    }

    return result;
  };

  // Initialize useActionState with the wrapper function
  const [state, action, pending] = useActionState(
    createCommentWrapper,
    undefined
  );

  return (
    <form
      action={action}
      className="flex items-center gap-2 p-4 border-b border-b-[var(--borderc)]"
    >
      <input
        type="text"
        id="comment"
        name="content" // Ensure the input has a name for FormData
        placeholder="Write a comment..."
        className="flex-grow p-2 border rounded-md"
        disabled={pending}
      />
      <button
        type="submit"
        className="px-4 py-2 text-white bg-blue-500 rounded-md"
        disabled={pending}
      >
        {pending ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
