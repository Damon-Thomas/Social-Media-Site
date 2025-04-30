"use client";

import Navigator from "../ui/navigator/Navigator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col-reverse md:flex-col h-screen bg-[var(--rdmono)] text-[var(--dmono)] overflow-y-aut`}
    >
      <Navigator />
      <div className="grow overflow-y-auto">{children}</div>
    </div>
  );
}
