"use server";

import prisma from "../lib/prisma";
import { Prisma } from "../../generated/prisma";
import type { ActivityItem } from "@/app/lib/definitions";
import type { Post, Comment } from "@/app/lib/definitions";

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

export async function fetchPaginatedActivity(
  userId: string,
  cursor?: string, // last‐seen ActivityItem.id
  limit: number = 10
): Promise<{ activities: ActivityItem[]; nextCursor: string | null }> {
  // 1) fetch all four lists with the same shape your other sections use
  const [posts, comments, likedPosts, likedComments] = await Promise.all([
    prisma.post.findMany({
      where: { authorId: userId },
      select: {
        id: true,
        createdAt: true,
        content: true,
        authorId: true,
        author: true,
        likedBy: true, // now includes array of users who liked
        comments: true, // now includes array of comments
      },
    }),
    prisma.comment.findMany({
      where: { authorId: userId },
      select: {
        id: true,
        createdAt: true,
        content: true,
        authorId: true,
        author: true,
        postId: true,
        likedBy: true, // now includes array of users who liked
      },
    }),
    prisma.post.findMany({
      where: { likedBy: { some: { id: userId } } },
      select: {
        id: true,
        createdAt: true,
        content: true,
        authorId: true,
        author: true,
        likedBy: true,
        comments: true,
      },
    }),
    prisma.comment.findMany({
      where: { likedBy: { some: { id: userId } } },
      select: {
        id: true,
        createdAt: true,
        content: true,
        authorId: true,
        author: true,
        postId: true,
        likedBy: true,
      },
    }),
  ]);

  // 2) normalize into ActivityItem[]
  const all: ActivityItem[] = [
    ...posts.map((p) => ({
      id: `post:${p.id}`,
      type: "post",
      createdAt: p.createdAt,
      payload: p,
    })),
    ...comments.map((c) => ({
      id: `comment:${c.id}`,
      type: "comment",
      createdAt: c.createdAt,
      payload: c,
    })),
    ...likedPosts.map((p) => ({
      id: `likedPost:${p.id}`,
      type: "likedPost",
      createdAt: p.createdAt,
      payload: p,
    })),
    ...likedComments.map((c) => ({
      id: `likedComment:${c.id}`,
      type: "likedComment",
      createdAt: c.createdAt,
      payload: c,
    })),
  ];

  // 3) sort by date desc and page‐through
  all.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const start = cursor ? all.findIndex((x) => x.id === cursor) + 1 : 0;
  const page = all.slice(start, start + limit);
  const nextCursor = page.length === limit ? page[page.length - 1].id : null;

  return { activities: page, nextCursor };
}

export async function fetchPaginatedLikedActivity(
  userId: string,
  postsCursor: string | null,
  commentsCursor: string | null,
  limit: number = 10
): Promise<{
  items: (
    | { type: "likedPost"; payload: Post; createdAt: Date }
    | { type: "likedComment"; payload: Comment; createdAt: Date }
  )[];
  nextCursors: {
    likedPostsCursor: string | null;
    likedCommentsCursor: string | null;
  };
}> {
  // Fetch liked posts and liked comments concurrently:
  const [postsRes, commentsRes] = await Promise.all([
    (async () => {
      const posts = await prisma.post.findMany({
        where: { likedBy: { some: { id: userId } } },
        take: limit,
        skip: postsCursor ? 1 : 0,
        cursor: postsCursor ? { id: postsCursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: { author: true, comments: true },
      });
      const nextCursor =
        posts.length === limit ? posts[posts.length - 1].id : null;
      return { posts, nextCursor };
    })(),
    (async () => {
      const comments = await prisma.comment.findMany({
        where: { likedBy: { some: { id: userId } } },
        take: limit,
        skip: commentsCursor ? 1 : 0,
        cursor: commentsCursor ? { id: commentsCursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: { author: true, post: true },
      });
      const nextCursor =
        comments.length === limit ? comments[comments.length - 1].id : null;
      return { comments, nextCursor };
    })(),
  ]);

  const combined = [
    ...postsRes.posts.map((p) => ({
      type: "likedPost" as const,
      payload: p,
      createdAt: p.createdAt,
    })),
    ...commentsRes.comments.map((c) => ({
      type: "likedComment" as const,
      payload: c,
      createdAt: c.createdAt,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const items = combined.slice(0, limit);

  return {
    items,
    nextCursors: {
      likedPostsCursor: postsRes.nextCursor,
      likedCommentsCursor: commentsRes.nextCursor,
    },
  };
}
