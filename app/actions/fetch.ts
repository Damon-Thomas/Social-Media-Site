"use server";

import prisma from "../lib/prisma";
import type { Activity } from "@/app/lib/definitions";
import type { Post, Comment } from "@/app/lib/definitions";

export async function mostPopular(currentUserId?: string) {
  const take = 5;
  const popularUsers = await prisma.user.findMany({
    where: {
      id: { not: currentUserId }, // Exclude current user
    },
    orderBy: {
      followers: {
        _count: "desc",
      },
    },
    take: take,
    select: {
      id: true,
      name: true,
      image: true,
      _count: {
        select: { followers: true },
      },
      theme: true,
    },
  });

  return popularUsers;
}

export async function getNewUsers(currentUserId?: string) {
  const newUsers = await prisma.user.findMany({
    where: {
      id: { not: currentUserId }, // Exclude current user
    },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      image: true,
      _count: {
        select: { followers: true },
      },
      theme: true,
    },
  });

  return newUsers;
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
        include: {
          comments: {
            include: {
              author: true,
            },
          },
        },
      },
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          post: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              updatedAt: true,
              authorId: true,
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  password: true,
                  bio: true,
                  createdAt: true,
                  updatedAt: true,
                  image: true,
                  profileId: true,
                },
              },
              comments: {
                select: {
                  id: true,
                  content: true,
                  createdAt: true,
                  updatedAt: true,
                  authorId: true,
                  postId: true,
                  parentId: true,
                  author: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      password: true,
                      bio: true,
                      createdAt: true,
                      updatedAt: true,
                      image: true,
                      profileId: true,
                    },
                  },
                  likedBy: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      password: true,
                      bio: true,
                      createdAt: true,
                      updatedAt: true,
                      image: true,
                      profileId: true,
                    },
                  },
                  replies: {
                    select: {
                      id: true,
                      content: true,
                      createdAt: true,
                      updatedAt: true,
                      authorId: true,
                      postId: true,
                      parentId: true,
                      author: {
                        select: {
                          id: true,
                          name: true,
                          email: true,
                          password: true,
                          bio: true,
                          createdAt: true,
                          updatedAt: true,
                          image: true,
                          profileId: true,
                        },
                      },
                      likedBy: {
                        select: {
                          id: true,
                          name: true,
                          email: true,
                          password: true,
                          bio: true,
                          createdAt: true,
                          updatedAt: true,
                          image: true,
                          profileId: true,
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
                  email: true,
                  password: true,
                  bio: true,
                  createdAt: true,
                  updatedAt: true,
                  image: true,
                  profileId: true,
                },
              },
            },
          },
        },
      },
      followers: true,
      following: true,
      friends: true,
      theme: true,
    },
  });
  return user;
}

