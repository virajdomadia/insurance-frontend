"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { claims } from "@/data/claims";
import RouteGuard from "@/components/auth/RouteGuard";

export default function ClaimsPage() {
  return (
    <RouteGuard allowedRole="citizen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Claims</h1>
        <p className="text-slate-600 text-sm">
          Track submitted insurance claims
        </p>
      </div>

      <div className="space-y-4 max-w-2xl">
        {claims.map((claim) => (
          <Card key={claim.id} className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">
                  {claim.hospital}
                </h3>
                <p className="text-sm text-slate-500">
                  Claim ID: {claim.id}
                </p>
              </div>

              <Badge variant="outline">
                {claim.status}
              </Badge>
            </div>

            <div className="mt-3 text-xs text-slate-500">
              Last updated on {claim.updated}
            </div>
          </Card>
        ))}
      </div>
    </RouteGuard>
  );
}
