import Image from "next/image";
import { useState, useEffect } from "react";
import { useDefaultProfileImage } from "@/app/utils/defaultProfileImage";
import { ConnectUser } from "./ConnectionContainer";
import Link from "next/link";

export default function ConnectCard({ user }: { user: ConnectUser }) {
  const [mounted, setMounted] = useState(false);
  const defaultProfileImage = useDefaultProfileImage();
  const iconSize = 25;
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!user) {
    return (
      <div className="animate-pulse flex flex-col justify-between items-center p-2 w-full border-1 rounded-lg h-48 overflow-hidden">
        <div
          className="rounded-full flex-shrink-0 h-20 w-20 bg-gray-700"
          style={{ width: 80, height: 80 }}
        />
        <div className="h-8 bg-gray-700 rounded w-full mt-2" />
        <div className="flex flex-col items-center w-full gap-2 mt-2">
          <div className="flex justify-around h-fit w-full">
            <div className="flex gap-2">
              <div className=" bg-gray-700 rounded  w-6 h-6" />
              <div className=" bg-gray-700 rounded w-6 h-6" />
            </div>
            <div className="flex gap-2">
              <div className=" bg-gray-700 rounded w-6 h-6" />
              <div className=" bg-gray-700 rounded w-6 h-6" />
            </div>
          </div>
          <div className="flex justify-around h-fit w-full">
            <div className="flex gap-2">
              <div className=" bg-gray-700 rounded  w-6 h-6" />
              <div className=" bg-gray-700 rounded w-6 h-6" />
            </div>
            <div className="flex gap-2">
              <div className=" bg-gray-700 rounded w-6 h-6" />
              <div className=" bg-gray-700 rounded w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={`profile/${user.id}`}>
      <div
        className={`flex flex-col justify-between items-center p-2 border-1 rounded-lg h-48 overflow-hidden hover:bg-[var(--gtint)] transition-all cursor-pointer`}
      >
        {mounted ? (
          <Image
            src={user.image || defaultProfileImage}
            alt="User profile picture"
            className="rounded-full flex-shrink-0 h-20 w-20"
            width={80}
            height={80}
          />
        ) : (
          <div style={{ width: 80, height: 80 }} />
        )}
        <div className="flex items-center justify-center pt-2 px-2 w-full">
          <p className="text-[var(--dmono)] font-bold w-full whitespace-nowrap overflow-hidden text-ellipsis text-center">
            {user.name}
          </p>
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full mt-2 items-center">
          <div className="flex items-center gap-1 justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={iconSize}
              height={iconSize}
              className="text-[var(--dmono)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
              <path d="M16 19h6" />
              <path d="M19 16v6" />
              <path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
            </svg>
            <span className="min-w-[3ch] text-center leading-none">
              {user._count?.friends ?? 0}
            </span>
          </div>
          <div className="flex items-center gap-1 justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={iconSize}
              height={iconSize}
              className="text-[var(--dmono)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
              <path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" />
              <path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
              <path d="M17 10h2a2 2 0 0 1 2 2v1" />
              <path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
              <path d="M3 13v-1a2 2 0 0 1 2 -2h2" />
            </svg>
            <span className="min-w-[3ch] text-center leading-none">
              {user._count?.followers ?? 0}
            </span>
          </div>
          <div className="flex items-center gap-1 justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={iconSize}
              height={iconSize}
              className="text-[var(--dmono)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
              <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
              <path d="M9 17v-5" />
              <path d="M12 17v-1" />
              <path d="M15 17v-3" />
            </svg>
            <span className="min-w-[3ch] text-center leading-none">
              {user._count?.posts ?? 0}
            </span>
          </div>
          <div className="flex items-center gap-1 justify-center">
            <svg
              className="text-[var(--dmono)]"
              xmlns="http://www.w3.org/2000/svg"
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            </svg>
            <span className="min-w-[3ch] text-center leading-none">
              {user._count?.comments ?? 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
