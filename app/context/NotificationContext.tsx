import { createContext, useContext, useState } from "react";

type NotificationContextType = {
  notifications: string[];
  setNotifications: React.Dispatch<React.SetStateAction<string[]>>;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export default function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<string[]>([]);
  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  return ctx;
}

// Custom hook that provides the addNotification function
export function useAddNotification() {
  const { setNotifications } = useNotifications();
  
  return (message: string) => {
    setNotifications((prev) => [...prev, message]);
  };
}
