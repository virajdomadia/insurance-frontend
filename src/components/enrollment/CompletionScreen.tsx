"use client";

import { motion } from "framer-motion";
import { Check, Shield, FileText, HelpCircle } from "lucide-react";
import { StepProps } from "./types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link"; // Assuming we want to eventually link out

export default function CompletionScreen({ formData }: StepProps) {
    return (
        <div className="flex flex-col h-full p-6 max-w-md mx-auto">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center mb-8 bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl"
            >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                    <Check className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-green-900 dark:text-green-400">You are Covered!</h2>
                <p className="text-green-700 dark:text-green-300">Your insurance journey has started.</p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                    <Card className="p-4 flex flex-col items-center justify-center text-center h-32 hover:bg-muted/50 transition-colors cursor-pointer">
                        <Shield className="w-8 h-8 text-teal-600 mb-2" />
                        <span className="font-semibold text-sm">Govt Policies</span>
                    </Card>
                </motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                    <Card className="p-4 flex flex-col items-center justify-center text-center h-32 hover:bg-muted/50 transition-colors cursor-pointer">
                        <Shield className="w-8 h-8 text-blue-600 mb-2" />
                        <span className="font-semibold text-sm">Micro Policies</span>
                    </Card>
                </motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                    <Card className="p-4 flex flex-col items-center justify-center text-center h-32 hover:bg-muted/50 transition-colors cursor-pointer">
                        <FileText className="w-8 h-8 text-amber-600 mb-2" />
                        <span className="font-semibold text-sm">My Claims</span>
                    </Card>
                </motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                    <Card className="p-4 flex flex-col items-center justify-center text-center h-32 hover:bg-muted/50 transition-colors cursor-pointer">
                        <HelpCircle className="w-8 h-8 text-rose-600 mb-2" />
                        <span className="font-semibold text-sm">Get Help</span>
                    </Card>
                </motion.div>
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8"
            >
                <Button className="w-full h-12" variant="outline" onClick={() => window.location.href = '/dashboard'}>
                    Go to Main Dashboard
                </Button>
            </motion.div>
        </div>
    );
}
