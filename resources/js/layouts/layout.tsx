import React from 'react';
import Nav from '../components/custom/nav';
import NotificationProvider from '@/providers/notificationProvider';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <NotificationProvider>
                <Nav />
            </NotificationProvider>

            <main className="min-h-[calc(100vh-100px)] py-8">
                {children}
            </main>
        </>
    );
}