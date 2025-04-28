import { User } from "@/app/lib/definitions";
import Image from "next/image";
import BioText from "./BioText";

export default function PersInfo({ userData }: { userData: User }) {
  if (!userData) {
    return;
  }
  console.log("User data in PersInfo:", userData.bio);
  return (
    <div className="flex items-start justify-center h-full">
      <Image
        src={userData.image || "/default-avatar.png"}
        alt="User Avatar"
        width={100}
        height={100}
        className="rounded-full w-20 h-20 md:w-40 md:h-40 object-cover mb-4"
      />
      <div className="flex flex-col ml-4">
        <h1 className="text-2xl font-bold">{userData.name}</h1>
        <BioText>{userData.bio}</BioText>
      </div>
      {/* Add more user information as needed */}
    </div>
  );
}
