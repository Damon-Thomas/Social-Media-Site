import { capitalize } from "@/app/utils/capitalize";
import { useDefaultProfileImage } from "@/app/utils/defaultProfileImage";
import Image from "next/image";
import Link from "next/link";

export type ActivityItem = {
  id?: string;
  cOrp?: "comment" | "post";
  content?: string;
  likeCount?: number;
  commentCount?: number;
  createdAt?: string;
};

export default function ActivityItem({
  data,
  user,
  liked,
  pOrc,
}: {
  data: unknown;
  user?: { id: string; name: string; profileImage?: string };
  liked?: boolean;
  pOrc?: "post" | "comment";
}) {
  const defaultProfileImage = useDefaultProfileImage();
  // Type assertion to extract the id from data
  const item = data as { id?: string; postId?: string };

  const getHref = () => {
    if (pOrc === "post") {
      return `/dashboard/posts/${item.id}`;
    } else if (pOrc === "comment") {
      return `/dashboard/comment/${item.id}`;
    }
    return "#"; // fallback
  };

  return (
    <div className="flex w-full">
      <div className="flex-shrink-0 w-fit h-full">
        <Link href={`/dashboard/profile/${user?.id}`}>
          <Image
            src={user?.profileImage || defaultProfileImage}
            alt={`${user?.name || "User"}'s profile picture`}
            className="rounded-full h-10 w-10 flex-shrink-0"
            width={40}
            height={40}
            loading="lazy"
            style={{ objectFit: "cover" }}
          />
        </Link>
      </div>

      <div className="flex flex-col w-full">
        <Link href={getHref()}>
          <div className="flex items-center justify-between gap-2">
            <p className="">{user?.name}</p>

            <p className="text-[var(--dull)]">
              {liked && "Liked "}
              {liked ? pOrc : pOrc ? capitalize(pOrc) : ""}
            </p>
          </div>
          <p className="whitespace-pre-wrap">
            {data?.content || "Content not available."}
          </p>
        </Link>
        <div className="flex items-center gap-4 mt-0.5"></div>
      </div>
    </div>
  );
}
