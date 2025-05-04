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
  userId: string,
  cursor?: string,
  limit: number = 15
  // ): Promise<{ activities: ActivityItem[]; nextCursor: string | null }> {
): any {
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
