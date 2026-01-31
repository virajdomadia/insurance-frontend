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

type Role = "citizen" | "ngo" | "admin";

export function Sidebar() {
  const pathname = usePathname();

  // 🔥 Synchronous role detection (NO useEffect)
  let role: Role = "citizen";

  if (pathname.startsWith("/ngo")) role = "ngo";
  if (pathname.startsWith("/admin")) role = "admin";
  if (pathname.startsWith("/citizen")) role = "citizen";

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm hidden md:flex transition-all duration-300">
      {/* LOGO */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-xl text-blue-600 tracking-tight">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Shield size={18} fill="currentColor" />
          </div>
          <span>Insurance<span className="text-slate-900">App</span></span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">

        {/* CITIZEN */}
        {role === "citizen" && (
          <div className="space-y-2">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Citizen Portal</p>

            <Link href="/citizen/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${pathname === '/citizen/dashboard' ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <Home size={18} className={pathname === '/citizen/dashboard' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} />
              Dashboard
            </Link>

            <Link href="/citizen/check-eligibility" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${pathname === '/citizen/check-eligibility' ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <Search size={18} className={pathname === '/citizen/check-eligibility' ? 'text-blue-600' : 'text-slate-400'} />
              Check Eligibility
            </Link>

            <Link href="/citizen/policy-wallet" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${pathname === '/citizen/policy-wallet' ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <Shield size={18} className={pathname === '/citizen/policy-wallet' ? 'text-blue-600' : 'text-slate-400'} />
              Policy Wallet
            </Link>

            <Link href="/citizen/claims" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${pathname === '/citizen/claims' ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <FileText size={18} className={pathname === '/citizen/claims' ? 'text-blue-600' : 'text-slate-400'} />
              Claims History
            </Link>

            <Link href="/enrollment" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${pathname === '/enrollment' ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-100' : 'text-teal-600 hover:bg-teal-50 hover:text-teal-900'}`}>
              <Shield size={18} className={pathname === '/enrollment' ? 'text-teal-600' : 'text-teal-400'} />
              New Insurance Wizard
            </Link>
          </div>
        )}

        {/* NGO */}
        {role === "ngo" && (
          <div className="space-y-2">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">NGO Management</p>

            <Link href="/ngo/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${pathname === '/ngo/dashboard' ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <Users size={18} className={pathname === '/ngo/dashboard' ? 'text-blue-600' : 'text-slate-400'} />
              Overview
            </Link>

            <Link href="/ngo/check-eligibility" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${pathname === '/ngo/check-eligibility' ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <Search size={18} className={pathname === '/ngo/check-eligibility' ? 'text-blue-600' : 'text-slate-400'} />
              Eligibility Checker
            </Link>

            <Link href="/ngo/beneficiaries" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${pathname === '/ngo/beneficiaries' ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <ClipboardList size={18} className={pathname === '/ngo/beneficiaries' ? 'text-blue-600' : 'text-slate-400'} />
              Beneficiary List
            </Link>

            <Link href="/ngo/add-beneficiary" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${pathname === '/ngo/add-beneficiary' ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <UserPlus size={18} className={pathname === '/ngo/add-beneficiary' ? 'text-blue-600' : 'text-slate-400'} />
              Add New Beneficiary
            </Link>

            <Link href="/ngo/claims" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${pathname === '/ngo/claims' ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <FileText size={18} className={pathname === '/ngo/claims' ? 'text-blue-600' : 'text-slate-400'} />
              Claims Support
            </Link>

            <Link href="/enrollment" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${pathname === '/enrollment' ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-100' : 'text-teal-600 hover:bg-teal-50 hover:text-teal-900'}`}>
              <Shield size={18} className={pathname === '/enrollment' ? 'text-teal-600' : 'text-teal-400'} />
              New Insurance Wizard
            </Link>
          </div>
        )}

        {/* ADMIN */}
        {role === "admin" && (
          <div className="space-y-2">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Administration</p>

            <Link href="/admin/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${pathname === '/admin/dashboard' ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <Users size={18} className={pathname === '/admin/dashboard' ? 'text-blue-600' : 'text-slate-400'} />
              CSR Dashboard
            </Link>

            <Link href="/admin/check-eligibility" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${pathname === '/admin/check-eligibility' ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <Search size={18} className={pathname === '/admin/check-eligibility' ? 'text-blue-600' : 'text-slate-400'} />
              Check Eligibility
            </Link>

            <Link href="/enrollment" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${pathname === '/enrollment' ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-100' : 'text-teal-600 hover:bg-teal-50 hover:text-teal-900'}`}>
              <Shield size={18} className={pathname === '/enrollment' ? 'text-teal-600' : 'text-teal-400'} />
              New Insurance Wizard
            </Link>
          </div>
        )}
      </nav>

      {/* FOOTER AREA */}
      <div className="p-4 border-t border-slate-100">
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-blue-800 font-medium">Need Help?</p>
          <p className="text-[10px] text-blue-600 mt-0.5">Contact support at <br /> help@insurance.com</p>
        </div>
      </div>
    </aside>
  );
}
