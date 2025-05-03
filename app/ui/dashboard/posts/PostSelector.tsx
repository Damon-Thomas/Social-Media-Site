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
    console.log("Global feed");
  }
  function followingFeed() {
    setSelectedFeed("following");
    console.log("Following feed");
  }
  return (
    <div className="sticky top-0 z-10 bg-[var(--rdmono-70)] backdrop-blur-sm flex justify-around items-center w-full h-14 border-b-1 border-[var(--borderc)]">
      <div
        className={`flex flex-col grow items-center justify-center cursor-pointer transition-colors h-full hover:bg-[var(--gtint)]
          `}
        onClick={globalFeed}
        role="button"
        tabIndex={0}
      >
        <div className="inline-flex flex-col items-center h-full">
          <Button
            className={`${
              selectedFeed === "global"
                ? "text-[var(--dmono)]"
                : "text-[var(--light-grey)]"
            } pointer-events-none grow`} // disables pointer events on the button itself
            style="text"
            size="fit"
          >
            Global
          </Button>
          <SelectorHighlight active={selectedFeed === "global"} />
        </div>
      </div>
      <div
        className={`flex flex-col grow items-center justify-center cursor-pointer h-full transition-colors hover:bg-[var(--gtint)] 
        `}
        onClick={followingFeed}
        role="button"
        tabIndex={0}
      >
        <div className="inline-flex flex-col items-center h-full">
          <Button
            className={`${
              selectedFeed === "following"
                ? "text-[var(--dmono)]"
                : "text-[var(--light-grey)]"
            }  pointer-events-none grow`}
            style="text"
            size="fit"
          >
            Following
          </Button>
          <SelectorHighlight active={selectedFeed === "following"} />
        </div>
      </div>
    </div>
  );
}
