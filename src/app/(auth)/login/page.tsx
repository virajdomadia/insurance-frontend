"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api-client";
import { Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.login(email, password);

      // Decode JWT to get user role (just for routing, not for security)
      const payload = JSON.parse(atob(response.accessToken.split('.')[1]));
      const role = payload.role;

      toast({
        title: "Login successful",
        description: `Welcome back to the platform.`,
      });

      // Redirect based on role
      if (role === "CITIZEN") {
        router.push("/citizen/dashboard");
      } else if (role === "NGO") {
        router.push("/ngo/dashboard");
      } else if (role === "ADMIN") {
        router.push("/admin/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
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
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Secure Insurance for Every Citizen
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            A unified platform connecting Citizens, NGOs, and Government schemes.
            Manage policies, detailed eligibility checks, and secure claim processing in one place.
          </p>

          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-4 text-blue-50">
              <div className="w-8 h-[1px] bg-white/50"></div>
              <span className="text-sm font-medium tracking-wider uppercase">Trusted by 50+ NGOs</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="mt-2 text-slate-600">
              Please enter your details to sign in.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign in <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          {/* DEMO CREDENTIALS - Redesigned */}
          <div className="pt-6 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center lg:text-left">Demo Access</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div
                onClick={() => { setEmail('admin@insurance.com'); setPassword('admin123'); }}
                className="cursor-pointer p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <p className="text-xs font-medium text-slate-900 group-hover:text-blue-700">Admin</p>
                <p className="text-[10px] text-slate-500 mt-1">admin@insurance.com</p>
              </div>
              <div
                onClick={() => { setEmail('ngo@example.com'); setPassword('ngo123'); }}
                className="cursor-pointer p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <p className="text-xs font-medium text-slate-900 group-hover:text-blue-700">NGO</p>
                <p className="text-[10px] text-slate-500 mt-1">ngo@example.com</p>
              </div>
              <div
                onClick={() => { setEmail('citizen@example.com'); setPassword('citizen123'); }}
                className="cursor-pointer p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <p className="text-xs font-medium text-slate-900 group-hover:text-blue-700">Citizen</p>
                <p className="text-[10px] text-slate-500 mt-1">citizen@example.com</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
