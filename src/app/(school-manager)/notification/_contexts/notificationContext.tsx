"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { SignalRService } from "../_services/signalRService";
import { INotificationItem } from "../_libs/constants";
import { getNotification } from "../_libs/apiNotification";

interface NotificationContextType {
  notifications: INotificationItem[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationUrl: string) => void;
}

interface NotificationProviderProps {
  children: React.ReactNode;
  sessionToken: string;
  accountId: number;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({
  children,
  sessionToken,
  accountId,
}: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<INotificationItem[]>([]);
  const [signalRService, setSignalRService] = useState<SignalRService | null>(
    null
  );

  const fetchNotifications = async () => {
    if (!sessionToken || !accountId) return;

    try {
      const response = await getNotification(sessionToken, accountId);
      if (response?.result?.items) {
        setNotifications(response.result.items);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (sessionToken) {
      const service = new SignalRService(sessionToken);
      setSignalRService(service);
      service.startConnection();

      service.addNotificationListener((notification: INotificationItem) => {
        setNotifications((prev) => [notification, ...prev]);
      });

      fetchNotifications();

      return () => {
        service.stopConnection();
      };
    }
  }, [sessionToken, accountId]);

  const markAsRead = (notificationUrl: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification["notification-url"] === notificationUrl
          ? { ...notification, "is-read": true }
          : notification
      )
    );
  };

  const unreadCount = notifications.filter((n) => !n["is-read"]).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within NotificationProvider"
    );
  }
  return context;
};
