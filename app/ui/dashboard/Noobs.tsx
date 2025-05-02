import { useEffect, useState } from "react";
import { getNewUsers } from "@/app/actions/fetch";
import { User } from "@/app/lib/definitions";
import SideItem from "../sidbar/SideItem";

export default function Noobs() {
  const [newUsers, setNewUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewUsers = async () => {
      try {
        const users = await getNewUsers();
        setNewUsers(users);
      } catch (error) {
        console.error("Error fetching new users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>New Users</h1>
      <ul>
        {newUsers.map((user: User) => (
          <SideItem key={user?.id} userData={user} />
        ))}
      </ul>
    </div>
  );
}
