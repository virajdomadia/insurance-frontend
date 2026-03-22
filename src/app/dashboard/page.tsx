'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Shield, ShieldCheck, ShieldAlert, ShieldX, TrendingUp, IndianRupee, Users, UserCheck,
    AlertTriangle, PlusCircle, ArrowRight, Activity, Building2, Clock, Loader2
} from "lucide-react";
import Link from 'next/link';
import { motion } from 'framer-motion';

interface DashboardData {
    totalPolicies: number;
    activePolicies: number;
    expiredPolicies: number;
    lapsedPolicies: number;
    totalCoverage: number;
    totalPremium: number;
    typeBreakdown: Record<string, number>;
    upcomingRenewals: number;
    recentPolicies: any[];
    monthlyTrend: { month: string; count: number }[];
    adminStats: {
        totalUsers: number;
        totalCitizens: number;
        topProviders: { provider: string; count: number }[];
    } | null;
    isAdmin: boolean;
}

const fadeUp: any = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.07, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
};

const formatCurrency = (val: number) =>
    '₹' + val.toLocaleString('en-IN', { maximumFractionDigits: 0 });

const policyTypeLabels: Record<string, string> = {
    life: 'Life',
    health: 'Health',
    accident: 'Accident',
    crop: 'Crop',
    other: 'Other',
};

const policyTypeColors: Record<string, string> = {
    life: 'bg-blue-500',
    health: 'bg-emerald-500',
    accident: 'bg-amber-500',
    crop: 'bg-lime-500',
    other: 'bg-purple-500',
};

