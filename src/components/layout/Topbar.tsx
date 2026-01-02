"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
    <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-white/20 shadow-sm px-4 md:px-6 flex items-center justify-between">
      <span className="text-xs md:text-sm text-blue-600 font-medium truncate">
        <span className="hidden sm:inline">Demo Mode · Investor Preview</span>
        <span className="sm:hidden">Demo Mode</span>
      </span>

      <div className="flex items-center gap-2 md:gap-3">
        {/* ROLE SWITCHER */}
        {role && (
          <select
            value={role}
            onChange={(e) => switchRole(e.target.value as Role)}
            className="border border-blue-200 rounded-lg px-2 md:px-3 py-1.5 text-xs md:text-sm bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="citizen">Citizen</option>
            <option value="ngo">NGO</option>
            <option value="admin">Admin</option>
          </select>
        )}

        <Button variant="outline" size="sm" onClick={logout} className="bg-white hover:bg-blue-50 border-blue-200 text-blue-700 text-xs md:text-sm px-3 md:px-4">
          Logout
        </Button>
      </div>
    </header>
  );
}
