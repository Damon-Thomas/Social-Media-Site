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
  const [nextContent, setNextContent] = useState<"Next" | "End">("Next");
  const [previousContent, setPreviousContent] = useState<"Previous" | "Start">(
    "Previous"
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const cardWidth = 192; // Default card width + gap
  const [page, setPage] = useState(1);

  const itemsPerRow = Math.max(1, Math.floor(containerWidth / cardWidth));
  const rows = 2; // Fixed number of rows

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
      const newProspects = await getProspects(
        user.id,
        itemsPerRow * rows,
        page
      );
      console.log("Fetched Prospects:", newProspects);
      if (page === 1) {
        setPreviousContent("Start");
      } else {
        setPreviousContent("Previous");
      }
      if (newProspects && newProspects.length === itemsPerRow * rows) {
        setProspects([...newProspects]);
        setNextContent("Next");
      } else if (newProspects && newProspects.length > 0) {
        setProspects([...newProspects]);
        setNextContent("End");
      } else if (newProspects && newProspects.length === 0) {
        setNextContent("End");
      } else {
        setNotifications((prev) => [...prev, "Friend request accepted!"]);
        console.error("Failed to fetch prospects");
      }
    }
    fetchProspects();
  }, [user?.id, containerWidth, itemsPerRow, page, setNotifications]);

  return (
    <div ref={containerRef} className="grow w-full  overflow-hidden">
      <div
        className="grid gap-1 p-1 mb-2"
        style={{
          gridTemplateColumns: `repeat(${itemsPerRow}, minmax(0, 1fr))`,
          gridTemplateRows: "2",
        }}
      >
        {prospects.map((prospect) => (
          <ConnectCard key={prospect.id} user={prospect} />
        ))}
      </div>
      <div className="w-full flex gap-2 justify-center items-center">
        <Button
          className="grow no-scale hover:bg-[var(--rgtint)]"
          onClick={() => setPage((prev) => (prev > 1 ? prev - 1 : 1))}
        >
          {previousContent}
        </Button>
        <Button
          className="grow  no-scale hover:bg-[var(--rgtint)]"
          onClick={() =>
            setPage((prev) => {
              return nextContent === "End" ? prev : prev + 1;
            })
          }
        >
          {nextContent}
        </Button>
      </div>
    </div>
  );
}
