"use client";

import NotificationProvider from "../context/NotificationContext";
import { UserProvider } from "../context/UserContext";
import Navigator from "../ui/navigator/Navigator";
import Sonner from "../ui/core/Sonner";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [smallScreen, setSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 500) {
        setSmallScreen(true);
      } else {
        setSmallScreen(false);
      }
    };
    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <NotificationProvider>
      <UserProvider>
        {/* <ThemeSwitcher /> */}
        <div
          className={`flex ${
            smallScreen ? "flex-col-reverse" : "flex-col"
          } h-screen bg-[var(--rdmono)] text-[var(--dmono)] `}
        >
          <Navigator />
          <div
            id="dashboard-scroll-container"
            className="grow flex justify-center overflow-y-auto h-full pb-4 md:pb-8"
          >
            {children}
          </div>
          <Sonner />
        </div>
      </UserProvider>
    </NotificationProvider>
  );
}
