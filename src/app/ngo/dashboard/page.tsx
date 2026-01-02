import { Card } from "@/components/ui/card";

export default function NgoDashboard() {
  return (
    <>
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-white">NGO Dashboard</h1>
        <p className="text-blue-100 text-xs md:text-sm">
          Overview of beneficiaries and claims support
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">

        <Card className="p-4 md:p-6 bg-white shadow-lg border-0">
          <p className="text-xs md:text-sm text-slate-500">Beneficiaries</p>
          <p className="text-2xl md:text-3xl font-bold mt-2 text-blue-600">1,248</p>
        </Card>

        <Card className="p-4 md:p-6 bg-white shadow-lg border-0">
          <p className="text-xs md:text-sm text-slate-500">Active Policies</p>
          <p className="text-2xl md:text-3xl font-bold mt-2 text-blue-600">982</p>
        </Card>

        <Card className="p-4 md:p-6 bg-white shadow-lg border-0 sm:col-span-2 md:col-span-1">
          <p className="text-xs md:text-sm text-slate-500">Pending Claims</p>
          <p className="text-2xl md:text-3xl font-bold mt-2 text-blue-600">17</p>
        </Card>

      </div>
    </>
  );
}
