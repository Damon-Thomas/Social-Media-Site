import { ReactNode } from "react";

export default function SectionWrapper({
  children,
  content = [],
}: {
  children: ReactNode;
  content?: Array<unknown>;
}) {
  if (!content.length) {
    return (
      <div className="grow p-2 flex flex-col gap-2 md:gap-4 md:p-4 border-1 border-[var(--borderc] rounded-lg overflow-hidden">
        <h2 className="font-bold text-lg">{children}</h2>
        <p>No {children?.toString().toLowerCase()} found</p>
      </div>
    );
  }
  return (
    <div className="grow p-2 md:p-4 border-1 border-[var(--borderc] rounded-lg overflow-hidden">
      <h2 className="font-bold text-lg">{children}</h2>
    </div>
  );
}
