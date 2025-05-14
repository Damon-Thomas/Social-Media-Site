import { getEssentialComment } from "@/app/actions/commentActions";
import { EssentialComment } from "@/app/lib/definitions";
import PostFlow from "@/app/ui/posts/PostFlow";
import { useEffect, useState } from "react";

export default function Connections() {
  const [comment, setComment] = useState<EssentialComment | null>(null);

  useEffect(() => {
    async function fetchComment() {
      return await getEssentialComment("cma47ycgi00178o0spz5a1ugd");
    }
    async function fetchAndSetComment() {
      const gotComment = await fetchComment();
      setComment(gotComment);
    }
    fetchAndSetComment();
  }, []);

  return (
    <div className="pt-10">
      <PostFlow comment={comment} />
    </div>
  );
}
