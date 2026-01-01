import { Card } from "@/components/ui/card";

export default function NgoDashboard() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">NGO Dashboard</h1>
        <p className="text-slate-600 text-sm">
          Overview of beneficiaries and claims support
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Card className="p-6">
          <p className="text-sm text-slate-500">Beneficiaries</p>
          <p className="text-3xl font-bold mt-2">1,248</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-slate-500">Active Policies</p>
          <p className="text-3xl font-bold mt-2">982</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-slate-500">Pending Claims</p>
          <p className="text-3xl font-bold mt-2">17</p>
        </Card>

      </div>
    </>
  );
}
