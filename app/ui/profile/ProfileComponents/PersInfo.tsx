import { User } from "@/app/lib/definitions";
import Image from "next/image";
import BioText from "./BioText";
import EditProfileModal from "./EditProfileModal";
import Button from "../../core/Button";
import { useDefaultProfileImage } from "@/app/utils/defaultProfileImage";
import { useFullUser } from "@/app/context/UserContext";
import { useEffect, useState } from "react";
import { useAddNotification } from "@/app/context/NotificationContext";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  deleteFriend,
  followUser,
  sendFriendRequest,
  unfollowUser,
} from "@/app/actions/fetch";

export default function PersInfo({
  userData,
  ownProfile = false,
  refreshProfileData,
  loading = false, // <-- Add a loading prop!
}: {
  userData?: User;
  ownProfile?: boolean;
  refreshProfileData?: () => Promise<void>;
  loading?: boolean;
}) {
  const defaultProfile = useDefaultProfileImage();
  const fullUser = useFullUser();
  const [friendCount, setFriendCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const [avatarFullSize, setAvatarFullSize] = useState(true);
  const [areFriends, setAreFriends] = useState<
    "friend" | "none" | "pending" | "received"
  >("none");
  const addNotification = useAddNotification();

  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerWidth < 500);
      setAvatarFullSize(window.innerWidth >= 900);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        addNotification(`Unfollowed ${userData.name}`);
        // Optimistically decrement
        setFollowerCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
      } else {
        await followUser(fullUser.id, userData.id);
        addNotification(`Followed ${userData.name}`);
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
        addNotification(`Cancelled friend request to ${userData.name}`);
        setAreFriends("none");
      } else if (isReceived) {
        // Accept friend request
        await acceptFriendRequest(fullUser.id, userData.id);
        addNotification(`Accepted friend request from ${userData.name}`);
        setAreFriends("friend");
        setFriendCount((prevCount) => prevCount + 1);
      } else if (isFriend) {
        // Unfriend
        await deleteFriend(fullUser.id, userData.id);
        addNotification(`Unfriended ${userData.name}`);
        setAreFriends("none");
        setFriendCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
      } else {
        // Send friend request
        await sendFriendRequest(fullUser.id, userData.id);
        addNotification(`Sent friend request to ${userData.name}`);
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

  // Skeleton helpers
  const Skeleton = ({ className }: { className?: string }) => (
    <div
      className={`bg-gray-300 dark:bg-gray-700 animate-pulse ${className}`}
    />
  );

  const profileImage =
    userData?.image && userData.image.trim() !== ""
      ? userData.image
      : defaultProfile;

  return (
    <div className="w-full clearfix">
      {/* Avatar */}
      {loading ? (
        <Skeleton
          className={`rounded-full float-left mr-6 mb-2 ${
            avatarFullSize ? "w-[160px] h-[160px]" : "w-[80px] h-[80px]"
          }`}
        />
      ) : (
        <Image
          src={profileImage}
          alt="User Avatar"
          width={160}
          height={160}
          className="rounded-full float-left object-cover mr-6 mb-2"
          style={{
            width: !avatarFullSize ? "80px" : "160px",
            height: !avatarFullSize ? "80px" : "160px",
          }}
          priority
        />
      )}

      <div className="w-full">
        <div
          className={`flex items-start ${
            isSmall ? "flex-col" : "flex-row"
          } justify-between`}
        >
          {/* Name */}
          {loading ? (
            <Skeleton className="h-8 w-1/3 mb-2 rounded" />
          ) : (
            <h1 className="text-lg pb-2 grow sm:text-2xl font-bold wrap-anywhere ">
              {userData?.name}
            </h1>
          )}

          {/* Edit or Action Buttons */}
          {loading ? (
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded" />
              <Skeleton className="h-8 w-24 rounded" />
            </div>
          ) : ownProfile ? (
            <EditProfileModal
              bio={userData?.bio || ""}
              refreshProfileData={refreshProfileData}
            />
          ) : (
            <div
              className={`flex gap-2 justify-end ${
                isSmall ? "flex-row w-full" : "flex-row"
              }`}
            >
              <Button
                onClick={handleFollowClick}
                style={!isFollowing ? "default" : "bordered"}
                size={isSmall ? "micro" : "medium"}
                className={`${isSmall ? "grow py-2" : ""}`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
              <Button
                onClick={handleFriendRequest}
                className={`${isSmall ? "grow" : ""}`}
                size={isSmall ? "micro" : "medium"}
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

        {/* Bio */}
        {loading ? (
          <Skeleton className="h-4 w-2/3 mb-2 rounded" />
        ) : (
          <BioText>{userData?.bio}</BioText>
        )}

        {/* Stats */}
        <div className="flex font-bold gap-4 p-1 gap-y-0 justify-between flex-wrap">
          {loading ? (
            <>
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
            </>
          ) : (
            <>
              <p className="whitespace-nowrap w-fit">
                {`Joined: ${userData?.createdAt?.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}`}
              </p>
              <div className="flex gap-4 w-fit">
                <p className="whitespace-nowrap">{followerCount} followers</p>
                <p className="whitespace-nowrap">{friendCount} friends</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
