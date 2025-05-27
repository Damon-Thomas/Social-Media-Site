import { User } from "@/app/lib/definitions";
import Image from "next/image";
import BioText from "./BioText";
import { useDefaultProfileImage } from "@/app/utils/defaultProfileImage";
import EditProfileModal from "./EditProfileModal"; // Update the path to the correct location
import Button from "../../core/Button";
import { useCurrentUser } from "@/app/context/UserContext";
import { unfollowUser } from "@/app/actions/fetch";

export default function PersInfo({
  userData,
  ownProfile = false,
}: {
  userData: User;
  ownProfile?: boolean;
}) {
  const defaultProfile = useDefaultProfileImage();
  const user = useCurrentUser();

  if (!userData) {
    return null;
  }

  const isFollowing = user?.following?.some(
    (followingUser: User) => followingUser?.id === userData.id
  );

  const isFriend = user?.friends?.some(
    (friendUser: User) => friendUser?.id === userData.id
  );

  async function follow() {
    if (!userData || !user) return;
    try {
      if (isFollowing) {
        await unfollowUser(user.id, userData.id);
        // Optimistically decrement
        if (user._count) selectedData._count.followers--;
      } else {
        await followUser(userData.id, selectedData.id);
        // Optimistically increment
        if (selectedData._count) selectedData._count.followers++;
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
      throw new Error("Failed to follow/unfollow user");
    }

    if (refreshUser) refreshUser();
    // Optionally skip refreshList for faster UI
  }

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
      />
      <div className="flex grow">
        <div className="grow flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{userData.name}</h1>
            {ownProfile && <EditProfileModal></EditProfileModal>}
            {!ownProfile && (
              <div>
                <Button style={!isFollowing ? "default" : "bordered"}>
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
                <Button style={!isFriend ? "default" : "bordered"}>
                  {!isFriend ? "Unfriend" : "Add Friend"}
                </Button>
              </div>
            )}
          </div>
          <BioText>{userData.bio}</BioText>

          <div className="flex gap-8 font-bold justify-between wrap">
            <p className="whitespace-nowrap w-fit">
              {`Joined:
                ${userData.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}`}
            </p>
            <div className="flex gap-4 w-fit">
              <p className="whitespace-nowrap">
                {userData.followers?.length} followers
              </p>
              <p className="whitespace-nowrap">
                {userData.friends?.length} friends
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
