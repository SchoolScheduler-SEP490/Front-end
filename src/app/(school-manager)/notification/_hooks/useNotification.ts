import { useNotificationContext } from '../_contexts/notificationContext';

export const useNotification = () => {
    const { notifications, unreadCount, fetchNotifications, markAsRead } = useNotificationContext();
    return {
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
    };
};
