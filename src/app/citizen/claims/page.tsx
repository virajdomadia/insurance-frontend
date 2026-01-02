"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { claims } from "@/data/claims";
import RouteGuard from "@/components/auth/RouteGuard";

export default function ClaimsPage() {
  return (
    <RouteGuard allowedRole="citizen">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-white">Claims</h1>
        <p className="text-blue-100 text-xs md:text-sm">
          Track submitted insurance claims
        </p>
      </div>

      <div className="space-y-4 w-full max-w-2xl">
        {claims.map((claim) => (
          <Card key={claim.id} className="p-4 md:p-5 bg-white shadow-lg border-0">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-800 text-sm md:text-base truncate">
                  {claim.hospital}
                </h3>
                <p className="text-xs md:text-sm text-slate-600">
                  Claim ID: {claim.id}
                </p>
              </div>

              <Badge variant="outline" className="border-blue-200 text-blue-700 text-xs shrink-0">
                {claim.status}
              </Badge>
            </div>

            <div className="mt-2 md:mt-3 text-xs text-slate-500">
              Last updated on {claim.updated}
            </div>
          </Card>
        ))}
      </div>
    </RouteGuard>
  );
}
