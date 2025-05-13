// "use client";

// import type { User, Post, Comment, ActivityItem } from "@/app/lib/definitions";
// import type { Dispatch, SetStateAction } from "react";
// import PersInfo from "./PersInfo";
// import ProfileRemote from "../ProfileRemote/ProfileRemote";

// // Use the same type as ProfileRemote's activeTab state
// type ActiveProfileTab = "activity" | "posts" | "comments" | "liked";

// export interface OtherProfileProps {
//   userData: User;
//   initialActivity?: ActivityItem[];
//   activityCursor?: string | null;
//   initialPosts?: Post[];
//   postsCursor?: string | null;
//   initialComments?: Comment[];
//   commentsCursor?: string | null;
//   initialLikedPosts?: Post[];
//   likedPostsCursor?: string | null;
//   initialLikedComments?: Comment[];
//   likedCommentsCursor?: string | null;
//   activeTab: ActiveProfileTab;
//   setActiveTab: Dispatch<SetStateAction<ActiveProfileTab>>; // Updated type
// }

// export default function OtherProfile({
//   userData,
//   initialActivity = [],
//   activityCursor = null,
//   initialPosts = [],
//   postsCursor = null,
//   initialComments = [],
//   commentsCursor = null,
//   initialLikedPosts = [],
//   likedPostsCursor = null,
//   initialLikedComments = [],
//   likedCommentsCursor = null,
//   activeTab,
//   setActiveTab,
// }: OtherProfileProps) {
//   const NAVIGATOR_HEIGHT = 64;

//   if (!userData) {
//     return (
//       <div className="flex flex-col items-center justify-center h-full">
//         <h1 className="text-2xl font-bold">User not found</h1>
//         <p className="mt-2 text-gray-600">
//           The user you are looking for does not exist.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-[1fr] gap-6 w-full ">
//       <div className="flex flex-col min-w-0">
//         <PersInfo userData={userData} />
//         <ProfileRemote
//           userData={userData}
//           initialActivity={initialActivity}
//           activityCursor={activityCursor}
//           initialPosts={initialPosts}
//           postsCursor={postsCursor}
//           initialComments={initialComments}
//           commentsCursor={commentsCursor}
//           initialLikedPosts={initialLikedPosts}
//           likedPostsCursor={likedPostsCursor}
//           initialLikedComments={initialLikedComments}
//           likedCommentsCursor={likedCommentsCursor}
//           navigatorHeight={NAVIGATOR_HEIGHT}
//           activeTab={activeTab}
//           setActiveTab={setActiveTab}
//         />
//       </div>
//     </div>
//   );
// }