export default function DashboardPage() {
    const { user, authenticatedFetch } = useAuth();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await authenticatedFetch('/dashboard');
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (e) {
                console.error('Dashboard fetch failed', e);
            } finally {
                setLoading(false);
            }
        };
        if (user) load();
    }, [user, authenticatedFetch]);

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-4 py-32">
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                <p className="text-slate-400 font-medium">Loading Dashboard...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-4 py-32">
                <ShieldAlert className="h-10 w-10 text-rose-500" />
                <p className="text-slate-400 font-medium">Failed to load dashboard data.</p>
            </div>
        );
    }

    const isAdmin = data.isAdmin;

    // KPI Cards config
    const kpiCards = [
        ...(isAdmin
            ? [
                  {
                      label: 'Total Users',
                      value: data.adminStats?.totalUsers || 0,
                      icon: Users,
                      color: 'text-violet-400',
                      bg: 'bg-violet-500/10 border-violet-500/20',
                      format: (v: number) => v.toString(),
                  },
                  {
                      label: 'Citizens Registered',
                      value: data.adminStats?.totalCitizens || 0,
                      icon: UserCheck,
                      color: 'text-sky-400',
                      bg: 'bg-sky-500/10 border-sky-500/20',
                      format: (v: number) => v.toString(),
                  },
              ]
            : []),
        {
            label: isAdmin ? 'All Policies' : 'My Policies',
            value: data.totalPolicies,
            icon: Shield,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10 border-indigo-500/20',
            format: (v: number) => v.toString(),
        },
        {
            label: 'Active',
            value: data.activePolicies,
            icon: ShieldCheck,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10 border-emerald-500/20',
            format: (v: number) => v.toString(),
        },
        {
            label: 'Expired',
            value: data.expiredPolicies,
            icon: ShieldX,
            color: 'text-rose-400',
            bg: 'bg-rose-500/10 border-rose-500/20',
            format: (v: number) => v.toString(),
        },
        {
            label: 'Upcoming Renewals',
            value: data.upcomingRenewals,
            icon: Clock,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10 border-amber-500/20',
            format: (v: number) => v.toString(),
        },
        {
            label: 'Total Coverage',
            value: data.totalCoverage,
            icon: TrendingUp,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10 border-emerald-500/20',
            format: formatCurrency,
        },
        {
            label: 'Annual Premium',
            value: data.totalPremium,
            icon: IndianRupee,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10 border-blue-500/20',
            format: formatCurrency,
        },
    ];

    // Max value for trend chart
    const maxTrend = Math.max(...data.monthlyTrend.map((t) => t.count), 1);

    // Type breakdown total
    const typeTotal = Object.values(data.typeBreakdown).reduce((a, b) => a + b, 0) || 1;

    return (
        <div className="container mx-auto py-10 px-4 md:px-8 xl:px-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-1">
                        {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
                    </h1>
                    <p className="text-slate-400">
                        {isAdmin
                            ? 'Platform-wide analytics and policy management overview.'
                            : 'Track your insurance coverage, premiums, and renewals at a glance.'}
                    </p>
                </div>
                <Link href="/add-policy">
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 px-6 shadow-lg shadow-blue-500/20">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Add Policy
                    </Button>
                </Link>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
                {kpiCards.map((kpi, i) => (
                    <motion.div key={kpi.label} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
                        <Card className={`border ${kpi.bg} backdrop-blur-xl overflow-hidden relative group hover:scale-[1.02] transition-transform`}>
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                                        {kpi.label}
                                    </span>
                                    <kpi.icon className={`h-5 w-5 ${kpi.color} opacity-70`} />
                                </div>
                                <p className={`text-2xl lg:text-3xl font-bold ${kpi.color}`}>
                                    {kpi.format(kpi.value)}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Middle Row — Trend + Type Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                {/* Monthly Trend */}
                <motion.div className="lg:col-span-2" custom={kpiCards.length} initial="hidden" animate="visible" variants={fadeUp}>
                    <Card className="bg-[#0A0F1C]/80 backdrop-blur-xl border-white/5 h-full">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg text-white flex items-center gap-2">
                                <Activity className="h-5 w-5 text-blue-400" />
                                Policy Trend (Last 6 Months)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-3 h-44">
                                {data.monthlyTrend.map((item, idx) => {
                                    const pct = (item.count / maxTrend) * 100;
                                    return (
                                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                            <span className="text-xs text-slate-400 font-medium">{item.count}</span>
                                            <div className="w-full relative rounded-lg overflow-hidden bg-white/5" style={{ height: '120px' }}>
                                                <motion.div
                                                    className="absolute bottom-0 left-0 right-0 rounded-lg bg-gradient-to-t from-blue-600 to-blue-400"
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${Math.max(pct, 5)}%` }}
                                                    transition={{ delay: 0.3 + idx * 0.1, duration: 0.6, ease: 'easeOut' }}
                                                />
                                            </div>
                                            <span className="text-[10px] text-slate-500 font-medium">{item.month}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Policy Type Breakdown */}
                <motion.div custom={kpiCards.length + 1} initial="hidden" animate="visible" variants={fadeUp}>
                    <Card className="bg-[#0A0F1C]/80 backdrop-blur-xl border-white/5 h-full">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg text-white flex items-center gap-2">
                                <Shield className="h-5 w-5 text-indigo-400" />
                                Policy Types
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Object.entries(data.typeBreakdown).map(([type, count]) => {
                                const pct = Math.round((count / typeTotal) * 100);
                                return (
                                    <div key={type}>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-sm text-slate-300 font-medium capitalize">
                                                {policyTypeLabels[type] || type}
                                            </span>
                                            <span className="text-xs text-slate-400">{count} ({pct}%)</span>
                                        </div>
                                        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                            <motion.div
                                                className={`h-2 rounded-full ${policyTypeColors[type] || 'bg-slate-500'}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${pct}%` }}
                                                transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                            {Object.keys(data.typeBreakdown).length === 0 && (
                                <p className="text-slate-500 text-sm italic text-center py-6">No policies yet</p>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Bottom Row — Recent Policies + Admin Top Providers */}
            <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-3' : ''} gap-6`}>
                {/* Recent Policies */}
                <motion.div className={isAdmin ? 'lg:col-span-2' : ''} custom={kpiCards.length + 2} initial="hidden" animate="visible" variants={fadeUp}>
                    <Card className="bg-[#0A0F1C]/80 backdrop-blur-xl border-white/5">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg text-white flex items-center gap-2">
                                <Shield className="h-5 w-5 text-emerald-400" />
                                Recent Policies
                            </CardTitle>
                            <Link href="/wallet">
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white text-xs gap-1">
                                    View All <ArrowRight className="h-3 w-3" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {data.recentPolicies.length === 0 ? (
                                <div className="text-center py-10">
                                    <Shield className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                                    <p className="text-slate-500 mb-4">No policies found</p>
                                    <Link href="/add-policy">
                                        <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white">
                                            <PlusCircle className="mr-1 h-4 w-4" /> Add First Policy
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {data.recentPolicies.map((policy: any) => (
                                        <div key={policy._id} className="flex items-center justify-between py-3 gap-4 group">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                                                    policy.status === 'Active'
                                                        ? 'bg-emerald-500/10 border border-emerald-500/20'
                                                        : 'bg-rose-500/10 border border-rose-500/20'
                                                }`}>
                                                    {policy.status === 'Active'
                                                        ? <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                                        : <ShieldX className="h-4 w-4 text-rose-400" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-white truncate">{policy.provider}</p>
                                                    <p className="text-[10px] text-slate-500 font-mono">{policy.policyNumber}</p>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-sm font-semibold text-emerald-400">
                                                    {formatCurrency(policy.coverageAmount)}
                                                </p>
                                                <p className="text-[10px] text-slate-500 uppercase">{policy.policyType}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Admin: Top Providers */}
                {isAdmin && data.adminStats && (
                    <motion.div custom={kpiCards.length + 3} initial="hidden" animate="visible" variants={fadeUp}>
                        <Card className="bg-[#0A0F1C]/80 backdrop-blur-xl border-white/5 h-full">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg text-white flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-amber-400" />
                                    Top Insurance Providers
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {data.adminStats.topProviders.length === 0 ? (
                                    <p className="text-slate-500 text-sm italic text-center py-6">No provider data</p>
                                ) : (
                                    <div className="space-y-4">
                                        {data.adminStats.topProviders.map((prov, idx) => (
                                            <div key={prov.provider} className="flex items-center gap-3">
                                                <span className="text-xs font-bold text-slate-500 w-5">{idx + 1}.</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-white truncate">{prov.provider}</p>
                                                </div>
                                                <span className="text-sm font-semibold text-amber-400">
                                                    {prov.count} {prov.count === 1 ? 'policy' : 'policies'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>

            {/* Alert Banner */}
            {data.upcomingRenewals > 0 && (
                <motion.div
                    className="mt-8"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    <Card className="bg-amber-500/5 border-amber-500/20">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-10 w-10 bg-amber-500/10 rounded-full flex items-center justify-center shrink-0">
                                <AlertTriangle className="h-5 w-5 text-amber-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-amber-400 text-sm">Renewal Reminder</p>
                                <p className="text-slate-400 text-xs">
                                    You have <strong className="text-white">{data.upcomingRenewals}</strong> {data.upcomingRenewals === 1 ? 'policy' : 'policies'} expiring in the next 30 days. Review and renew to maintain coverage.
                                </p>
                            </div>
                            <Link href="/wallet" className="ml-auto shrink-0">
                                <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-xs">
                                    Review
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
