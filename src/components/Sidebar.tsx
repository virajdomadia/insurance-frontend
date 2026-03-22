'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { 
    Shield,
    PlusCircle, 
    Home, 
    LogOut, 
    Menu, 
    X,
    User,
    Users,
    Wallet
} from 'lucide-react';
import { Button } from './ui/button';

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    type NavLink = {
        name: string;
        href: string;
        icon: any;
        isPrimary?: boolean;
        adminOnly?: boolean;
        badge?: string;
    };

    const navLinks: NavLink[] = [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "Users Directory", href: "/admin/users", icon: Users, adminOnly: true },
        { name: "Policy Wallet", href: "/wallet", icon: Wallet },
        { name: "Add Policy", href: "/add-policy", icon: PlusCircle, isPrimary: true },
    ];

    const handleLogout = async () => {
        await logout();
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 h-screen bg-[#0A0F1C]/95 backdrop-blur-3xl border-r border-white/10 shrink-0 z-40 transition-all duration-300 relative">
                <div className="p-6">
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white tracking-tight leading-tight">Apna <span className="text-blue-500">Policy</span></h2>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Unified Portal</p>
                        </div>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
                    <p className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Navigation</p>
                    {navLinks.map((link) => {
                        if (link.adminOnly && user?.role !== 'ADMIN') return null;
                        const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname?.startsWith(link.href));
                        
                        return (
                            <Link key={link.name} href={link.href} className="block">
                                <div className={`
                                    flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group
                                    ${isActive 
                                        ? 'bg-blue-500/10 text-blue-400' 
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }
                                    ${link.isPrimary && !isActive ? 'border border-blue-500/30 bg-blue-500/5' : ''}
                                `}>
                                    <div className="flex items-center gap-3">
                                        <link.icon className={`h-5 w-5 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'} ${link.isPrimary ? 'text-blue-400' : ''}`} />
                                        <span className={`font-medium text-sm ${link.isPrimary && !isActive ? 'text-blue-300' : ''}`}>
                                            {link.name}
                                        </span>
                                    </div>
                                    {link.badge && (
                                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider rounded-md ml-auto">
                                            {link.badge}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* User Profile & Logout - Bottom pinned */}
                <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                            <User className="h-5 w-5 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                                {user?.name || user?.email?.split('@')[0] || 'User'}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate capitalize">
                                {user?.role || 'Citizen'}
                            </p>
                        </div>
                    </div>
                    
                    <Button 
                        variant="ghost" 
                        className="w-full justify-start text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                    </Button>
                </div>
            </aside>

            {/* Mobile Header / Hamburger */}
            <div className="md:hidden fixed top-0 w-full h-16 bg-[#0A0F1C]/90 backdrop-blur-xl border-b border-white/10 z-50 flex items-center justify-between px-4">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-white">Apna <span className="text-blue-500">Policy</span></h2>
                </Link>
                
                <button 
                    className="p-2 -mr-2 text-slate-400 hover:text-white transition-colors focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 top-16 bg-[#0A0F1C]/98 backdrop-blur-3xl z-40 overflow-y-auto pb-20 animate-in slide-in-from-top-2 duration-300 flex flex-col">
                    <div className="p-4 space-y-1 mt-4">
                        {navLinks.map((link) => {
                            if (link.adminOnly && user?.role !== 'ADMIN') return null;
                            const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname?.startsWith(link.href));
                            
                            return (
                                <Link 
                                    key={link.name} 
                                    href={link.href} 
                                    className="block"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <div className={`
                                        flex items-center justify-between px-4 py-3.5 rounded-2xl transition-colors
                                        ${isActive 
                                            ? 'bg-blue-500/15 text-blue-400' 
                                            : 'text-slate-300 hover:bg-white/5'
                                        }
                                        ${link.isPrimary && !isActive ? 'border border-blue-500/30 bg-blue-500/5' : ''}
                                    `}>
                                        <div className="flex items-center gap-4">
                                            <link.icon className={`h-6 w-6 ${isActive ? 'text-blue-400' : 'text-slate-500'} ${link.isPrimary ? 'text-blue-400' : ''}`} />
                                            <span className="font-semibold text-[15px]">
                                                {link.name}
                                            </span>
                                        </div>
                                        {link.badge && (
                                            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider rounded-md">
                                                {link.badge}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-auto p-4 border-t border-white/10 mx-4">
                        <Button 
                            variant="outline" 
                            className="w-full bg-white/5 border-white/10 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl h-12"
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                handleLogout();
                            }}
                        >
                            <LogOut className="mr-2 h-5 w-5" />
                            Sign out
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
