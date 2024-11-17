"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { SignalRService } from "../_services/signalRService";
import { INotificationItem } from "../_libs/constants";
import { getNotification, getUnreadCount, markAllNotificationsAsRead, markNotificationAsRead } from "../_libs/apiNotification";

interface NotificationContextType {
  notifications: INotificationItem[];
  unreadCount: number;
  sessionToken: string;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationUrl: string) => void;
  fetchUnreadCount: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
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
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchUnreadCount = async () => {
    const count = await getUnreadCount(sessionToken, accountId);
    setUnreadCount(count);
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

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
      service.startConnection();

      service.addNotificationListener((notification: INotificationItem) => {
        console.log("New notification received:", notification);
        setNotifications((prev) => [notification, ...prev]);
        // Call function fetchUnreadCount() to update unread notification in real-time
        fetchUnreadCount();
      });

      fetchNotifications();
      fetchUnreadCount();

      return () => {
        service.stopConnection();
      };
    }
  }, [sessionToken]);

  const markAsRead = async (notificationUrl: string) => {
    await markNotificationAsRead(sessionToken, accountId);
    setNotifications(prev =>
        prev.map(notification =>
            notification["notification-url"] === notificationUrl
                ? { ...notification, "is-read": true }
                : notification
        )
    );
    fetchUnreadCount();
  };

  const markAllAsRead = async () => {
    await markAllNotificationsAsRead(sessionToken, accountId);
    setNotifications(prev => prev.map(notification => ({ ...notification, "is-read": true })));
    fetchUnreadCount();
};

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        sessionToken,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        fetchUnreadCount,
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
