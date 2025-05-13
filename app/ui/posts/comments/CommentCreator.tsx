import { useCurrentUser } from "@/app/context/UserContext";
import { EssentialComment, FullPost } from "@/app/lib/definitions";
import { useDefaultProfileImage } from "@/app/utils/defaultProfileImage";
import Image from "next/image";
import LongInput from "../../form/LongInput";
import { createComment } from "@/app/actions/commentActions";
import { useActionState } from "react";

export default function CommentCreator({
  postId,
  setPost,
  setComment,
  parentId = undefined,
  setHidden,
  placeholder = "Share your thoughts...",
  className = "",
}: {
  postId: string | null | undefined;
  setPost?: React.Dispatch<React.SetStateAction<FullPost | null>>;
  setComment?: React.Dispatch<React.SetStateAction<EssentialComment[]>>;
  parentId?: string;
  setHidden?: React.Dispatch<React.SetStateAction<boolean>>;
  placeholder?: string;
  className?: string;
}) {
  const [, action, pending] = useActionState(actionWrapper, null);

  const updatePost = (newComment: EssentialComment | null) => {
    if (!newComment) {
      console.error("Failed to create a new comment.");
      return;
    }
    if (setComment && !parentId) {
      setComment((prevComment: EssentialComment[]) => {
        if (!prevComment) return prevComment;
        return [newComment, ...prevComment];
      });
    }
    if (setComment && parentId) {
      return;
      // add nested comment
    }
    setPost?.((prevPost: FullPost | null) => {
      if (!prevPost) return prevPost;

      return {
        ...prevPost,
        comments: [newComment, ...prevPost.comments],
      };
    });
  };

  const user = useCurrentUser();
  const defaultProfile = useDefaultProfileImage();

  async function actionWrapper(state: void | null, payload: FormData) {
    try {
      if (!postId) {
        console.error("Post ID is required to create a comment.");
        return;
      }
      if (!user) {
        console.error("User must be logged in to create a comment.");
        return;
      }
      payload.append("postId", postId);
      payload.append("parentId", parentId || "");
      payload.append("userId", user.id);
      const newComment = await createComment(payload, user?.id || "");

      if (newComment && "errors" in newComment) {
        console.error("Failed to create comment:", newComment.errors);
        alert(
          "Failed to create comment. Please check your input and try again."
        );
        return;
      }

      if (newComment && "id" in newComment) {
        updatePost(newComment);
      } else {
        console.error("Unexpected response from createComment:", newComment);
        alert("An unexpected error occurred. Please try again later.");
      }

      if (setHidden) {
        setTimeout(() => setHidden(true), 0);
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  }

  return (
    <form
      action={action}
      className={`flex w-full  items-start gap-2 py-2 ${className}`}
    >
      <Image
        src={user?.image || defaultProfile}
        alt="User profile picture"
        width={40}
        height={40}
        className="rounded-full flex-shrink-0 h-10 w-10 my-0.5"
      />
      <LongInput
        label=""
        id="comment"
        name="content"
        placeholder={placeholder}
        className="flex-grow rounded-md h-full "
        disabled={pending}
      />
      <button
        type="submit"
        className="self-end px-4 py-2 w-28 text-[var(--aBlack)] font-bold bg-[var(--primary)] rounded-md my-1"
        disabled={pending}
      >
        {pending ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
