"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/AuthContext";

const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const { forgotPassword } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        try {
            setError(null);
            const result = await forgotPassword(data.email);

            if (!result.ok) {
                throw new Error(result.message || "Request failed");
            }

            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
                <p className="text-slate-400 mb-6">If an account exists with that email, we have sent a password reset link.</p>
                <Link href="/login" className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-white tracking-tight">Reset password</h2>
                <p className="text-sm text-slate-400 mt-1">Enter your email and we'll send you a reset link.</p>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-6 bg-red-900/30 border-red-500/50 text-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">Email address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                        {...register("email")}
                    />
                    {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white h-11"
                >
                    {isSubmitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                    ) : (
                        "Send Reset Link"
                    )}
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
                Remember your password?{" "}
                <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                    Sign in
                </Link>
            </div>
        </>
    );
}
