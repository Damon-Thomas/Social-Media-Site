"use server";

import prisma from "../lib/prisma";
import { CommentUnested, EssentialComment } from "../lib/definitions";
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
        select: {
          likedBy: true,
          replies: true,
        },
      },
      // First level of replies with basic info
      replies: {
        take: 3, // Show first 3 replies initially
        orderBy: { createdAt: "desc" }, // Newest first
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
            select: {
              likedBy: true,
              replies: true,
            },
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
): Promise<{ replies: EssentialComment[]; nextCursor: string | null }> {
  const replies = await prisma.comment.findMany({
    where: { parentId: commentId },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      authorId: true,
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
      replies: {
        select: {
          id: true,
          content: true,
          authorId: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          postId: true,
          _count: {
            select: {
              likedBy: true,
              replies: true,
            },
          },
          createdAt: true,
          updatedAt: true,
          parentId: true,
        },
        orderBy: { createdAt: "desc" },
      },
      postId: true,
      _count: {
        select: {
          likedBy: true,
          replies: true,
        },
      },
      createdAt: true,
      updatedAt: true,
      parentId: true,
    },
  });

  const nextCursor =
    replies.length === limit ? replies[replies.length - 1].id : null;
  return { replies, nextCursor };
}

export async function createComment(
  payload: FormData,
  userId: string
): Promise<FormState | ReturnType<typeof getEssentialComment>> {
  const content = payload.get("content")?.toString();
  if (!content) {
    return {
      errors: {
        content: ["Comment content is required"],
      },
      message: "Comment content is required",
    };
  }

  const sanitizedContent = DOMPurify.sanitize(content);
  try {
    // Validate the sanitized content
    const parsedContent = CommentFormSchema.parse({
      content: sanitizedContent,
    });
    // Extract postId and parentId
    const postId = payload.get("postId")?.toString();
    const parentId = payload.get("parentId")?.toString();
    let comment: EssentialComment | null = null;
    // Validate parentId if provided
    if (parentId) {
      const parentExists = await prisma.comment.findUnique({
        where: { id: parentId },
      });
      if (!parentExists) {
        return {
          errors: {
            content: [], // Ensure the structure matches expected type
          },
          message: "Parent comment does not exist",
        };
      }
      comment = await prisma.comment.create({
        data: {
          content: parsedContent.content,
          author: {
            connect: { id: userId },
          },
          post: postId
            ? {
                connect: { id: postId },
              }
            : undefined,
          parent: parentId
            ? {
                connect: { id: parentId },
              }
            : undefined,
        },
      });
    } else {
      comment = await prisma.comment.create({
        data: {
          content: parsedContent.content,
          author: {
            connect: { id: userId },
          },
          post: postId
            ? {
                connect: { id: postId },
              }
            : undefined,
        },
      });
    }
    const processedComment = await getEssentialComment(comment.id);

    return processedComment;
  } catch (error) {
    console.error("Error creating comment:", error);
    if (error instanceof z.ZodError) {
      return {
        errors: error.flatten().fieldErrors,
        message: "Validation error",
      };
    } else if (error instanceof Error) {
      return {
        errors: {
          content: [error.message],
        },
        message: "An unexpected error occurred",
      };
    } else {
      return {
        errors: {
          content: ["Unknown error occurred"],
        },
        message: "An unexpected error occurred",
      };
    }
  }
}

export async function likeComment(
  commentId: string,
  userId: string | undefined
) {
  if (!userId) {
    throw new Error("User ID is required");
  }
  if (!commentId) {
    throw new Error("Comment ID is required");
  }

  // Check if the comment exists
  const commentExists = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { id: true },
  });

  if (!commentExists) {
    throw new Error(`Comment with ID ${commentId} does not exist`);
  }

  try {
    // Check if the comment is already liked by this user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        likedComments: {
          where: { id: commentId },
          select: { id: true },
        },
      },
    });

    const isLiked = (user?.likedComments ?? []).length > 0;

    if (isLiked) {
      // Unlike: Disconnect the relationship
      await prisma.comment.update({
        where: { id: commentId },
        data: {
          likedBy: {
            disconnect: { id: userId },
          },
        },
      });

      // Verify the join table state
      // const joinTableState = await prisma.$queryRaw`
      //   SELECT * FROM "_UserLikedComments" WHERE "A" = ${commentId} AND "B" = ${userId};
      // `;
      // console.error("Join table state after unlike:", joinTableState);

      await prisma.user.update({
        where: { id: userId },
        data: {
          likedComments: {
            disconnect: { id: commentId },
          },
        },
      });
    } else {
      // Like: Connect the relationship
      await prisma.comment.update({
        where: { id: commentId },
        data: {
          likedBy: {
            connect: { id: userId },
          },
        },
      });

      // Verify the join table state
      // const joinTableState = await prisma.$queryRaw`
      //   SELECT * FROM "_UserLikedComments" WHERE "A" = ${commentId} AND "B" = ${userId};
      // `;
      // console.error("Join table state after like:", joinTableState);

      await prisma.user.update({
        where: { id: userId },
        data: {
          likedComments: {
            connect: { id: commentId },
          },
        },
      });
    }

    // Fetch the updated comment to verify the likedBy field
    const updatedComment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        content: true,
        authorId: true,
        likedBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return updatedComment;
  } catch (error) {
    console.error("Error toggling comment like status:", error);
    throw error;
  }
}

export async function isLikedByUser(
  userId: string | undefined,
  commentId: string | undefined
) {
  if (!userId || !commentId) {
    console.error("Invalid input: userId or commentId is undefined");
    return false;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        likedComments: {
          where: { id: commentId },
          select: { id: true },
        },
      },
    });

    const isLiked = (user?.likedComments ?? []).length > 0;
    return isLiked;
  } catch (error) {
    console.error("Error in isLikedByUser:", error);
    return false;
  }
}

export async function getEssentialComment(commentId: string) {
  return prisma.comment.findUnique({
    where: { id: commentId },
    select: {
      id: true,
      content: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      authorId: true,
      postId: true,
      likedBy: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      replies: {
        select: {
          id: true,
          content: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          authorId: true,
          postId: true,
          _count: {
            select: {
              likedBy: true,
              replies: true,
            },
          },
          parentId: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
      parentId: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          likedBy: true,
          replies: true,
        },
      },
    },
  });
}

export async function getBasicComment(commentId: string) {
  return prisma.comment.findUnique({
    where: { id: commentId },
    select: {
      id: true,
      content: true,
      authorId: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          likedBy: true,
          replies: true,
        },
      },
      postId: true,
      createdAt: true,
      updatedAt: true,
      parentId: true,
    },
  });
}

export async function fetchPaginatedReplies(
  commentId: string,
  cursor: string | null
): Promise<{ replies: EssentialComment[]; nextCursor: string | null }> {
  const response = await fetch(
    `/api/comments/${commentId}/replies?cursor=${cursor || ""}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch replies");
  }
  return response.json();
}
