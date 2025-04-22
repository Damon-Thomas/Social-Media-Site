import { getUser } from "@/app/lib/dal";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await getUser();

  if (!user) {
    redirect("/auth");
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <p>Account created on: {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  );
}
