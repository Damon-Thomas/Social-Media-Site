"use client";
import { getFriendRequestsReceived } from "@/app/actions/connectionActions";
import { useCurrentUser, useRefreshUser } from "@/app/context/UserContext";
import { EssentialUser } from "@/app/lib/definitions";
import { useDefaultProfileImage } from "@/app/utils/defaultProfileImage";
import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "../../core/Button";
import Link from "next/link";
import { acceptFriendRequest, declineFriendRequest } from "@/app/actions/fetch";

export default function PendingRequestSection() {
  const [pendingRequests, setPendingRequests] = useState<EssentialUser[]>([]);
  const defaultAvatar = useDefaultProfileImage();
  const user = useCurrentUser();
  const refreshUser = useRefreshUser(); // Add this line

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

  async function acceptRequest(friendId: string) {
    console.log(`Accepting request from ${friendId}`);
    try {
      const accepted = await acceptFriendRequest(user?.id || "", friendId);
      if (accepted) {
        setPendingRequests((prev) =>
          prev.filter((request) => request?.id !== friendId)
        );
        console.log(`Request from ${friendId} accepted successfully.`);

        // Refresh user context to update friend lists
        if (refreshUser) {
          await refreshUser();
        }
      } else {
        console.error(`Failed to accept request from ${friendId}.`);
      }
    } catch (error) {
      console.error(`Error accepting request from ${friendId}:`, error);
    }
  }
  async function declineRequest(friendId: string) {
    console.log(`Declining request from ${friendId}`);
    try {
      const accepted = await declineFriendRequest(user?.id || "", friendId);
      if (accepted) {
        setPendingRequests((prev) =>
          prev.filter((request) => request?.id !== friendId)
        );
        console.log(`Request from ${friendId} declined successfully.`);

        // Refresh user context to update friend request lists
        if (refreshUser) {
          await refreshUser();
        }
      }
    } catch (error) {
      console.error(`Error declining request from ${friendId}:`, error);
    }
  }

  const getHref = (id: string) => {
    return `profile/${id}`;
  };

  return (
    <div className="w-full border-1 border-[var(--borderc)] rounded p-2 md:p-4 my-2 md:my-4">
      <div className="flex flex-col items-start justify-baseline">
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-2xl ">
            {pendingRequests.length
              ? "Friend Requests"
              : "No Pending Friend Requests"}
          </h2>
          <div className="rounded-full bg-[var(--dmono)] text-[var(--rdmono)] font-extrabold w-6 h-6 flex items-center justify-center ">
            {pendingRequests.length}
          </div>
        </div>
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
                onClick={() => acceptRequest(user?.id || "")}
              >
                Accept
              </Button>
              <Button
                className="ml-2"
                style="bordered"
                data-interactive="true"
                onClick={() => declineRequest(user?.id || "")}
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
