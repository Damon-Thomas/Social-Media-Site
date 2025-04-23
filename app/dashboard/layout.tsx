"use client";

import { logout } from "@/app/lib/session";
import Navigator from "../ui/navigator/Navigator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--rdmono)] text-[var(--dmono)] theme-transition">
      <Navigator />
      <div className="container mx-auto mt-20">
        <button onClick={handleLogout}>Logout</button>
        <h1>Dashboard</h1>
        <div>{children}</div>
      </div>
    </div>
  );
}
