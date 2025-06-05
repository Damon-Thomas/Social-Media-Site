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
  await prisma.comment.updateMany({
    where: { authorId: userId },
    data: { authorId: null, content: "This comment has been deleted." },
  });
}

// maintain posts for deleted users
// This is to maintain the integrity of the posts in the system and to maintain comment chains
async function deleteUserPosts(userId: string) {
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
