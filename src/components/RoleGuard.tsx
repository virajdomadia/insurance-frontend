'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface RoleGuardProps {
    children: ReactNode;
    allowedRoles: string[];
    fallbackPath?: string;
}

export default function RoleGuard({
    children,
    allowedRoles,
}: RoleGuardProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen text-slate-400">Loading your profile...</div>;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
                <div className="h-20 w-20 bg-red-500/10 rounded-full flex justify-center items-center mb-6">
                    <AlertTriangle className="h-10 w-10 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">Access Denied</h1>
                <p className="text-slate-400 mb-8 max-w-sm">
                    You do not have the required permissions ({allowedRoles.join(', ')}) to view this page. Your current role is {user ? user.role : 'Guest'}.
                </p>
                <div className="flex gap-4">
                    <Button onClick={() => router.push(user ? (user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard') : '/login')} className="bg-blue-600 hover:bg-blue-500">
                        Go to valid Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
