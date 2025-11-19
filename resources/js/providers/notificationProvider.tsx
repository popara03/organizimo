import Notification from "@/components/custom/notification";
import { usePage } from "@inertiajs/react";
import { useEffect, useState, createContext, ReactNode } from "react";

// Context izvan komponente
export const NotificationContext = createContext<any>(null);

export type NotificationProps = {
    id: number
    type: string
    post: {
        id: number
        title: string
    } | null
    comment_id: number | null
    user: {
        id: number
        name: string
    } | null
    message: string | null
    is_read: boolean
    created_at: string
    server_time: string
}

const NotificationProvider = ({ children }: { children: ReactNode }) => {
    // get last 10 notifications
    const [notifications, setNotifications] = useState<NotificationProps[]>(usePage().props.notifications as NotificationProps[] || []);
    const [isAllRead, setIsAllRead] = useState(false);

    console.log("Notifications from context:", notifications);

    //on every notification change, re-check if all are read
    useEffect(() => {
        setIsAllRead(notifications.every((n) => n.is_read));
    }, [notifications])

    const markAsRead = (id: number) => {
        // TODO: Make API call to mark notification as read

        // Update local state instead of re-fetching
        const n  = notifications.find((n) => n.id === id);
        
        if(n){
            n.is_read = !n.is_read;
            setNotifications([...notifications]);
        }
        else{
            console.error("Notification with passed ID not found", id);
        }
        console.log("Mark notification as read", id);
    }

    const markAllAsRead = () => {
        if(isAllRead) return;

        // TODO: Make API call to mark all notifications as read, special endpoint /notifications/mark-all-as-read
        
        notifications.forEach((n) => n.is_read = true);
        setNotifications([...notifications]);
        
        console.log("All notifications marked as read");
    }

    const deleteNotification = (id:number) => {
        // TODO: Make API call to delete notification

        // Update local state instead of re-fetching
        setNotifications(notifications.filter((n) => n.id !== id));

        console.log("Delete notification", id);
    }

    return (
        <NotificationContext.Provider value={{
            notifications,
            isAllRead,
            markAsRead,
            markAllAsRead,
            deleteNotification
        }}>
            {children}
        </NotificationContext.Provider>
    )
}

export default NotificationProvider