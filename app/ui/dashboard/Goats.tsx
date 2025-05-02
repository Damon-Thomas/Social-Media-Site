"use client";

import { useEffect, useState } from "react";
import { mostPopular } from "@/app/actions/fetch";
import SideWrapper from "../sidebar/SideWrapper";

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
  const refreshPopularUsers = async () => {
    setLoading(true);
    const users = await mostPopular();
    setPopularUsers(users);
    setLoading(false);
  };

  useEffect(() => {
    refreshPopularUsers();
  }, []);

  return (
    <>
      {loading ? (
        <p>Loading popular users...</p>
      ) : (
        <SideWrapper userArray={popularUsers} refreshList={refreshPopularUsers}>
          {" "}
          Top Users{" "}
        </SideWrapper>
      )}
    </>
  );
}
