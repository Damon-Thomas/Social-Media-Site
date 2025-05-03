import { useEffect, useState } from "react";
import { getNewUsers } from "@/app/actions/fetch";
import { SimpleUser } from "@/app/lib/definitions";
import SideWrapper from "../sidebar/SideWrapper";
import { useCurrentUser } from "@/app/context/UserContext";
import SideSectionSkeleton from "../skeleton/sidebar/SideSkeleton";

export default function Noobs() {
  const [newUsers, setNewUsers] = useState<SimpleUser[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useCurrentUser();

  useEffect(() => {
    async function fetchNewUsers() {
      setLoading(true);
      const users = await getNewUsers(user?.id);
      setNewUsers(users);
      setLoading(false);
    }
    fetchNewUsers();
  }, [user?.id]);

  return (
    <>
      {loading ? (
        <SideSectionSkeleton section="New Users" />
      ) : (
        <SideWrapper userArray={newUsers}>New Users</SideWrapper>
      )}
    </>
  );
}
