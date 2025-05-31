import { useCurrentUser } from "@/app/context/UserContext";
import { EssentialComment, FullPost } from "@/app/lib/definitions";
import { useDefaultProfileImage } from "@/app/utils/defaultProfileImage";
import Image from "next/image";
import LongInput from "../../form/LongInput";
import { createComment } from "@/app/actions/commentActions";
import { useActionState, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { SWR_KEYS } from "@/app/lib/swr";

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
  refreshPageAfterComment = false,
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
  refreshPageAfterComment?: boolean;
}) {
  const [, action, pending] = useActionState(actionWrapper, null);
  const [mounted, setMounted] = useState(false);
  const [iconSize, setIconSize] = useState(40);
  const [commentContent, setCommentContent] = useState("");
  const longInputRef = useRef<{ reset?: () => void }>(null);
  const router = useRouter();

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

  // Legacy local state update function for backward compatibility
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

      // Get the actual content from the form payload
      const actualContent =
        (payload.get("content") as string) || commentContent;

      payload.set("content", actualContent); // Ensure controlled value is submitted
      payload.append("postId", postId);
      payload.append("parentId", parentId || "");
      payload.append("userId", user.id);

      // Create optimistic comment using the actual content
      const optimisticComment: EssentialComment = {
        id: `temp-${Date.now()}-${Math.random()}`, // More unique ID
        content: actualContent,
        author: {
          id: user.id,
          name: user.name || "Unknown",
          image: user.image || null,
        },
        authorId: user.id,
        postId: postId,
        parentId: parentId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        likedBy: [],
        replies: [],
        _count: {
          likedBy: 0,
          replies: 0,
        },
      };

      // Optimistic update for parent comment replies
      if (parentId) {
        const commentKey = SWR_KEYS.COMMENT(parentId);
        const repliesKey = SWR_KEYS.COMMENT_REPLIES(parentId);

        // Update parent comment's reply count
        mutate(
          commentKey,
          (currentComment: EssentialComment | undefined) => {
            if (currentComment) {
              return {
                ...currentComment,
                _count: {
                  likedBy: currentComment._count?.likedBy || 0,
                  replies: (currentComment._count?.replies || 0) + 1,
                },
              };
            }
            return currentComment;
          },
          false
        );

        // Add optimistic reply to replies list
        mutate(
          repliesKey,
          (
            currentData:
              | { replies: EssentialComment[]; nextCursor: string | null }
              | undefined
          ) => {
            if (currentData && currentData.replies) {
              return {
                ...currentData,
                replies: [optimisticComment, ...currentData.replies],
              };
            }
            return { replies: [optimisticComment], nextCursor: null };
          },
          false
        );
      } else {
        // For top-level comments, update the post's SWR cache
        if (postId) {
          const postKey = SWR_KEYS.POST(postId);

          // Update the post data to include the new comment
          mutate(
            postKey,
            (currentPost: FullPost | undefined) => {
              if (currentPost) {
                return {
                  ...currentPost,
                  comments: [
                    optimisticComment,
                    ...(currentPost.comments || []),
                  ],
                  _count: {
                    ...currentPost._count,
                    comments: (currentPost._count?.comments || 0) + 1,
                  },
                };
              }
              return currentPost;
            },
            false
          );
        }
      }

      // Update local state optimistically only if legacy props are provided
      // Pages using SWR will get updates automatically from cache
      if (setPost || setComment) {
        updatePost(optimisticComment);
      }

      setCommentCount?.((prevCount) => (prevCount || 0) + 1);
      if (setTopCommentCount) {
        setTopCommentCount((prevCount) => (prevCount || 0) + 1);
      }
      if (setOpenPostComment) {
        setOpenPostComment("");
      }
      setCommentContent(""); // Clear input after optimistic update
      longInputRef.current?.reset?.(); // Reset textarea height

      // Make the actual API call
      const newComment = await createComment(payload, user?.id || "");

      if (newComment && "errors" in newComment) {
        console.error("Failed to create comment:", newComment.errors);
        alert(
          "Failed to create comment. Please check your input and try again."
        );

        // Rollback optimistic updates
        if (parentId) {
          mutate(SWR_KEYS.COMMENT(parentId));
          mutate(SWR_KEYS.COMMENT_REPLIES(parentId));
        } else if (postId) {
          mutate(SWR_KEYS.POST(postId));
        }
        return;
      }

      if (newComment && "id" in newComment) {
        // Success - revalidate to get the real data from server
        if (parentId) {
          mutate(SWR_KEYS.COMMENT(parentId));
          mutate(SWR_KEYS.COMMENT_REPLIES(parentId));
        }
        if (postId) {
          mutate(SWR_KEYS.POST(postId));
          mutate(SWR_KEYS.POST_COMMENTS(postId));
        }

        // Refresh the page if requested
        if (refreshPageAfterComment) {
          router.refresh();
        }
      } else {
        console.error("Unexpected response from createComment:", newComment);
        alert("An unexpected error occurred. Please try again later.");

        // Rollback optimistic updates
        if (parentId) {
          mutate(SWR_KEYS.COMMENT(parentId));
          mutate(SWR_KEYS.COMMENT_REPLIES(parentId));
        } else if (postId) {
          mutate(SWR_KEYS.POST(postId));
        }
      }

      if (setHidden) {
        setTimeout(() => setHidden(true), 0);
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      alert("An error occurred while creating the comment. Please try again.");

      // Rollback optimistic updates on error
      if (parentId) {
        mutate(SWR_KEYS.COMMENT(parentId));
        mutate(SWR_KEYS.COMMENT_REPLIES(parentId));
      } else if (postId) {
        // Rollback post SWR cache for top-level comments
        mutate(SWR_KEYS.POST(postId));
      }
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
            ref={longInputRef}
            label=""
            id="comment"
            name="content"
            placeholder={placeholder}
            className="flex-grow rounded-md  "
            disabled={pending}
            noPadding={noPadding}
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <button
            type="submit"
            className="self-end px-4 py-2 w-28 text-[var(--aBlack)] font-bold bg-[var(--primary)] rounded-md my-1 mr-1"
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
                ref={longInputRef}
                label=""
                id="comment"
                name="content"
                placeholder={placeholder}
                className="flex-grow rounded-md p-0"
                text="text-base"
                disabled={pending}
                noPadding={noPadding}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
              <button
                type="submit"
                className="self-end px-4 py-2 w-28 text-[var(--aBlack)] font-bold bg-[var(--primary)] rounded-md my-1 mr-1"
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
