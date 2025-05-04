"use server";

import prisma from "../lib/prisma";
import { type Comment } from "../lib/definitions";

// Function to fetch paginated top-level comments for a post
export async function getPostComments(
  postId: string,
  cursor?: string,
  limit: number = 10
): Promise<{ comments: Comment[]; nextCursor: string | null }> {
  const comments = await prisma.comment.findMany({
    where: {
      postId,
      parentId: null, // Only top-level comments
    },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      authorId: true,
      postId: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      likedBy: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      // Include first-level replies with their count
      _count: {
        select: { replies: true },
      },
      // First level of replies with basic info
      replies: {
        take: 3, // Show first 3 replies initially
        orderBy: { createdAt: "asc" }, // Oldest first is typical for replies
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
          likedBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: { replies: true },
          },
        },
      },
    },
  });

  const nextCursor =
    comments.length === limit ? comments[comments.length - 1].id : null;
  return { comments, nextCursor };
}

// Function to fetch paginated replies for a specific comment
export async function getCommentReplies(
  commentId: string,
  cursor?: string,
  limit: number = 10
): Promise<{ replies: Comment[]; nextCursor: string | null }> {
  const replies = await prisma.comment.findMany({
    where: { parentId: commentId },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "asc" }, // Oldest first is typical for replies
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
      likedBy: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: { replies: true },
      },
    },
  });

  const nextCursor =
    replies.length === limit ? replies[replies.length - 1].id : null;
  return { replies, nextCursor };
}
