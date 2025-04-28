"use server";

import prisma from "../lib/prisma";
import { Prisma } from "../../generated/prisma";

export async function mostPopular(mobile: boolean) {
  const take = mobile ? 3 : 5;
  const popularUsers = await prisma.user.findMany({
    orderBy: {
      followers: {
        _count: "desc",
      },
    } as Prisma.UserOrderByWithRelationInput,
    include: {
      _count: {
        select: { followers: true },
      },
    },
    take: take,
  });

  return popularUsers;
}

export async function fetchUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      posts: {
        orderBy: { createdAt: "desc" },
        include: { comments: { include: { author: true } } },
      },
      comments: {
        orderBy: { createdAt: "desc" },
        include: { post: { select: { id: true, content: true } } },
      },
      followers: true,
      following: true,
      friends: true,
    },
  });
  return user;
}

export async function fetchPaginatedPosts(
  userId: string,
  cursor?: string,
  limit: number = 10
) {
  const posts = await prisma.post.findMany({
    where: { authorId: userId },
    take: limit,
    skip: cursor ? 1 : 0, // Skip the cursor if provided
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      comments: { include: { author: true } },
    },
  });

  const nextCursor = posts.length === limit ? posts[posts.length - 1].id : null;

  return { posts, nextCursor };
}
