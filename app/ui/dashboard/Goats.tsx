"use client";

import { useEffect, useState } from "react";
import { mostPopular } from "@/app/actions/fetch";
import Image from "next/image";
import Link from "next/link";
import SideItem from "../sidebar/SideItem";

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
            <SideItem key={user.id} selectedData={user} />
          ))}
        </div>
      ) : (
        <p>No popular users found.</p>
      )}
    </div>
  );
}
