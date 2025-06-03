"use client";

import NotificationProvider from "../context/NotificationContext";
import { UserProvider } from "../context/UserContext";
import Navigator from "../ui/navigator/Navigator";
import ThemeSwitcher from "../ui/landing-page/ThemeSwitcher";
import Sonner from "../ui/core/Sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <NotificationProvider>
        <ThemeSwitcher />
        <div
          className={`flex flex-col-reverse md:flex-col h-screen bg-[var(--rdmono)] text-[var(--dmono)] `}
        >
          <Navigator />
          <div
            id="dashboard-scroll-container"
            className="grow flex justify-center overflow-y-auto h-full"
          >
            {children}
          </div>
          <Sonner />
        </div>
      </NotificationProvider>
    </UserProvider>
  );
}
