import {
  fetchUserById,
  fetchPaginatedPosts,
  fetchPaginatedComments,
  fetchPaginatedLikedPosts,
  fetchPaginatedLikedComments,
} from "@/app/actions/fetch";
import { notFound } from "next/navigation";
import type { User } from "@/app/lib/definitions";
import OtherProfile from "@/app/ui/profile/otherProfile/OtherProfile";
import PostsSection from "@/app/ui/profile/otherProfile/PostsSection";
import CommentsSection from "@/app/ui/profile/otherProfile/CommentsSection";
import LikedPostsSection from "@/app/ui/profile/otherProfile/LikedPostsSection";
import LikedCommentsSection from "@/app/ui/profile/otherProfile/LikedCommentsSection";

type PageParams = {
  params: Promise<{ userId: string }>;
};

const ITEMS_PER_PAGE = 5;

export default async function ProfilePage({ params }: PageParams) {
  const { userId } = await params;
  const fetched = await fetchUserById(userId);
  if (!fetched) notFound();
  const userData = fetched as User;

  // Get initial data for each section with cursor
  const { posts: initialPosts, nextCursor: postsCursor } =
    await fetchPaginatedPosts(userId, undefined, ITEMS_PER_PAGE);

  const { comments: initialComments, nextCursor: commentsCursor } =
    await fetchPaginatedComments(userId, undefined, ITEMS_PER_PAGE);

  const { posts: initialLikedPosts, nextCursor: likedPostsCursor } =
    await fetchPaginatedLikedPosts(userId, undefined, ITEMS_PER_PAGE);

  const { comments: initialLikedComments, nextCursor: likedCommentsCursor } =
    await fetchPaginatedLikedComments(userId, undefined, ITEMS_PER_PAGE);

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-6 overflow-auto flex flex-col w-full">
      <OtherProfile userData={userData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Posts</h2>
          <PostsSection
            userId={userId}
            initialPosts={initialPosts}
            initialCursor={postsCursor}
          />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Comments</h2>
          <CommentsSection
            userId={userId}
            initialComments={initialComments}
            initialCursor={commentsCursor}
          />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Liked Posts</h2>
          <LikedPostsSection
            userId={userId}
            initialPosts={initialLikedPosts}
            initialCursor={likedPostsCursor}
          />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Liked Comments</h2>
          <LikedCommentsSection
            userId={userId}
            initialComments={initialLikedComments}
            initialCursor={likedCommentsCursor}
          />
        </div>
      </div>
    </div>
  );
}
