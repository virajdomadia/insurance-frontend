"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/AuthContext";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            setError(null);
            const result = await login(data.email, data.password);

            if (!result.ok) {
                throw new Error(result.message || "Login failed");
            }

            // Redirect explicit logic
            if (result.role === 'ADMIN') {
                router.push('/admin/dashboard');
            } else {
                router.push('/dashboard');
            }

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <>
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back</h2>
                <p className="text-sm text-slate-400 mt-1">Sign in to your Apna Policy account.</p>
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

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="password" className="text-slate-300">Password</Label>
                        <Link href="/forgot-password" className="text-xs font-semibold text-blue-400 hover:text-blue-300">Forgot password?</Link>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 pr-10"
                            {...register("password")}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 focus:outline-none"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white h-11"
                >
                    {isSubmitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
                    ) : (
                        "Sign In"
                    )}
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
                Don't have an account?{" "}
                <Link href="/register" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                    Register now
                </Link>
            </div>
        </>
    );
}
