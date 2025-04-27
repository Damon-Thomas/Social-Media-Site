"use client";

import Navigator from "../ui/navigator/Navigator";
// import AuthCheck from "@/app/components/AuthCheck";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <AuthCheck>
    <div
      className={`flex flex-col-reverse md:flex-col h-screen overflow-hidden bg-[var(--rdmono)] text-[var(--dmono)]`}
    >
      <Navigator />
      <div className="overflow-hidden grow">{children}</div>
    </div>
    //  </AuthCheck>
  );
}
