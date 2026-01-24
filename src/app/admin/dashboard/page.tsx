"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import RouteGuard from "@/components/auth/RouteGuard";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/ui/use-toast";

interface AdminStats {
  users: {
    total: number;
    citizens: number;
    ngos: number;
  };
  beneficiaries: number;
  claims: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    totalAmount: number;
  };
  policies: number;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminStats();
      setStats(data);
    } catch (error: any) {
      toast({
        title: "Error loading stats",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts (can be enhanced with real data later)
  const coverageByDistrict = [
    { district: "Mumbai", families: 1200 },
    { district: "Delhi", families: 980 },
    { district: "Bangalore", families: 850 },
    { district: "Chennai", families: 720 },
  ];

  const claimsTrend = [
    { month: "Jan", claims: 45 },
    { month: "Feb", claims: 52 },
    { month: "Mar", claims: 61 },
    { month: "Apr", claims: 58 },
    { month: "May", claims: 70 },
    { month: "Jun", claims: 65 },
  ];

  return (
    <RouteGuard allowedRole="admin">
      {/* HEADER */}
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-white">
          Admin Dashboard
        </h1>
        <p className="text-blue-100 text-xs md:text-sm">
          Impact monitoring & utilization overview
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Total Users */}
        <Card className="p-4 md:p-6 bg-white shadow-lg border-0">
          <p className="text-xs md:text-sm text-slate-500">Total Users</p>
          {loading ? (
            <Skeleton className="h-8 w-20 mt-2" />
          ) : (
            <p className="text-2xl md:text-3xl font-bold mt-2 text-blue-600">
              {stats?.users.total || 0}
            </p>
          )}
          {!loading && stats && (
            <p className="text-xs text-slate-400 mt-1">
              {stats.users.citizens} Citizens, {stats.users.ngos} NGOs
            </p>
          )}
        </Card>

        {/* Beneficiaries */}
        <Card className="p-4 md:p-6 bg-white shadow-lg border-0">
          <p className="text-xs md:text-sm text-slate-500">Beneficiaries</p>
          {loading ? (
            <Skeleton className="h-8 w-20 mt-2" />
          ) : (
            <p className="text-2xl md:text-3xl font-bold mt-2 text-blue-600">
              {stats?.beneficiaries.toLocaleString() || 0}
            </p>
          )}
        </Card>

        {/* Total Claims */}
        <Card className="p-4 md:p-6 bg-white shadow-lg border-0">
          <p className="text-xs md:text-sm text-slate-500">Total Claims</p>
          {loading ? (
            <Skeleton className="h-8 w-20 mt-2" />
          ) : (
            <p className="text-2xl md:text-3xl font-bold mt-2 text-blue-600">
              {stats?.claims.total.toLocaleString() || 0}
            </p>
          )}
          {!loading && stats && (
            <p className="text-xs text-slate-400 mt-1">
              {stats.claims.pending} Pending, {stats.claims.approved} Approved
            </p>
          )}
        </Card>

        {/* Claim Amount */}
        <Card className="p-4 md:p-6 bg-white shadow-lg border-0">
          <p className="text-xs md:text-sm text-slate-500">Total Claim Amount</p>
          {loading ? (
            <Skeleton className="h-8 w-20 mt-2" />
          ) : (
            <p className="text-2xl md:text-3xl font-bold mt-2 text-blue-600">
              ₹{((stats?.claims.totalAmount || 0) / 100000).toFixed(1)}L
            </p>
          )}
        </Card>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* DISTRICT COVERAGE */}
        <Card className="p-4 md:p-6 bg-white shadow-lg border-0">
          <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base text-slate-800">
            Coverage by District
          </h3>

          <div className="h-[200px] md:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coverageByDistrict}>
                <XAxis dataKey="district" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="families" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* CLAIMS TREND */}
        <Card className="p-4 md:p-6 bg-white shadow-lg border-0">
          <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base text-slate-800">
            Claims Trend (Monthly)
          </h3>

          <div className="h-[200px] md:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={claimsTrend}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="claims" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </RouteGuard>
  );
}
