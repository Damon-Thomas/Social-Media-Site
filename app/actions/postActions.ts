"use server";

import {
  EssentialPost,
  // GetFollowingActivitiesResult,
  FullPost,
} from "../lib/definitions";
import prisma from "../lib/prisma";
import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

const PostFormSchema = z.object({
  content: z
    .string()
    .min(1, "Post content must not be empty")
    .max(1000, "Post content must be less than 1000 characters"),
});

type FormState =
  | {
      errors?: {
        content?: string[];
      };
      message?: string;
    }
  | undefined;

type PostOrState = EssentialPost | FormState;

export async function createPost({
  // state,
  payload,
  userId,
}: {
  // state: FormState;
  payload: FormData;
  userId: string | undefined;
}): Promise<PostOrState> {
  // Sanitize the content
  const content = payload.get("content");
  if (!content) {
    return {
      errors: {
        content: ["Post content is required"],
      },
      message: "Post content is required",
    };
  }

  const sanitizedContent = DOMPurify.sanitize(content.toString());

  try {
    // Validate the sanitized content
    const parsedContent = PostFormSchema.parse({ content: sanitizedContent });

    // Create the post in the database
    const post = await prisma.post.create({
      data: {
        content: parsedContent.content,
      },
    });

    // Update the user's posts
    await prisma.user.update({
      where: { id: userId },
      data: {
        posts: {
          connect: { id: post.id },
        },
      },
    });

    const newPost = await getEssentialPost({
      postId: post.id,
    });

    return newPost;
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
      console.error("Error creating post:", error);
      return {
        errors: {
          content: ["An error occurred while creating the post"],
        },
        message: "An error occurred while creating the post",
      };
    }
  }
}

export async function getfullPost(postId: string): Promise<FullPost> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
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
      comments: {
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
          parentId: true,

          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              likedBy: true,
              replies: true,
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
              createdAt: true,
              updatedAt: true,
              parentId: true,
              _count: {
                select: {
                  likedBy: true,
                  replies: true,
                },
              },
            },
          },
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
          comments: true,
          likedBy: true,
        },
      },
      authorId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  return {
    ...post,
    authorId: post.authorId || "", // Ensure authorId is a string
    comments: post.comments.map((comment) => ({
      ...comment,
      authorId: comment.authorId || "", // Ensure authorId is a string
      author: comment.author || { id: "", name: "", image: null },
      replies: comment.replies.map((reply) => ({
        ...reply,
        authorId: reply.authorId || "", // Ensure authorId is a string
        author: reply.author || { id: "", name: "", image: null },
      })),
    })),
  };
}

export async function getGlobalFeedPosts(
  cursor?: string,
  limit: number = 15,
  userId?: string
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
      // Only include likedBy if userId is provided
      ...(userId && {
        likedBy: {
          where: { id: userId },
          select: { id: true },
        },
      }),
      _count: {
        select: {
          comments: true,
          likedBy: true,
        },
      },
    },
  });

  // Map posts to include likedByUser field and exclude likedBy array
  const postsWithLikeStatus = posts.map(post => ({
    ...post,
    ...(userId && { likedByUser: post.likedBy && post.likedBy.length > 0 }),
    likedBy: undefined, // Remove likedBy from response since EssentialPost doesn't include it
  }));

  const nextCursor = posts.length === limit ? posts[posts.length - 1].id : null;
  return { posts: postsWithLikeStatus, nextCursor };
}

export async function getEssentialPost({
  postId,
}: {
  postId: string;
}): Promise<EssentialPost | null> {
  return await prisma.post.findUnique({
    where: { id: postId },
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
}

// export async function getFollowingActivities(
//   userId: string | undefined,
//   cursor?: string,
//   limit: number = 15
// ): Promise<GetFollowingActivitiesResult> {
//   if (!userId) {
//     throw new Error("User ID is required");
//   }
//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//     setIsModalHidden
//   });

//   // Map to match the expected types
//   if (!user) return null;
//   return {
//     following: user.following.map((f) => ({
//       id: f.id,
//       posts: f.posts
//         .filter((p) => p && p.authorId && p.author) // filter out nulls
//         .map((p) => ({
//           id: p.id,
//           content: p.content,
//           authorId: p.authorId as string,
//           createdAt: p.createdAt,
//           updatedAt: p.updatedAt,
//           author: {
//             id: p.author!.id,
//             name: p.author!.name,
//             image: p.author!.image,
//           },
//           _count: p._count,
//         })),
//       comments: f.comments
//         .filter((c) => c && c.authorId && c.author)
//         .map((c) => ({
//           id: c.id,
//           content: c.content,
//           authorId: c.authorId as string,
//           postId: c.postId as string,
//           createdAt: c.createdAt,
//           updatedAt: c.updatedAt,
//           parentId: c.parentId as string,
//           author: {
//             id: c.author!.id,
//             name: c.author!.name,
//             image: c.author!.image,
//           },
//           _count: c._count,
//         })),
//     })),
//   };
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
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
              createdAt: true,
              updatedAt: true,
              likedBy: {
                where: { id: userId },
                select: { id: true },
              },
              _count: {
                select: {
                  comments: true,
                  likedBy: true,
                },
              },
            },
          },
        },
      },
      posts: {
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
          createdAt: true,
          updatedAt: true,
          likedBy: {
            where: { id: userId },
            select: { id: true },
          },
          _count: {
            select: {
              comments: true,
              likedBy: true,
            },
          },
        },
      },
    },
  });

  const followingPosts = user?.following.flatMap((f) => f.posts) || [];
  const userPosts = user?.posts || [];
  const allPostsRaw = [...followingPosts, ...userPosts].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  // Map posts to include likedByUser field and exclude likedBy array
  const allPosts = allPostsRaw.map(post => ({
    ...post,
    likedByUser: post.likedBy && post.likedBy.length > 0,
    likedBy: undefined, // Remove likedBy from response
  }));

  const nextCursor =
    allPosts.length === limit ? allPosts[allPosts.length - 1].id : null;
  return { posts: allPosts, nextCursor };
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
