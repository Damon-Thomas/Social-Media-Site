import { User } from "@/app/lib/definitions";
import Image from "next/image";
import BioText from "./BioText";
import { useDefaultProfileImage } from "@/app/utils/defaultProfileImage";
import EditProfileModal from "./EditProfileModal"; // Update the path to the correct location
import Button from "../../core/Button";
import { useFullUser } from "@/app/context/UserContext";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  followUser,
  sendFriendRequest,
  unfollowUser,
} from "@/app/actions/fetch";
import { useEffect, useState } from "react";

export default function PersInfo({
  userData,
  ownProfile = false,
  refreshProfileData,
}: {
  userData: User;
  ownProfile?: boolean;
  refreshProfileData?: () => Promise<void>;
}) {
  const defaultProfile = useDefaultProfileImage();
  const fullUser = useFullUser();
  const [friendCount, setFriendCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [areFriends, setAreFriends] = useState<
    "friend" | "none" | "pending" | "received"
  >("none");

  useEffect(() => {
    if (userData) {
      setFriendCount(userData?.friends?.length || 0);
      setFollowerCount(userData?.followers?.length || 0);
    }
  }, [userData]);

  useEffect(() => {
    if (!fullUser || !userData) return;
    const isFriend = fullUser?.friends?.some(
      (friendUser: User) => friendUser?.id === userData.id
    );
    const isPending = fullUser?.friendRequestsSent?.some(
      (requestUser: User) => requestUser?.id === userData.id
    );
    const isReceived = fullUser?.friendRequestsReceived?.some(
      (requestUser: User) => requestUser?.id === userData.id
    );
    if (isFriend) {
      setAreFriends("friend");
    } else if (isPending) {
      setAreFriends("pending");
    } else if (isReceived) {
      setAreFriends("received");
    } else {
      setAreFriends("none");
    }
  }, [fullUser, userData]);

  useEffect(() => {
    if (fullUser && userData) {
      setIsFollowing(
        fullUser?.following?.some(
          (followingUser: User) => followingUser?.id === userData.id
        ) || false
      );
    }
  }, [fullUser, userData]);

  if (!userData) {
    return null;
  }

  async function follow() {
    if (!userData || !fullUser) return;
    try {
      if (isFollowing) {
        await unfollowUser(fullUser.id, userData.id);
        setIsFollowing(false);
        // Optimistically decrement
        setFollowerCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
      } else {
        await followUser(fullUser.id, userData.id);
        setIsFollowing(true);
        // Optimistically increment
        setFollowerCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
      throw new Error("Failed to follow/unfollow user");
    }
  }

  async function handleFriendRequest() {
    if (!userData || !fullUser) return;
    const isPending = areFriends === "pending";
    const isReceived = areFriends === "received";
    const isFriend = areFriends === "friend";

    try {
      if (isPending) {
        // Cancel friend request
        await cancelFriendRequest(fullUser.id, userData.id);
        setAreFriends("none");
      } else if (isReceived) {
        // Accept friend request
        await acceptFriendRequest(fullUser.id, userData.id);
        setAreFriends("friend");
        setFriendCount((prevCount) => prevCount + 1);
      } else if (isFriend) {
        // Unfriend
        await cancelFriendRequest(fullUser.id, userData.id);
        setAreFriends("none");
        setFriendCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
      } else {
        // Send friend request
        await sendFriendRequest(fullUser.id, userData.id);
        setAreFriends("pending");
      }
    } catch (error) {
      console.error("Error handling friend request:", error);
      throw new Error("Failed to handle friend request");
    }
  }

  const handleFollowClick = async () => {
    if (!ownProfile) {
      await follow();
    }
  };

  const profileImage =
    userData.image && userData.image.trim() !== ""
      ? userData.image
      : defaultProfile;

  return (
    <div className="flex items-start mb-4 gap-4 md:gap-8 justify-start w-full">
      <Image
        src={profileImage}
        alt="User Avatar"
        width={100}
        height={100}
        className="self-center rounded-full w-20 h-20 md:w-40 md:h-40 object-cover mb-4 shrink-0"
        priority
      />
      <div className="flex grow min-h-full">
        <div className="grow flex flex-col gap-2">
          <div className="flex flex-col justify-start gap-2 h-full">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">{userData.name}</h1>
              {ownProfile && (
                <EditProfileModal
                  bio={userData?.bio || ""}
                  refreshProfileData={refreshProfileData}
                ></EditProfileModal>
              )}
              {!ownProfile && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleFollowClick}
                    style={!isFollowing ? "default" : "bordered"}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                  <Button
                    onClick={handleFriendRequest}
                    style={
                      areFriends === "none" || areFriends === "received"
                        ? "default"
                        : "bordered"
                    }
                  >
                    {areFriends === "friend"
                      ? "Unfriend"
                      : areFriends === "none"
                      ? "Befriend"
                      : areFriends === "received"
                      ? "Accept"
                      : "Pending"}
                  </Button>
                </div>
              )}
            </div>
            <BioText>{userData.bio}</BioText>
          </div>

          <div className="flex font-bold gap-4 gap-y-0 justify-between flex-wrap">
            <p className="whitespace-nowrap w-fit">
              {`Joined:
                ${userData.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}`}
            </p>
            <div className="flex gap-4 w-fit">
              <p className="whitespace-nowrap">{followerCount} followers</p>
              <p className="whitespace-nowrap">{friendCount} friends</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
