import React from "react";
import Image from "next/image";
import ErrorMessage from "../../form/ErrorMessage";
import LongInput from "../../form/LongInput";
import Button from "../../core/Button";

type PostCreatorProps = {
  image: string;
};

export default function PostCreator({ image }: PostCreatorProps) {
  return (
    <div className="flex flex-col gap-4 ">
      <form className="flex flex-col border-b-1 border-b-[var(--borderc)] ">
        <div className="flex gap-4 items-start pt-4 px-4">
          <Image
            src={image}
            alt="User profile picture"
            width={40}
            height={40}
            className="rounded-full flex-shrink-0 h-10 w-10"
          />
          <LongInput
            label=""
            id="post"
            placeholder="Broadcast Now"
            className="p-2 rounded"
          />
        </div>
        <div className="flex gap-4 w-full no-wrap my-2 pt-2 border-t-1 border-[var(--borderc)] h-fit px-4">
          <ErrorMessage className="grow flex flex-wrap "></ErrorMessage>
          <Button type="submit" className="">
            Post
          </Button>
        </div>
      </form>
    </div>
  );
}
