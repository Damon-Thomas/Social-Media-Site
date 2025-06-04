import ConnectionContainer from "./ConnectionContainer";

export default function ConnectionWrapper({
  children,
  type = "none",
  rows = 2,
  botborder = true,
}: {
  children?: React.ReactNode;
  type?:
    | "none"
    | "friends"
    | "followers"
    | "following"
    | "friendRequestsSent"
    | "recentlyActive";
  rows?: number;
  botborder?: boolean;
}) {
  return (
    <div
      className={`flex flex-col p-2 py-2 md:py-8 ${
        botborder ? "border-b-1 border-[var(--borderc)]" : ""
      }`}
    >
      <h3 className="text-2xl mb-2 ">{children}</h3>
      <ConnectionContainer type={type} rows={rows} />
    </div>
  );
}
