"use client";

import { motion } from "framer-motion";
import { Heart, AlertTriangle, ExternalLink, Info } from "lucide-react";
import { StepProps } from "./types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LifeAccidentScreen({ onNext, onBack }: StepProps) {
    return (
        <div className="flex flex-col h-full p-6 max-w-md mx-auto overflow-y-auto">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <h2 className="text-2xl font-bold mb-2">Government Insurance</h2>
                <p className="text-muted-foreground mb-6">Essential protection at minimal cost.</p>

                <div className="space-y-4">
                    {/* PMJJBY Card */}
                    <Card className="p-5 border-l-4 border-l-red-500 overflow-hidden relative group hover:shadow-md transition-all">
                        <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">
                            LIFE COVER
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-2.5 bg-red-100 rounded-full text-red-600">
                                <Heart className="w-6 h-6 fill-current" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg">PMJJBY</h3>
                                </div>
                                <div className="text-2xl font-bold text-red-600 mt-1">₹2 Lakh</div>
                                <p className="text-sm text-muted-foreground mt-1">Life Insurance for death due to any cause.</p>
                                <div className="mt-3 flex items-center gap-2 text-sm font-medium bg-red-50 w-fit px-2 py-1 rounded text-red-700">
                                    <span className="line-through opacity-50">₹500</span>
                                    <span>₹436 / year</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* PMSBY Card */}
                    <Card className="p-5 border-l-4 border-l-amber-500 overflow-hidden relative group hover:shadow-md transition-all">
                        <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">
                            ACCIDENT COVER
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-2.5 bg-amber-100 rounded-full text-amber-600">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg">PMSBY</h3>
                                </div>
                                <div className="text-2xl font-bold text-amber-600 mt-1">₹2 Lakh</div>
                                <p className="text-sm text-muted-foreground mt-1">Accidental death & disability cover.</p>
                                <div className="mt-3 flex items-center gap-2 text-sm font-medium bg-amber-50 w-fit px-2 py-1 rounded text-amber-700">
                                    <span>Just ₹20 / year</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-8 space-y-3"
            >
                <Button onClick={onNext} className="w-full h-12 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                    Apply via Bank App
                    <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={onNext} className="w-full h-12">
                    How to Apply?
                    <Info className="ml-2 w-4 h-4" />
                </Button>
            </motion.div>
        </div>
    );
}
