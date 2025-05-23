import { EssentialComment } from "@/app/lib/definitions";
import CommentCreator from "./CommentCreator";

export default function PopDownComment({
  postId,
  setComment,
  parentId,
  hidden,
  setHidden,
  className = "",
  creatorClassName = "",
  setCloseCreator,
  setCommentCount,
  setTopCommentCount,
  chained = false,
  narrow = false,
  setOpenPostComment,
}: {
  postId: string | null | undefined;
  setComment?: React.Dispatch<React.SetStateAction<EssentialComment[]>>;
  parentId?: string | undefined;
  hidden: boolean;
  setHidden?: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
  creatorClassName?: string;
  setCloseCreator?: React.Dispatch<React.SetStateAction<string>>;
  setCommentCount?: React.Dispatch<React.SetStateAction<number>>;
  setTopCommentCount?: React.Dispatch<React.SetStateAction<number>>;
  chained?: boolean;
  narrow?: boolean;
  setOpenPostComment?: React.Dispatch<React.SetStateAction<string>>;
}) {
  if (!postId) {
    console.error("Post ID is required to create a comment.");
    return null;
  }

  return (
    <>
      {!chained ? (
        <div
          className={`${hidden && "hidden"} ${className} ${
            chained ? "" : narrow ? "" : "py-2 px-4"
          } grow flex relative `}
        >
          <CommentCreator
            postId={postId}
            placeholder="Reply here..."
            setComment={setComment}
            parentId={parentId}
            setHidden={setHidden}
            className={`w-full ${creatorClassName} relative z-10`}
            setCloseCreator={setCloseCreator}
            setCommentCount={setCommentCount}
            setTopCommentCount={setTopCommentCount}
            chained={chained}
            narrow={narrow}
            setOpenPostComment={setOpenPostComment}
          ></CommentCreator>
        </div>
      ) : (
        <CommentCreator
          postId={postId}
          placeholder="Reply here..."
          setComment={setComment}
          parentId={parentId}
          setHidden={setHidden}
          hidden={hidden}
          className={`w-full ${creatorClassName} relative z-10 `}
          setCloseCreator={setCloseCreator}
          setCommentCount={setCommentCount}
          setTopCommentCount={setTopCommentCount}
          chained={chained}
          setOpenPostComment={setOpenPostComment}
        ></CommentCreator>
      )}
    </>
  );
}
