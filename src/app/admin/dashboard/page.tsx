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
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          CSR / Admin Dashboard
        </h1>
        <p className="text-slate-600 text-sm">
          Impact monitoring & utilization overview
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <p className="text-sm text-slate-500">Families Covered</p>
          <p className="text-3xl font-bold mt-2">
            {impactMetrics.familiesCovered.toLocaleString()}
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-slate-500">NGOs Onboarded</p>
          <p className="text-3xl font-bold mt-2">
            {impactMetrics.ngosOnboarded}
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-slate-500">Claims Processed</p>
          <p className="text-3xl font-bold mt-2">
            {impactMetrics.claimsProcessed.toLocaleString()}
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-slate-500">Avg Claim Time</p>
          <p className="text-3xl font-bold mt-2">
            {impactMetrics.avgClaimTime}
          </p>
        </Card>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* DISTRICT COVERAGE */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">
            Coverage by District
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={coverageByDistrict}>
              <XAxis dataKey="district" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="families" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* CLAIMS TREND */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">
            Claims Trend (Monthly)
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={claimsTrend}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="claims" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

      </div>
    </RouteGuard>
  );
}
