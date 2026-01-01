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
      <h1 className="text-2xl font-semibold mb-4">Claims Support</h1>

      <div className="space-y-4 max-w-2xl">
        {ngoClaims.map((c) => (
          <Card key={c.id} className="p-4 flex justify-between">
            <div>
              <p className="font-medium">{c.beneficiary}</p>
              <p className="text-sm text-slate-500">
                Claim ID: {c.id}
              </p>
            </div>

            <Badge variant="outline">
              {c.status}
            </Badge>
          </Card>
        ))}
      </div>
    </RouteGuard>
  );
}
