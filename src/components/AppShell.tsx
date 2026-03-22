'use client';

import React, { ReactNode, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';

interface AppShellContentProps {
    children: ReactNode;
}

function AppShellContent({ children }: AppShellContentProps) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const isPublicRoute = pathname === '/login' || pathname === '/register' || pathname === '/';

    useEffect(() => {
        if (!loading) {
            if (!user && !isPublicRoute) {
                router.push('/login');
            } else if (user && isPublicRoute) {
                if (user.role === 'ADMIN') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/dashboard');
                }
            }
        }
    }, [user, loading, isPublicRoute, router]);

    if (loading && !isPublicRoute) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="text-sm font-medium text-muted-foreground">Authenticating...</p>
                </div>
            </div>
        );
    }

    if (isPublicRoute) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#0A0F1C] text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <main className="flex-1 overflow-y-auto w-full pt-16 md:pt-0 scrollbar-hide">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function AppShell({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <AppShellContent>{children}</AppShellContent>
        </AuthProvider>
    );
}
