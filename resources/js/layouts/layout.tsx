import React from 'react';
import Nav from '../components/custom/nav';
import Footer from '../components/custom/footer';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Nav />
            <main className="min-h-[calc(100vh-100px)] py-8">
                {children}
            </main>
            <Footer />
        </>
    );
}