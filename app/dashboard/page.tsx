import { getUser } from "@/app/lib/dal";
import { redirect } from "next/navigation";
import { logout } from "@/app/lib/session";

export default async function Dashboard() {
  const user = await getUser();

  if (!user) {
    redirect("/auth");
  }

  return (
    <div className="p-6 ">
      <h1 className="text-2xl font-bold mb-4 ">Welcome, {user.name}!</h1>
      <p className="mb-2 ">Email: {user.email}</p>
      <p className="">
        Account created on: {new Date(user.createdAt).toLocaleDateString()}
      </p>
      <div onClick={logout} className="cursor-pointer">
        logout
      </div>
    </div>
  );
}
