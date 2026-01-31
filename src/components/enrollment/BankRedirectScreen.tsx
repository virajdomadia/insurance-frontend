"use client";

import { motion } from "framer-motion";
import { Building2, ArrowRight } from "lucide-react";
import { StepProps } from "./types";
import { Button } from "@/components/ui/button";

export default function BankRedirectScreen({ onNext, onBack }: StepProps) {
    return (
        <div className="flex flex-col h-full items-center justify-center p-6 text-center max-w-md mx-auto">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-full"
            >
                <Building2 className="w-16 h-16 text-blue-600" />
            </motion.div>

            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
            >
                <h2 className="text-2xl font-bold">Redirecting to Bank</h2>
                <p className="text-muted-foreground text-lg">
                    You will be redirected to your bank’s official app to complete enrollment.
                </p>
                <div className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded-lg border border-yellow-100 text-left">
                    <strong>Why?</strong> Banks manage the premium deduction for PMJJBY (₹436) and PMSBY (₹20).
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full mt-10 space-y-3"
            >
                <Button onClick={onNext} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                    Open Bank App (Simulate)
                    <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button variant="ghost" onClick={onBack} className="w-full">
                    Go Back
                </Button>
            </motion.div>
        </div>
    );
}
