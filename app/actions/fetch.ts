"use server";

import prisma from "../lib/prisma";
import { Prisma } from "../../generated/prisma";

export default async function mostPopular(mobile: boolean) {
  const take = mobile ? 3 : 50;
  const popularUsers = await prisma.user.findMany({
    orderBy: {
      followers: {
        _count: "desc",
      },
    } as Prisma.UserOrderByWithRelationInput,
    include: {
      _count: {
        select: { followers: true },
      },
    },
    take: take,
  });

  return popularUsers;
}
