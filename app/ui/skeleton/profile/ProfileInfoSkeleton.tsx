export default function ProfileInfoSkeleton() {
  return (
    <div className="flex flex-col w-full animate-pulse">
      <div className="w-full flex flex-row gap-6  py-6 items-center sm:items-start">
        {/* Avatar Skeleton */}
        <div
          className="rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0"
          style={{ width: 120, height: 120 }}
        />
        {/* Info Skeleton */}
        <div className="flex flex-col flex-1 gap-2 w-full max-w-xl">
          {/* Name and Edit Button Row */}
          <div className="flex items-center gap-3 w-full pb-4">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
            <div className="flex gap-1 ml-auto">
              <div className="h-8 w-14 bg-gray-300 dark:bg-gray-700 rounded ml-auto" />
              <div className="h-8 w-14 bg-gray-300 dark:bg-gray-700 rounded ml-auto" />
            </div>
          </div>
          {/* Bio */}
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-1" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
          {/* Stats Row */}
          {/* Action Buttons Row */}
          <div className="flex gap-2 mt-2">
            <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
      {/* Activity Bar */}
      <div className="flex flex-1 w-full gap-2 mb-2">
        <div className="grow h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="grow h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="grow h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="grow h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
      {/* Posts */}
      <div className="flex flex-col w-full gap-4 p-2">
        <div className="grow flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="h-8 w-8 rounded-full  bg-gray-300 dark:bg-gray-700"></div>
            <div className="h-8 w-24 rounded bg-gray-300 dark:bg-gray-700"></div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 "></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 "></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 "></div>
          </div>
          <div className="flex gap-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-12 "></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-12 "></div>
          </div>
        </div>
        {/* Post */}
        <div className="grow flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="h-8 w-8 rounded-full  bg-gray-300 dark:bg-gray-700"></div>
            <div className="h-8 w-44 rounded bg-gray-300 dark:bg-gray-700"></div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 "></div>
          </div>
          <div className="flex gap-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-12 "></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-12 "></div>
          </div>
        </div>
        {/* Posts */}
        <div className="grow flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="h-8 w-8 rounded-full  bg-gray-300 dark:bg-gray-700"></div>
            <div className="h-8 w-32 rounded bg-gray-300 dark:bg-gray-700"></div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 "></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 "></div>
          </div>
          <div className="flex gap-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-12 "></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-12 "></div>
          </div>
        </div>
      </div>
    </div>
  );
}
