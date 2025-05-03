export default function SideItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-2 h-16 border-b border-b-[var(--dmono)] animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        <div className="w-32 h-4 bg-gray-300 rounded"></div>
      </div>
      <div className="w-16 h-4 bg-gray-300 rounded"></div>
    </div>
  );
}
