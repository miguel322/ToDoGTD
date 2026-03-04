"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/infrastructure/firebase/config';
import { useTaskStore } from '@/application/useStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { setUser } = useTaskStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                setUser(user.uid);
                if (pathname === '/login') {
                    router.replace('/');
                }
            } else {
                // User is signed out
                setUser(null);
                if (pathname !== '/login') {
                    router.replace('/login');
                }
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [pathname, router, setUser]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-deep text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin"></div>
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-500 animate-pulse">Initializing Interface...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
