"use client";

import { useEffect, useState } from "react";
import { mostPopular } from "@/app/actions/fetch";
import SideWrapper from "../sidebar/SideWrapper";
import SideSectionSkeleton from "../skeleton/sidebar/SideSkeleton";
import { useCurrentUser } from "@/app/context/UserContext";

export default function Goats() {
  const [popularUsers, setPopularUsers] = useState<
    {
      id: string;
      name: string | null;
      image: string | null;
      _count?: { followers: number };
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const user = useCurrentUser();

  useEffect(() => {
    async function fetchPopularUsers() {
      setLoading(true);
      const users = await mostPopular(user?.id);
      setPopularUsers(users);
      setLoading(false);
    }
    fetchPopularUsers();
  }, [user?.id]);

  return (
    <>
      {loading ? (
        <SideSectionSkeleton section="Goats" />
      ) : (
        <SideWrapper userArray={popularUsers}>Top Users</SideWrapper>
      )}
    </>
  );
}
