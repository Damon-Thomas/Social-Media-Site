"use client";

import Navigator from "../ui/navigator/Navigator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col-reverse md:flex-col h-screen bg-[var(--rdmono)] text-[var(--dmono)]`}
    >
      <Navigator />
      <div
        id="dashboard-scroll-container" // Add this ID
        className="grow overflow-y-auto flex justify-center"
      >
        {children}
      </div>
    </div>
  );
}
