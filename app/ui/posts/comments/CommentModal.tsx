import { FullPost } from "@/app/lib/definitions";
import Modal from "../../core/Modal";
import CommentCreator from "./CommentCreator";

export default function CommentModal({
  postId,
  hidden,
  setHidden,
  setPost,
  parentId,
}: {
  postId: string | null | undefined;
  hidden: boolean;
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setPost?: React.Dispatch<React.SetStateAction<FullPost | null>>; // Update to accept FullPost
  parentId?: string | undefined; // Optional parentId for nested comments
}) {
  const handleCloseModal = () => setHidden(true); // Wrap setHidden in a function

  return (
    <Modal hidden={hidden} setHidden={handleCloseModal}>
      {" "}
      {/* Pass the wrapper function */}
      <CommentCreator
        setHidden={setHidden}
        postId={postId}
        setPost={setPost}
        parentId={parentId}
      />
    </Modal>
  );
}
