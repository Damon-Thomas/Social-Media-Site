import { fetchUserById } from "@/app/actions/fetch";
import { notFound } from "next/navigation";
import type { User } from "@/app/lib/definitions";
import OtherProfile from "@/app/ui/profile/otherProfile/OtherProfile";

type PageParams = {
  params: Promise<{ userId: string }>;
};

export default async function ProfilePage({ params }: PageParams) {
  const { userId } = await params;
  console.log("User ID from params:", userId);
  const fetched = await fetchUserById(userId);
  if (!fetched) notFound();
  const userData = fetched as User;

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6 overflow-auto">
      <h1>{userData?.name}</h1>
      <OtherProfile userData={userData} />
    </div>
  );
}
