import type { User } from "@/app/lib/definitions";
import PersInfo from "./PersInfo";
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

  return (
    <div className=" flex justify-start items-start gap-4 md:gap-8 h-full w-full">
      <PersInfo userData={userData} />
    </div>
  );
}
