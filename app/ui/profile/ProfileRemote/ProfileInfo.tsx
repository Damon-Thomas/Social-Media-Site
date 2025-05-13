import type { User, Post, Comment, ActivityItem } from "@/app/lib/definitions";
import InfoContainer from "./InfoContainer";
import ActivitySection from "./ActivitySection";
import PostsSection from "../ProfileActivityComponents/PostsSection";
import CommentsSection from "../ProfileActivityComponents/CommentsSection";
import LikedPostsSection from "../ProfileActivityComponents/LikedPostsSection";
import LikedCommentsSection from "../ProfileActivityComponents/LikedCommentsSection";

type ProfileInfoProps =
  | {
      type: "activity";
      userData: User;
      initialContent: ActivityItem[];
      cursor: string | null;
    }
  | {
      type: "posts";
      userData: User;
      initialContent: Post[];
      cursor: string | null;
    }
  | {
      type: "comments";
      userData: User;
      initialContent: Comment[];
      cursor: string | null;
    }
  | {
      type: "likedPosts";
      userData: User;
      initialContent: Post[];
      cursor: string | null;
    }
  | {
      type: "likedComments";
      userData: User;
      initialContent: Comment[];
      cursor: string | null;
    };

export default function ProfileInfo(props: ProfileInfoProps) {
  const { type, userData, cursor } = props;

  let content;
  switch (type) {
    case "activity":
      content = (
        <ActivitySection
          userId={userData?.id || ""}
          initialActivities={props.initialContent}
          initialCursor={cursor}
        />
      );
      break;
    case "posts":
      content = (
        <PostsSection
          userId={userData?.id || ""}
          initialPosts={props.initialContent}
          initialCursor={cursor}
        />
      );
      break;
    case "comments":
      content = (
        <CommentsSection
          userId={userData?.id || ""}
          initialComments={props.initialContent}
          initialCursor={cursor}
        />
      );
      break;
    case "likedPosts":
      content = (
        <LikedPostsSection
          userId={userData?.id || ""}
          initialPosts={props.initialContent}
          initialCursor={cursor}
        />
      );
      break;
    case "likedComments":
      content = (
        <LikedCommentsSection
          userId={userData?.id || ""}
          initialComments={props.initialContent}
          initialCursor={cursor}
        />
      );
      break;
  }

  return <InfoContainer>{content}</InfoContainer>;
}
