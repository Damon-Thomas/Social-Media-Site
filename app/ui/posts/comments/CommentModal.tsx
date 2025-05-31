import { EssentialComment } from "@/app/lib/definitions";
import Modal from "../../core/Modal";
import CommentCreator from "./CommentCreator";

export default function CommentModal({
  postId,
  hidden,
  setHidden,
  setComment,
  parentId,
}: {
  postId: string | null | undefined;
  hidden: boolean;
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setComment?: React.Dispatch<React.SetStateAction<EssentialComment[]>>; // Update to accept FullPost
  parentId?: string | undefined; // Optional parentId for nested comments
}) {
  const handleCloseModal = () => setHidden(true); // Wrap setHidden in a function

  return (
    <Modal hidden={hidden} setHidden={handleCloseModal}>
      <CommentCreator
        setHidden={setHidden}
        postId={postId}
        setComment={setComment}
        parentId={parentId}
        refreshPageAfterComment={true}
      />
    </Modal>
  );
}
