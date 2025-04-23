import { getUser } from "@/app/lib/dal";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await getUser();

  if (!user) {
    redirect("/auth");
  }

  // Prevent rendering until user is loaded (prevents flicker on theme change)
  if (!user) return null;

  return (
    <div>
      <h1 className="theme-transition">Welcome, {user.name}!</h1>
      <p className="theme-transition">Email: {user.email}</p>
      <p className="theme-transition">
        Account created on: {new Date(user.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
