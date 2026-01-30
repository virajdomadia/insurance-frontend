"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api-client";
import { Loader2, UserPlus, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
    const { toast } = useToast();
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("CITIZEN");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.register(email, password, name, role);

            toast({
                title: "Registration successful",
                description: "Your account has been created. Please log in.",
            });

            // Redirect to login page
            router.push("/login?registered=true");
        } catch (error: any) {
            toast({
                title: "Registration failed",
                description: error.message || "Failed to create account",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full bg-slate-50">
            {/* Left Side - Hero/Branding */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:flex w-1/2 bg-blue-600 items-center justify-center p-12 relative overflow-hidden"
            >
                {/* Abstract shapes/pattern */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white blur-3xl"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-300 blur-3xl"></div>
                </div>

                <div className="relative z-10 text-white max-w-lg">
                    <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-6 leading-tight">
                        Join the Community
                    </h1>
                    <p className="text-blue-100 text-lg leading-relaxed mb-8">
                        Create an account to access insurance schemes, manage policies, or partner as an NGO to help others.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-blue-200" />
                            <span className="text-blue-50">Simplified claims processing</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-blue-200" />
                            <span className="text-blue-50">Government scheme eligibility checks</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-blue-200" />
                            <span className="text-blue-50">Secure digital document storage</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Right Side - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-12 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-md space-y-8 py-10"
                >
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create an account</h2>
                        <p className="mt-2 text-slate-600">
                            Already have an account?{" "}
                            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700" htmlFor="name">
                                Full Name
                            </label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700" htmlFor="email">
                                Email Address
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700" htmlFor="password">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Create a password (min. 8 chars)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                                required
                                minLength={8}
                            />
                        </div>

                        <div className="space-y-3 pt-2">
                            <label className="text-sm font-medium text-slate-700">I am a...</label>
                            <RadioGroup value={role} onValueChange={setRole} className="grid grid-cols-2 gap-4">
                                <div>
                                    <RadioGroupItem value="CITIZEN" id="citizen" className="peer sr-only" />
                                    <Label
                                        htmlFor="citizen"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 hover:text-slate-900 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:text-blue-600 cursor-pointer transition-all"
                                    >
                                        <UserPlus className="mb-2 h-6 w-6" />
                                        Citizen
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem value="NGO" id="ngo" className="peer sr-only" />
                                    <Label
                                        htmlFor="ngo"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 hover:text-slate-900 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:text-blue-600 cursor-pointer transition-all"
                                    >
                                        <UserPlus className="mb-2 h-6 w-6" />
                                        NGO Partner
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all mt-6"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Create Account <ArrowRight className="w-4 h-4" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <p className="text-xs text-center text-slate-500 mt-6">
                        By clicking "Create Account", you agree to our <a href="#" className="underline hover:text-blue-600">Terms of Service</a> and <a href="#" className="underline hover:text-blue-600">Privacy Policy</a>.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
