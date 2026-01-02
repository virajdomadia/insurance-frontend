import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Route } from "lucide-react";
import RouteGuard from "@/components/auth/RouteGuard";

const ngoClaims = [
  {
    id: "CLM-778",
    beneficiary: "Sita Devi",
    status: "Documents Submitted",
  },
];

export default function NgoClaimsPage() {
  return (
    <RouteGuard allowedRole="ngo">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-white">Claims Support</h1>
      </div>

      <div className="space-y-4 w-full max-w-2xl">
        {ngoClaims.map((c) => (
          <Card key={c.id} className="p-4 flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0 bg-white shadow-lg border-0">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm md:text-base text-slate-800">{c.beneficiary}</p>
              <p className="text-xs md:text-sm text-slate-600">
                Claim ID: {c.id}
              </p>
            </div>

            <Badge variant="outline" className="border-blue-200 text-blue-700 text-xs shrink-0">
              {c.status}
            </Badge>
          </Card>
        ))}
      </div>
    </RouteGuard>
  );
}
