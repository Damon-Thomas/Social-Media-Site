import type { User, Post, Comment } from "@/app/lib/definitions";
import PersInfo from "./PersInfo";
import PostsSection from "./PostsSection";
import CommentsSection from "./CommentsSection";
import LikedPostsSection from "./LikedPostsSection";
import LikedCommentsSection from "./LikedCommentsSection";

interface OtherProfileProps {
  userData: User;
  initialPosts?: Post[];
  postsCursor?: string | null;
  initialComments?: Comment[];
  commentsCursor?: string | null;
  initialLikedPosts?: Post[];
  likedPostsCursor?: string | null;
  initialLikedComments?: Comment[];
  likedCommentsCursor?: string | null;
}

export default function OtherProfile({
  userData,
  initialPosts = [],
  postsCursor = null,
  initialComments = [],
  commentsCursor = null,
  initialLikedPosts = [],
  likedPostsCursor = null,
  initialLikedComments = [],
  likedCommentsCursor = null,
}: OtherProfileProps) {
  const userId = userData?.id;

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold">User not found</h1>
        <p className="mt-2 text-gray-600">
          The user you are looking for does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-start items-start gap-4 md:gap-8 h-full w-full">
      <PersInfo userData={userData}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Posts</h2>
            <PostsSection
              userId={userId || ""}
              initialPosts={initialPosts}
              initialCursor={postsCursor}
            />
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Comments</h2>
            <CommentsSection
              userId={userId || ""}
              initialComments={initialComments}
              initialCursor={commentsCursor}
            />
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Liked Posts</h2>
            <LikedPostsSection
              userId={userId || ""}
              initialPosts={initialLikedPosts}
              initialCursor={likedPostsCursor}
            />
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Liked Comments</h2>
            <LikedCommentsSection
              userId={userId || ""}
              initialComments={initialLikedComments}
              initialCursor={likedCommentsCursor}
            />
          </div>
        </div>
      </PersInfo>
    </div>
  );
}
