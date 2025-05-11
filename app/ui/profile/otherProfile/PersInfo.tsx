import { User } from "@/app/lib/definitions";
import Image from "next/image";
import BioText from "./BioText";
import { useDefaultProfileImage } from "@/app/utils/defaultProfileImage";

export default function PersInfo({ userData }: { userData: User }) {
  const defaultProfile = useDefaultProfileImage();

  if (!userData) {
    return null;
  }

  const profileImage =
    userData.image && userData.image.trim() !== ""
      ? userData.image
      : defaultProfile;

  return (
    <div className="flex items-start gap-4 md:gap-8 justify-start w-full">
      <Image
        src={profileImage}
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
              {userData.friends?.length} friends
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
