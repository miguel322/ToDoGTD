"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from "@/components/organisms/Sidebar";
import VoiceOverlay from "@/components/organisms/VoiceOverlay";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (pathname === '/login') {
        return <main className="min-h-screen bg-bg-deep">{children}</main>;
    }

    return (
        <>
            <Sidebar />
            <main className="flex-1 min-h-screen relative">
                {children}
                <VoiceOverlay />
            </main>
        </>
    );
}
