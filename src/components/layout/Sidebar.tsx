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
} from "lucide-react";

type Role = "citizen" | "ngo" | "admin";

export function Sidebar() {
  const pathname = usePathname();

  // 🔥 Synchronous role detection (NO useEffect)
  let role: Role = "citizen";

  if (pathname.startsWith("/ngo")) role = "ngo";
  if (pathname.startsWith("/admin")) role = "admin";
  if (pathname.startsWith("/citizen")) role = "citizen";

  return (
    <aside className="w-64 bg-white border-r flex flex-col">
      {/* LOGO */}
      <div className="p-6 font-bold text-lg text-indigo-600 border-b">
        NGO Insurance
      </div>

      <nav className="px-4 py-4 space-y-6 text-sm">

        {/* CITIZEN */}
        {role === "citizen" && (
          <div>
            <p className="text-xs uppercase text-slate-400 mb-2">Citizen</p>

            <Link href="/citizen/dashboard" className="flex items-center gap-2 p-2 rounded hover:bg-slate-100">
              <Home size={18} /> Dashboard
            </Link>

            <Link href="/citizen/policy-wallet" className="flex items-center gap-2 p-2 rounded hover:bg-slate-100">
              <Shield size={18} /> Policy Wallet
            </Link>

            <Link href="/citizen/claims" className="flex items-center gap-2 p-2 rounded hover:bg-slate-100">
              <FileText size={18} /> Claims
            </Link>
          </div>
        )}

        {/* NGO */}
        {role === "ngo" && (
          <div>
            <p className="text-xs uppercase text-slate-400 mb-2">NGO</p>

            <Link href="/ngo/dashboard" className="flex items-center gap-2 p-2 rounded hover:bg-slate-100">
              <Users size={18} /> Dashboard
            </Link>

            <Link href="/ngo/beneficiaries" className="flex items-center gap-2 p-2 rounded hover:bg-slate-100">
              <ClipboardList size={18} /> Beneficiaries
            </Link>

            <Link href="/ngo/add-beneficiary" className="flex items-center gap-2 p-2 rounded hover:bg-slate-100">
              <UserPlus size={18} /> Add Beneficiary
            </Link>

            <Link href="/ngo/claims" className="flex items-center gap-2 p-2 rounded hover:bg-slate-100">
              <FileText size={18} /> Claims Support
            </Link>
          </div>
        )}

        {/* ADMIN */}
        {role === "admin" && (
          <div>
            <p className="text-xs uppercase text-slate-400 mb-2">Admin</p>

            <Link href="/admin/dashboard" className="flex items-center gap-2 p-2 rounded hover:bg-slate-100">
              <Users size={18} /> CSR Dashboard
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
}
