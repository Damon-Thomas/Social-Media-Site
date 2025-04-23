"use client";

import { useEffect, useState } from "react";

export default function Navigator({ className }: { className: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent flicker

  return (
    <div
      className={
        `fixed bottom-0 md:top-0 flex items-center w-full ` + className
      }
    >
      <div className="flex items-center justify-center h-full ">
        <h1 className="text-2xl font-extrabold ">Zuno</h1>
      </div>
      <nav className="flex p-4 gap-6 items-center h-full ">
        <a href="/dashboard" className="text-lg hover:text-gray-400 ">
          Dashboard
        </a>
        <a href="/profile" className="text-lg hover:text-gray-400 ">
          Profile
        </a>
        <a href="/settings" className="text-lg hover:text-gray-400 ">
          Settings
        </a>
        <a href="/logout" className="text-lg hover:text-gray-400 ">
          Logout
        </a>
      </nav>
    </div>
  );
}
