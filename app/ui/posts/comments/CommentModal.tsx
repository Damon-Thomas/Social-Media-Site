import { Post } from "@/app/lib/definitions";
import Modal from "../../core/Modal";
import CommentCreator from "./CommentCreator";

export default function CommentModal({
  postId,
  hidden,
  setHidden,
  setPost,
  parentId,
}: {
  postId: string;
  hidden: boolean;
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setPost?: React.Dispatch<React.SetStateAction<Post | null>>;
  parentId?: string | null; // Optional parentId for nested comments
}) {
  return (
    <Modal hidden={hidden} setHidden={setHidden}>
      <CommentCreator postId={postId} setPost={setPost} parentId={parentId} />
    </Modal>
  );
}
