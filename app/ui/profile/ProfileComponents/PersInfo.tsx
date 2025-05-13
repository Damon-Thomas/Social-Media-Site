import { User } from "@/app/lib/definitions";
import Image from "next/image";
import BioText from "./BioText";
import { useDefaultProfileImage } from "@/app/utils/defaultProfileImage";
import EditProfileModal from "./EditProfileModal"; // Update the path to the correct location

export default function PersInfo({
  userData,
  ownProfile = false,
}: {
  userData: User;
  ownProfile?: boolean;
}) {
  const defaultProfile = useDefaultProfileImage();

  if (!userData) {
    return null;
  }

  const profileImage =
    userData.image && userData.image.trim() !== ""
      ? userData.image
      : defaultProfile;

  return (
    <div className="flex items-start mb-4 gap-4 md:gap-8 justify-start w-full">
      <Image
        src={profileImage}
        alt="User Avatar"
        width={100}
        height={100}
        className="self-center rounded-full w-20 h-20 md:w-40 md:h-40 object-cover mb-4 shrink-0"
      />
      <div className="flex grow">
        <div className="grow flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{userData.name}</h1>
            {ownProfile && <EditProfileModal></EditProfileModal>}
          </div>
          <BioText>{userData.bio}</BioText>

          <div className="flex gap-8 font-bold justify-between wrap">
            <p className="whitespace-nowrap w-fit">
              {`Joined:
                ${userData.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}`}
            </p>
            <div className="flex gap-4 w-fit">
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
    </div>
  );
}
