// import CommentSection from "@/app/ui/comments/CommentSection";

// export default function PostPage({ params }: { params: { postId: string } }) {
export default function PostPage() {
  // You can fetch initial comments on the server if needed
  // const initialComments = await getPostComments(params.postId);

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Post content here */}
      <h1 className="text-2xl font-bold mb-4">Post Title</h1>
      <p className="text-gray-700 mb-4">
        This is the content of the post. It can be a long text, images, or any
        other content.
      </p>
      <p className="text-gray-500 mb-4">Posted by User Name</p>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Comments</h3>
        {/* <CommentSection
          postId={params.postId}
          // initialComments={initialComments.comments}
          // initialCursor={initialComments.nextCursor}
        /> */}
      </div>
    </div>
  );
}
