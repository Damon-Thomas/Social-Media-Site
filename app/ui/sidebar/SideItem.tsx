import { SimpleUser } from "@/app/lib/definitions";
import Image from "next/image";
import Link from "next/link";
import { useCurrentUser, useRefreshUser } from "@/app/context/UserContext";
import { followUser, unfollowUser } from "@/app/actions/fetch";

export default function SideItem({
  selectedData,
  refreshList, // <-- add this prop
}: {
  selectedData: SimpleUser;
  refreshList?: () => void;
}) {
  const userData = useCurrentUser();
  const refreshUser = useRefreshUser();
  if (!selectedData) {
    return null;
  }

  function isFollowing() {
    if (!userData || !Array.isArray(userData.following)) return false;
    return userData.following.some((user) => user?.id === selectedData?.id);
  }

  async function follow() {
    if (!userData || !selectedData) return;
    const isFollowing = userData?.following?.some(
      (user) => user?.id === selectedData?.id
    );
    try {
      if (isFollowing) {
        // unfollow

        await unfollowUser(userData.id, selectedData.id);
      } else {
        // follow
        await followUser(userData.id, selectedData.id);
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
      throw new Error("Failed to follow/unfollow user");
    }

    if (refreshUser) refreshUser(); // <--- Only call if defined
    if (refreshList) refreshList(); // <-- refresh sidebar list
  }

  async function followHandler(event: React.MouseEvent) {
    event.preventDefault();
    follow();
  }

  const isCurrentUser = userData?.id === selectedData.id;
  if (isCurrentUser) {
    console.log("isCurrentUser", selectedData.name);
    return null; // Don't render the current user's profile
  }

  return (
    // <li className="flex items-center gap-2 h-16">
    <Link
      href={`/dashboard/profile/${selectedData.id}`}
      key={selectedData.id}
      className="flex items-center gap-2 h-16"
    >
      <Image
        src={selectedData?.image || "/defaultProfileLight.svg"}
        alt={selectedData?.name || "User"}
        className="w-10 h-10 rounded-full object-cover bg-gray-200"
        width={40}
        height={40}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <h3 className="font-semibold truncate">{selectedData?.name}</h3>
        <p className="text-sm text-gray-500">
          Followers {selectedData?._count?.followers ?? 0}
        </p>
      </div>
      {/* </Link> */}
      <button
        onClick={followHandler}
        className={`${
          !isFollowing()
            ? "bg-[var(--dmono)] text-[var(--rdmono)] border-[var(--rdmono)]"
            : ""
        }  border-1 w-24 px-4 py-2 rounded whitespace-nowrap`}
      >
        {isFollowing() ? "Following" : "Follow"}
      </button>
    </Link>
    // </li>
  );
}
