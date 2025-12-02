import NotificationProvider from '@/providers/notificationProvider';
import React from 'react';
import Nav from '../components/custom/fixed/nav';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <NotificationProvider>
                <Nav />
                <main className="flex min-h-[calc(100vh-60px)] flex-col pt-8">{children}</main>
            </NotificationProvider>
        </>
    );
}
