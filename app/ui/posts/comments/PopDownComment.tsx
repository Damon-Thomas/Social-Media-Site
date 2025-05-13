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
}: {
  postId: string | null | undefined;
  setComment?: React.Dispatch<React.SetStateAction<EssentialComment[]>>;
  parentId?: string | undefined;
  hidden: boolean;
  setHidden?: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
  creatorClassName?: string;
}) {
  if (!postId || !parentId) {
    console.error("Post ID and Parent Id is required to create a comment.");
    return null;
  }

  return (
    <div
      className={`${
        hidden && "hidden"
      } ${className}  ml-4 pb-2 px-4 grow flex `}
    >
      <CommentCreator
        postId={postId}
        placeholder="Reply here..."
        setComment={setComment}
        parentId={parentId}
        setHidden={setHidden}
        className={`w-full ${creatorClassName} `}
      ></CommentCreator>
    </div>
  );
}
