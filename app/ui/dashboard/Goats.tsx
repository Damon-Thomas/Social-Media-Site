"use client";

import { useEffect, useState } from "react";
import { mostPopular } from "@/app/actions/fetch";
import Image from "next/image";
import Link from "next/link";

export default function Goats() {
  const [popularUsers, setPopularUsers] = useState<
    {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
      _count?: { followers: number };
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Set initial mobile state
    setIsMobile(window.innerWidth < 768);

    // Add resize listener to update mobile state
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchPopularUsers = async () => {
      try {
        const users = await mostPopular(isMobile);
        setPopularUsers(users);
      } catch (error) {
        console.error("Error fetching popular users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularUsers();
  }, [isMobile]);

  return (
    <div className="border-b-1 border-b-[var(--dmono)] pb-4">
      <h1 className="text-2xl font-bold mb-4">Most Popular Users</h1>

      {loading ? (
        <p>Loading popular users...</p>
      ) : popularUsers.length > 0 ? (
        <div className="space-y-4">
          {popularUsers.map((user) => (
            <Link
              href={`/dashboard/profile/${user.id}`}
              key={user.id}
              className="p-4 border rounded-lg flex items-center"
            >
              {user.image && (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={40}
                  height={40}
                  className="rounded-full mr-4"
                />
              )}
              <div>
                <p className="font-medium">{user.name || "Anonymous"}</p>
                <p className="text-sm text-gray-500">
                  {user._count?.followers || 0} followers
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No popular users found.</p>
      )}
    </div>
  );
}
