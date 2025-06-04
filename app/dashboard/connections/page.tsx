import ConnectionWrapper from "@/app/ui/connections/ConnectionWrapper";
import PendingRequestSection from "@/app/ui/connections/pendingRequestSection/PendingRequestSection";
import Goats from "@/app/ui/dashboard/Goats";
import Noobs from "@/app/ui/dashboard/Noobs";

export default function Connections() {
  return (
    <div className="w-full max-w-6xl">
      <div className="flex gap-4 md:gap-8">
        <div className="min-w-0 grow flex flex-col gap-y-4">
          <PendingRequestSection />
          <div className="flex flex-col border-1 border-[var(--borderc)] rounded">
            <ConnectionWrapper rows={1} type="recentlyActive">
              Recently Active
            </ConnectionWrapper>
            <ConnectionWrapper>New Connections</ConnectionWrapper>
            <ConnectionWrapper type="following">Following</ConnectionWrapper>
            <ConnectionWrapper type="followers">Followers</ConnectionWrapper>
            <ConnectionWrapper type="friends">Friends</ConnectionWrapper>
            <ConnectionWrapper
              botborder={false}
              rows={1}
              type="friendRequestsSent"
            >
              Friend Requests Sent
            </ConnectionWrapper>
          </div>
        </div>
        <div className="hidden md:flex flex-col">
          <Goats />
          <Noobs />
        </div>
      </div>
    </div>
  );
}
