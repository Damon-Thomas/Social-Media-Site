import { User } from "@/app/lib/definitions";
import Image from "next/image";
import BioText from "./BioText";
import CardWrapper from "../CardWrapper";
import SectionWrapper from "../SectionWrapper";

export default function PersInfo({
  userData,
  children,
}: {
  userData: User;
  children?: React.ReactNode;
}) {
  if (!userData) {
    return;
  }
  console.log("User data", userData.posts, userData.comments);
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-start h-full w-full grow">
      <div className="flex flex-col gap-4 md:gap-8 justify-start h-full w-full grow">
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
              <BioText>{userData.bio}</BioText>
              <p>
                {`Joined on:
                ${userData.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}`}
              </p>
              <div className="flex gap-4">
                <p className="whitespace-nowrap">
                  {userData.followers?.length} followers
                </p>
                <p className="whitespace-nowrap">
                  {" "}
                  {userData.friends?.length} friends
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:gap-8 justify-start h-full w-full grow">
          {children}
        </div>
      </div>
      <div className="grow flex flex-col gap-4 md:gap-8">
        <CardWrapper>Liked Posts</CardWrapper>
        <CardWrapper>Liked Comments</CardWrapper>
      </div>
    </div>
  );
}
