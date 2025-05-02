import { User } from "@/app/lib/definitions";
import Image from "next/image";
import Link from "next/link";
import { useCurrentUser } from "@/app/context/UserContext";

export default function SideItem({ selectedData }: { selectedData: User }) {
  const userData = useCurrentUser();
  if (!selectedData) {
    return null;
  }

  function isFollowing() {
    if (!userData) return false;
    const isFollowing = userData?.following?.some(
      (user) => user?.id === selectedData?.id
    );
    return isFollowing;
  }

  const isCurrentUser = userData?.id === selectedData.id;
  if (isCurrentUser) {
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
          Followers {selectedData?.followers?.length ?? 0}
        </p>
      </div>
      {/* </Link> */}
      <button className="bg-[var(--dmono)] text-[var(--rdmono)] px-4 py-2 rounded whitespace-nowrap">
        {isFollowing() ? "Following" : "Follow"}
      </button>
    </Link>
    // </li>
  );
}
