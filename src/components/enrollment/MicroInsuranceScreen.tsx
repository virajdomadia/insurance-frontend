"use client";

import { motion } from "framer-motion";
import { HandHeart, Activity, Umbrella, ChevronRight } from "lucide-react";
import { StepProps } from "./types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MicroInsuranceScreen({ onNext }: StepProps) {
    return (
        <div className="flex flex-col h-full p-6 max-w-md mx-auto overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
                <Badge variant="outline" className="mb-2 border-blue-200 bg-blue-50 text-blue-700">CSR / NGO Supported</Badge>
                <h2 className="text-2xl font-bold">Boost Your Protection</h2>
                <p className="text-muted-foreground">Affordable micro-insurance to fill the gaps.</p>
            </motion.div>

            <div className="space-y-4">
                {/* Micro Accident */}
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                    <Card className="p-4 hover:shadow-lg transition-all cursor-pointer border-blue-100">
                        <div className="flex gap-4">
                            <div className="bg-blue-100 p-3 rounded-lg h-fit text-blue-600">
                                <Umbrella className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold">Income Loss Cover</h3>
                                    <Badge className="bg-blue-600">Popular</Badge>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">Get daily cash if hospitalized due to accident.</p>
                                <div className="mt-2 text-lg font-bold text-blue-700">₹500 / day</div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Micro Life */}
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                    <Card className="p-4 hover:shadow-lg transition-all cursor-pointer border-purple-100">
                        <div className="flex gap-4">
                            <div className="bg-purple-100 p-3 rounded-lg h-fit text-purple-600">
                                <HandHeart className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold">Extra Life Cover</h3>
                                <p className="text-sm text-gray-600 mt-1">Additional ₹2 Lakh protection for family.</p>
                                <div className="mt-2 text-lg font-bold text-purple-700">₹2 Lakh</div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Micro Health */}
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                    <Card className="p-4 hover:shadow-lg transition-all cursor-pointer border-green-100">
                        <div className="flex gap-4">
                            <div className="bg-green-100 p-3 rounded-lg h-fit text-green-600">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold">OPD & Recovery</h3>
                                <p className="text-sm text-gray-600 mt-1">Covers medicines and doctor visits.</p>
                                <div className="mt-2 text-lg font-bold text-green-700">₹5,000 / year</div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
            >
                <Button onClick={onNext} className="w-full h-12 bg-gray-900 text-white hover:bg-black">
                    Continue
                    <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
            </motion.div>
        </div>
    );
}
