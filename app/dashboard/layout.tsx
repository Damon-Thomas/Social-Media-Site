"use client";

import { UserProvider } from "../context/UserContext";
// import ThemeSwitcher from "../ui/landing-page/ThemeSwitcher";
import Navigator from "../ui/navigator/Navigator";
import ThemeSwitcher from "../ui/landing-page/ThemeSwitcher";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
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
      </div>
    </UserProvider>
  );
}
