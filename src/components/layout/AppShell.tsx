'use client';

import { ReactNode } from "react";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - hidden on mobile, visible on desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 w-full min-w-0">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-6">
          {children}
        </main>

        {/* Bottom Navigation - visible on mobile only */}
        <BottomNav />
      </div>
    </div>
  );
}
