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
}) {
  if (!postId || !parentId) {
    console.error("Post ID and Parent Id is required to create a comment.");
    return null;
  }

  return (
    <>
      {!chained ? (
        <div
          className={`${hidden && "hidden"} ${className} ${
            chained ? "" : "py-2 px-4"
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
        ></CommentCreator>
      )}
    </>
  );
}
