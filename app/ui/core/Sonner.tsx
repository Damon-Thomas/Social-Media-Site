import {
  useClearNotifications,
  useNotifications,
} from "@/app/context/NotificationContext";
import { useEffect, useState } from "react";

export default function Sonner() {
  const { notifications, setNotifications } = useNotifications();
  const clearNotifications = useClearNotifications();
  const show = notifications.length > 0;
  const [progressKey, setProgressKey] = useState(0);

  // Remove the first notification after 3 seconds
  useEffect(() => {
    if (!show) return;
    setProgressKey((k) => k + 1); // Restart progress bar
    const timer = setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
    }, 3000);
    return () => clearTimeout(timer);
  }, [show, setNotifications, notifications]);

  return (
    <div
      className={`fixed bottom-0 right-0 m-4 z-50 transition-all ${
        show ? "block animate-slide-in-from-right" : "hidden"
      } safe-bottom`}
    >
      <button
        onClick={clearNotifications}
        className="absolute cursor-pointer hover:te top-2 right-1 text-sm text-[var(--rdmono)] z-60"
      >
        X
      </button>
      <div className="bg-[var(--dmono)] text-[var(--rdmono)] min-w-52 rounded-lg shadow-lg">
        {/* Progress bar */}
        <div className="h-2 w-full rounded-t bg-[var(--rdmono)] overflow-hidden">
          <div
            key={progressKey}
            className="w-full h-2 bg-[var(--primary)] rounded-t origin-left"
            style={{
              animation: "progressBar 3s linear forwards",
            }}
          ></div>
        </div>
        <div className="p-4 ">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">Notifications</h2>
            <p className="bg-[var(--rdmono)] text-[var(--dmono)] rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {notifications.length}
            </p>
          </div>
          <p className="">{notifications[0]}</p>
        </div>
      </div>
    </div>
  );
}
