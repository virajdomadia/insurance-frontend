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
      { href: "/citizen/dashboard", icon: Home, label: "Dashboard" },
      { href: "/citizen/check-eligibility", icon: Search, label: "Eligibility" },
      { href: "/citizen/policy-wallet", icon: Shield, label: "Policy" },
      { href: "/citizen/claims", icon: FileText, label: "Claims" },
    ],
    ngo: [
      { href: "/ngo/dashboard", icon: Home, label: "Dashboard" },
      { href: "/ngo/check-eligibility", icon: Search, label: "Eligibility" },
      { href: "/ngo/beneficiaries", icon: ClipboardList, label: "Beneficiaries" },
      { href: "/ngo/add-beneficiary", icon: UserPlus, label: "Add" },
      { href: "/ngo/claims", icon: FileText, label: "Claims" },
    ],
    admin: [
      { href: "/admin/dashboard", icon: Home, label: "Dashboard" },
    ],
  };

  const items = navItems[role] || [];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              )}
            >
              <Icon size={20} className={cn(isActive && "text-blue-600")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

