"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import RouteGuard from "@/components/auth/RouteGuard";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface PolicyRecommendation {
    name: string;
    coverage: number;
    premium: number;
    description: string;
    provider?: string;
    benefits?: string[];
}

interface FormData {
    name: string;
    age: string;
    income: string;
    district: string;
    bpl: boolean;
}

export default function AdminCheckEligibilityPage() {
    const { toast } = useToast();
    const [formData, setFormData] = useState<FormData>({
        name: "",
        age: "",
        income: "",
        district: "",
        bpl: false,
    });
    const [aadharFile, setAadharFile] = useState<File | null>(null);
    const [eligiblePolicies, setEligiblePolicies] = useState<PolicyRecommendation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setIsSubmitted(false);

        try {
            // In a real implementation with file upload, we would use FormData
            // const formDataToSend = new FormData();
            // formDataToSend.append('file', aadharFile);
            // ... append other fields headers: { 'Content-Type': 'multipart/form-data' }

            const response = await api.checkEligibility({
                age: parseInt(formData.age),
                income: parseFloat(formData.income),
                bplStatus: formData.bpl,
                name: formData.name,
                district: formData.district,
            });

            // Enhance API response with UI-specific fields if needed
            const policiesWithDetails = response.policies.map((p: any) => ({
                ...p,
                provider: "Government Scheme",
                benefits: ["Cashless Treatment", "Family Floater", "No Waiting Period"],
            }));

            setEligiblePolicies(policiesWithDetails);
            setIsSubmitted(true);

            if (aadharFile) {
                toast({
                    title: "Aadhar Card Uploaded",
                    description: `File ${aadharFile.name} attached to eligibility check.`,
                });
            }

        } catch (error: any) {
            toast({
                title: "Error checking eligibility",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <RouteGuard allowedRole="admin">
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Check Eligibility (Admin)</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Verify citizen eligibility and insurance schemes
                </p>
            </div>

            <div className="space-y-6">
                <Card className="p-4 md:p-6 bg-white shadow-lg border-0">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                                Full Name
                            </label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                required
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-1">
                                Age
                            </label>
                            <Input
                                id="age"
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Enter age"
                                min="1"
                                max="120"
                                required
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label htmlFor="income" className="block text-sm font-medium text-slate-700 mb-1">
                                Annual Income (₹)
                            </label>
                            <Input
                                id="income"
                                name="income"
                                type="number"
                                value={formData.income}
                                onChange={handleChange}
                                placeholder="Enter annual income"
                                min="0"
                                required
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label htmlFor="district" className="block text-sm font-medium text-slate-700 mb-1">
                                District
                            </label>
                            <Input
                                id="district"
                                name="district"
                                type="text"
                                value={formData.district}
                                onChange={handleChange}
                                placeholder="Enter district"
                                required
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="aadhar" className="block text-sm font-medium text-slate-700 mb-1">
                                Upload Aadhar Card
                            </label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="aadhar"
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => setAadharFile(e.target.files?.[0] || null)}
                                    className="w-full cursor-pointer"
                                />
                            </div>
                            <p className="text-xs text-slate-500">Supported formats: PDF, JPG, PNG (Max 5MB)</p>
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox
                                id="bpl"
                                checked={formData.bpl}
                                onCheckedChange={(checked) =>
                                    setFormData(prev => ({ ...prev, bpl: checked as boolean }))
                                }
                            />
                            <label htmlFor="bpl" className="text-sm font-medium text-slate-700 cursor-pointer">
                                Below Poverty Line (BPL) Card Holder
                            </label>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Checking Eligibility...
                                </>
                            ) : (
                                "Check Eligibility"
                            )}
                        </Button>
                    </form>
                </Card>

                {isSubmitted && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-lg md:text-xl font-semibold text-slate-800">
                            Eligible Insurance Schemes ({eligiblePolicies.length})
                        </h2>

                        {eligiblePolicies.length === 0 ? (
                            <Card className="p-8 bg-white border border-dashed border-slate-300 shadow-sm text-center">
                                <p className="text-slate-600 text-sm md:text-base mb-2">
                                    No eligible insurance schemes found.
                                </p>
                                <p className="text-xs text-slate-400">Try adjusting the income or age criteria.</p>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {eligiblePolicies.map((policy, index) => (
                                    <Card key={index} className="p-4 md:p-6 bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-base md:text-lg text-slate-800 mb-1">
                                                    {policy.name}
                                                </h3>
                                                <p className="text-xs md:text-sm text-slate-600 mb-2">
                                                    {policy.description}
                                                </p>
                                            </div>
                                            <Badge className="bg-green-600 text-white shrink-0 self-start">
                                                Eligible
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200">
                                            <div>
                                                <p className="text-xs text-slate-500">Coverage</p>
                                                <p className="text-sm md:text-base font-semibold text-slate-800">
                                                    ₹{policy.coverage.toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Annual Premium</p>
                                                <p className="text-sm md:text-base font-semibold text-slate-800">
                                                    {policy.premium === 0 ? "Free" : `₹${policy.premium.toLocaleString()}`}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <p className="text-xs font-medium text-slate-700 mb-2">Key Benefits:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {policy.benefits?.map((benefit, idx) => (
                                                    <Badge key={idx} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                                        {benefit}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </RouteGuard>
    );
}
