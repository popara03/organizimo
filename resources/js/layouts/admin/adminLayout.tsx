import React from 'react';
import Nav from '@/components/custom/nav';
import NotificationProvider from '@/providers/notificationProvider';
import Sidebar, { SidebarElement } from '@/components/custom/sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const sidebarAdminTabs: SidebarElement[] = [
      { id: 1, href: "/admin/groups", name: "Groups", color: "#9EB41D" },
      { id: 2, href: "/admin/users", name: "Users", color: "#369AC3" },
    ];

    return (
        <>
            <NotificationProvider>
                <Nav />
            </NotificationProvider>

            <main className="min-h-[calc(100vh-60px)] py-8 ps-12 pe-4 flex flex-col">
                <Sidebar data={sidebarAdminTabs} />
                {children}
            </main>
        </>
    );
}