export default function ConnectionSkeleton(rows: number = 1) {
  return (
    <div className="flex flex-col w-full animate-pulse">
      <div className="flex flex-col gap-2 p-2">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 py-2">
            <div
              className="rounded-full bg-gray-300 dark:bg-gray-700"
              style={{ width: 48, height: 48 }}
            />
            <div className="flex flex-col flex-1 gap-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
