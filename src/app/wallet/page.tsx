'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, PlusCircle, ArrowRight, Wallet, Download, FileCheck, ShieldCheck, FileText, AlertCircle, Edit } from "lucide-react";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function WalletPage() {
    const { user, authenticatedFetch } = useAuth();
    const [policies, setPolicies] = useState<any[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const loadPolicies = async () => {
            try {
                const response = await authenticatedFetch('/policies');
                if (response.ok) {
                    const data = await response.json();
                    setPolicies(data.policies || []);
                }
            } catch (error) {
                console.error("Failed to fetch policies", error);
            } finally {
                setLoadingStats(false);
            }
        };

        if (user) {
            loadPolicies();
        }
    }, [user, authenticatedFetch]);

    return (
        <div className="container mx-auto py-10 px-4 md:px-8 xl:px-12">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
                            <Wallet size={24} className="text-indigo-400" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white">Digital Wallet</h1>
                    </div>
                    <p className="text-slate-400 max-w-xl">
                        A secure, centralized vault for all your linked insurance policies and official documents.
                    </p>
                </div>
                
                <Link href="/add-policy">
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 px-6 shadow-lg shadow-blue-500/20">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Add New Policy
                    </Button>
                </Link>
            </div>

            {loadingStats ? (
                <div className="h-64 flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-[#111827]/30 backdrop-blur-xl">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mb-4"></div>
                    <p className="text-slate-400 font-medium">Decrypting Vault...</p>
                </div>
            ) : policies.length === 0 ? (
                <Card className="bg-[#111827]/30 border-white/5 p-12 text-center flex flex-col items-center justify-center border-dashed border-2 max-w-2xl mx-auto mt-10">
                    <div className="h-20 w-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-inner">
                        <Shield className="h-10 w-10 text-slate-500 opacity-60" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Your Vault is Empty</h3>
                    <p className="text-slate-400 mb-8 max-w-md">
                        Link your first insurance policy to securely track coverage limits, premium deadlines, and official documents right here.
                    </p>
                    <Link href="/add-policy">
                        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white h-12 px-8 font-bold text-lg">
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Secure Your First Policy
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {policies.map((policy: any, index: number) => (
                        <motion.div
                            key={policy._id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="bg-[#0A0F1C]/80 backdrop-blur-xl border-white/5 hover:border-indigo-500/40 transition-all flex flex-col h-full overflow-hidden group shadow-xl">
                                
                                {/* Top Banner Line */}
                                <div className={`h-1.5 w-full ${policy.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />

                                <CardHeader className="pb-4 pt-6 border-b border-white/5 relative">
                                    <div className="absolute top-4 right-4 flex items-center gap-2">
                                        <Link href={`/edit-policy/${policy._id}`}>
                                            <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-full transition-colors">
                                                <Edit className="h-5 w-5" />
                                            </Button>
                                        </Link>
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center shadow-lg ${
                                            policy.status === 'Active' 
                                            ? 'bg-emerald-500/10 border border-emerald-500/20' 
                                            : 'bg-amber-500/10 border border-amber-500/20'
                                        }`}>
                                            {policy.status === 'Active' ? <ShieldCheck className="h-5 w-5 text-emerald-400"/> : <AlertCircle className="h-5 w-5 text-amber-400"/>}
                                        </div>
                                    </div>
                                    
                                    <span className="inline-block px-2.5 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded border border-indigo-500/20 mb-3 w-max">
                                        {policy.policyType} Insurance
                                    </span>
                                    
                                    <CardTitle className="text-2xl text-white tracking-tight mb-1 pr-12">{policy.provider}</CardTitle>
                                    <CardDescription className="text-slate-400 font-mono flex items-center gap-2">
                                        <FileText size={14} />
                                        {policy.policyNumber}
                                    </CardDescription>
                                </CardHeader>
                                
                                <CardContent className="pt-6 flex-1 flex flex-col gap-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">Total Coverage</p>
                                            <p className="text-emerald-400 font-bold text-lg">₹{(policy.coverageAmount || 0).toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">Annual Premium</p>
                                            <p className="text-white font-semibold text-lg">₹{(policy.premiumAmount || 0).toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center text-sm">
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Issue Date</p>
                                            <p className="text-slate-300 font-medium">{new Date(policy.startDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Renewal Date</p>
                                            <p className="text-slate-300 font-medium">{new Date(policy.endDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                        </div>
                                    </div>

                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
