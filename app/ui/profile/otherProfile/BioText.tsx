import { ReactNode } from "react";

export default function BioText({ children }: { children: ReactNode }) {
  if (!children) {
    return <p className="">No bio available</p>;
  }

  return (
    <div className="mt-2">
      <h2 className="text-lg font-semibold">Bio</h2>
      <p className="mt-1 ">{children}</p>
    </div>
  );
}
