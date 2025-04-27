"use server";

import { verifySession } from "@/app/lib/dal";
import { deleteSession } from "@/app/lib/session.server";
import { redirect } from "next/navigation";

// For clearing invalid sessions
export async function validateSessionOrClear() {
  const session = await verifySession();

  if (!session) {
    // Return false to indicate an invalid session
    return false;
  }

  // Return true for a valid session
  return true;
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
