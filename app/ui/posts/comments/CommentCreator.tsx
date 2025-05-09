import { createComment } from "@/app/actions/commentActions";
import { useCurrentUser } from "@/app/context/UserContext";
import { Post, Comment } from "@/app/lib/definitions";
import { useDefaultProfileImage } from "@/app/utils/defaultProfileImage";
import Image from "next/image";

import { useActionState } from "react";
import LongInput from "../../form/LongInput";
import { useRef } from "react";

export default function CommentCreator({
  postId,
  setPost,
  parentId,
  setHidden,
}: {
  postId: string;
  setPost?: React.Dispatch<React.SetStateAction<Post | null>>;
  parentId?: string; // Optional parentId for nested comments
  setHidden?: React.Dispatch<React.SetStateAction<boolean>>; // Optional setHidden for modal control
}) {
  const user = useCurrentUser(); // Get the current user from context
  const defaultProfile = useDefaultProfileImage();
  const formRef = useRef<HTMLFormElement>(null); // Add a ref to the form

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

      // Reset the form and textarea height
      if (formRef.current) {
        formRef.current.reset();
        const textarea = formRef.current.querySelector("textarea");
        if (textarea) {
          textarea.style.height = "auto";
        }
      }

      // Close the modal after successfully submitting a comment
      if (setHidden) {
        setTimeout(() => setHidden(true), 0); // Use a timeout to ensure state updates properly
      }
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
      ref={formRef} // Attach the form ref
      action={action}
      className="flex items-start gap-2 py-2 border-b border-b-[var(--borderc)]"
    >
      <Image
        src={user?.image || defaultProfile} // Use a default image if user image is not available
        alt="User profile picture"
        width={40}
        height={40}
        className="rounded-full flex-shrink-0 h-10 w-10"
      />
      <LongInput
        label=""
        id="comment"
        name="content" // Name attribute for form submission
        placeholder="Share your thoughts..."
        className="flex-grow p-2 rounded-md"
        disabled={pending}
      />
      <button
        type="submit"
        className="self-end px-4 py-2 w-28 text-[var(--aBlack)] font-bold bg-[var(--primary)] rounded-md"
        disabled={pending}
      >
        {pending ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
