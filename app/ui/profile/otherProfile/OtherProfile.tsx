import type { User } from "@/app/lib/definitions";
// import PostsSection from "./PostsSection";

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

  return <div className="max-w-2xl mx-auto"></div>;
}
