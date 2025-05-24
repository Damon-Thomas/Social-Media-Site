import React, { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import ErrorMessage from "@/app/ui/form/ErrorMessage";
import LongInput from "@/app/ui/form/LongInput";
import Button from "@/app/ui/core/Button";
import { useCurrentUser, useUserLoading } from "@/app/context/UserContext";
import { createPost } from "@/app/actions/postActions";
import { EssentialPost, EssentialUser } from "@/app/lib/definitions";

import { useDefaultProfileImage } from "@/app/utils/defaultProfileImage";

export default function PostCreator({
  user,
  setInitialPosts,
}: {
  user: EssentialUser;
  setInitialPosts: React.Dispatch<React.SetStateAction<EssentialPost[]>>;
}) {
  const currentUser = useCurrentUser();
  const defaultProfile = useDefaultProfileImage();
  const isUserLoading = useUserLoading();

  const [mounted, setMounted] = useState(false);
  // Add state for the textarea value
  const [content, setContent] = useState("");

  const createPostWrapper = async (
    state:
      | EssentialPost
      | { errors?: { content?: string[] }; message?: string }
      | null
      | undefined,
    payload: FormData
  ): Promise<
    EssentialPost | { errors?: { content?: string[] }; message?: string } | null
  > => {
    const userId = currentUser?.id;
    if (!userId) {
      return { message: "User ID is required" };
    }

    const postPayload = { payload, userId };
    const post = await createPost(postPayload);

    // add error handling for empty post
    if (
      post &&
      typeof post === "object" &&
      ("errors" in post || "message" in post)
    ) {
      return post;
    } else if (post) {
      const newPost = post as EssentialPost;
      setInitialPosts((prevPosts) => [newPost, ...prevPosts]);
      setContent(""); // Reset textarea after successful post
      return newPost;
    }
    return { message: "Unexpected response from createPost" };
  };

  const [state, action, pending] = useActionState(createPostWrapper, undefined);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isUserLoading) {
    // Optionally, render a minimal placeholder to avoid hydration mismatch
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <form
        action={action} // Directly use the action function from useActionState
        className="flex flex-col border-b-1 border-b-[var(--borderc)]"
      >
        <div className="flex gap-4 items-start pt-4 px-4">
          <Image
            src={user?.image || defaultProfile}
            alt="User profile picture"
            width={40}
            height={40}
            className="rounded-full flex-shrink-0 h-10 w-10"
          />
          <LongInput
            label=""
            id="post"
            name="content" // Name attribute for form submission
            placeholder="Broadcast Now"
            className="p-2 rounded"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            type="hidden"
            name="userId"
            value={currentUser?.id || ""} // Include userId as a hidden input
          />
        </div>
        <div className="flex gap-4 w-full no-wrap my-2 pt-2 border-t-1 border-[var(--borderc)] h-fit px-4">
          <ErrorMessage className="grow flex flex-wrap">
            {state &&
            typeof state === "object" &&
            "errors" in state &&
            state.errors?.content
              ? state.errors.content.join(", ")
              : ""}
          </ErrorMessage>
          <Button type="submit" className="" disabled={pending}>
            {pending ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
