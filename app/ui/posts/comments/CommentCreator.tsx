import { useCurrentUser } from "@/app/context/UserContext";
import { FullPost } from "@/app/lib/definitions";
import { useDefaultProfileImage } from "@/app/utils/defaultProfileImage";
import Image from "next/image";
import { useState } from "react";
import LongInput from "../../form/LongInput";

export default function CommentCreator<T extends FullPost | ExtendedPost>({
  postId,
  setPost,
  parentId,
  setHidden,
}: {
  postId: string | null | undefined; // Post ID to which the comment belongs
  setPost?: React.Dispatch<React.SetStateAction<T | null>>; // Update to accept generic type T
  parentId?: string; // Optional parentId for nested comments
  setHidden?: React.Dispatch<React.SetStateAction<boolean>>; // Optional setHidden for modal control
}) {
  // Ensure `setPost` returns a `T`
  const updatePost = (newComment: T["comments"][number]) => {
    setPost?.((prevPost) => {
      if (!prevPost) return prevPost;
      return {
        ...prevPost,
        comments: [newComment, ...prevPost.comments],
      };
    });
  };

  const user = useCurrentUser(); // Get the current user from context
  const defaultProfile = useDefaultProfileImage();

  // Correct `pending` usage
  const [pending, setPending] = useState(false);

  const handleSubmit = async (payload: FormData) => {
    setPending(true);
    try {
      // Simulate comment creation
      const newComment: T["comments"][number] = {
        id: "new-comment-id",
        content: payload.get("content")?.toString() || "",
        authorId: user?.id || "current-user-id",
        author: {
          id: user?.id || "current-user-id",
          name: user?.name || "Current User",
          image: user?.image || null,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { likedBy: 0, replies: 0 },
        replies: [],
      };
      updatePost(newComment);

      // Close the modal after successfully submitting a comment
      if (setHidden) {
        setTimeout(() => setHidden(true), 0); // Use a timeout to ensure state updates properly
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setPending(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.append("postId", postId || ""); // Use postId
        if (parentId) {
          formData.append("parentId", parentId); // Use parentId
        }
        handleSubmit(formData);
      }}
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
