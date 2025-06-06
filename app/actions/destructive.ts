import prisma from "../lib/prisma";

export async function deleteAccount(userId: string) {
  // Check if the user is a test account
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
    },
  });
  if (!user) {
    return {
      error: "User not found",
      status: 404,
      success: false,
    };
  }
  if (user?.name === "Guest User") {
    return {
      error: "You cannot delete the guest account.",
      status: 403,
      success: false,
    };
  }
  // delete all user-related relationships and data
  try {
    await deleteUserComments(userId);
    await deleteUserPosts(userId);
    await deleteUserFollowing(userId);
    await deleteUserFriendships(userId);
    await deleteFriendRequests(userId);
    //final user deletion
    await deleteUser(userId);
  } catch (error) {
    console.error("Error deleting user data:", error);
    return {
      error: "Failed to delete user data",
      status: 500,
      success: false,
    };
  }

  return {
    user,
    success: true,
  };
}

async function deleteUser(userId: string) {
  // Delete the user account
  // No cascade set due to many to many relationships preventing cascading, delete data manually first
  const deletedUser = await prisma.user.delete({
    where: { id: userId },
  });
  return deletedUser;
}

// maintain commments and posts for deleted users
// This is to maintain the integrity of the comments and posts in the system
async function deleteUserComments(userId: string) {
  // Find comments with no replies and delete them
  let commentsWithNoReplies;
  let round = 1;
  do {
    console.log("Finding comments with no replies for user:", round);
    round++;
    commentsWithNoReplies = await prisma.comment.findMany({
      where: {
        authorId: userId,
        // Find comments where no other comment has this comment as parent
        replies: { none: {} },
      },
      select: { id: true },
    });
    for (const comment of commentsWithNoReplies) {
      await prisma.comment.delete({
        where: { id: comment.id },
      });
    }
  } while (commentsWithNoReplies.length > 0);

  // Update comments with replies to remove authorId and set content to a placeholder
  await prisma.comment.updateMany({
    where: { authorId: userId },
    data: { authorId: null, content: "This comment has been deleted." },
  });
}

// maintain posts for deleted users
// This is to maintain the integrity of the posts in the system and to maintain comment chains
async function deleteUserPosts(userId: string) {
  //find posts with no comments and delete them
  const postsWithNoComments = await prisma.post.findMany({
    where: {
      authorId: userId,
      comments: { none: {} }, // No comments associated with the post
    },
    select: { id: true },
  });
  for (const post of postsWithNoComments) {
    await prisma.post.delete({
      where: { id: post.id },
    });
  }
  // Update posts with comments to remove authorId and set content to a placeholder
  await prisma.post.updateMany({
    where: { authorId: userId },
    data: { authorId: null, content: "This post has been deleted." },
  });
}

async function deleteUserFollowing(userId: string) {
  // Remove user from all other users' followers
  const usersWithAsFollower = await prisma.user.findMany({
    where: {
      followers: {
        some: { id: userId },
      },
    },
    select: { id: true },
  });

  for (const u of usersWithAsFollower) {
    await prisma.user.update({
      where: { id: u.id },
      data: {
        followers: {
          disconnect: { id: userId },
        },
      },
    });
  }

  // Remove user from all other users' following
  const usersWithAsFollowing = await prisma.user.findMany({
    where: {
      following: {
        some: { id: userId },
      },
    },
    select: { id: true },
  });

  for (const u of usersWithAsFollowing) {
    await prisma.user.update({
      where: { id: u.id },
      data: {
        following: {
          disconnect: { id: userId },
        },
      },
    });
  }
}

