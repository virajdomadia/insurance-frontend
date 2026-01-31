"use client";

import { motion } from "framer-motion";
import { User, Phone, Calendar, MapPin, Briefcase } from "lucide-react";
import { StepProps } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function UserDetailsScreen({ onNext, updateData, formData }: StepProps) {
    const handleChange = (field: string, value: string) => {
        updateData({ [field]: value });
    };

    return (
        <div className="flex flex-col h-full p-6 max-w-md mx-auto">
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="mb-8"
            >
                <h2 className="text-2xl font-bold text-foreground">Basic Details</h2>
                <p className="text-muted-foreground">Tell us a bit about yourself</p>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex-1 space-y-5"
            >
                <div className="space-y-2">
                    <Label>Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Enter your name"
                            className="pl-9 h-12 bg-white/50 backdrop-blur-sm"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Mobile Number</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="tel"
                            placeholder="+91 00000 00000"
                            className="pl-9 h-12 bg-white/50 backdrop-blur-sm"
                            value={formData.mobile}
                            onChange={(e) => handleChange("mobile", e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Age</Label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="number"
                                placeholder="Age"
                                className="pl-9 h-12 bg-white/50 backdrop-blur-sm"
                                value={formData.age}
                                onChange={(e) => handleChange("age", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>State</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                            <Select value={formData.state} onValueChange={(val) => handleChange("state", val)}>
                                <SelectTrigger className="pl-9 h-12 bg-white/50 backdrop-blur-sm w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MH">Maharashtra</SelectItem>
                                    <SelectItem value="DL">Delhi</SelectItem>
                                    <SelectItem value="KA">Karnataka</SelectItem>
                                    <SelectItem value="TN">Tamil Nadu</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Occupation (Optional)</Label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="e.g. Farmer, Driver, etc."
                            className="pl-9 h-12 bg-white/50 backdrop-blur-sm"
                            value={formData.occupation || ""}
                            onChange={(e) => handleChange("occupation", e.target.value)}
                        />
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-8 pt-4"
            >
                <Button
                    className="w-full h-12 text-lg bg-gradient-to-r from-teal-500 to-blue-600 shadow-lg shadow-blue-500/20"
                    onClick={onNext}
                    disabled={!formData.name || !formData.mobile || !formData.age}
                >
                    Continue
                </Button>
            </motion.div>
        </div>
    );
}
