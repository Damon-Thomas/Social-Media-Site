import { useCurrentUser } from "@/app/context/UserContext";
import { EssentialComment, FullPost } from "@/app/lib/definitions";
import { useDefaultProfileImage } from "@/app/utils/defaultProfileImage";
import Image from "next/image";
import LongInput from "../../form/LongInput";
import { createComment } from "@/app/actions/commentActions";
import { useActionState, useEffect, useState } from "react";

export default function CommentCreator({
  postId,
  setPost,
  setComment,
  parentId = undefined,
  setCloseCreator,
  setHidden,
  placeholder = "Share your thoughts...",
  className = "",
  setCommentCount,
  setTopCommentCount,
  chained = false,
  // isLast = true,
  hidden = false,
  noPadding = false,
  narrow = false,
  setOpenPostComment,
}: {
  postId: string | null | undefined;
  setPost?: React.Dispatch<React.SetStateAction<FullPost | null>>;
  setComment?: React.Dispatch<React.SetStateAction<EssentialComment[]>>;
  parentId?: string;
  setCloseCreator?: React.Dispatch<React.SetStateAction<string>>;
  setHidden?: React.Dispatch<React.SetStateAction<boolean>>;
  placeholder?: string;
  className?: string;
  setCommentCount?: React.Dispatch<React.SetStateAction<number>>;
  setTopCommentCount?: React.Dispatch<React.SetStateAction<number>>;
  chained?: boolean;
  // isLast?: boolean;
  hidden?: boolean;
  noPadding?: boolean;
  narrow?: boolean;
  setOpenPostComment?: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [, action, pending] = useActionState(actionWrapper, null);
  const [mounted, setMounted] = useState(false);
  const [iconSize, setIconSize] = useState(40);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIconSize(24);
      } else {
        setIconSize(40);
      }
    };
    handleResize(); // Set initial size
    if (narrow) {
      setIconSize(24);
    }
  }, [narrow]);

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
      setComment((prevComment: EssentialComment[]) => {
        if (!prevComment) return prevComment;
        const updatedComments = prevComment.map((comment) => {
          if (comment?.id === parentId) {
            return {
              ...comment,
              replies: [newComment, ...(comment.replies || [])],
            };
          }
          return comment;
        });

        return updatedComments;
      });
      setCloseCreator?.("");
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
        setCommentCount?.((prevCount) => (prevCount || 0) + 1);
        if (setTopCommentCount) {
          setTopCommentCount((prevCount) => (prevCount || 0) + 1);
        }
        if (setOpenPostComment) {
          setOpenPostComment("");
        }
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

  if (!mounted) {
    // Optionally, render a minimal placeholder to avoid hydration mismatch
    return null;
  }

  return (
    <>
      {!chained ? (
        <form
          action={action}
          className={`flex w-full items-start gap-2 ${
            narrow ? "mt-2" : "py-2"
          } z-10 ${className}  `}
        >
          <div
            className={`relative flex-shrink-0 ${
              narrow ? "pt-1" : ""
            } h-10 w-10 my-0.5`}
          >
            <Image
              src={user?.image || defaultProfile}
              alt="User profile picture"
              width={iconSize}
              height={iconSize}
              className={`rounded-full  ${narrow ? "h-8 w-8" : "h-10 w-10"}`}
            />
            {/* {continueLink && (
          <div className="z-0 absolute -bottom-12 -left-3 h-18 w-5 border-l-1  border-[var(--dull)] "></div>
        )}
        {anotherReply && (
          <div className="z-0 absolute -bottom-18 left-1/2 h-18 w-5 border-l-1  border-[var(--dull)] "></div>
        )} */}
          </div>
          <LongInput
            label=""
            id="comment"
            name="content"
            placeholder={placeholder}
            className="flex-grow rounded-md  "
            disabled={pending}
            noPadding={noPadding}
          />
          <button
            type="submit"
            className="self-end px-4 py-2 w-28 text-[var(--aBlack)] font-bold bg-[var(--primary)] rounded-md my-1"
            disabled={pending}
          >
            {pending ? "Sending..." : "Send"}
          </button>
        </form>
      ) : (
        <div className={`relative ${hidden && "hidden"}`}>
          {/* <div
            className={`${
              isLast ? "z-10 bg-[var(--rdmono)]" : ""
            } w-[24px] sm:w-[32px] h-full z-10 absolute -left-[24px] sm:-left-[32px] top-0`}
          ></div> */}
          <div className="grid grid-cols-[24px_minmax(0,1fr)]  sm:grid-cols-[32px_minmax(0,1fr)]  relative">
            <div className="here absolute top-0 z-20 -left-[12px] sm:-left-[16px] w-[12px] sm:w-[16px] h-4 border-b-[1px] border-l-[1px] border-[var(--dull)] rounded-bl-xl"></div>

            <Image
              src={user?.image || defaultProfile}
              alt="Post Image"
              width={24}
              height={24}
              className="rounded-full w-full h-auto"
            />
            <form
              action={action}
              className={`flex w-full justify-between items-start gap-2 pb-4 z-10 `}
            >
              <LongInput
                label=""
                id="comment"
                name="content"
                placeholder={placeholder}
                className="flex-grow rounded-md p-0"
                text="text-base"
                disabled={pending}
                noPadding={noPadding}
              />
              <button
                type="submit"
                className="self-end px-4 py-2 w-28 text-[var(--aBlack)] font-bold bg-[var(--primary)] rounded-md my-1"
                disabled={pending}
              >
                {pending ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
          <div className="grid grid-cols-[24px_1fr] relative sm:grid-cols-[32px_1fr] ">
            <div className=" grid grid-cols-2">
              {/* {chained && (
                <>
                  <div className=""></div>
                  <div className="border-l-[1px] border-[var(--dull)]"></div>
                </>
              )} */}
            </div>
            <div className="commentContent   w-full h-full">
              <div className="flex items-center gap-4  justify-between"></div>

              <div className=""> </div>
            </div>
          </div>
          <div className="grid grid-cols-[24px_1fr] relative sm:grid-cols-[32px_1fr]"></div>
        </div>
      )}
    </>
  );
}
