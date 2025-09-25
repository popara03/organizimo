import { useEffect, useState, createContext, ReactNode } from "react";

// Context izvan komponente
export const NotificationContext = createContext<any>(null);

export type NotificationProps = {
    id: number
    post_id: number
    text: string
    time: string
    is_read: boolean
}

const NotificationProvider = ({ children }: { children: ReactNode }) => {
    // fetch last 10 notifications
    const [notifications, setNotifications] = useState([
    { id: 1, post_id: 1, text: "Novi komentar od Marko Jovanovic na vašem postu", time: "5 min ago", is_read: false },
    { id: 2, post_id: 2, text: "Diskusija \"Problem sa memorijom\" koju ste pratili je zatvorena.", time: "10 min ago", is_read: false },
    { id: 3, post_id: 3, text: "Novi odgovor od Ana Nikolic na vašem postu Post broj tri", time: "30 min ago", is_read: false },
    { id: 4, post_id: 4, text: "Novi komentar od Petar Petrovic na vašem postu Cetvrti post", time: "1 hour ago", is_read: true },
    { id: 5, post_id: 5, text: "Diskusija \"Kako nauciti React?\" koju ste pratili je zatvorena.", time: "2 hours ago", is_read: true },
    { id: 6, post_id: 6, text: "Novi odgovor od Jovana Jovanovic na vašem postu Post broj sest", time: "3 hours ago", is_read: true },
    { id: 7, post_id: 7, text: "Novi odgovor od Jovana Jovanovic na vašem postu Post broj sest", time: "3 hours ago", is_read: true },
    { id: 8, post_id: 8, text: "Novi odgovor od Jovana Jovanovic na vašem postu Post broj sest", time: "3 hours ago", is_read: true },
    { id: 9, post_id: 9, text: "Novi odgovor od Jovana Jovanovic na vašem postu Post broj sest", time: "3 hours ago", is_read: true },
    { id: 10, post_id: 10, text: "Novi odgovor od Jovana Jovanovic na vašem postu Post broj sest", time: "3 hours ago", is_read: true },
    ]);

    const [isAllRead, setIsAllRead] = useState(false);

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