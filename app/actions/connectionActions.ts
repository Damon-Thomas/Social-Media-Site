"use server";

import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

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
  start: number,
  type:
    | "none"
    | "friends"
    | "followers"
    | "following"
    | "friendRequestsSent"
    | "recentlyActive"
) {
  // @ts-expect-errorswitchstatement
  let where: Prisma.UserWhereInput | undefined;
  // @ts-expect-errorswitchstatement
  let orderBy: Prisma.UserOrderByWithRelationInput | undefined;

  switch (type) {
    case "none":
      where = {
        NOT: {
          id: userId,
        },
        friends: { none: { id: userId } },
        friendRequestsReceived: { none: { id: userId } },
        friendRequestsSent: { none: { id: userId } },
      };
      break;
    case "friends":
      where = {
        friends: { some: { id: userId } },
        id: { not: userId },
      };
      break;
    case "followers":
      where = {
        following: { some: { id: userId } },
        id: { not: userId },
      };
      break;
    case "following":
      where = {
        followers: { some: { id: userId } },
        id: { not: userId },
      };
      break;
    case "friendRequestsSent":
      where = {
        friendRequestsReceived: { some: { id: userId } },
        id: { not: userId },
      };
      break;
    case "recentlyActive":
      where = {
        id: { not: userId },
      };
      orderBy = { updatedAt: "desc" };
      break;
    default:
      where = {
        id: { not: userId },
      };
  }

  const prospects = await prisma.user.findMany({
    where,
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
    take,
    skip: start * take,
    distinct: ["id"],
    ...(orderBy ? { orderBy } : {}),
  });
  // console.log("Prospects fetched:", prospects, "Type:", type, take, start);
  return prospects;
}

export async function getFriendsPaginated(
  userId: string,
  take: number,
  start: number
) {
  console.log(
    "Fetching friends paginated for user:",
    userId,
    "Take:",
    take,
    "Start:",
    start
  );
  const users = await prisma.user.findMany({
    where: {
      friends: {
        some: {
          id: userId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
    take,
    skip: start * take,
  });
  console.log("Friends paginated fetched:", users);
  return users;
}
