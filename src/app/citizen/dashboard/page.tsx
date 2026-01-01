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
          <Skeleton className="h-8 w-64" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-32 md:col-span-2" />
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">
              Welcome, {citizenProfile.name}
            </h1>
            <p className="text-slate-600 text-sm">
              {citizenProfile.district}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg">Active Policy</h3>
              <p className="mt-4 text-sm">{activePolicy.name}</p>
              <Badge className="mt-4 bg-green-600">
                {activePolicy.status}
              </Badge>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg">Eligibility Status</h3>
              <p className="mt-4 text-sm">
                Income: ₹{citizenProfile.income}
              </p>
              <Badge className="mt-4 bg-indigo-600">
                Eligible
              </Badge>
            </Card>

            <Card className="p-6 md:col-span-2">
              <h3 className="font-semibold text-lg">Claims</h3>

              {claims.map((c) => (
                <div key={c.id} className="mt-3 text-sm">
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
