import "server-only";
import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/login");
  }

  return { isAuth: true, userId: session.userId };
});

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const data = await prisma.users.findMany({
      where: {
        id: session.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const user = data[0];

    return user;
  } catch (error) {
    console.log("Failed to fetch user");
    return null;
  }
});
