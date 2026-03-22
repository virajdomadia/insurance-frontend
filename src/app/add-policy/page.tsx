'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldPlus, User, FileText, CheckCircle2, ArrowLeft, Loader2, ArrowRight, UploadCloud, FileCheck, X } from "lucide-react";
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export default function AddPolicyPage() {
    const { user, authenticatedFetch } = useAuth();
    const { toast } = useToast();
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [formData, setFormData] = useState({
        citizenEmailOrId: '',
        policyType: 'life',
        policyNumber: '',
        provider: '',
        premiumAmount: '',
        coverageAmount: '',
        startDate: '',
        endDate: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSelectChange = (value: string) => {
        setFormData({ ...formData, policyType: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');

        try {
            const bodyData = {
                policyType: formData.policyType,
                policyNumber: formData.policyNumber,
                provider: formData.provider,
                premiumAmount: Number(formData.premiumAmount),
                coverageAmount: Number(formData.coverageAmount),
                startDate: formData.startDate,
                endDate: formData.endDate,
                // Only send citizen target if the user is an AGGREGATOR/ADMIN
                ...(user?.role === 'ADMIN' && { citizenEmailOrId: formData.citizenEmailOrId }),
            };

            const response = await authenticatedFetch('/policies', {
                method: 'POST',
                body: JSON.stringify(bodyData),
            });

            if (response.ok) {
                setIsSuccess(true);
                toast({
                    title: "Success",
                    description: "Policy added successfully.",
                });
            } else {
                const data = await response.json();
                setErrorMsg(data.message || 'Failed to add policy');
                toast({
                    title: "Error",
                    description: data.message || 'Failed to add policy',
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error("Policy submission error:", error);
            setErrorMsg('An unexpected error occurred during submission.');
            toast({
                title: "Error",
                description: 'An unexpected error occurred',
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 md:px-8 xl:px-12 text-white">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
                <ArrowLeft size={16} />
                <span>Back to Dashboard</span>
            </Link>

            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-14 w-14 rounded-2xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                        <ShieldPlus size={32} className="text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Add Existing Policy</h1>
                        <p className="text-slate-400">Link a manual or external policy to a digital wallet.</p>
                    </div>
                </div>

                {isSuccess ? (
                    <Card className="bg-green-500/10 border-green-500/20 p-12 text-center relative overflow-hidden">
                        <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 size={32} className="text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Policy Successfully Linked</h2>
                        <p className="text-slate-400 md:max-w-md mx-auto mb-10">
                            The policy has been added to the profile and will now appear in the dashboard metrics.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button 
                                onClick={() => {
                                    setIsSuccess(false);
                                    setFormData({ ...formData, policyNumber: '', provider: '', premiumAmount: '', coverageAmount: '' });
                                }} 
                                variant="outline" 
                                className="border-white/10 text-slate-300 hover:text-white"
                            >
                                Add Another Policy
                            </Button>
                            <Link href="/dashboard">
                                <Button variant="secondary" className="bg-slate-800 hover:bg-slate-700 text-white">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        </div>
                    </Card>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {user?.role === 'ADMIN' && (
                                <Card className="bg-[#111827]/50 border-white/5 p-6 md:col-span-2">
                                    <CardHeader className="px-0 pt-0">
                                        <CardTitle className="text-xl flex items-center gap-2 text-white">
                                            <User size={20} className="text-blue-400" />
                                            Target Citizen Information
                                        </CardTitle>
                                        <CardDescription className="text-slate-400">
                                            Since you are an Administrator, you can add this policy on behalf of a citizen.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-0 space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="citizenEmailOrId" className="text-slate-200">Citizen Email or Unique ID</Label>
                                            <Input 
                                                id="citizenEmailOrId" 
                                                value={formData.citizenEmailOrId}
                                                onChange={handleChange}
                                                placeholder="e.g. user@example.com" 
                                                className="bg-white/5 border-white/10 h-11 text-white placeholder:text-slate-500" 
                                                required 
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            <Card className="bg-[#111827]/50 border-white/5 p-6 md:col-span-2">
                                <CardHeader className="px-0 pt-0">
                                    <CardTitle className="text-xl flex items-center gap-2 text-white">
                                        <FileText size={20} className="text-indigo-400" />
                                        Policy Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-0 grid grid-cols-1 md:grid-cols-2 gap-6 pb-0">
                                    <div className="space-y-2">
                                        <Label htmlFor="policyType" className="text-slate-200">Policy Type</Label>
                                        <Select value={formData.policyType} onValueChange={handleSelectChange}>
                                            <SelectTrigger className="bg-white/5 border-white/10 h-11 text-white">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#0A0F1C] border-white/10 text-white">
                                                <SelectItem value="life">Life Insurance</SelectItem>
                                                <SelectItem value="health">Health Insurance</SelectItem>
                                                <SelectItem value="accident">Accident Insurance</SelectItem>
                                                <SelectItem value="crop">Crop Insurance</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="policyNumber" className="text-slate-200">Policy Number</Label>
                                        <Input id="policyNumber" value={formData.policyNumber} onChange={handleChange} placeholder="e.g. POL-890234" className="bg-white/5 border-white/10 h-11 text-white placeholder:text-slate-500" required />
                                    </div>
                                    
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="provider" className="text-slate-200">Insurance Provider</Label>
                                        <Input id="provider" value={formData.provider} onChange={handleChange} placeholder="e.g. Life Insurance Corp" className="bg-white/5 border-white/10 h-11 text-white placeholder:text-slate-500" required />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="coverageAmount" className="text-slate-200">Total Coverage (Sum Insured in ₹)</Label>
                                        <Input id="coverageAmount" type="number" min="0" value={formData.coverageAmount} onChange={handleChange} placeholder="e.g. 500000" className="bg-white/5 border-white/10 h-11 text-white placeholder:text-slate-500" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="premiumAmount" className="text-slate-200">Annual Premium (₹)</Label>
                                        <Input id="premiumAmount" type="number" min="0" value={formData.premiumAmount} onChange={handleChange} placeholder="e.g. 5000" className="bg-white/5 border-white/10 h-11 text-white placeholder:text-slate-500" required />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="startDate" className="text-slate-200">Issue Date</Label>
                                        <Input id="startDate" type="date" value={formData.startDate} onChange={handleChange} className="bg-white/5 border-white/10 h-11 text-white placeholder:text-slate-500" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="endDate" className="text-slate-200">Expiry / Renewal Date</Label>
                                        <Input id="endDate" type="date" value={formData.endDate} onChange={handleChange} className="bg-white/5 border-white/10 h-11 text-white placeholder:text-slate-500" required />
                                    </div>

                                </CardContent>
                                
                                {errorMsg && (
                                    <div className="px-0 pt-4 pb-2">
                                        <p className="text-rose-400 text-sm font-medium">{errorMsg}</p>
                                    </div>
                                )}
                                
                                <CardFooter className="px-0 pt-10">
                                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Securing Policy...</>
                                        ) : (
                                            "Link Policy"
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
