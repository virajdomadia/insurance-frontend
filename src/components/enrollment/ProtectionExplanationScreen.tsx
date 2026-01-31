"use client";

import { motion } from "framer-motion";
import { Shield, Plus, ArrowDown } from "lucide-react";
import { StepProps } from "./types";
import { Button } from "@/components/ui/button";

export default function ProtectionExplanationScreen({ onNext }: StepProps) {
    return (
        <div className="flex flex-col h-full items-center justify-center p-6 text-center max-w-md mx-auto">
            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-bold mb-8"
            >
                Total Accident Protection
            </motion.h2>

            <div className="relative w-full max-w-xs space-y-4">
                {/* Layer 1 */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-amber-100 border border-amber-300 p-4 rounded-xl flex justify-between items-center shadow-sm"
                >
                    <span className="font-semibold text-amber-900">Govt Accident (PMSBY)</span>
                    <span className="font-bold text-amber-700">₹2 Lakh</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center"
                >
                    <Plus className="w-6 h-6 text-gray-400" />
                </motion.div>

                {/* Layer 2 */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-blue-100 border border-blue-300 p-4 rounded-xl flex justify-between items-center shadow-sm"
                >
                    <span className="font-semibold text-blue-900">Micro Accident</span>
                    <span className="font-bold text-blue-700">₹2 Lakh</span>
                </motion.div>

                {/* Separator */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.8 }}
                    className="h-0.5 bg-gray-300 my-4"
                />

                {/* Total */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="bg-gradient-to-r from-teal-500 to-blue-600 text-white p-6 rounded-2xl shadow-xl flex flex-col items-center"
                >
                    <Shield className="w-10 h-10 mb-2 opacity-80" />
                    <div className="text-lg font-medium opacity-90">Total Cover</div>
                    <div className="text-4xl font-bold">₹4 Lakh</div>
                </motion.div>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
                *Applies to Accidental Death & Permanent Disability
            </p>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-10 w-full"
            >
                <Button onClick={onNext} className="w-full h-12 text-lg">
                    View Claim Support
                </Button>
            </motion.div>
        </div>
    );
}
