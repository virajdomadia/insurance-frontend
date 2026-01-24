'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Shield,
  Users,
  Heart,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Building2,
  UserCircle,
  Award
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
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

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              NGO Insurance Platform
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Empowering communities through accessible insurance. Connecting citizens, NGOs, and government schemes for comprehensive coverage.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => router.push("/login")}
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                onClick={() => router.push("/login")}
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg"
              >
                Login
              </Button>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(248 250 252)" />
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <stat.icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
              <p className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">{stat.value}</p>
              <p className="text-xs md:text-sm text-slate-600">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A comprehensive solution designed to make insurance accessible to everyone
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* User Types Section */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Built for Everyone
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Tailored experiences for citizens, NGOs, and administrators
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {userTypes.map((type, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
                <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${type.color} flex items-center justify-center mb-4`}>
                  <type.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{type.title}</h3>
                <p className="text-slate-600 mb-4">{type.description}</p>
                <Button
                  onClick={() => router.push("/login")}
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  Learn More
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Join thousands of citizens and NGOs already using our platform
          </p>
          <Button
            onClick={() => router.push("/login")}
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Access Platform
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400 text-sm">
            © 2026 NGO Insurance Platform. Demo environment with MongoDB backend.
          </p>
        </div>
      </div>
    </div>
  );
}
