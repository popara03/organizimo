import Notification from '@/components/custom/notification';
import { NotificationContext } from '@/providers/notificationProvider';
import { useContext } from 'react';

const Notifications = () => {
    const ctx = useContext(NotificationContext);
    const { notifications } = ctx;

    return (
        <div className="mx-8 flex flex-col gap-4">
            <h1 className="font-jersey !text-5xl">Notifications</h1>
            <div className="rounded-md bg-neutral-800">
                {notifications.map((notification: any, key: number) => (
                    <Notification key={key} {...notification} className="border-b border-secondary/10" />
                ))}
            </div>
        </div>
    );
};

export default Notifications;
