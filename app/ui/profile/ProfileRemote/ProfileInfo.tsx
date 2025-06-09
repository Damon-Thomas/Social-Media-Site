import type { User, Post, Comment, ActivityItem } from "@/app/lib/definitions";
import type { Dispatch, SetStateAction } from "react";
import InfoContainer from "./InfoContainer";
import ActivitySection from "./ActivitySection";
import PostsSection from "../ProfileActivityComponents/PostsSection";
import CommentsSection from "../ProfileActivityComponents/CommentsSection";
// import LikedPostsSection from "../ProfileActivityComponents/LikedPostsSection";
// import LikedCommentsSection from "../ProfileActivityComponents/LikedCommentsSection";

type ProfileInfoProps =
  | {
      type: "activity";
      userData: User;
      initialContent: ActivityItem[];
      cursor: string | null;
      openPostComment?: string;
      setOpenPostComment?: Dispatch<SetStateAction<string>>;
    }
  | {
      type: "posts";
      userData: User;
      initialContent: Post[];
      cursor: string | null;
      openPostComment?: string;
      setOpenPostComment?: Dispatch<SetStateAction<string>>;
    }
  | {
      type: "comments";
      userData: User;
      initialContent: Comment[];
      cursor: string | null;
      openPostComment?: string;
      setOpenPostComment?: Dispatch<SetStateAction<string>>;
    };
// | {
//     type: "likedPosts";
//     userData: User;
//     initialContent: Post[];
//     cursor: string | null;
//     openPostComment?: string;
//     setOpenPostComment?: Dispatch<SetStateAction<string>>;
//   }
// | {
//     type: "likedComments";
//     userData: User;
//     initialContent: Comment[];
//     cursor: string | null;
//     openPostComment?: string;
//     setOpenPostComment?: Dispatch<SetStateAction<string>>;
//   };

export default function ProfileInfo(props: ProfileInfoProps) {
  const { type, userData, cursor, openPostComment, setOpenPostComment } = props;

  console.log("ProfileInfo rendered with type:", props.initialContent);

  let content;
  switch (type) {
    case "activity":
      content = (
        <ActivitySection
          userId={userData?.id || ""}
          initialActivities={props.initialContent}
          initialCursor={cursor}
          openPostComment={openPostComment}
          setOpenPostComment={setOpenPostComment}
        />
      );
      break;
    case "posts":
      content = (
        <PostsSection
          userId={userData?.id || ""}
          initialPosts={props.initialContent}
          initialCursor={cursor}
          openPostComment={openPostComment}
          setOpenPostComment={setOpenPostComment}
        />
      );
      break;
    case "comments":
      content = (
        <CommentsSection
          userId={userData?.id || ""}
          initialComments={props.initialContent}
          initialCursor={cursor}
          openPostComment={openPostComment}
          setOpenPostComment={setOpenPostComment}
        />
      );
      break;
    // case "likedPosts":
    //   content = (
    //     <LikedPostsSection
    //       userId={userData?.id || ""}
    //       initialPosts={props.initialContent}
    //       initialCursor={cursor}
    //       openPostComment={openPostComment}
    //       setOpenPostComment={setOpenPostComment}
    //     />
    //   );
    //   break;
    // case "likedComments":
    //   content = (
    //     <LikedCommentsSection
    //       userId={userData?.id || ""}
    //       initialComments={props.initialContent}
    //       initialCursor={cursor}
    //       openPostComment={openPostComment}
    //       setOpenPostComment={setOpenPostComment}
    //     />
    //   );
    //   break;
  }

  return <InfoContainer>{content}</InfoContainer>;
}
