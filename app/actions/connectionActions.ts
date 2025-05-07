"use server";

import prisma from "../lib/prisma";

export async function getFriends() {
  const friends = prisma.user.findUnique({
    where: {
      id: "userId",
    },
    select: {
      friends: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
  return friends;
}

export async function getFollowers() {
  const followers = prisma.user.findUnique({
    where: {
      id: "userId",
    },
    select: {
      followers: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
  return followers;
}

export async function getFollowing() {
  const following = prisma.user.findUnique({
    where: {
      id: "userId",
    },
    select: {
      following: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
  return following;
}

export async function getFriendsRequestsReceived() {
  const friendRequests = prisma.user.findUnique({
    where: {
      id: "userId",
    },
    select: {
      friendRequestsReceived: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
  return friendRequests;
}

export async function getFriendRequestsSent() {
  const friendRequests = prisma.user.findUnique({
    where: {
      id: "userId",
    },
    select: {
      friendRequestsSent: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
  return friendRequests;
}
