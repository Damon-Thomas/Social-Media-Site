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
    <div className="border-b-1 border-b-[var(--dmono)] py-4">
      <h1 className="text-2xl font-bold">{children}</h1>
      <ul className="h-80">
        {userArray.map((user: SimpleUser) => (
          <SideItem key={user?.id} selectedData={user} />
        ))}
      </ul>
    </div>
  );
}
