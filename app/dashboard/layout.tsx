"use client";

import { logout } from "@/app/lib/session";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="container mx-auto p-4">
      <button onClick={handleLogout}>Logout</button>
      <h1>Dashboard</h1>
      <div>{children}</div>
    </div>
  );
}
