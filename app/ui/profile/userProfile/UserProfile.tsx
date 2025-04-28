"use client";

import BioText from "../otherProfile/BioText";
import { useEffect, useState } from "react";
import { fetchUserById } from "@/app/actions/fetch";
import type { User } from "@/app/lib/definitions";
import Image from "next/image";

export default function UserProfile() {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      try {
        // Step 1: Get the current user's basic info
        const response = await fetch("/api/me");
        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }

        const userInfo = await response.json();

        // Step 2: Use fetchUserById to get complete user data
        if (userInfo?.id) {
          const fullUserData = await fetchUserById(userInfo.id);
          console.log("Current user data:", fullUserData);
          setUserData(fullUserData as User);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setLoading(false);
    }

    loadUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>Unable to load user profile</div>;
  }

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

      {/* You can now access other fields too */}
      <div className="mt-4">
        <p>Posts: {userData.posts?.length || 0}</p>
        <p>Followers: {userData.followers?.length || 0}</p>
        <p>Following: {userData.following?.length || 0}</p>
      </div>
    </div>
  );
}
