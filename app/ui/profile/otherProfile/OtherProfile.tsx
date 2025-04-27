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
    <div className="max-w-2xl mx-auto">
      <PostsSection userId={userData.id} initialPosts={initialPosts} />
    </div>
  );
}