export async function fetchPaginatedPosts(
  userId: string,
  cursor?: string,
  limit: number = 5,
  currentUserId?: string
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
      likedBy: true, // Include likedBy to get the count
    },
  });

  // Map posts to include isLikedByUser field if currentUserId is provided
  const postsWithLikeStatus = posts.map((post) => ({
    ...post,
    ...(currentUserId && {
      isLikedByUser: post.likedBy.some((user) => user.id === currentUserId),
    }),
  }));

  const nextCursor = posts.length === limit ? posts[posts.length - 1].id : null;

  return { posts: postsWithLikeStatus, nextCursor };
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
      author: true,
      post: { select: { id: true, content: true, author: true } },
      likedBy: true, // Include likedBy to get the count
      replies: true, // Include replies to get the count
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
      likedBy: true, // Include likedBy to get the count
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
      likedBy: true, // Include likedBy to get the count
      replies: true, // Include replies to get the count
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
): Promise<{ activities: Activity[]; nextCursor: string | null }> {
  // 1) fetch all four lists with the same shape your other sections use
  const [posts, comments, likedPosts, likedComments] = await Promise.all([
    prisma.post.findMany({
      where: { authorId: userId },
      select: {
        id: true,
        createdAt: true,
        content: true,
        authorId: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        likedBy: true, // Include likedBy array for proper count
        comments: true, // Include comments array for proper count
      },
    }),
    prisma.comment.findMany({
      where: { authorId: userId },
      select: {
        id: true,
        createdAt: true,
        content: true,
        authorId: true,
        postId: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        likedBy: true, // Include likedBy array for proper count
        replies: true, // Include replies array for proper count
      },
    }),
    prisma.post.findMany({
      where: { likedBy: { some: { id: userId } } },
      select: {
        id: true,
        createdAt: true,
        content: true,
        authorId: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        likedBy: true, // Include likedBy array for proper count
        comments: true, // Include comments array for proper count
      },
    }),
    prisma.comment.findMany({
      where: { likedBy: { some: { id: userId } } },
      select: {
        id: true,
        createdAt: true,
        content: true,
        authorId: true,
        postId: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        likedBy: true, // Include likedBy array for proper count
        replies: true, // Include replies array for proper count
      },
    }),
  ]);

  // 2) normalize into Activity[]
  const all: Activity[] = [
    ...posts.map((p) => ({
      id: `post:${p.id}`,
      type: "post" as const,
      createdAt: p.createdAt,
      payload: {
        id: p.id,
        content: p.content,
        authorId: p.authorId,
        createdAt: p.createdAt,
        updatedAt: p.createdAt, // Assuming updatedAt is same as createdAt for simplicity
        author: p.author,
        likedBy: p.likedBy, // Include likedBy array
        comments: p.comments, // Include comments array
      },
    })),
    ...comments.map((c) => ({
      id: `comment:${c.id}`,
      type: "comment" as const,
      createdAt: c.createdAt,
      payload: {
        id: c.id,
        content: c.content,
        authorId: c.authorId,
        postId: c.postId,
        createdAt: c.createdAt,
        updatedAt: c.createdAt, // Assuming updatedAt is same as createdAt for simplicity
        author: c.author,
        likedBy: c.likedBy, // Include likedBy array
        replies: c.replies, // Include replies array
      },
    })),
    ...likedPosts.map((p) => ({
      id: `likedPost:${p.id}`,
      type: "likedPost" as const,
      createdAt: p.createdAt,
      payload: {
        id: p.id,
        content: p.content,
        authorId: p.authorId,
        createdAt: p.createdAt,
        updatedAt: p.createdAt, // Assuming updatedAt is same as createdAt for simplicity
        author: p.author,
        likedBy: p.likedBy, // Include likedBy array
        comments: p.comments, // Include comments array
      },
    })),
    ...likedComments.map((c) => ({
      id: `likedComment:${c.id}`,
      type: "likedComment" as const,
      createdAt: c.createdAt,
      payload: {
        id: c.id,
        content: c.content,
        authorId: c.authorId,
        postId: c.postId,
        createdAt: c.createdAt,
        updatedAt: c.createdAt, // Assuming updatedAt is same as createdAt for simplicity
        author: c.author,
        likedBy: c.likedBy, // Include likedBy array
        replies: c.replies, // Include replies array
      },
    })),
  ];

  // 3) sort by date desc and page‐through
  all.sort(
    (a, b) =>
      (b?.createdAt ? b.createdAt.getTime() : 0) -
      (a?.createdAt ? a.createdAt.getTime() : 0)
  );
  const start = cursor ? all.findIndex((x) => x?.id === cursor) + 1 : 0;
  const page = all.slice(start, start + limit);
  const nextCursor = page.length === limit ? page[page.length - 1]?.id : null;

  return { activities: page, nextCursor: nextCursor ?? null };
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
        include: { author: true, comments: true, likedBy: true },
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
        include: { author: true, post: true, likedBy: true, replies: true },
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

export async function followUser(userId: string, followId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        following: {
          connect: { id: followId },
        },
      },
    });
    await prisma.user.update({
      where: { id: followId },
      data: {
        followers: {
          connect: { id: userId },
        },
      },
    });
  } catch (error) {
    console.error("Error following user:", error);
    throw new Error("Failed to follow user");
  }
  return true;
}
export async function unfollowUser(userId: string, unfollowId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        following: {
          disconnect: { id: unfollowId },
        },
      },
    });
    await prisma.user.update({
      where: { id: unfollowId },
      data: {
        followers: {
          disconnect: { id: userId },
        },
      },
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw new Error("Failed to unfollow user");
  }
  return true;
}

