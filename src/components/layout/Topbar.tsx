"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

type Role = "citizen" | "ngo" | "admin" | null;

export function Topbar() {
  const router = useRouter();
  const [role, setRole] = useState<Role>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role") as Role;
    setRole(storedRole);
  }, []);

  const switchRole = (newRole: Role) => {
    if (!newRole) return;

    localStorage.setItem("role", newRole);
    setRole(newRole);

    if (newRole === "citizen") router.push("/citizen/dashboard");
    if (newRole === "ngo") router.push("/ngo/dashboard");
    if (newRole === "admin") router.push("/admin/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="md:hidden font-bold text-lg text-blue-600 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Shield size={18} fill="currentColor" />
          </div>
          <span>InsuranceApp</span>
        </div>
        <span className="hidden md:inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
          Demo Environment
        </span>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* ROLE SWITCHER */}
        {role && (
          <div className="relative group">
            <select
              value={role}
              onChange={(e) => switchRole(e.target.value as Role)}
              className="appearance-none border border-slate-200 hover:border-blue-300 rounded-lg pl-3 pr-8 py-1.5 text-sm bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="citizen">Citizen View</option>
              <option value="ngo">NGO View</option>
              <option value="admin">Admin View</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-slate-600 hover:text-red-600 hover:bg-red-50 font-medium transition-colors"
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
