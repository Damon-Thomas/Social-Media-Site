import {
  fetchUserById,
  fetchPaginatedPosts,
  fetchPaginatedComments,
  fetchPaginatedLikedPosts,
  fetchPaginatedLikedComments,
  fetchPaginatedActivity,
} from "@/app/actions/fetch";
import { notFound } from "next/navigation";
import type { User, Post, Comment, ActivityItem } from "@/app/lib/definitions";
import OtherProfile from "@/app/ui/profile/otherProfile/OtherProfile";

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
  const activityResponse = await fetchPaginatedActivity(
    userId,
    undefined,
    ITEMS_PER_PAGE * 2
  );
  const postsResponse = await fetchPaginatedPosts(
    userId,
    undefined,
    ITEMS_PER_PAGE
  );
  const commentsResponse = await fetchPaginatedComments(
    userId,
    undefined,
    ITEMS_PER_PAGE
  );
  const likedPostsResponse = await fetchPaginatedLikedPosts(
    userId,
    undefined,
    ITEMS_PER_PAGE
  );
  const likedCommentsResponse = await fetchPaginatedLikedComments(
    userId,
    undefined,
    ITEMS_PER_PAGE
  );

  // Apply proper type assertions
  const initialActivity = (activityResponse.activities || []) as ActivityItem[];
  const activityCursor = activityResponse.nextCursor;

  const initialPosts = (postsResponse.posts || []) as Post[];
  const postsCursor = postsResponse.nextCursor;

  const initialComments = (commentsResponse.comments || []) as Comment[];
  const commentsCursor = commentsResponse.nextCursor;

  const initialLikedPosts = (likedPostsResponse.posts || []) as Post[];
  const likedPostsCursor = likedPostsResponse.nextCursor;

  const initialLikedComments = (likedCommentsResponse.comments ||
    []) as Comment[];
  const likedCommentsCursor = likedCommentsResponse.nextCursor;

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-6 overflow-hidden flex flex-col w-full h-full">
      <OtherProfile
        userData={userData}
        initialActivity={initialActivity}
        activityCursor={activityCursor}
        initialPosts={initialPosts}
        postsCursor={postsCursor}
        initialComments={initialComments}
        commentsCursor={commentsCursor}
        initialLikedPosts={initialLikedPosts}
        likedPostsCursor={likedPostsCursor}
        initialLikedComments={initialLikedComments}
        likedCommentsCursor={likedCommentsCursor}
      />
    </div>
  );
}
