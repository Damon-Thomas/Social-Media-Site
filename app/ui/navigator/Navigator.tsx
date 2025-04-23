import { useEffect, useState } from "react";

export default function Navigator() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent flicker

  return (
    <div className="fixed bottom-0 md:top-0 flex items-center w-full bg-[var(--rdmono)] text-[var(--dmono)] h-20">
      <div className="flex items-center justify-center h-full">
        <h1 className="text-2xl font-extrabold theme-transition">Zuno</h1>
      </div>
      <nav className="flex p-4 gap-6 items-center h-full">
        <a
          href="/dashboard"
          className="text-lg hover:text-gray-400 theme-transition"
        >
          Dashboard
        </a>
        <a
          href="/profile"
          className="text-lg hover:text-gray-400 theme-transition"
        >
          Profile
        </a>
        <a
          href="/settings"
          className="text-lg hover:text-gray-400 theme-transition"
        >
          Settings
        </a>
        <a
          href="/logout"
          className="text-lg hover:text-gray-400 theme-transition"
        >
          Logout
        </a>
      </nav>
    </div>
  );
}
