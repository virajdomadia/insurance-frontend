"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  Shield,
  FileText,
  Users,
  UserPlus,
  ClipboardList,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "citizen" | "ngo" | "admin";

export function BottomNav() {
  const pathname = usePathname();

  // Determine role from pathname or localStorage
  const [role, setRole] = useState<Role>("citizen");

  useEffect(() => {
    // 1. Try to get explicit role from storage
    const storedRole = localStorage.getItem("role") as Role;
    if (storedRole && ["citizen", "ngo", "admin"].includes(storedRole)) {
      setRole(storedRole);
      return;
    }

    // 2. Fallback: Infer from URL
    if (pathname.startsWith("/ngo")) setRole("ngo");
    else if (pathname.startsWith("/admin")) setRole("admin");
    else if (pathname.startsWith("/citizen")) setRole("citizen");
  }, [pathname]);

  // Don't show bottom nav on login or home page
  if (pathname === "/" || pathname === "/login") {
    return null;
  }

  const navItems = {
    citizen: [
      { href: "/citizen/dashboard", icon: Home, label: "Home" },
      { href: "/citizen/check-eligibility", icon: Search, label: "Eligible" },
      { href: "/citizen/policy-wallet", icon: Shield, label: "Wallet" },
      { href: "/citizen/claims", icon: FileText, label: "Claims" },
      { href: "/enrollment", icon: Shield, label: "Wizard" },
    ],
    ngo: [
      { href: "/ngo/dashboard", icon: Home, label: "Home" },
      { href: "/ngo/beneficiaries", icon: ClipboardList, label: "Users" },
      { href: "/ngo/add-beneficiary", icon: UserPlus, label: "Add" },
      { href: "/ngo/claims", icon: FileText, label: "Claims" },
      { href: "/enrollment", icon: Shield, label: "Wizard" },
    ],
    admin: [
      { href: "/admin/dashboard", icon: Home, label: "Dashboard" },
      { href: "/admin/check-eligibility", icon: Search, label: "Eligible" },
      { href: "/enrollment", icon: Shield, label: "Wizard" },
    ],
  };

  const items = navItems[role] || [];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] z-50 md:hidden pb-safe">
      <div className="flex items-center justify-around h-16 px-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300 relative",
                isActive
                  ? "text-blue-600"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-blue-600 rounded-b-full shadow-[0_2px_8px_rgba(37,99,235,0.4)]" />
              )}
              <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} className={cn("transition-transform duration-300", isActive && "-translate-y-0.5")} />
              <span className={cn("text-[10px] font-medium transition-all", isActive ? "font-bold" : "font-normal")}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

