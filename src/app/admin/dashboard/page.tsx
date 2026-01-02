"use client";

import { Card } from "@/components/ui/card";
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

import {
  impactMetrics,
  coverageByDistrict,
  claimsTrend,
} from "@/data/admin";
import { Route } from "lucide-react";
import RouteGuard from "@/components/auth/RouteGuard";

export default function AdminDashboard() {
  return (
    <RouteGuard allowedRole="admin">
      {/* HEADER */}
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-white">
          CSR / Admin Dashboard
        </h1>
        <p className="text-blue-100 text-xs md:text-sm">
          Impact monitoring & utilization overview
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card className="p-4 md:p-6 bg-white shadow-lg border-0">
          <p className="text-xs md:text-sm text-slate-500">Families Covered</p>
          <p className="text-2xl md:text-3xl font-bold mt-2 text-blue-600">
            {impactMetrics.familiesCovered.toLocaleString()}
          </p>
        </Card>

        <Card className="p-4 md:p-6 bg-white shadow-lg border-0">
          <p className="text-xs md:text-sm text-slate-500">NGOs Onboarded</p>
          <p className="text-2xl md:text-3xl font-bold mt-2 text-blue-600">
            {impactMetrics.ngosOnboarded}
          </p>
        </Card>

        <Card className="p-4 md:p-6 bg-white shadow-lg border-0">
          <p className="text-xs md:text-sm text-slate-500">Claims Processed</p>
          <p className="text-2xl md:text-3xl font-bold mt-2 text-blue-600">
            {impactMetrics.claimsProcessed.toLocaleString()}
          </p>
        </Card>

        <Card className="p-4 md:p-6 bg-white shadow-lg border-0 sm:col-span-2 lg:col-span-1">
          <p className="text-xs md:text-sm text-slate-500">Avg Claim Time</p>
          <p className="text-2xl md:text-3xl font-bold mt-2 text-blue-600">
            {impactMetrics.avgClaimTime}
          </p>
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
