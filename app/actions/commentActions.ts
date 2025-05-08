"use server";

import prisma from "../lib/prisma";
import { CommentUnested } from "../lib/definitions";
import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

const CommentFormSchema = z.object({
  content: z
    .string()
    .min(1, "Comment content must not be empty")
    .max(500, "Comment content must be less than 500 characters"),
});

type FormState =
  | {
      errors?: {
        content?: string[];
      };
      message?: string;
    }
  | undefined;

// Function to fetch paginated top-level comments for a post
export async function getPostComments(
  postId: string,
  cursor?: string,
  limit: number = 10
): Promise<{ comments: CommentUnested[]; nextCursor: string | null }> {
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
          email: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          bio: true,
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
              email: true,
              image: true,
              createdAt: true,
              updatedAt: true,
              bio: true,
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
): Promise<{ replies: CommentUnested[]; nextCursor: string | null }> {
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
          email: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          bio: true,
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

export async function createComment({
  state,
  payload,
  userId,
}: {
  state: FormState;
  payload: FormData;
  userId: string | undefined;
}): Promise<FormState> {
  // Sanitize the content
  const content = payload.get("content");
  if (!content) {
    return {
      errors: {
        content: ["Comment content is required"],
      },
      message: "Comment content is required",
    };
  }

  const sanitizedContent = DOMPurify.sanitize(content.toString());

  try {
    // Validate the sanitized content
    const parsedContent = CommentFormSchema.parse({
      content: sanitizedContent,
    });

    // Create the comment in the database
    const comment = await prisma.comment.create({
      data: {
        content: parsedContent.content,
      },
    });

    // If a postId is provided, associate the comment with the post
    const postId = payload.get("postId")?.toString();
    if (postId) {
      await prisma.comment.update({
        where: { id: comment.id },
        data: {
          postId: postId,
        },
      });
    }

    // Update the user's comments
    await prisma.user.update({
      where: { id: userId },
      data: {
        comments: {
          connect: { id: comment.id },
        },
      },
    });

    // If a parentId is provided, update the parent comment
    if (payload.get("parentId")) {
      const parentId = payload.get("parentId")?.toString();
      if (parentId) {
        await prisma.comment.update({
          where: { id: parentId },
          data: {
            replies: {
              connect: { id: comment.id },
            },
          },
        });
      }
    }

    return undefined; // No errors
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const field = err.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(err.message);
      });
      return {
        errors: fieldErrors,
        message: "Validation errors occurred",
      };
    } else {
      console.error("Error creating comment:", error);
      return {
        errors: {
          content: ["An error occurred while creating the comment"],
        },
        message: "An error occurred while creating the comment",
      };
    }
  }
}
