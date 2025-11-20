import { usePage } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState, createContext, ReactNode } from "react";

// Context izvan komponente
export const NotificationContext = createContext<any>(null);

export type NotificationProps = {
    id: number
    type: string
    post: {
        id: number
        title: string
        status: boolean
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
    const initialNotifications = usePage().props.notifications as NotificationProps[];
    const [notifications, setNotifications] = useState<NotificationProps[]>(initialNotifications);
    const [isAllRead, setIsAllRead] = useState(false);

    //on load & redirect, set notifications and check isAllRead
    useEffect(() => {
        setNotifications(initialNotifications);
        setIsAllRead(notifications?.every((n) => n.is_read));
    }, [initialNotifications]);

    const markAsRead = (id: number) => {
        // TODO: Make API call to mark notification as read
        axios.post(`/notifications/${id}/mark-as-read`)
        .then((response) => {
            // Handle success if needed

        })
        .catch((error) => {
            // Handle error if needed
            console.error("Error marking notification as read", error);
        });

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