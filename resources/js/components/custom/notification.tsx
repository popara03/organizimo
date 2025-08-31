import {Link} from '@inertiajs/react'
import {Button} from '@/components/ui/button'
import { useState } from 'react'

export type NotificationProps = {
    id: number
    post_id: number
    text: string
    time: string
    is_read: boolean
    handleCheckIsAllRead: (id:number, value:boolean) => void
    handleRemoveDeletedNotification: (id:number) => void
}

const Notification = ( props: NotificationProps) => {
    const markNotificationAsRead = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        // TODO: Make API call to mark notification as read

            props.handleCheckIsAllRead(props.id, !props.is_read);

        console.log("Mark notification as read", props.id)
    }

    const deleteNotification = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        // TODO: Make API call to delete notification

            props.handleRemoveDeletedNotification(props.id);

        console.log("Delete notification", props.id)
    }

    return (
    <Link
    href={`/posts/${props.post_id}`}
    className={`w-full px-4 py-2 flex justify-between items-center gap-2 hover:opacity-100 ${props.is_read ? "" : "bg-accent-purple/50"}`}
    >
        <div className="min-w-0 w-full flex flex-col gap-2">
            <span className="text-sm text-secondary line-clamp-2">{props.text}</span>
            <span className="text-xs text-secondary/50">{props.time}</span>
        </div>

        <div className="flex gap-2">
            <Button size='icon'
            className="bg-secondary/5 cursor-pointer"
            onClick={markNotificationAsRead}
            >
                {!props.is_read ? (
                    <svg className="!w-6 !h-6 *:fill-secondary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 11H16V13H17V11Z" fill="black"/>
                    <path d="M16 13V15H15V16H13V15H14V14H15V13H16Z" fill="black"/>
                    <path d="M16 9V11H15V10H14V9H13V8H15V9H16Z" fill="black"/>
                    <path d="M13 16H11V17H13V16Z" fill="black"/>
                    <path d="M11 15V16H9V15H8V13H9V14H10V15H11Z" fill="black"/>
                    <path d="M13 7V8H12V11H11V12H8V13H7V11H8V9H9V8H11V7H13Z" fill="black"/>
                    <path d="M22 11V9H21V8H20V7H19V6H17V5H7V6H5V7H4V8H3V9H2V11H1V13H2V15H3V16H4V17H5V18H7V19H17V18H19V17H20V16H21V15H22V13H23V11H22ZM21 14H20V15H19V16H18V17H16V18H8V17H7V16H5V15H4V14H3V10H4V9H5V8H6V7H8V6H16V7H18V8H19V9H20V10H21V14Z" fill="black"/>
                    </svg>
                ) : (
                    <svg className="!w-6 !h-6 *:fill-secondary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 13H16V15H15V16H13V15H14V14H15V13Z" fill="black"/>
                    <path d="M17 11H16V13H17V11Z" fill="black"/>
                    <path d="M23 11V13H22V15H21V16H20V17H19V18H17V19H9V18H16V17H18V16H19V15H20V14H21V10H20V9H19V8H21V9H22V11H23Z" fill="black"/>
                    <path d="M2 13H1V11H2V9H3V8H4V7H5V6H7V5H15V6H8V7H6V8H5V9H4V10H3V14H4V15H5V16H3V15H2V13Z" fill="black"/>
                    <path d="M13 7V8H12V9H11V10H10V11H9V12H8V13H7V11H8V9H9V8H11V7H13Z" fill="black"/>
                    <path d="M9 17H8V18H7V19H6V20H5V21H4V22H3V21H2V20H3V19H4V18H5V17H6V16H7V15H8V14H9V13H10V12H11V11H12V10H13V9H14V8H15V7H16V6H17V5H18V4H19V3H20V2H21V3H22V4H21V5H20V6H19V7H18V8H17V9H16V10H15V11H14V12H13V13H12V14H11V15H10V16H9V17Z" fill="black"/>
                    <path d="M13 16H11V17H13V16Z" fill="black"/>
                    </svg>
                )}
            </Button>

            <Button
            size='icon'
            className="bg-secondary/5 cursor-pointer"
            onClick={deleteNotification}
            >
                <svg className="!w-6 !h-6 *:fill-secondary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path  d="M20 6V14H19V22H18V23H6V22H5V14H4V6H20Z" fill="black"/>
                <path  d="M21 3V5H3V3H4V2H9V1H15V2H20V3H21Z" fill="black"/>
                </svg>
            </Button>
        </div>
    </Link>
  )
}

export default Notification