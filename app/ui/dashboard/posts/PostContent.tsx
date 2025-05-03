import { useEffect, useState } from "react";

export default function PostContent({
  selectedFeed,
}: {
  selectedFeed: string;
}) {
  const [feedData, setFeedData] = useState(null);

  useEffect(() => {
    // This is a placeholder for any side effects you might want to run
    // when the selected feed changes.
    console.log(`Selected feed changed to: ${selectedFeed}`);
  }, [selectedFeed]);

  return (
    <div className="flex flex-col gap-4 ">
      {selectedFeed === "global" ? (
        <>
          <div className="flex gap-4 items-start pt-4 px-4">
            <h1 className="text-[var(--dmono)]">Global Feed</h1>
          </div>
          <div className="flex gap-4 w-full no-wrap my-2 pt-2 border-t-1 border-[var(--borderc)] h-fit px-4">
            <h1 className="text-[var(--dmono)]">Global Feed Content</h1>
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-4 items-start pt-4 px-4">
            <h1 className="text-[var(--dmono)]">Following Feed</h1>
          </div>
          <div className="flex gap-4 w-full no-wrap my-2 pt-2 border-t-1 border-[var(--borderc)] h-fit px-4">
            <h1 className="text-[var(--dmono)]">Following Feed Content</h1>
          </div>
        </>
      )}
    </div>
  );
}
