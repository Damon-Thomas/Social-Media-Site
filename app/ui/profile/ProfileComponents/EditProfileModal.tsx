import { useState } from "react";
import Image from "next/image"; // Import Image for rendering the icon
import Modal from "@/app/ui/core/Modal";
import editIcon from "@public/square-edit-outline.svg";
import EditProfileForm from "@/app/ui/form/editProfile/EditProfileForm";

export default function EditProfileModal() {
  const [hidden, setHidden] = useState(true); // State to control modal visibility
  return (
    <>
      <Image
        src={editIcon.src}
        className="bg-[var(--rdmono)] hover:scale-110 transition-transform duration-300 rounded-full cursor-pointer"
        alt="Edit Profile"
        width={24}
        height={24}
        onClick={() => {
          setHidden(!hidden);
        }}
      />

      <Modal hidden={hidden} setHidden={setHidden}>
        <EditProfileForm />
      </Modal>
    </>
  );
}
