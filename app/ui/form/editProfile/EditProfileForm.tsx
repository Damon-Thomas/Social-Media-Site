// import { useActionState } from "react";
import LongInput from "../LongInput";
import InputWrapper from "../InputWrapper";
import Button from "../../core/Button";
import Form from "../Form";
import { useCurrentUser } from "@/app/context/UserContext";
import { useState } from "react";
import Image from "next/image";
import ErrorMessage from "../ErrorMessage";
import defaultProfileWhite from "@/public/defaultProfileDark.svg";

export default function EditProfileForm() {
  //   const [state, action, pending] = useActionState(placholder, undefined);
  const user = useCurrentUser();
  const [longText, setLongText] = useState("");

  function action() {
    return;
  }

  return (
    <Form
      onSubmit={action}
      className="border border-zinc-700 rounded-md p-4 md:p-8 flex flex-col gap-2 justify-start bg-[var(--grey)] text-[var(--aWhite)]  w-full"
    >
      <h1 className=" text-lg font-semibold md:text-xl pb-2 md:pb-4">
        Edit Profile
      </h1>
      <div className="flex items-center gap-2 mb-4">
        <Image
          src={user?.image || defaultProfileWhite}
          alt="User profile picture"
          width={40}
          height={40}
          className="rounded-full flex-shrink-0 h-10 w-10"
        />
        <h3 className="text-md font-semibold md:text-lg ">{user?.name}</h3>
      </div>
      <InputWrapper>
        <LongInput
          label="Bio"
          placeholder={`Tell the world about yourself`}
          id="bio"
          className="border border-[var(--greyRing)] rounded-xs text focus:outline focus:ring-2 focus:ring-[var(--aWhite)] focus:border-transparent p-2"
          text="text-md"
          rows={3}
          value={longText}
          onChange={(e) => setLongText(e.target.value)}
        />
      </InputWrapper>
      <div className="flex gap-2 justify-between">
        <ErrorMessage className="grow flex flex-wrap">
          {
            // Placeholder for error messages
            // You can replace this with actual error handling logic
            "Error messages will appear here."
          }
        </ErrorMessage>
        <Button
          className="font-bold text-[var(--aBlack)] mt-2"
          type="submit"
          style="primary"
        >
          Submit
        </Button>
      </div>
    </Form>
  );
}
