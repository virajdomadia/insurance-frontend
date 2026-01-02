import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { activePolicy } from "@/data/policy";
import RouteGuard from "@/components/auth/RouteGuard";

export default function PolicyWalletPage() {
  return (
    <RouteGuard allowedRole="citizen">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-white">Policy Wallet</h1>
        <p className="text-blue-100 text-xs md:text-sm">
          All active and past insurance policies
        </p>
      </div>

      <Card className="p-4 md:p-6 w-full max-w-xl bg-white shadow-lg border-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-slate-800">
              {activePolicy.name}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Coverage up to {activePolicy.coverage}
            </p>
          </div>

          <Badge className="bg-green-600">
            {activePolicy.status}
          </Badge>
        </div>

        <div className="mt-4 text-sm space-y-1 text-slate-600">
          <p><strong className="text-slate-800">Valid Till:</strong> {activePolicy.validTill}</p>
          <p><strong className="text-slate-800">Policy Type:</strong> Government Sponsored</p>
          <p><strong className="text-slate-800">Hospital Network:</strong> Empanelled Hospitals</p>
        </div>
      </Card>
    </RouteGuard>
  );
}
