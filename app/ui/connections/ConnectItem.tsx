import { EssentialUser } from "@/app/lib/definitions";
import Image from "next/image";
import defaultProfileDark from "@public/defaultProfileDark.svg";
import defaultProfileLight from "@public/defaultProfileLight.svg";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function ConnectCard({ user }: { user: EssentialUser }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!user) {
    return null; // add fallback UI
  }

  return (
    <div className="flex flex-col gap-2 items-center p-2 h-48 w-28 border-b-1 border-b-[var(--borderc)] overflow-hidden">
      {mounted ? (
        <Image
          src={
            user.image || theme === "dark"
              ? defaultProfileDark.src
              : defaultProfileLight.src
          }
          alt="User profile picture"
          className="rounded-full flex-shrink-0 h-10 w-10"
        />
      ) : (
        <div style={{ width: 40, height: 40 }} />
      )}
      <div className="flex flex-col">
        <span className="text-[var(--dmono)] overflow-ellipsis">
          {user.name}
        </span>
      </div>
    </div>
  );
}
