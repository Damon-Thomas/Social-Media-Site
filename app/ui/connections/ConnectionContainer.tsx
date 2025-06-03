"use client";

import { useCurrentUser } from "@/app/context/UserContext";
import { useRef, useEffect, useState } from "react";
import ConnectCard from "./ConnectCard";
import { getProspects } from "@/app/actions/connectionActions";
import { useNotifications } from "@/app/context/NotificationContext";
import Button from "../core/Button";

export type ConnectUser = {
  id: string;
  name: string;
  image?: string | null;
  _count?: {
    followers?: number;
    posts?: number;
    comments?: number;
    friends?: number;
  };
};

export default function ConnectionContainer() {
  const user = useCurrentUser();
  const { setNotifications } = useNotifications();

  const [prospects, setProspects] = useState<ConnectUser[]>([]);
  const [nextContent, setNextContent] = useState<"Next" | "Max">("Next");

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [page, setPage] = useState(1);
  const cardWidth = 180 + 16; // card width + gap
  const itemsPerRow = Math.max(1, Math.floor(containerWidth / cardWidth));

  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }
    updateWidth();

    // Use ResizeObserver for responsive updates
    const observer = new ResizeObserver(updateWidth);
    if (containerRef.current) observer.observe(containerRef.current);

    // Cleanup
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function fetchProspects() {
      if (!user?.id) return;
      const newProspects = await getProspects(user.id, itemsPerRow, page);
      console.log("Fetched Prospects:", newProspects);
      if (newProspects && newProspects.length === itemsPerRow) {
        setProspects([...newProspects]);
      } else if (newProspects && newProspects.length > 0) {
        setProspects([...newProspects]);
        setNextContent("Max");
      } else if (newProspects && newProspects.length === 0) {
        setNextContent("Max");
      } else {
        setNotifications((prev) => [...prev, "Friend request accepted!"]);
        console.error("Failed to fetch prospects");
      }
    }
    fetchProspects();
  }, [user?.id, containerWidth, itemsPerRow, page, setNotifications]);

  return (
    <div ref={containerRef} className="grow p-4">
      <div
        className="grid gap-4 mb-4"
        style={{
          gridTemplateColumns: `repeat(${itemsPerRow}, minmax(0, 1fr))`,
        }}
      >
        {prospects.map((prospect) => (
          <ConnectCard key={prospect.id} user={prospect} />
        ))}
      </div>
      <div className="w-full h-4 flex justify-center items-center">
        <Button
          className="grow hover:brightness-110"
          onClick={() => setPage((prev) => (prev > 1 ? prev - 1 : 1))}
        >
          Previous
        </Button>
        <Button
          className="grow hover:brightness-110"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
