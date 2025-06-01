import PendingRequestSection from "@/app/ui/connections/pendingRequestSection/PendingRequestSection";
import Goats from "@/app/ui/dashboard/Goats";
import Noobs from "@/app/ui/dashboard/Noobs";

export default function Connections() {
  return (
    <div className="w-full max-w-3xl">
      <div className="grid grid-cols-[1fr,320px] gap-4">
        <div className="min-w-0">
          <PendingRequestSection />
        </div>
        <div className="flex flex-col">
          <Goats />
          <Noobs />
        </div>
      </div>
    </div>
  );
}
