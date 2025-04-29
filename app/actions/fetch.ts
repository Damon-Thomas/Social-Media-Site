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
      bio: true,
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
  limit: number = 5
) {
  const posts = await prisma.post.findMany({
    where: { authorId: userId },
    take: limit,
    skip: cursor ? 1 : 0, // Skip the cursor if provided
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      comments: { include: { author: true } },
      author: true,
    },
  });

  const nextCursor = posts.length === limit ? posts[posts.length - 1].id : null;

  return { posts, nextCursor };
}

export async function fetchPaginatedComments(
  userId: string,
  cursor?: string,
  limit: number = 5
) {
  const comments = await prisma.comment.findMany({
    where: { authorId: userId },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      post: { select: { id: true, content: true, author: true } },
    },
  });

  const nextCursor =
    comments.length === limit ? comments[comments.length - 1].id : null;

  return { comments, nextCursor };
}

export async function fetchPaginatedLikedPosts(
  userId: string,
  cursor?: string,
  limit: number = 5
) {
  const likedPosts = await prisma.post.findMany({
    where: {
      likedBy: {
        some: { id: userId },
      },
    },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
      comments: { include: { author: true } },
    },
  });

  const nextCursor =
    likedPosts.length === limit ? likedPosts[likedPosts.length - 1].id : null;

  return { posts: likedPosts, nextCursor };
}

export async function fetchPaginatedLikedComments(
  userId: string,
  cursor?: string,
  limit: number = 5
) {
  const likedComments = await prisma.comment.findMany({
    where: {
      likedBy: {
        some: { id: userId },
      },
    },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
      post: { select: { id: true, content: true } },
    },
  });

  const nextCursor =
    likedComments.length === limit
      ? likedComments[likedComments.length - 1].id
      : null;

  return { comments: likedComments, nextCursor };
}
