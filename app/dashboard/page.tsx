import { getUser } from "@/app/lib/dal";
import { redirect } from "next/navigation";
import PostCreator from "../ui/posts/PostCreater";
import Image from "next/image";
import defaultProfile from "@public/defaultProfile.svg";

export default async function Dashboard() {
  const user = await getUser();

  if (!user) {
    redirect("/auth");
  }

  // Get the profile image from any possible source
  const profileImage =
    user.image ||
    user.picture ||
    user.avatar ||
    user.profilePicture ||
    defaultProfile;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
      <Image
        src={profileImage}
        alt="User profile picture"
        width={100}
        height={100}
        className="rounded-full mb-4"
      />
      <PostCreator />
    </div>
  );
}
