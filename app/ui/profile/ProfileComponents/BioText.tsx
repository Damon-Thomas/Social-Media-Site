import { ReactNode } from "react";

export default function BioText({ children }: { children: ReactNode }) {
  if (!children) {
    return (
      <div className="p-2">
        <p className="">No bio available</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      <p className="">{children}</p>
    </div>
  );
}
