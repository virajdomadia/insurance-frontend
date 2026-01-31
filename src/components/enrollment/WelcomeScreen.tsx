"use client";

import { motion } from "framer-motion";
import { Shield, Languages, ChevronRight } from "lucide-react";
import { StepProps } from "./types";
import { Button } from "@/components/ui/button";

export default function WelcomeScreen({ onNext, updateData, formData }: StepProps) {
    return (
        <div className="flex flex-col h-full items-center justify-center p-6 text-center space-y-8">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 bg-gradient-to-br from-teal-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20"
            >
                <Shield className="w-12 h-12 text-white" />
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
            >
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400">
                    Insurance Access Platform
                </h1>
                <p className="text-muted-foreground text-lg max-w-xs mx-auto">
                    Check Government Insurance & Get Extra Protection
                </p>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-full max-w-xs space-y-4"
            >
                <Button
                    size="lg"
                    className="w-full h-14 text-lg bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 shadow-lg shadow-blue-500/25 rounded-xl"
                    onClick={onNext}
                >
                    Start Now
                    <ChevronRight className="ml-2 w-5 h-5" />
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary transition-colors">
                    <Languages className="w-4 h-4" />
                    <span>{formData.language || "English"}</span>
                </div>
            </motion.div>
        </div>
    );
}
