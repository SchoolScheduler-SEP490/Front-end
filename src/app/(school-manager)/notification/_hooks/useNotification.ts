import { useNotificationContext } from "../_contexts/notificationContext";
import { sendNotificationToAll } from "../_libs/apiNotification";
import { ISendNotification } from "../_libs/constants";

export const useNotification = () => {
    const context = useNotificationContext();

    const sendToAll = async (notification: ISendNotification) => {
        try {
            await sendNotificationToAll(context.sessionToken, notification);
            await context.fetchNotifications();
            await context.fetchUnreadCount();
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    return {
        notifications: context.notifications,
        unreadCount: context.unreadCount,
        markAsRead: context.markAsRead,
        fetchUnreadCount: context.fetchUnreadCount,
        markAllAsRead: context.markAllAsRead,
        sendToAll,
    };
};

