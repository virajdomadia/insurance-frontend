import { ReactNode } from "react";
import { Shield } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#0A0F1C] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-blue-500/30 text-slate-200">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0 pointer-events-none"></div>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-[100%] blur-[120px] -z-10 pointer-events-none"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <Link href="/" className="flex items-center justify-center gap-2.5 mb-8 hover:opacity-80 transition-opacity">
                    <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Shield size={28} className="text-white" />
                    </div>
                    <span className="font-bold text-3xl tracking-tight text-white drop-shadow-sm">
                        Apna Policy<span className="text-blue-500">.</span>
                    </span>
                </Link>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-[#0F1629]/90 backdrop-blur-2xl py-8 px-4 shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 sm:rounded-2xl sm:px-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
