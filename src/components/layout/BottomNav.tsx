"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  // Determine role from pathname
  let role: Role = "citizen";
  if (pathname.startsWith("/ngo")) role = "ngo";
  if (pathname.startsWith("/admin")) role = "admin";
  if (pathname.startsWith("/citizen")) role = "citizen";

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
    ],
    ngo: [
      { href: "/ngo/dashboard", icon: Home, label: "Home" },
      { href: "/ngo/check-eligibility", icon: Search, label: "Check" },
      { href: "/ngo/beneficiaries", icon: ClipboardList, label: "Users" },
      { href: "/ngo/add-beneficiary", icon: UserPlus, label: "Add" },
      { href: "/ngo/claims", icon: FileText, label: "Claims" },
    ],
    admin: [
      { href: "/admin/dashboard", icon: Home, label: "Dashboard" },
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

