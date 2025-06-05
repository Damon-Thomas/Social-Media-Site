import { useState } from "react";
import WarningModal from "../core/WarningModal";
import { useCurrentUser } from "@/app/context/UserContext";
import { useNotifications } from "@/app/context/NotificationContext";
import { logout } from "@/app/lib/session";

export default function DeleteAccount() {
  const [hidden, setHidden] = useState(true);
  const user = useCurrentUser();
  const { setNotifications } = useNotifications();

  const handleDelete = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch("/api/destructive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      console.log("Delete account response:", data);
      if (res.ok && data.success) {
        setNotifications(["Your account has been deleted."]);
        await logout();
      } else {
        setNotifications([data.error || "Failed to delete account."]);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setNotifications(["Failed to delete account."]);
    }
  };

  return (
    <div className="flex flex-col items-start w-full  border-y-2 border-[var(--danger)]">
      <button
        className="bg-[var(--rdmono)] text-[var(--danger)] text-2xl w-full p-4 md:py-8 h-full flex justify-start  font-extrabold  no-button-effects transition-all duration-300 ease-in-out hover:bg-red-50"
        onClick={() => setHidden(false)}
      >
        Delete Account
      </button>
      <WarningModal
        hidden={hidden}
        setHidden={setHidden}
        warningMessage="Are you sure you want to delete your account? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setHidden(true)}
        typeVerificationText="DELETE"
      />
    </div>
  );
}
