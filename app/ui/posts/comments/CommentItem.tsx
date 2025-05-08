import { EssentialComment } from "@/app/lib/definitions";

export default function CommentItem({
  comment,
}: {
  comment: EssentialComment;
}) {
  return (
    <div key={comment.id} className="mb-4 p-4 border rounded">
      <p className="text-gray-700">{comment.content}</p>
      <p className="text-gray-500">
        Commented by {comment.author?.name || "Unknown User"}
      </p>
      <p className="text-gray-500">
        {new Date(comment.createdAt).toLocaleDateString()}
      </p>
      <p className="text-gray-500">{comment._count?.likedBy} Likes</p>
      <p className="text-gray-500">{comment._count?.replies} Replies</p>

      <div className="flex items-center mt-2">
        <button className="text-blue-500 hover:underline">Like</button>
        <button className="text-blue-500 hover:underline ml-4">Reply</button>
      </div>
    </div>
  );
}
