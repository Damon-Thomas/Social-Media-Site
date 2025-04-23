// "use client";

import Navigator from "../ui/navigator/Navigator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigator className="h-20" />
      <div className="mt-20 ">{children}</div>
    </div>
  );
}
