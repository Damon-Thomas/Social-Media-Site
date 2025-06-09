// "use client";

// import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
// import { fetchPaginatedLikedPosts } from "@/app/actions/fetch";
// import type { Post } from "@/app/lib/definitions";
// import type { Dispatch, SetStateAction } from "react";
// import ActivityItem from "./ActivityItem";

// const ITEMS_PER_PAGE = 5;

// export default function LikedPostsSection({
//   userId,
//   initialPosts = [],
//   initialCursor = null,
//   openPostComment,
//   setOpenPostComment,
// }: {
//   userId: string;
//   initialPosts: Post[];
//   initialCursor: string | null;
//   openPostComment?: string;
//   setOpenPostComment?: Dispatch<SetStateAction<string>>;
// }) {
//   const fetchMore = async (cursor: string | null) => {
//     const { posts, nextCursor } = await fetchPaginatedLikedPosts(
//       userId,
//       cursor ?? undefined,
//       ITEMS_PER_PAGE
//     );

//     // Map properly to match Post type
//     const mappedPosts = posts.map((post) => {
//       if (!post) return null;

//       // No need to transform fields - just return the post as is
//       return post;
//     }) as Post[];

//     return { items: mappedPosts, nextCursor };
//   };

//   const {
//     items: likedPosts,
//     loading,
//     observerTarget,
//   } = useInfiniteScroll(initialPosts, initialCursor, fetchMore);

//   if (likedPosts.length === 0 && !loading) {
//     return <div className="text-center py-4">No liked posts found</div>;
//   }

//   return (
//     <div className="">
//       {likedPosts.map((post) => {
//         if (!post) return null;

//         return (
//           <ActivityItem
//             key={`liked-posts-section-${post.id}`}
//             data={{
//               id: post.id,
//               cOrp: "post" as const,
//               content: post.content || "",
//               likeCount: post.likedBy?.length || 0,
//               commentCount: post.comments?.length || 0,
//               createdAt: post.createdAt.toISOString(),
//               isLikedByUser: true, // Always true for liked posts section
//             }}
//             user={{
//               id: post.authorId || "",
//               name: post.author?.name || "Unknown User",
//               profileImage: post.author?.image || undefined,
//             }}
//             pOrc="post"
//             showAsLiked={true}
//             openPostComment={openPostComment}
//             setOpenPostComment={setOpenPostComment}
//           />
//         );
//       })}

//       {/* Observer element */}
//       <div ref={observerTarget} className="h-10" />

//       {loading && (
//         <div className="flex justify-center py-4">
//           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--dmono)]"></div>
//         </div>
//       )}
//     </div>
//   );
// }
