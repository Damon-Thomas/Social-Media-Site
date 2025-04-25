// "use client";

import Navigator from "../ui/navigator/Navigator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col-reverse md:flex-col h-screen overflow-hidden bg-[var(--rdmono)] text-[var(--dmono)] p-2 md:p-4`}
    >
      <Navigator />
      <div className="overflow-auto grow">{children}</div>
    </div>
  );
}
