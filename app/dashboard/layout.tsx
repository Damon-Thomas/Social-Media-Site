"use client";

import NotificationProvider from "../context/NotificationContext";
import { UserProvider } from "../context/UserContext";
import Navigator from "../ui/navigator/Navigator";
import Sonner from "../ui/core/Sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <UserProvider>
        {/* <ThemeSwitcher /> */}
        <div
          className={`flex flex-col h-screen bg-[var(--rdmono)] text-[var(--dmono)] `}
        >
          <Navigator />
          <div
            id="dashboard-scroll-container"
            className="grow flex justify-center overflow-y-auto h-full content-bottom-padding md:pb-8"
          >
            {children}
          </div>
          <Sonner />
        </div>
      </UserProvider>
    </NotificationProvider>
  );
}
