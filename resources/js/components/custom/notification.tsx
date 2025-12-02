import { Button } from '@/components/ui/button';
import timeAgo from '@/lib/timeAgo';
import { NotificationContext, NotificationProps } from '@/providers/notificationProvider';
import { Link } from '@inertiajs/react';
import { useContext, useState } from 'react';

export function renderMessage(props: NotificationProps) {
    switch (props.type) {
        case 'general':
            return props.message;

        case 'post_comment':
            return (
                <>
                    <span className="font-semibold text-secondary">{props.user?.name}</span> commented on the post "
                    <span className="text-secondary">{props.post?.title}</span>"
                </>
            );

        case 'post_status_change':
            return (
                <>
                    <span className="font-semibold text-secondary">{props.user?.name}</span> {props.post?.status ? 'closed' : 'reopened'} the
                    discussion "<span className="text-secondary">{props.post?.title}</span>"
                </>
            );

        case 'comment_reply':
            return (
                <>
                    <span className="font-semibold text-secondary">{props.user?.name}</span> replied to your comment on the post "
                    <span className="text-secondary">{props.post?.title}</span>"
                </>
            );
    }
}

const Notification = (props: NotificationProps) => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('Notification must be used within a NotificationProvider');

    const { markAsRead, deleteNotification } = ctx;
    const [isProcessing, setIsProcessing] = useState(false);

    return (
        <div
            className={`flex w-full items-center justify-between gap-2 px-4 py-2 hover:opacity-100 ${props.is_read ? '' : 'bg-accent-lime/40'} ${props.className}`}
        >
            <Link href={`${props.post?.id ? '/posts/' + props.post.id : ''}`} className="flex w-full min-w-0 flex-col gap-2">
                <span className="line-clamp-2 text-sm text-secondary">{renderMessage(props)}</span>
                <span className="text-xs text-secondary/50">{timeAgo(props.created_at, props.server_time)}</span>
            </Link>

            <div className="flex gap-2">
                <Button
                    size="icon"
                    className={`cursor-pointer bg-secondary/5`}
                    disabled={isProcessing}
                    onClick={(e) => {
                        e.preventDefault();

                        setIsProcessing(true);

                        markAsRead(props.id, props.is_read).finally(() => {
                            setIsProcessing(false);
                        });
                    }}
                >
                    {!props.is_read ? (
                        <svg className="!h-6 !w-6 *:fill-secondary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 11H16V13H17V11Z" fill="black" />
                            <path d="M16 13V15H15V16H13V15H14V14H15V13H16Z" fill="black" />
                            <path d="M16 9V11H15V10H14V9H13V8H15V9H16Z" fill="black" />
                            <path d="M13 16H11V17H13V16Z" fill="black" />
                            <path d="M11 15V16H9V15H8V13H9V14H10V15H11Z" fill="black" />
                            <path d="M13 7V8H12V11H11V12H8V13H7V11H8V9H9V8H11V7H13Z" fill="black" />
                            <path
                                d="M22 11V9H21V8H20V7H19V6H17V5H7V6H5V7H4V8H3V9H2V11H1V13H2V15H3V16H4V17H5V18H7V19H17V18H19V17H20V16H21V15H22V13H23V11H22ZM21 14H20V15H19V16H18V17H16V18H8V17H7V16H5V15H4V14H3V10H4V9H5V8H6V7H8V6H16V7H18V8H19V9H20V10H21V14Z"
                                fill="black"
                            />
                        </svg>
                    ) : (
                        <svg className="!h-6 !w-6 *:fill-secondary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 13H16V15H15V16H13V15H14V14H15V13Z" fill="black" />
                            <path d="M17 11H16V13H17V11Z" fill="black" />
                            <path
                                d="M23 11V13H22V15H21V16H20V17H19V18H17V19H9V18H16V17H18V16H19V15H20V14H21V10H20V9H19V8H21V9H22V11H23Z"
                                fill="black"
                            />
                            <path d="M2 13H1V11H2V9H3V8H4V7H5V6H7V5H15V6H8V7H6V8H5V9H4V10H3V14H4V15H5V16H3V15H2V13Z" fill="black" />
                            <path d="M13 7V8H12V9H11V10H10V11H9V12H8V13H7V11H8V9H9V8H11V7H13Z" fill="black" />
                            <path
                                d="M9 17H8V18H7V19H6V20H5V21H4V22H3V21H2V20H3V19H4V18H5V17H6V16H7V15H8V14H9V13H10V12H11V11H12V10H13V9H14V8H15V7H16V6H17V5H18V4H19V3H20V2H21V3H22V4H21V5H20V6H19V7H18V8H17V9H16V10H15V11H14V12H13V13H12V14H11V15H10V16H9V17Z"
                                fill="black"
                            />
                            <path d="M13 16H11V17H13V16Z" fill="black" />
                        </svg>
                    )}
                </Button>

                <Button
                    size="icon"
                    className={`cursor-pointer bg-secondary/5`}
                    disabled={isProcessing}
                    onClick={(e) => {
                        e.preventDefault();
                        setIsProcessing(true);
                        deleteNotification(props.id).finally(() => {
                            setIsProcessing(false);
                        });
                    }}
                >
                    <svg className="!h-6 !w-6 *:fill-secondary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6V14H19V22H18V23H6V22H5V14H4V6H20Z" fill="black" />
                        <path d="M21 3V5H3V3H4V2H9V1H15V2H20V3H21Z" fill="black" />
                    </svg>
                </Button>
            </div>
        </div>
    );
};

export default Notification;
