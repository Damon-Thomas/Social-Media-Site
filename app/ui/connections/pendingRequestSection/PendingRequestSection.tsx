"use client";
import { getFriendRequestsReceived } from "@/app/actions/connectionActions";
import { useCurrentUser } from "@/app/context/UserContext";
import { EssentialUser } from "@/app/lib/definitions";
import { useDefaultProfileImage } from "@/app/utils/defaultProfileImage";
import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "../../core/Button";
import Link from "next/link";

export default function PendingRequestSection() {
  const [pendingRequests, setPendingRequests] = useState<EssentialUser[]>([]);
  const defaultAvatar = useDefaultProfileImage();
  const user = useCurrentUser();

  useEffect(() => {
    if (!user?.id) return;
    async function fetchPendingRequests() {
      try {
        const response = await getFriendRequestsReceived(user?.id || "");
        console.log("Pending Requests:", response);
        setPendingRequests(response?.friendRequestsReceived || []);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    }
    fetchPendingRequests();
  }, [user?.id]);

  const getHref = (id: string) => {
    return `profile/${id}`;
  };

  return (
    <div className="w-full border-1 border-[var(--borderc)] rounded p-2 md:p-4 my-2 md:my-4">
      <div className="flex flex-col items-start justify-baseline">
        <h2 className="font-bold text-2xl">
          {pendingRequests.length
            ? "Friend Requests"
            : "No Pending Friend Requests"}
        </h2>
        <div className="flex flex-col gap-2 mt-2 w-full">
          {pendingRequests.map((user) => (
            <div
              key={user?.id}
              className="flex items-center gap-2 p-2 border rounded hover:bg-[var(--gtint)] transition-all cursor-pointer"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest('[data-interactive="true"]')) {
                  return;
                }
                window.location.href = getHref(user?.id || "");
              }}
            >
              <Link
                href={`/profile/${user?.id}`}
                className="flex items-center gap-2"
              >
                <Image
                  src={user?.image || defaultAvatar}
                  alt={user?.name || "User Avatar"}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-semibold">{user?.name}</span>
              </Link>
              <Button
                className="ml-auto"
                style="primary"
                data-interactive="true"
                onClick={() =>
                  console.log(`Accepting request from ${user?.name}`)
                }
              >
                Accept
              </Button>
              <Button
                className="ml-2"
                style="bordered"
                data-interactive="true"
                onClick={() =>
                  console.log(`Declining request from ${user?.name}`)
                }
              >
                Decline
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
