"use server";

import prisma from "../lib/prisma";

export async function getFriends(userId: string) {
  const friends = await prisma.user.findUnique({
    where: {
      id: userId,
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

export async function getFollowers(userId: string) {
  const followers = await prisma.user.findUnique({
    where: {
      id: userId,
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

export async function getFollowing(userId: string) {
  const following = await prisma.user.findUnique({
    where: {
      id: userId,
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

export async function getFriendRequestsReceived(userId: string) {
  console.log("Fetching friend requests received...");

  const friendRequests = await prisma.user.findUnique({
    where: {
      id: userId,
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
  console.log("Friend Requests Received:", friendRequests);

  return friendRequests;
}

export async function getFriendRequestsSent(userId: string) {
  const friendRequests = await prisma.user.findUnique({
    where: {
      id: userId,
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

export async function getProspects(
  userId: string,
  take: number,
  start: number
) {
  const prospects = await prisma.user.findMany({
    where: {
      NOT: {
        id: userId,
      },
      friends: {
        none: {
          id: userId,
        },
      },
      friendRequestsReceived: {
        none: {
          id: userId,
        },
      },
      friendRequestsSent: {
        none: {
          id: userId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
      _count: {
        select: {
          followers: true,
          posts: true,
          comments: true,
          friends: true,
        },
      },
    },
    take: take,
    skip: start,
    distinct: ["id"],
  });
  return prospects;
}
