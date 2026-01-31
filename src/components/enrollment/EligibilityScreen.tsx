"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, FileText, ChevronRight, AlertCircle } from "lucide-react";
import { StepProps } from "./types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function EligibilityScreen({ onNext, updateData, formData }: StepProps) {
    const [checking, setChecking] = useState(true);
    // Simple mock logic: if age > 60 or state is 'MH', eligible. Or just random for demo if not set.
    const isEligible = formData.age ? parseInt(formData.age) > 50 || formData.state === 'MH' : true;

    useEffect(() => {
        const timer = setTimeout(() => {
            setChecking(false);
            // Store eligibility in formData for summary screen
            updateData({ isEligiblePromised: isEligible });
        }, 1500);
        return () => clearTimeout(timer);
    }, [updateData, isEligible, formData.age, formData.state]);

    if (checking) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-6">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full"
                />
                <h2 className="text-xl font-semibold animate-pulse">Checking Eligibility...</h2>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-6 max-w-md mx-auto">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center space-y-6 text-center"
            >
                {isEligible ? (
                    <>
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="space-y-2">
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Verified</span>
                            <h2 className="text-2xl font-bold">Eligible for PM-JAY</h2>
                            <p className="text-muted-foreground">You qualify for the government health scheme.</p>
                        </div>

                        <Card className="w-full p-4 bg-gradient-to-br from-green-50 to-teal-50 border-green-200 dark:bg-green-950/20 dark:border-green-800">
                            <div className="flex items-start gap-4 text-left">
                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                    <FileText className="w-6 h-6 text-teal-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">₹5 Lakh Coverage</h3>
                                    <p className="text-sm text-green-700/80 dark:text-green-400">Free medical treatment per family per year.</p>
                                </div>
                            </div>
                        </Card>

                        <Button onClick={onNext} className="w-full h-12 bg-teal-600 hover:bg-teal-700">
                            View Ayushman Card Steps
                            <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                    </>
                ) : (
                    <>
                        <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">Not Eligible for PM-JAY</h2>
                            <p className="text-muted-foreground">Based on current criteria, you are not eligible for the government health scheme.</p>
                        </div>

                        <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-800">
                            Don't worry! You can still protect your family with affordable Life & Accident Insurance.
                        </div>

                        <Button onClick={onNext} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                            Continue to Life & Accident Insurance
                            <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                    </>
                )}
            </motion.div>
        </div>
    );
}
