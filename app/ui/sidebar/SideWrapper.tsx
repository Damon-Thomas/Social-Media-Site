import { SimpleUser } from "@/app/lib/definitions";
import SideItem from "./SideItem";

export default function SideWrapper({
  children,
  userArray,
  refreshList,
}: {
  children: React.ReactNode;
  userArray: SimpleUser[];
  refreshList: () => Promise<void>;
}) {
  return (
    <div className="border-b-1 border-b-[var(--dmono)] pb-4">
      <h1 className="text-2xl font-bold">{children}</h1>
      <ul>
        {userArray.map((user: SimpleUser) => (
          <SideItem
            key={user?.id}
            selectedData={user}
            refreshList={refreshList}
          />
        ))}
      </ul>
    </div>
  );
}