export async function sendFriendRequest(userId: string, friendId: string) {
  if (userId === friendId) {
    throw new Error("Cannot send friend request to yourself");
  }
  // Check if the friend request already exists
  const existingRequest = await prisma.user.findFirst({
    where: {
      id: userId,
      friendRequestsSent: {
        some: { id: friendId },
      },
    },
    select: { id: true },
  });
  if (existingRequest) {
    throw new Error("Friend request already sent");
  }
  // Check if already friends
  const alreadyFriends = await prisma.user.findFirst({
    where: {
      id: userId,
      friends: {
        some: { id: friendId },
      },
    },
    select: { id: true },
  });
  if (alreadyFriends) {
    throw new Error("You are already friends with this user");
  }
  // Check if the friend request is already received
  const existingReceivedRequest = await prisma.user.findFirst({
    where: {
      id: friendId,
      friendRequestsReceived: {
        some: { id: userId },
      },
    },
    select: { id: true },
  });
  // if received request exists, accept it
  if (existingReceivedRequest) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          friends: {
            connect: { id: friendId },
          },
          friendRequestsReceived: {
            disconnect: { id: userId },
          },
          friendRequestsSent: {
            disconnect: { id: friendId },
          },
        },
      });
    } catch (error) {
      console.error("Error accepting friend request:", error);
      throw new Error("Failed to accept friend request");
    }

    try {
      await prisma.user.update({
        where: { id: friendId },
        data: {
          friends: {
            connect: { id: userId },
          },
          friendRequestsSent: {
            disconnect: { id: friendId },
          },
          friendRequestsReceived: {
            disconnect: { id: userId },
          },
        },
      });
      return true; // Successfully accepted the request
    } catch (error) {
      console.error("Error accepting friend request:", error);
      //undo one sided friendship to handle error
      await prisma.user.update({
        where: { id: friendId },
        data: {
          friends: {
            disconnect: { id: userId },
          },
          friendRequestsSent: {
            connect: { id: friendId },
          },
        },
      });

      throw new Error("Failed to accept already received friend request");
    }
  }
  // If no existing request, proceed to send a new friend request
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        friendRequestsSent: {
          connect: { id: friendId },
        },
      },
    });
    await prisma.user.update({
      where: { id: friendId },
      data: {
        friendRequestsReceived: {
          connect: { id: userId },
        },
      },
    });
  } catch (error) {
    console.error("Error sending friend request:", error);
    await prisma.user.update({
      where: { id: userId },
      data: {
        friendRequestsSent: {
          disconnect: { id: friendId },
        },
      },
    });
    await prisma.user.update({
      where: { id: friendId },
      data: {
        friendRequestsReceived: {
          disconnect: { id: userId },
        },
      },
    }); // Disconnect if failed at some point
    throw new Error("Failed to send friend request");
  }
  return true; // Successfully sent the friend request
}

export async function cancelFriendRequest(userId: string, friendId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        friendRequestsSent: {
          disconnect: { id: friendId },
        },
      },
    });
    await prisma.user.update({
      where: { id: friendId },
      data: {
        friendRequestsReceived: {
          disconnect: { id: userId },
        },
      },
    });
  } catch (error) {
    console.error("Error canceling friend request:", error);
    throw new Error("Failed to cancel friend request");
  }

  return true;
}

export async function acceptFriendRequest(userId: string, friendId: string) {
  //verify if the friend request exists
  try {
    const requestExists = await prisma.user.findFirst({
      where: {
        id: userId,
        friendRequestsReceived: {
          some: { id: friendId },
        },
      },
      select: { id: true },
    });
    if (!requestExists) {
      throw new Error("Friend request does not exist");
    }
  } catch (error) {
    console.error("Error checking friend request:", error);
    throw new Error("Failed to check friend request");
  }
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        friends: {
          connect: { id: friendId },
        },
        friendRequestsReceived: {
          disconnect: { id: friendId },
        },
        friendRequestsSent: {
          disconnect: { id: userId },
        },
      },
    });
    await prisma.user.update({
      where: { id: friendId },
      data: {
        friends: {
          connect: { id: userId },
        },
        friendRequestsSent: {
          disconnect: { id: userId },
        },
        friendRequestsReceived: {
          disconnect: { id: friendId },
        },
      },
    });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    throw new Error("Failed to accept friend request");
  }
  return true;
}

export async function deleteFriend(userId: string, friendId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        friends: {
          disconnect: { id: friendId },
        },
      },
    });
    await prisma.user.update({
      where: { id: friendId },
      data: {
        friends: {
          disconnect: { id: userId },
        },
      },
    });
  } catch (error) {
    console.error("Error deleting friend:", error);
    throw new Error("Failed to delete friend");
  }
  return true;
}

export async function declineFriendRequest(userId: string, friendId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        friendRequestsReceived: {
          disconnect: { id: friendId },
        },
      },
    });
    await prisma.user.update({
      where: { id: friendId },
      data: {
        friendRequestsSent: {
          disconnect: { id: userId },
        },
      },
    });
  } catch (error) {
    console.error("Error declining friend request:", error);
    throw new Error("Failed to decline friend request");
  }
  return true;
}
