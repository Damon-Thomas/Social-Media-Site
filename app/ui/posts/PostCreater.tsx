import React from "react";
import Image from "next/image";
import ErrorMessage from "../form/ErrorMessage";
import LongInput from "../form/LongInput";

type PostCreatorProps = {
  image: string;
};

export default function PostCreator({ image }: PostCreatorProps) {
  return (
    <div className="flex flex-col gap-4">
      <form className="flex flex-col gap-4 border-b-1 border-b-[var(--borderc)] pb-4">
        <div className="flex gap-4">
          <Image
            src={image}
            alt="User profile picture"
            width={50}
            height={50}
            className="rounded-full flex-shrink-0 h-fit w-fit"
          />
          <LongInput
            label=""
            id="post"
            placeholder="Broadcast Now"
            className="p-2 rounded"
          />
        </div>
        <div className="flex gap-4 w-full no-wrap h-fit">
          <ErrorMessage className="grow flex flex-wrap"></ErrorMessage>
          <button
            type="submit"
            className="flex self-end p-2 md:p-4 bg-[var(--dmono)] text-[var(--rdmono)] font-bold rounded-lg w-fit"
          >
            Create Post
          </button>
        </div>
      </form>
    </div>
  );
}
