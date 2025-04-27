import { fetchUserById } from "@/app/actions/fetch";
import { notFound } from "next/navigation";
import type { User } from "@/app/lib/definitions";
import Image from "next/image";
import Link from "next/link";
import PostsSection from "@/app/ui/profile/otherProfile/PostsSection";

export default async function ProfilePage({
  params,
}: {
  params: { user: string[] };
}) {
  const userId = params.user[params.user.length - 1];
  const fetched = await fetchUserById(userId);
  if (!fetched) notFound();
  const userData = fetched as User;

  // Get initial posts for the client component
  const initialPosts = userData.posts || [];

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6 overflow-auto">
      {/* Profile Header */}
      {/* <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:space-x-6">
        <div className="flex-shrink-0">
          <Image
            src={userData.image || "/default-avatar.png"}
            alt={userData.name || "User"}
            width={120}
            height={120}
            className="rounded-full border-4 border-white dark:border-gray-900"
          />
        </div>
        <div className="mt-4 md:mt-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {userData.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            @{userData.email?.split("@")[0] || userData.id.slice(0, 8)}
          </p>
          <p className="mt-2 text-gray-700 dark:text-gray-200">
            {userData.profile?.bio || "No bio available."}
          </p>
          <div className="mt-4 flex space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Follow
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
              Message
            </button>
          </div>
        </div>
      </div> */}

      {/* Stats */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center">
          <span className="block text-xl font-semibold text-gray-900 dark:text-white">
            {userData.posts?.length || 0}
          </span>
          <span className="text-gray-500 dark:text-gray-400">Posts</span>
        </div>
        <div className="text-center">
          <span className="block text-xl font-semibold text-gray-900 dark:text-white">
            {userData.comments?.length || 0}
          </span>
          <span className="text-gray-500 dark:text-gray-400">Comments</span>
        </div>
        <div className="text-center">
          <span className="block text-xl font-semibold text-gray-900 dark:text-white">
            {userData.followers?.length || 0}
          </span>
          <span className="text-gray-500 dark:text-gray-400">Followers</span>
        </div>
        <div className="text-center">
          <span className="block text-xl font-semibold text-gray-900 dark:text-white">
            {userData.following?.length || 0}
          </span>
          <span className="text-gray-500 dark:text-gray-400">Following</span>
        </div>
      </div> */}

      {/* Followers, Following & Connections */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> */}
      {/* Followers */}
      {/* <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            Followers
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {userData.followers
              ?.filter((f): f is NonNullable<typeof f> => !!f)
              .map((f) => (
                <Link
                  key={f.id}
                  href={`/dashboard/profile/${f.id}`}
                  className="flex flex-col items-center"
                >
                  <Image
                    src={f.image || "/default-avatar.png"}
                    alt={f.name || ""}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <span className="mt-1 text-sm text-gray-700 dark:text-gray-300 truncate">
                    {f.name}
                  </span>
                </Link>
              ))}
          </div>
        </div> */}
      {/* Following */}
      {/* <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            Following
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {userData.following
              ?.filter((f): f is NonNullable<typeof f> => !!f)
              .map((f) => (
                <Link
                  key={f.id}
                  href={`/dashboard/profile/${f.id}`}
                  className="flex flex-col items-center"
                >
                  <Image
                    src={f.image || "/default-avatar.png"}
                    alt={f.name || ""}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <span className="mt-1 text-sm text-gray-700 dark:text-gray-300 truncate">
                    {f.name}
                  </span>
                </Link>
              ))}
          </div>
        </div> */}
      {/* Connections */}
      {/* <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            Connections
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {userData.friends
              ?.filter((f): f is NonNullable<typeof f> => !!f)
              .map((f) => (
                <Link
                  key={f.id}
                  href={`/dashboard/profile/${f.id}`}
                  className="flex flex-col items-center"
                >
                  <Image
                    src={f.image || "/default-avatar.png"}
                    alt={f.name || ""}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <span className="mt-1 text-sm text-gray-700 dark:text-gray-300 truncate">
                    {f.name}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </div> */}

      {/* Posts with infinite scrolling */}
      <PostsSection userId={userId} initialPosts={initialPosts} />
    </div>
  );
}
