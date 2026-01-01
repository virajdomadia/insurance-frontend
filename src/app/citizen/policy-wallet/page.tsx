import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { activePolicy } from "@/data/policy";
import RouteGuard from "@/components/auth/RouteGuard";

export default function PolicyWalletPage() {
  return (
    <RouteGuard allowedRole="citizen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Policy Wallet</h1>
        <p className="text-slate-600 text-sm">
          All active and past insurance policies
        </p>
      </div>

      <Card className="p-6 max-w-xl">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">
              {activePolicy.name}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Coverage up to {activePolicy.coverage}
            </p>
          </div>

          <Badge className="bg-green-600">
            {activePolicy.status}
          </Badge>
        </div>

        <div className="mt-4 text-sm space-y-1">
          <p><strong>Valid Till:</strong> {activePolicy.validTill}</p>
          <p><strong>Policy Type:</strong> Government Sponsored</p>
          <p><strong>Hospital Network:</strong> Empanelled Hospitals</p>
        </div>
      </Card>
    </RouteGuard>
  );
}
