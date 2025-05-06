import Button from "../../core/Button";
import SelectorHighlight from "./SelectorHighlight";

export default function PostSelector({
  selectedFeed,
  setSelectedFeed,
}: {
  selectedFeed: string;
  setSelectedFeed: (feed: string) => void;
}) {
  function globalFeed() {
    setSelectedFeed("global");
  }
  function followingFeed() {
    setSelectedFeed("following");
  }

  return (
    <div className="sticky top-0 z-10 bg-[var(--rdmono-70)] backdrop-blur-sm flex justify-around items-center w-full border-b-1 border-[var(--borderc)]">
      <div
        className="flex flex-col h-14 grow items-center cursor-pointer transition-colors hover:bg-[var(--gtint)]"
        onClick={globalFeed}
        // role="button"
        // tabIndex={0}
      >
        <div className="flex flex-col justify-between grow">
          <div className="flex flex-grow items-center">
            <Button
              className={`${
                selectedFeed === "global"
                  ? "text-[var(--dmono)]"
                  : "text-[var(--light-grey)]"
              } pointer-events-none`}
              style="text"
              size="fit"
            >
              Global
            </Button>
          </div>
          <SelectorHighlight active={selectedFeed === "global"} />
        </div>
      </div>

      <div
        className="flex flex-col h-14 grow items-center justify-between cursor-pointer  transition-colors hover:bg-[var(--gtint)]"
        onClick={followingFeed}
        // role="button"
        // tabIndex={0}
      >
        <div className="flex flex-col items-center justify-between grow">
          <div className="flex flex-grow items-center">
            <Button
              className={`${
                selectedFeed === "following"
                  ? "text-[var(--dmono)]"
                  : "text-[var(--light-grey)]"
              } pointer-events-none`}
              style="text"
              size="fit"
            >
              Following
            </Button>
          </div>
          <SelectorHighlight active={selectedFeed === "following"} />
        </div>
      </div>
    </div>
  );
}
