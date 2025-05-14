"use client";

import { getEssentialComment } from "@/app/actions/commentActions";
import { EssentialComment } from "@/app/lib/definitions";
import { useDefaultProfileImage } from "@/app/utils/defaultProfileImage";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PostFlow() {
  const defaultProfile = useDefaultProfileImage();
  const [comment, setComment] = useState<EssentialComment>(null);

  useEffect(() => {
    async function fetchComment() {
      return await getEssentialComment("cma47ycgi00178o0spz5a1ugd");
    }
    async function fetchAndSetComment() {
      const gotComment = await fetchComment();
      setComment(gotComment);
    }
    fetchAndSetComment();
  }, []);

  return (
    <div className="w-xl h-full">
      {" "}
      {/* <= temp container dimensions*/}
      <div className="grid grid-cols-[24px_minmax(0,1fr)]  sm:grid-cols-[32px_minmax(0,1fr)] bg-amber-300">
        <Image
          src={comment?.author?.image || defaultProfile}
          alt="Post Image"
          width={24}
          height={24}
          className="rounded-full w-full h-auto"
        />
        <h1 className="ml-4 flex items-center"> {comment?.author?.name}</h1>
      </div>
      <div className="grid grid-cols-[24px_1fr] relative sm:grid-cols-[32px_1fr] min-h-96">
        <div className="bg-amber-200"></div>
        <div className="commentContent bg-cyan-300 w-full h-full"></div>
      </div>
      <div className="grid grid-cols-[24px_1fr] relative sm:grid-cols-[32px_1fr] min-h-96">
        <div className="bg-amber-100"></div>
        <div className="commentContent bg-cyan-500 w-full h-full"></div>
      </div>
    </div>
  );
}
