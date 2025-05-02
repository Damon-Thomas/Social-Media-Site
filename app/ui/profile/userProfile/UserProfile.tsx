"use client";

import { useCurrentUser } from "@/app/context/UserContext";
import Image from "next/image";
import BioText from "../otherProfile/BioText";

export default function UserProfile() {
  const userData = useCurrentUser();

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold">{userData.name}</h1>
      <Image
        src={userData.image || "/default-avatar.png"}
        alt="User Avatar"
        width={100}
        height={100}
        className="rounded-full w-20 h-20 md:w-40 md:h-40 object-cover mb-4"
      />
      <p className="mt-2 text-gray-600">This is the user profile page.</p>
      <BioText>{userData.bio}</BioText>
      <div className="mt-4">
        <p>Posts: {userData.posts?.length || 0}</p>
        <p>Followers: {userData.followers?.length || 0}</p>
        <p>Following: {userData.following?.length || 0}</p>
      </div>
    </div>
  );
}
