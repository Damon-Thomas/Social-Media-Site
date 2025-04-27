import type { User } from "@/app/lib/definitions";
import Image from "next/image";
import PostsSection from "./PostsSection";

export default function OtherProfile({ userData }: { userData: User }) {
  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold">User not found</h1>
        <p className="mt-2 text-gray-600">
          The user you are looking for does not exist.
        </p>
      </div>
    );
  }
  
  // Get initial posts for the PostsSection component
  const initialPosts = userData.posts || [];

  return (
    <div className="space-y-8 mx-auto">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-6">
            <Image
              src={userData.image || "/default-avatar.png"}
              alt={userData.name || "User"}
              width={80}
              height={80}
              className="rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {userData.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                @{userData.email?.split("@")[0] || userData.id.slice(0, 8)}
              </p>
            </div>
          </div>
          <p className="mt-4 text-gray-800 dark:text-gray-200">
            {userData.profile?.bio || "This user hasn't added a bio yet."}
          </p>
          
          <div className="mt-6 grid grid-cols-4 text-center text-gray-700 dark:text-gray-300">
            <div>
              <span className="block text-lg font-semibold">
                {userData.posts?.length || 0}
              </span>
              <span className="text-sm">Posts</span>
            </div>
            <div>
              <span className="block text-lg font-semibold">
                {userData.followers?.length || 0}
            <span className="block text-lg font-semibold">
              {userData.following?.length || 0}
            </span>
            <span className="text-sm">Following</span>
          </div>
          <div>
            <span className="block text-lg font-semibold">
              {new Date(userData.createdAt).toLocaleDateString()}
            </span>
            <span className="text-sm">Joined</span>
          </div>
        </div>
      </div>
    </div>
  );
}
