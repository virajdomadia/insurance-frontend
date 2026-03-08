"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Shield,
  Users,
  Heart,
  TrendingUp,
  ArrowRight,
  Building2,
  UserCircle,
  Award,
  ChevronRight,
  Stethoscope,
  Activity,
  Globe2,
  CheckCircle2
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Universal Coverage",
      description: "Seamless access to government schemes and bite-sized micro-insurance policies tailored for every citizen's daily needs."
    },
    {
      icon: Globe2,
      title: "Ecosystem Integration",
      description: "A unified platform connecting citizens, NGOs, and healthcare providers to streamline the entire insurance lifecycle."
    },
    {
      icon: Activity,
      title: "Instant Claim Processing",
      description: "Proprietary AI-driven validation ensures that legitimate claims are processed and disbursed in record time."
    },
    {
      icon: TrendingUp,
      title: "Actionable Insights",
      description: "Empower decision-makers with real-time geospatial analytics on policy adoption and public health trends."
    }
  ];

  const stats = [
    { label: "Active Policies managed", value: "2.4M+", icon: Shield },
    { label: "NGO Partners onboarded", value: "850+", icon: Building2 },
    { label: "Lives protected globally", value: "10M+", icon: Heart },
    { label: "Claims disbursed swiftly", value: "₹450Cr+", icon: Award }
  ];

  const howItWorks = [
    "Discover your eligibility for government-backed schemes instantly.",
    "Enroll in comprehensive or bite-sized policies without the paperwork.",
    "Manage your family's coverage securely in your digital Policy Wallet.",
    "File claims online and receive unparalleled support from our NGO network."
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0A0F1C] font-sans selection:bg-blue-500/30 text-slate-200 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0F1C]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield size={22} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white drop-shadow-sm">Apna Policy<span className="text-blue-500">.</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Platform</a>
            <a href="#impact" className="hover:text-white transition-colors">Impact</a>
            <a href="#ecosystem" className="hover:text-white transition-colors">Ecosystem</a>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/login")}
              variant="ghost"
              className="hidden md:flex text-slate-300 hover:text-white hover:bg-white/5"
            >
              Sign In
            </Button>
            <Button
              onClick={() => router.push("/register")}
              className="bg-white text-[#0A0F1C] hover:bg-blue-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] rounded-full px-6 font-semibold"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0 pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 rounded-[100%] blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            style={{ opacity, scale }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-xs font-semibold text-blue-200 tracking-wide uppercase">Now Live: Micro Insurance Marketplace</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-8 max-w-5xl leading-[1.1]"
            >
              Insurance infrastructure for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">next billion.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-2xl text-slate-400 mb-12 max-w-3xl leading-relaxed"
            >
              Democratizing financial protection. We connect underserved communities with government schemes and affordable private coverage through a unified, intelligent platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Button
                onClick={() => router.push("/register")}
                className="bg-blue-600 hover:bg-blue-500 text-white h-14 px-8 text-lg rounded-full shadow-[0_0_40px_rgba(37,99,235,0.3)] transition-all hover:shadow-[0_0_60px_rgba(37,99,235,0.4)] hover:-translate-y-1"
              >
                Start Coverage Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => router.push("/login")}
                variant="outline"
                className="bg-transparent border-white/10 text-white hover:bg-white/5 h-14 px-8 text-lg rounded-full backdrop-blur-sm"
              >
                Access Partner Portal
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Dashboard Preview / Interface Mockup */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-10 md:-mt-20 mb-32">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 100 }}
          className="rounded-2xl md:rounded-[2rem] border border-white/10 bg-[#0F1629]/90 backdrop-blur-2xl shadow-2xl shadow-blue-900/20 overflow-hidden"
        >
          {/* Mockup Header */}
          <div className="h-12 border-b border-white/5 flex items-center px-4 md:px-6 gap-2 bg-black/20">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
            </div>
            <div className="mx-auto bg-white/5 px-32 py-1.5 rounded-md text-[10px] text-slate-500 font-mono hidden md:block">app.apnapolicy.live</div>
          </div>
          {/* Mockup Body - Abstract interpretation of Policy Wallet */}
          <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 lg:col-span-2 space-y-6">
              <div className="h-40 rounded-xl bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border border-blue-500/20 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">Active</span>
                </div>
                <div>
                  <div className="h-2 w-24 bg-blue-400/20 rounded mt-4 mb-2"></div>
                  <div className="h-4 w-48 bg-white/60 rounded"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="h-24 rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col justify-between">
                  <div className="h-2 w-16 bg-white/20 rounded"></div>
                  <div className="h-6 w-24 bg-white/80 rounded"></div>
                </div>
                <div className="h-24 rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col justify-between">
                  <div className="h-2 w-16 bg-white/20 rounded"></div>
                  <div className="h-6 w-24 bg-white/80 rounded"></div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 w-32 bg-white/10 rounded mb-6"></div>
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 rounded-lg bg-white/5 border border-white/5 flex items-center px-4 gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10"></div>
                  <div className="flex-1">
                    <div className="h-2 w-full bg-white/20 rounded mb-2"></div>
                    <div className="h-2 w-2/3 bg-white/10 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/5">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Engineered for <span className="text-blue-400">scale & impact</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            A full-stack, API-first architecture designed to eliminate friction in policy distribution and claims processing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="p-8 h-full bg-[#111827]/50 border-white/5 hover:bg-[#111827] hover:border-blue-500/30 transition-all duration-300 group">
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                  <feature.icon className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats/Impact Section with Background */}
      <div id="impact" className="relative py-24 md:py-32 overflow-hidden border-y border-white/5 bg-[#0D1322]">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto w-12 h-12 mb-4 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                  <stat.icon className="h-5 w-5 text-indigo-400" />
                </div>
                <p className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">{stat.value}</p>
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* User Types / Ecosystem Section */}
      <div id="ecosystem" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              A unified ecosystem powering <span className="text-indigo-400">financial inclusion.</span>
            </h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              We've replaced fractured processes with a streamlined platform. No more opaque eligibility checks or manual claims paperwork. Just one interface for everyone involved.
            </p>

            <div className="space-y-6">
              {howItWorks.map((text, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={i}
                  className="flex items-start gap-4"
                >
                  <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
                  <p className="text-slate-300 text-lg">{text}</p>
                </motion.div>
              ))}
            </div>

            <Button
              onClick={() => router.push("/register")}
              className="mt-10 bg-white text-[#0A0F1C] hover:bg-slate-200 h-12 px-8 rounded-full font-semibold"
            >
              Explore the Platform
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Ecosystem Cards */}
              <Card className="p-6 bg-gradient-to-br from-blue-900/40 to-[#0A0F1C] border-blue-500/20 col-span-1 sm:col-span-2 hover:border-blue-500/40 transition-colors">
                <UserCircle className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Citizens</h3>
                <p className="text-sm text-slate-400">Seamlessly discover schemes, manage policies, and track claims from a unified wallet interface.</p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-indigo-900/40 to-[#0A0F1C] border-indigo-500/20 hover:border-indigo-500/40 transition-colors">
                <Building2 className="w-8 h-8 text-indigo-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">NGO Partners</h3>
                <p className="text-sm text-slate-400">Onboard beneficiaries in bulk and assist with claim documentation effortlessly.</p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-purple-900/40 to-[#0A0F1C] border-purple-500/20 hover:border-purple-500/40 transition-colors">
                <Shield className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Administrators</h3>
                <p className="text-sm text-slate-400">Govern the ecosystem with real-time analytics, rapid claim adjudication, and custom workflows.</p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 md:py-32 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-blue-600/10"></div>
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Ready to deploy <span className="text-blue-400">protection?</span>
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Join the network of municipalities, NGOs, and citizens leveraging modern infrastructure for inclusive insurance.
            </p>
            <Button
              onClick={() => router.push("/register")}
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-500 rounded-full h-16 px-10 text-xl font-semibold shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(37,99,235,0.6)]"
            >
              Create Free Account
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#050812] py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5">
              <Shield size={20} className="text-blue-500" />
              <span className="font-bold tracking-tight text-white">Apna Policy<span className="text-blue-500">.live</span></span>
            </div>
            <div className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Apna Policy Platform. A production-ready infrastructure project.
            </div>
            <div className="flex gap-4 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
