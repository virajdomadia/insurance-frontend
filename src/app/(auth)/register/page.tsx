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
import { Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/AuthContext";

// Extremely strict password rules mapping
const passwordSchema = z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." });

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    password: passwordSchema,
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const { register: registerUser } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const passwordValue = watch("password", "");

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            setError(null);
            // Role is always USER for public registration
            const result = await registerUser(data.email, data.password, "USER", data.name);

            if (!result.ok) {
                throw new Error(result.message || "Registration failed");
            }

            setIsSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const PasswordStrengthIndicator = () => {
        const hasMinLength = passwordValue?.length >= 8;
        const hasUpper = /[A-Z]/.test(passwordValue || "");
        const hasLower = /[a-z]/.test(passwordValue || "");
        const hasNumber = /[0-9]/.test(passwordValue || "");
        const hasSpecial = /[^A-Za-z0-9]/.test(passwordValue || "");

        const metCount = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
        let strengthText = "Weak";
        let colorClass = "bg-red-500";
        if (metCount >= 3) { strengthText = "Fair"; colorClass = "bg-yellow-500"; }
        if (metCount === 5) { strengthText = "Strong"; colorClass = "bg-green-500"; }

        if (!passwordValue) return null;

        return (
            <div className="mt-2 text-xs">
                <div className="flex justify-between items-center mb-1 text-slate-400">
                    <span>Password Strength:</span>
                    <span className={`font-semibold ${colorClass.replace('bg-', 'text-')}`}>{strengthText}</span>
                </div>
                <div className="flex gap-1 h-1.5 w-full">
                    <div className={`flex-1 rounded-l-full ${passwordValue.length > 0 ? colorClass : 'bg-slate-700'}`}></div>
                    <div className={`flex-1 ${metCount >= 3 ? colorClass : 'bg-slate-700'}`}></div>
                    <div className={`flex-1 rounded-r-full ${metCount === 5 ? colorClass : 'bg-slate-700'}`}></div>
                </div>
            </div>
        );
    };

    if (isSuccess) {
        return (
            <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Registration Complete</h2>
                <p className="text-slate-400">Your account has been securely created. Redirecting to login...</p>
            </div>
        );
    }

    return (
        <>
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-white tracking-tight">Create an account</h2>
                <p className="text-sm text-slate-400 mt-1">Join the Apna Policy network today.</p>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-6 bg-red-900/30 border-red-500/50 text-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                    <Input
                        id="name"
                        placeholder="John Doe"
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                        {...register("name")}
                    />
                    {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                </div>




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
                    <Label htmlFor="password" className="text-slate-300">Secure Password</Label>
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
                    <PasswordStrengthIndicator />
                    {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 pr-10"
                            {...register("confirmPassword")}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 focus:outline-none"
                            tabIndex={-1}
                        >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>}
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white h-11"
                >
                    {isSubmitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</>
                    ) : (
                        "Create Account"
                    )}
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                    Sign in
                </Link>
            </div>
        </>
    );
}
