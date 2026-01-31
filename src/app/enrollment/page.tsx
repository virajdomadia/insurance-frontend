"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WelcomeScreen from "@/components/enrollment/WelcomeScreen";
import { EnrollmentFormData } from "@/components/enrollment/types";
import UserDetailsScreen from "@/components/enrollment/UserDetailsScreen";
import EligibilityScreen from "@/components/enrollment/EligibilityScreen";
import LifeAccidentScreen from "@/components/enrollment/LifeAccidentScreen";
import BankRedirectScreen from "@/components/enrollment/BankRedirectScreen";
import CoverageSummaryScreen from "@/components/enrollment/CoverageSummaryScreen";
import MicroInsuranceScreen from "@/components/enrollment/MicroInsuranceScreen";
import ProtectionExplanationScreen from "@/components/enrollment/ProtectionExplanationScreen";
import NgoClaimSupportScreen from "@/components/enrollment/NgoClaimSupportScreen";
import CompletionScreen from "@/components/enrollment/CompletionScreen";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EnrollmentPage() {
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(1);
    const [formData, setFormData] = useState<EnrollmentFormData>({
        language: "English",
        name: "",
        mobile: "",
        age: "",
        state: "",
    });

    const updateData = (data: Partial<EnrollmentFormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const nextStep = () => {
        setDirection(1);
        setStep((prev) => prev + 1);
    };

    const prevStep = () => {
        if (step > 1) {
            setDirection(-1);
            setStep((prev) => prev - 1);
        }
    };

    const renderStep = () => {
        const props = { onNext: nextStep, onBack: prevStep, formData, updateData };

        switch (step) {
            case 1:
                return <WelcomeScreen {...props} />;
            case 2:
                return <UserDetailsScreen {...props} />;
            case 3:
                return <EligibilityScreen {...props} />;
            case 4:
                return <LifeAccidentScreen {...props} />;
            case 5:
                return <BankRedirectScreen {...props} />;
            case 6:
                return <CoverageSummaryScreen {...props} />;
            case 7:
                return <MicroInsuranceScreen {...props} />;
            case 8:
                return <ProtectionExplanationScreen {...props} />;
            case 9:
                return <NgoClaimSupportScreen {...props} />;
            case 10:
                return <CompletionScreen {...props} />;
            default:
                return <WelcomeScreen {...props} />;
        }
    };

    // Progress Bar Calculation
    const progress = (step / 10) * 100;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Top Navigation Bar - Only show back button if not on welcome screen */}
            <div className="p-4 flex items-center h-16 sticky top-0 bg-background/80 backdrop-blur-md z-10">
                {step > 1 && step < 10 && (
                    <Button variant="ghost" size="icon" onClick={prevStep} className="-ml-2">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                )}
                <div className="flex-1 text-center font-semibold text-sm text-muted-foreground ml-2">
                    {step < 10 ? `Step ${step} of 10` : 'Complete'}
                </div>
                <div className="w-8"></div> {/* Spacer for centering */}
            </div>

            {/* Progress Bar */}
            <div className="h-1 w-full bg-secondary">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={step}
                        custom={direction}
                        initial={{ x: direction > 0 ? 50 : -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: direction > 0 ? -50 : 50, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="h-full w-full absolute top-0 left-0 overflow-y-auto"
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
