'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldAlert, User, FileText, CheckCircle2, ArrowLeft, Loader2, UploadCloud, FileCheck, X, Trash2 } from "lucide-react";
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useRouter, useParams } from 'next/navigation';

export default function EditPolicyPage() {
    const { user, authenticatedFetch } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const policyId = params.id as string;
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState({
        policyType: 'life',
        policyNumber: '',
        provider: '',
        premiumAmount: '',
        coverageAmount: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        const fetchPolicy = async () => {
            if (!policyId) return;
            try {
                const response = await authenticatedFetch(`/policies/${policyId}`);
                if (response.ok) {
                    const data = await response.json();
                    const p = data.policy;
                    setFormData({
                        policyType: p.policyType,
                        policyNumber: p.policyNumber,
                        provider: p.provider,
                        premiumAmount: p.premiumAmount.toString(),
                        coverageAmount: p.coverageAmount.toString(),
                        startDate: p.startDate ? new Date(p.startDate).toISOString().split('T')[0] : '',
                        endDate: p.endDate ? new Date(p.endDate).toISOString().split('T')[0] : '',
                    });
                } else {
                    toast({ title: "Error", description: "Failed to load policy details", variant: "destructive" });
                    router.push('/wallet');
                }
            } catch (error) {
                console.error("Failed to load policy", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user && policyId) {
            fetchPolicy();
        }
    }, [user, authenticatedFetch, policyId, router, toast]);

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
            };

            const response = await authenticatedFetch(`/policies/${policyId}`, {
                method: 'PUT',
                body: JSON.stringify(bodyData),
            });

            if (response.ok) {
                toast({ title: "Success", description: "Policy updated successfully." });
                router.push('/wallet');
            } else {
                const data = await response.json();
                setErrorMsg(data.message || 'Failed to update policy');
                toast({ title: "Error", description: data.message || 'Failed to update policy', variant: "destructive" });
            }
        } catch (error) {
            console.error("Update error:", error);
            setErrorMsg('An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await authenticatedFetch(`/policies/${policyId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                toast({ title: "Deleted", description: "Policy securely removed." });
                router.push('/wallet');
            } else {
                toast({ title: "Error", description: "Failed to delete policy", variant: "destructive" });
                setIsDeleting(false);
            }
        } catch (error) {
            console.error("Delete error:", error);
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-20 flex justify-center items-center h-full">
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4 md:px-8 xl:px-12 text-white">
            <Link href="/wallet" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
                <ArrowLeft size={16} />
                <span>Back to Wallet</span>
            </Link>

            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-amber-600/20 flex items-center justify-center border border-amber-500/30">
                            <ShieldAlert size={32} className="text-amber-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">Edit Policy</h1>
                            <p className="text-slate-400">Update or re-upload secure policy details.</p>
                        </div>
                    </div>
                    
                    <Button variant="outline" className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-300" onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                        Remove Policy
                    </Button>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="bg-[#111827]/50 border-white/5 p-6">
                        <CardHeader className="px-0 pt-0">
                            <CardTitle className="text-xl flex items-center gap-2 text-white">
                                <FileText size={20} className="text-amber-400" />
                                Modify Information
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
                            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold h-12" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating Record...</>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </div>
    );
}
