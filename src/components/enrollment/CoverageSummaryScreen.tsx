"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Heart, AlertTriangle, Plus } from "lucide-react";
import { StepProps } from "./types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CoverageSummaryScreen({ onNext, formData }: StepProps) {
    return (
        <div className="flex flex-col h-full p-6 max-w-md mx-auto">
            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-bold mb-6"
            >
                Your Protection Shield
            </motion.h2>

            <div className="space-y-4 flex-1">
                {/* Government Health */}
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                    <Card className={`p-4 border-l-4 ${formData.isEligiblePromised ? 'border-l-green-500 bg-green-50/50' : 'border-l-gray-300 bg-gray-50/50'}`}>
                        <div className="flex items-center gap-3">
                            <ShieldCheck className={`w-6 h-6 ${formData.isEligiblePromised ? 'text-green-600' : 'text-gray-400'}`} />
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <span className="font-semibold">Govt Health (PM-JAY)</span>
                                    <span className={`text-sm font-bold ${formData.isEligiblePromised ? 'text-green-600' : 'text-gray-500'}`}>
                                        {formData.isEligiblePromised ? 'Active' : 'Not Eligible'}
                                    </span>
                                </div>
                                {formData.isEligiblePromised && <div className="text-sm text-green-700">₹5 Lakh Coverage</div>}
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Life Cover */}
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                    <Card className="p-4 border-l-4 border-l-red-500 bg-red-50/50">
                        <div className="flex items-center gap-3">
                            <Heart className="w-6 h-6 text-red-600" />
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <span className="font-semibold">Life Cover (PMJJBY)</span>
                                    <span className="text-sm font-bold text-red-600">Pending</span>
                                </div>
                                <div className="text-sm text-red-700">₹2 Lakh Coverage</div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Accident Cover */}
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                    <Card className="p-4 border-l-4 border-l-amber-500 bg-amber-50/50">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 text-amber-600" />
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <span className="font-semibold">Accident Cover</span>
                                    <span className="text-sm font-bold text-amber-600">Pending</span>
                                </div>
                                <div className="text-sm text-amber-700">₹2 Lakh Coverage</div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="p-4 mt-4 bg-blue-900 text-white rounded-xl shadow-lg"
                >
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold">Total Protection</h3>
                        <span className="text-2xl font-bold">₹{formData.isEligiblePromised ? '9' : '4'} Lakh</span>
                    </div>
                    <p className="text-blue-200 text-sm">Includes health, life, and accident coverage.</p>
                </motion.div>
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6"
            >
                <Button onClick={onNext} className="w-full h-12 bg-gradient-to-r from-teal-500 to-blue-600 text-lg shadow-lg">
                    Add Extra Protection
                    <Plus className="ml-2 w-5 h-5" />
                </Button>
            </motion.div>
        </div>
    );
}
