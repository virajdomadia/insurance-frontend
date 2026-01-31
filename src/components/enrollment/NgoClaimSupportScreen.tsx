"use client";

import { motion } from "framer-motion";
import { HeartHandshake, UploadCloud, PhoneCall, CheckCircle } from "lucide-react";
import { StepProps } from "./types";
import { Button } from "@/components/ui/button";

export default function NgoClaimSupportScreen({ onNext }: StepProps) {
    return (
        <div className="flex flex-col h-full p-6 max-w-md mx-auto text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 bg-rose-100 rounded-full mx-auto flex items-center justify-center mb-6"
            >
                <HeartHandshake className="w-10 h-10 text-rose-600" />
            </motion.div>

            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold mb-2">
                We Are Here For You
            </motion.h2>
            <p className="text-muted-foreground mb-8">
                Our NGO partner helps you claim what is rightfully yours.
            </p>

            <div className="space-y-4 text-left">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-4 p-4 bg-white border rounded-xl shadow-sm"
                >
                    <div className="bg-gray-100 p-2 rounded-lg"><UploadCloud className="w-5 h-5 text-gray-700" /></div>
                    <div>
                        <h3 className="font-semibold">Document Upload</h3>
                        <p className="text-xs text-muted-foreground">Easy digital submission</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-4 p-4 bg-white border rounded-xl shadow-sm"
                >
                    <div className="bg-gray-100 p-2 rounded-lg"><CheckCircle className="w-5 h-5 text-gray-700" /></div>
                    <div>
                        <h3 className="font-semibold">Claim Status Tracking</h3>
                        <p className="text-xs text-muted-foreground">Real-time updates</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-4 p-4 bg-rose-50 border border-rose-100 rounded-xl"
                >
                    <div className="bg-rose-100 p-2 rounded-lg"><PhoneCall className="w-5 h-5 text-rose-600" /></div>
                    <div>
                        <h3 className="font-semibold text-rose-900">NGO Helpline</h3>
                        <p className="text-xs text-rose-700">Free assistance for claims</p>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-auto pt-8"
            >
                <Button onClick={onNext} className="w-full h-12 bg-rose-600 hover:bg-rose-700">
                    Finish Setup
                </Button>
            </motion.div>
        </div>
    );
}
