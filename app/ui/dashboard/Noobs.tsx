import { useEffect, useState } from "react";
import { getNewUsers } from "@/app/actions/fetch";
import { SimpleUser } from "@/app/lib/definitions";
import SideWrapper from "../sidebar/SideWrapper";

export default function Noobs() {
  const [newUsers, setNewUsers] = useState<SimpleUser[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshPopularUsers = async () => {
    setLoading(true);
    const users = await getNewUsers();
    setNewUsers(users);
    setLoading(false);
  };

  useEffect(() => {
    refreshPopularUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <SideWrapper userArray={newUsers} refreshList={refreshPopularUsers}>
      {" "}
      New Users
    </SideWrapper>
  );
}
