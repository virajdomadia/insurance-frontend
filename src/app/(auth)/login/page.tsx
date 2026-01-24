"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

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
        description: `Welcome back!`,
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 px-4 py-8">
      <Card className="w-full max-w-md p-6 md:p-8 shadow-2xl border-0">
        {/* BRAND */}
        <div className="text-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-blue-600">
            NGO Insurance
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-1">
            Secure access for citizens, NGOs & CSR partners
          </p>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs md:text-sm font-medium text-slate-700">
              Email
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 border-blue-200 focus:border-blue-400 text-sm md:text-base"
              required
            />
          </div>

          <div>
            <label className="text-xs md:text-sm font-medium text-slate-700">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 border-blue-200 focus:border-blue-400 text-sm md:text-base"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base"
            disabled={loading || !email || !password}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        {/* DEMO CREDENTIALS */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs font-semibold text-blue-900 mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-[11px] text-blue-800">
            <p><strong>Admin:</strong> admin@insurance.com / admin123</p>
            <p><strong>NGO:</strong> ngo@example.com / ngo123</p>
            <p><strong>Citizen:</strong> citizen@example.com / citizen123</p>
          </div>
        </div>

        {/* FOOTER */}
        <p className="text-[11px] text-slate-400 text-center mt-6">
          Demo environment · MongoDB backend · JWT authentication
        </p>
      </Card>
    </div>
  );
}
