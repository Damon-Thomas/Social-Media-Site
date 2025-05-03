import { SimpleUser } from "@/app/lib/definitions";
import SideItem from "./SideItem";

export default function SideWrapper({
  children,
  userArray,
}: {
  children: React.ReactNode;
  userArray: SimpleUser[];
}) {
  return (
    <div className="border-1 border-[var(--borderc)] rounded p-2 my-2 md:my-4">
      <h1 className="text-2xl font-bold">{children}</h1>
      <ul className="h-80">
        {userArray.map((user: SimpleUser) => (
          <SideItem key={user?.id} selectedData={user} />
        ))}
      </ul>
    </div>
  );
}
