import { SimpleUser } from "@/app/lib/definitions";
import Image from "next/image";
import Link from "next/link";
import { useCurrentUser, useRefreshUser } from "@/app/context/UserContext";
import { followUser, unfollowUser } from "@/app/actions/fetch";
import { useTheme } from "next-themes";

export default function SideItem({
  selectedData,
}: // refreshList, // <-- add this prop
{
  selectedData: SimpleUser;
  // refreshList?: () => void;
}) {
  const userData = useCurrentUser();
  const refreshUser = useRefreshUser();
  const { theme } = useTheme();
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
        await unfollowUser(userData.id, selectedData.id);
        // Optimistically decrement
        if (selectedData._count) selectedData._count.followers--;
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
        src={
          selectedData?.image ||
          (theme === "light"
            ? "/defaultProfileLight.svg"
            : "/defaultProfileDark.svg")
        }
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
