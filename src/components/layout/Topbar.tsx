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
    <header className="h-14 bg-white border-b px-6 flex items-center justify-between">
      <span className="text-sm text-slate-500">
        Demo Mode · Investor Preview
      </span>

      <div className="flex items-center gap-3">
        {/* ROLE SWITCHER */}
        {role && (
          <select
            value={role}
            onChange={(e) => switchRole(e.target.value as Role)}
            className="border rounded px-2 py-1 text-sm bg-white"
          >
            <option value="citizen">Citizen</option>
            <option value="ngo">NGO</option>
            <option value="admin">Admin</option>
          </select>
        )}

        <Button variant="outline" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
