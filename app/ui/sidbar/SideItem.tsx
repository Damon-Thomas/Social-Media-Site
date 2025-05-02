import { User } from "@/app/lib/definitions";
import Image from "next/image";

export default function SideItem({ userData }: { userData: User }) {
  return (
    <li className="flex items-center p-2 gap-2 min-h-16">
      <Image
        src={userData?.image || "/defaultProfileLight.svg"}
        alt={userData?.name || "User"}
        className="w-10 h-10 rounded-full object-cover bg-gray-200"
        width={40}
        height={40}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <h3 className="font-semibold truncate">{userData?.name}</h3>
        <p className="text-sm text-gray-500">
          Followers {userData?.followers?.length ?? 0}
        </p>
      </div>
      <button className="bg-[var(--dmono)] text-[var(--rdmono)] px-4 py-2 rounded whitespace-nowrap">
        Follow
      </button>
    </li>
  );
}
