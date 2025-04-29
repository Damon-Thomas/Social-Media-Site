import { User } from "@/app/lib/definitions";
import Image from "next/image";
import BioText from "./BioText";
import CardWrapper from "../CardWrapper";

export default function PersInfo({ userData }: { userData: User }) {
  if (!userData) {
    return;
  }
  console.log("User data in PersInfo:", userData.bio);
  return (
    <div className="flex items-start gap-4 md:gap-8 justify-start h-full w-full grow">
      <Image
        src={userData.image || "/default-avatar.png"}
        alt="User Avatar"
        width={100}
        height={100}
        className="rounded-full w-20 h-20 md:w-40 md:h-40 object-cover mb-4 shrink-0"
      />
      <div className="flex grow">
        <div className="grow flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{userData.name}</h1>
          <p>
            {`Joined on: 
            ${userData.createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}`}
          </p>
          <BioText>{userData.bio}</BioText>
          <div className="flex gap-4">
            <p className="whitespace-nowrap">
              {userData.followers?.length} followers
            </p>
            <p className="whitespace-nowrap">
              {" "}
              {userData.friends?.length} friends
            </p>
          </div>
          <div className="h-20 bg-slate-500 w-full">
            <h2>Latest Activity</h2>
          </div>
          <div className="h-20 bg-amber-300 w-full">
            <h2>Posts</h2>
          </div>
          <div className="h-20 bg-cyan-700 w-full">
            <h2>Comments</h2>
          </div>
          <div className="h-20 bg-amber-800 w-full">
            <h2>Likes</h2>
          </div>
        </div>
        <CardWrapper className="flex flex-col gap-2">
          <h3 className="font-bold md:text-lg">Connections</h3>
          <p className="whitespace-nowrap">
            Follower Count {userData?.followers?.length}
          </p>
          <p className="whitespace-nowrap">
            Friend Count {userData?.friends?.length}
          </p>
        </CardWrapper>
      </div>
    </div>
  );
}
