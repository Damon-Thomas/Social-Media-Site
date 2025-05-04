import type { EssentialPost } from "@/app/lib/definitions";
import { formatRelativeTime } from "@/app/utils/formatRelativeTime";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import flame from "@/public/flame.svg";
import commentText from "@/public/comment.svg";
import ThemedIcon from "@/app/ui/core/ThemedIcon";
import { useCurrentUser, useRefreshUser } from "@/app/context/UserContext";
import { likePost } from "@/app/actions/postActions";
import { useEffect, useState } from "react";

export default function Post({ post }: { post: EssentialPost }) {
  const { theme } = useTheme();
  const iconSize = 20;
  const userData = useCurrentUser();
  const refreshUser = useRefreshUser(); // Get the existing refresh function
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?._count?.likedBy || 0);

  async function likePostHandler() {
    const willBeLiked = !liked;
    const res = await likePost(post?.id, userData?.id);

    if (res) {
      // Update local state immediately for UI feedback
      setLiked(willBeLiked);
      setLikeCount((prevCount) =>
        willBeLiked ? prevCount + 1 : prevCount - 1
      );

      // Refresh user data to update the likedPosts array in context
      if (refreshUser) refreshUser();

      console.log("Post liked successfully");
    } else {
      console.error("Failed to like the post");
    }
  }

  // This will update when userData changes due to the refreshUser() call
  useEffect(() => {
    if (userData?.likedPosts?.some((likedP) => likedP?.id === post?.id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [post, userData]);

  useEffect(() => {
    setLikeCount(post?._count?.likedBy || 0);
  }, [post?._count?.likedBy]);

  return (
    <div className="flex w-full pb-2 border-b-1 border-[var(--borderc)] ">
      <div className="flex-shrink-0 mr-2">
        {post?.author?.image && (
          <Link href={`/dashboard/profile/${post.authorId}`}>
            <Image
              src={
                post.author.image ||
                (theme === "light"
                  ? "/defaultProfileLight.svg"
                  : "/defaultProfileDark.svg")
              }
              alt="Profile"
              className="w-8 h-8 rounded-full"
              width={32}
              height={32}
            />
          </Link>
        )}
      </div>

      <div className="flex flex-col flex-grow min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="font-extrabold">{post?.author?.name}</span>
          <p className="text-sm text-[var(--dull)] ">
            {post?.createdAt && formatRelativeTime(post.createdAt, true)}
          </p>
        </div>
        <p className="">{post?.content}</p>
        <div className="flex items-center gap-4 mt-0.5">
          <div className="flex items-center gap-1">
            <ThemedIcon
              count={likeCount}
              src={flame.src}
              alt="Likes"
              size={iconSize}
              liked={liked}
              onClick={likePostHandler}
            />
          </div>

          <div className="flex items-center gap-1">
            <ThemedIcon
              count={post?._count?.comments}
              src={commentText.src}
              alt="Comments"
              size={iconSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
