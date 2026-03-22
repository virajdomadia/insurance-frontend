'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, ChevronDown, ChevronUp, Shield, ShieldCheck, AlertCircle, TrendingUp, Mail } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

export default function AdminUsersPage() {
    const { user, authenticatedFetch } = useAuth();
    const [usersData, setUsersData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await authenticatedFetch('/admin/users');
                if (response.ok) {
                    const data = await response.json();
                    setUsersData(data.users || []);
                }
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.role === 'ADMIN') {
            loadUsers();
        } else if (user) {
            setLoading(false); // They shouldn't be here, RoleGuard would normally catch them
        }
    }, [user, authenticatedFetch]);

    const toggleExpand = (userId: string) => {
        setExpandedUserId(prev => prev === userId ? null : userId);
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                    <p className="text-slate-400 font-medium">Loading user directory...</p>
                </div>
            </div>
        );
    }

    if (user?.role !== 'ADMIN') {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <p className="text-rose-400 font-bold text-xl">Access Denied: Admin Only</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4 md:px-8 xl:px-12">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-12 w-12 rounded-2xl bg-violet-600/20 flex items-center justify-center border border-violet-500/30">
                            <Users size={24} className="text-violet-400" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white">Users Directory</h1>
                    </div>
                    <p className="text-slate-400 max-w-xl">
                        Comprehensive view of all registered members and their individual linked policies.
                    </p>
                </div>
            </div>

            {usersData.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                    <Users className="mx-auto h-12 w-12 text-slate-500 mb-4 opacity-50" />
                    <h3 className="text-xl font-bold text-white mb-2">No users found</h3>
                    <p className="text-slate-400">There are currently no registered users on the platform.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {usersData.map((userData, index) => {
                        const isExpanded = expandedUserId === userData._id;
                        const policies = userData.policies || [];
                        const isCitizen = !userData.role || userData.role.toUpperCase() !== 'ADMIN';

                        return (
                            <motion.div
                                key={userData._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="bg-[#0A0F1C]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-xl"
                            >
                                {/* User Row Header */}
                                <div 
                                    className="p-6 cursor-pointer hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                                    onClick={() => toggleExpand(userData._id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-full flex items-center justify-center border ${isCitizen ? 'bg-sky-500/10 border-sky-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                                            <span className={`font-bold ${isCitizen ? 'text-sky-400' : 'text-rose-400'}`}>
                                                {userData.name ? userData.name.charAt(0).toUpperCase() : userData.email.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                {userData.name || 'Anonymous User'}
                                                {!isCitizen && (
                                                    <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase tracking-wider rounded border border-rose-500/20">
                                                        Admin
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-0.5">
                                                <Mail className="h-3.5 w-3.5" />
                                                {userData.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 md:gap-12 pl-16 md:pl-0">
                                        <div className="text-left md:text-right">
                                            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Total Policies</p>
                                            <p className="text-white font-bold">{policies.length}</p>
                                        </div>
                                        <div className="text-left md:text-right">
                                            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Total Coverage</p>
                                            <p className="text-emerald-400 font-bold">{formatCurrency(userData.totalCoverage || 0)}</p>
                                        </div>
                                        <div className="text-slate-400">
                                            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Policies View */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="border-t border-white/5 bg-[#050811]/50"
                                        >
                                            <div className="p-6 md:p-8">
                                                {policies.length === 0 ? (
                                                    <div className="text-center py-8">
                                                        <Shield className="mx-auto h-8 w-8 text-slate-600 mb-3" />
                                                        <p className="text-slate-400">No policies linked to this user yet.</p>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                        {policies.map((policy: any) => (
                                                            <div key={policy._id} className="bg-white/[0.02] border border-white/5 rounded-xl p-5 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
                                                                <div className={`absolute top-0 left-0 w-1 h-full ${policy.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                                
                                                                <div className="flex justify-between items-start mb-4 pl-3">
                                                                    <div>
                                                                        <span className="inline-block px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded border border-indigo-500/20 mb-2">
                                                                            {policy.policyType} Insurance
                                                                        </span>
                                                                        <h4 className="text-lg font-bold text-white">{policy.provider}</h4>
                                                                        <p className="text-xs text-slate-400 font-mono mt-1">{policy.policyNumber}</p>
                                                                    </div>
                                                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${policy.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                                                        {policy.status === 'Active' ? <ShieldCheck className="h-4 w-4"/> : <AlertCircle className="h-4 w-4"/>}
                                                                    </div>
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-4 pl-3">
                                                                    <div>
                                                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Coverage</p>
                                                                        <p className="text-emerald-400 font-semibold">{formatCurrency(policy.coverageAmount)}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Premium</p>
                                                                        <p className="text-white font-semibold">{formatCurrency(policy.premiumAmount)}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
