import { deleteSession } from "@/app/lib/session.server";
import { redirect } from "next/navigation";

export async function logout() {
  deleteSession();
  redirect("/");
}
