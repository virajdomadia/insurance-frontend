'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Heart,
  TrendingUp,
  ArrowRight,
  Building2,
  UserCircle,
  Award
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Comprehensive Coverage",
      description: "Access to government schemes and private insurance policies for all citizens"
    },
    {
      icon: Users,
      title: "NGO Partnership",
      description: "Collaborate with NGOs to reach underserved communities and BPL families"
    },
    {
      icon: Heart,
      title: "Easy Claims",
      description: "Simplified claim process with quick approvals and transparent tracking"
    },
    {
      icon: TrendingUp,
      title: "Real-time Analytics",
      description: "Track beneficiaries, policies, and claims with comprehensive dashboards"
    }
  ];

  const stats = [
    { label: "Active Policies", value: "10K+", icon: Shield },
    { label: "NGO Partners", value: "50+", icon: Building2 },
    { label: "Beneficiaries", value: "25K+", icon: UserCircle },
    { label: "Claims Processed", value: "₹5Cr+", icon: Award }
  ];

  const userTypes = [
    {
      title: "Citizens",
      description: "Check eligibility, apply for policies, and manage claims",
      icon: UserCircle,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "NGOs",
      description: "Register beneficiaries and help them access insurance",
      icon: Building2,
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Administrators",
      description: "Manage users, approve claims, and monitor the system",
      icon: Shield,
      color: "from-purple-500 to-purple-600"
    }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              NGO Insurance Platform
            </h1>
            <p className="text-lg md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Empowering communities through accessible insurance. Connecting citizens, NGOs, and government schemes for comprehensive coverage.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Button
                onClick={() => router.push("/login")}
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all duration-200 font-bold px-8 py-7 text-lg shadow-xl"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                onClick={() => router.push("/login")}
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-7 text-lg font-bold"
              >
                Login
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f8fafc" />
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg bg-white/95 backdrop-blur-sm">
              <stat.icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
              <p className="text-2xl md:text-4xl font-extrabold text-blue-600 mb-1">{stat.value}</p>
              <p className="text-xs md:text-sm text-slate-500 uppercase tracking-wide font-semibold">{stat.label}</p>
            </Card>
          ))}
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-slate-900 mb-6"
          >
            Why Choose Our Platform?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto"
          >
            A comprehensive solution designed to make insurance accessible to everyone
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-8 h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-md bg-white">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* User Types Section */}
      <div className="bg-slate-100 py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold text-slate-900 mb-6"
            >
              Built for Everyone
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-600 max-w-2xl mx-auto"
            >
              Tailored experiences for citizens, NGOs, and administrators
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {userTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -10 }}
              >
                <Card className="p-8 h-full flex flex-col items-center text-center border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className={`h-20 w-20 rounded-full bg-gradient-to-br ${type.color} flex items-center justify-center mb-6 shadow-xl`}>
                    <type.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{type.title}</h3>
                  <p className="text-slate-600 mb-8 flex-grow leading-relaxed">{type.description}</p>
                  <Button
                    onClick={() => router.push("/login")}
                    variant="outline"
                    className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-6"
                  >
                    Learn More
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-50 mb-10 max-w-2xl mx-auto">
              Join thousands of citizens and NGOs already using our platform to make a difference.
            </p>
            <Button
              onClick={() => router.push("/login")}
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-10 py-8 text-xl shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-200"
            >
              Access Platform
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400 text-sm">
            © 2026 NGO Insurance Platform. Demo environment with MongoDB backend.
          </p>
        </div>
      </div>
    </div>
  );
}
