import SideItemSkeleton from "./SideItemSkeleton";

export default function SideSectionSkeleton({ section }: { section: string }) {
  return (
    <div className="border-b-1 border-b-[var(--dmono)] py-4">
      <h1 className="text-2xl font-bold animate-pulse bg-gray-300 w-32 h-8 rounded"></h1>
      <ul className="h-80">
        {Array.from({ length: 5 }, (_, index) => (
          <SideItemSkeleton key={`SideItemSkeleton ${section} ${index}`} />
        ))}
      </ul>
    </div>
  );
}
