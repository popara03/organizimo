import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { toast } from 'sonner';

// Context izvan komponente
export const NotificationContext = createContext<any>(null);

export type NotificationProps = {
    id: number;
    type: string;
    post: {
        id: number;
        title: string;
        status: boolean;
    } | null;
    comment_id: number | null;
    user: {
        id: number;
        name: string;
    } | null;
    message: string | null;
    is_read: boolean;
    created_at: string;
    server_time: string;
    className?: string;
};

const NotificationProvider = ({ children }: { children: ReactNode }) => {
    // get last 10 notifications
    const initialNotifications = usePage().props.notifications as NotificationProps[];
    const pageNotifications = (usePage().props.pageNotifications as NotificationProps[]) || [];
    const [notifications, setNotifications] = useState<NotificationProps[]>([initialNotifications, ...pageNotifications].flat());
    const [isAllRead, setIsAllRead] = useState(false);

    useEffect(() => {
        setNotifications([initialNotifications, ...pageNotifications].flat());
    }, [initialNotifications, pageNotifications]);

    useEffect(() => {
        setIsAllRead(notifications?.every((n) => n.is_read));
    }, [notifications]);

    async function markAsRead(id: number, isRead: boolean): Promise<void> {
        if (!id) {
            toast.error('Invalid notification ID.');
            throw new Error('Invalid notification ID.');
        }

        try {
            await axios.post(`/notifications/${id}/mark-as-read`, { is_read: !isRead });
            const updatedNotifications = notifications.map((n) => (n.id === id ? { ...n, is_read: !isRead } : n));
            setNotifications(updatedNotifications);
        } catch (error) {
            toast.error('Error marking notification as read.');
            throw error;
        }
    }

    const markAllAsRead = async () => {
        if (isAllRead) return; //cancel if already read

        try {
            await axios.post('/notifications/mark-all-as-read');
            setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
        } catch {
            toast.error('Error marking all notifications as read.');
        }
    };

    async function deleteNotification(id: number): Promise<void> {
        if (!id) {
            toast.error('Invalid notification ID.');
            throw new Error('Invalid notification ID.');
        }

        try {
            await axios.post(`/notifications/${id}/delete`);
            setNotifications(notifications.filter((n) => n.id !== id));
            toast.success('Notification deleted.');
        } catch (error) {
            toast.error('Error deleting notification.');
            throw error;
        }
    }

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                isAllRead,
                markAsRead,
                markAllAsRead,
                deleteNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;
