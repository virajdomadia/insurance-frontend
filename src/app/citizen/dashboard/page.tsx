"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { citizenProfile } from "@/data/citizen";
import { activePolicy } from "@/data/policy";
import { claims } from "@/data/claims";
import { fakeApi } from "@/lib/fakeApi";
import RouteGuard from "@/components/auth/RouteGuard";

export default function CitizenDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fakeApi(true, 900).then(() => setLoading(false));
  }, []);

  return (
    <RouteGuard allowedRole="citizen">
      {loading ? (
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-64 bg-white/20 mb-2" />
            <Skeleton className="h-4 w-48 bg-white/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-white shadow-lg border-0">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-6 w-20" />
            </Card>
            <Card className="p-6 bg-white shadow-lg border-0">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-6 w-20" />
            </Card>
            <Card className="p-6 md:col-span-2 bg-white shadow-lg border-0">
              <Skeleton className="h-6 w-24 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </Card>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-white">
              Welcome, {citizenProfile.name}
            </h1>
            <p className="text-blue-100 text-xs md:text-sm">
              {citizenProfile.district}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card className="p-4 md:p-6 bg-white shadow-lg border-0">
              <h3 className="font-semibold text-base md:text-lg text-slate-800">Active Policy</h3>
              <p className="mt-3 md:mt-4 text-xs md:text-sm text-slate-600">{activePolicy.name}</p>
              <Badge className="mt-3 md:mt-4 bg-green-600 text-xs">
                {activePolicy.status}
              </Badge>
            </Card>

            <Card className="p-4 md:p-6 bg-white shadow-lg border-0">
              <h3 className="font-semibold text-base md:text-lg text-slate-800">Eligibility Status</h3>
              <p className="mt-3 md:mt-4 text-xs md:text-sm text-slate-600">
                Income: ₹{citizenProfile.income}
              </p>
              <Badge className="mt-3 md:mt-4 bg-blue-600 text-xs">
                Eligible
              </Badge>
            </Card>

            <Card className="p-4 md:p-6 md:col-span-2 bg-white shadow-lg border-0">
              <h3 className="font-semibold text-base md:text-lg text-slate-800">Claims</h3>

              {claims.map((c) => (
                <div key={c.id} className="mt-2 md:mt-3 text-xs md:text-sm text-slate-600">
                  {c.hospital} — {c.status}
                </div>
              ))}
            </Card>
          </div>
        </>
      )}
    </RouteGuard>
  );
}
