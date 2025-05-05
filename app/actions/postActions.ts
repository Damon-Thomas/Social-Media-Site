"use server";

import { EssentialPost } from "../lib/definitions";
import prisma from "../lib/prisma";

export async function getGlobalFeedPosts(
  cursor?: string,
  limit: number = 15
): Promise<{ posts: EssentialPost[]; nextCursor: string | null }> {
  const posts = await prisma.post.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      authorId: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          comments: true,
          likedBy: true,
        },
      },
    },
  });

  const nextCursor = posts.length === limit ? posts[posts.length - 1].id : null;
  return { posts, nextCursor };
}

export async function getFollowingActivities(
  userId: string | undefined,
  cursor?: string,
  limit: number = 15
  // ): Promise<{ activities: ActivityItem[]; nextCursor: string | null }> {
): any {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      following: {
        select: {
          id: true,
          posts: {
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              content: true,
              authorId: true,
              createdAt: true,
              updatedAt: true,
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
              _count: {
                select: {
                  comments: true,
                  likedBy: true,
                },
              },
            },
          },
          comments: {
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              content: true,
              authorId: true,
              postId: true,
              createdAt: true,
              updatedAt: true,
              parentId: true,
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
              _count: {
                select: {
                  replies: true,
                  likedBy: true,
                },
              },
            },
          },
        },
      },
    },
  });

  console.log(user);
}

//   return { activities: paginatedActivities, nextCursor };
// }

export async function getFollowingPosts(
  userId: string | undefined,
  cursor?: string,
  limit: number = 15
): Promise<{ posts: EssentialPost[]; nextCursor: string | null }> {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      following: {
        select: {
          posts: {
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              content: true,
              authorId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
    },
  });
  const posts = user?.following.flatMap((f) => f.posts) || [];
  const nextCursor = posts.length === limit ? posts[posts.length - 1].id : null;
  return { posts, nextCursor };
}

export async function likePost(
  postId: string | undefined,
  userId: string | undefined
) {
  if (!postId || !userId) {
    throw new Error("Post ID and User ID are required");
  }

  try {
    // Check if the post is already liked by this user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        likedPosts: {
          where: { id: postId },
          select: { id: true },
        },
      },
    });

    const isLiked = (user?.likedPosts ?? []).length > 0;

    if (isLiked) {
      // Unlike: Disconnect the relationship
      await prisma.post.update({
        where: { id: postId },
        data: {
          likedBy: {
            disconnect: { id: userId },
          },
        },
      });

      await prisma.user.update({
        where: { id: userId },
        data: {
          likedPosts: {
            disconnect: { id: postId },
          },
        },
      });
    } else {
      // Like: Connect the relationship
      await prisma.post.update({
        where: { id: postId },
        data: {
          likedBy: {
            connect: { id: userId },
          },
        },
      });

      await prisma.user.update({
        where: { id: userId },
        data: {
          likedPosts: {
            connect: { id: postId },
          },
        },
      });
    }

    return true;
  } catch (error) {
    console.error("Error toggling post like:", error);
    throw new Error("Failed to toggle post like");
  }
}

export async function doesUserLikePost(userId: string, postId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      likedPosts: {
        where: { id: postId },
        select: { id: true },
      },
    },
  });

  return (user?.likedPosts ?? []).length > 0;
}
