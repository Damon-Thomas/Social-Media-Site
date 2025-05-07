import { redirect } from "next/navigation";
import { validateSessionOrClear } from "@/app/actions/auth";
import { ReactNode } from "react";

export default async function AuthCheck({ children }: { children: ReactNode }) {
  const isValid = await validateSessionOrClear();

  if (!isValid) {
    // Use the full URL for the API call
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/clear-session`);
    redirect("/");
  }

  return <>{children}</>;
}