async function deleteUserFriendships(userId: string) {
  // Remove user from all other users' friends
  const usersWithAsFriend = await prisma.user.findMany({
    where: {
      friends: {
        some: { id: userId },
      },
    },
    select: { id: true },
  });

  for (const u of usersWithAsFriend) {
    await prisma.user.update({
      where: { id: u.id },
      data: {
        friends: {
          disconnect: { id: userId },
        },
      },
    });
  }

  const usersWithAsFriendOf = await prisma.user.findMany({
    where: {
      friendsOfUser: {
        some: { id: userId },
      },
    },
    select: { id: true },
  });

  for (const u of usersWithAsFriendOf) {
    await prisma.user.update({
      where: { id: u.id },
      data: {
        friendsOfUser: {
          disconnect: { id: userId },
        },
      },
    });
  }
}

async function deleteFriendRequests(userId: string) {
  // Remove all friend requests sent by the user
  const usersWithAFriendRequest = await prisma.user.findMany({
    where: { friendRequestsReceived: { some: { id: userId } } },
    select: { id: true },
  });

  // Remove all friend requests received by the user

  for (const u of usersWithAFriendRequest) {
    await prisma.user.update({
      where: { id: u.id },
      data: {
        friendRequestsReceived: {
          disconnect: { id: userId },
        },
      },
    });
  }

  const userSentAFriendRequests = await prisma.user.findMany({
    where: { friendRequestsSent: { some: { id: userId } } },
    select: { id: true },
  });

  for (const u of userSentAFriendRequests) {
    await prisma.user.update({
      where: { id: u.id },
      data: {
        friendRequestsSent: {
          disconnect: { id: userId },
        },
      },
    });
  }
}

export async function deleteComment(userId: string, commentId: string) {
  // Check if the comment exists
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) {
      return {
        error: "Comment not found",
        status: 404,
        success: false,
      };
    }

    // Check if the user is the author of the comment
    if (!comment.authorId) {
      return {
        error: "You are not authorized to delete this comment",
        status: 403,
        success: false,
      };
    }

    // Check if the comment has replies
    const replies = await prisma.comment.findMany({
      where: { parentId: commentId },
    });
    if (replies.length === 0) {
      const usersWhoLikedComment = await prisma.user.findMany({
        where: { likedComments: { some: { id: commentId } } },
        select: { id: true },
      });
      // Remove the comment from all users who liked it
      for (const u of usersWhoLikedComment) {
        await prisma.user.update({
          where: { id: u.id },
          data: {
            likedComments: {
              disconnect: { id: commentId },
            },
          },
        });
      }
      // Delete the comment
      await prisma.comment.delete({
        where: { id: commentId },
      });
      console.log("Comment deleted successfully pre deleted");
      return {
        success: true,
        deleted: true,
      };
    }

    // Delete the comment's content and authorId if it has replies
    await prisma.comment.update({
      where: { id: commentId },
      data: { content: "This comment has been deleted.", authorId: null },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return {
      error: "Failed to delete comment",
      status: 500,
      success: false,
    };
  }
}

export async function deletePost(userId: string, postId: string) {
  // Check if the post exists
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) {
      return {
        error: "Post not found",
        status: 404,
        success: false,
      };
    }

    // Check if the user is the author of the post
    if (post.authorId !== userId) {
      return {
        error: "You are not authorized to delete this post",
        status: 403,
        success: false,
      };
    }

    // Check if the post has comments
    const comments = await prisma.comment.findMany({
      where: { postId: postId },
    });
    if (comments.length === 0) {
      const usersWhoLikedPoast = await prisma.user.findMany({
        where: { likedPosts: { some: { id: postId } } },
        select: { id: true },
      });
      // Remove the post from all users who liked it
      for (const u of usersWhoLikedPoast) {
        await prisma.user.update({
          where: { id: u.id },
          data: {
            likedPosts: {
              disconnect: { id: postId },
            },
          },
        });
      }
      // Delete the post
      await prisma.post.delete({
        where: { id: postId },
      });
      console.log("Post deleted successfully pre deleted");
      return {
        success: true,
        deleted: true,
      };
    }

    // Delete the post info and authorId if there are comments
    await prisma.post.update({
      where: { id: postId },
      data: { content: "This post has been deleted.", authorId: null },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting post:", error);
    return {
      error: "Failed to delete post",
      status: 500,
      success: false,
    };
  }
}
