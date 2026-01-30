"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RouteGuard from "@/components/auth/RouteGuard";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/ui/use-toast";

interface AdminStats {
  users: {
    total: number;
    citizens: number;
    ngos: number;
  };
  beneficiaries: number;
  claims: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    totalAmount: number;
  };
  policies: number;
  coverage: { district: string; families: number }[];
  trends: { month: string; claims: number }[];
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminStats();
      setStats(data);
    } catch (error: any) {
      toast({
        title: "Error loading stats",
        description: "Failed to fetch dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKpiClick = async (kpi: string) => {
    setSelectedKpi(kpi);
    setModalOpen(true);
    setModalLoading(true);
    setModalData([]);

    try {
      let data = [];
      switch (kpi) {
        case 'USERS':
          data = await api.getUsers();
          break;
        case 'BENEFICIARIES':
          data = await api.getBeneficiaries();
          break;
        case 'CLAIMS':
        case 'DISBURSED': // Show claims for disbursed amount too
          data = await api.getClaims();
          break;
      }
      setModalData(data);
    } catch (error) {
      console.error("Error fetching details:", error);
      toast({
        title: "Error fetching details",
        description: "Could not load specific data for this metric.",
        variant: "destructive",
      });
    } finally {
      setModalLoading(false);
    }
  };

  const renderModalContent = () => {
    if (modalLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!modalData || modalData.length === 0) {
      return <div className="text-center py-8 text-slate-500">No records found.</div>;
    }

    return (
      <div className="max-h-[60vh] overflow-y-auto rounded-md border text-black">
        <Table>
          <TableHeader className="bg-slate-50 sticky top-0">
            <TableRow>
              {selectedKpi === 'USERS' && (
                <>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </>
              )}
              {selectedKpi === 'BENEFICIARIES' && (
                <>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Income</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>BPL Status</TableHead>
                </>
              )}
              {(selectedKpi === 'CLAIMS' || selectedKpi === 'DISBURSED') && (
                <>
                  <TableHead>Policy Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {modalData.map((item: any, index: number) => (
              <TableRow key={index} className="hover:bg-slate-50">
                {selectedKpi === 'USERS' && (
                  <>
                    <TableCell className="font-medium text-slate-900">{item.name || 'N/A'}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        item.role === 'NGO' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                        {item.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex h-2 w-2 rounded-full ${item.isActive ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </TableCell>
                  </>
                )}
                {selectedKpi === 'BENEFICIARIES' && (
                  <>
                    <TableCell className="font-medium text-slate-900">{item.name}</TableCell>
                    <TableCell>{item.age}</TableCell>
                    <TableCell>₹{item.income?.toLocaleString()}</TableCell>
                    <TableCell>{item.district || 'Unknown'}</TableCell>
                    <TableCell>
                      {item.bplStatus ? (
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-md">Yes</span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">No</span>
                      )}
                    </TableCell>
                  </>
                )}
                {(selectedKpi === 'CLAIMS' || selectedKpi === 'DISBURSED') && (
                  <>
                    <TableCell className="font-medium text-slate-900">{item.policyType}</TableCell>
                    <TableCell>₹{item.amount?.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        item.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <RouteGuard allowedRole="admin">
      {/* HEADER */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Impact monitoring & utilization overview
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Total Users */}
        <Card
          onClick={() => handleKpiClick('USERS')}
          className="p-6 bg-white shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide group-hover:text-blue-600 transition-colors">Total Users</p>
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-20 mt-2" />
          ) : (
            <p className="text-3xl font-bold mt-2 text-slate-900">
              {stats?.users.total || 0}
            </p>
          )}
          {!loading && stats && (
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">{stats.users.citizens} Citizens</span>
              <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full">{stats.users.ngos} NGOs</span>
            </div>
          )}
        </Card>

        {/* Beneficiaries */}
        <Card
          onClick={() => handleKpiClick('BENEFICIARIES')}
          className="p-6 bg-white shadow-sm border border-slate-200 hover:shadow-lg hover:border-green-200 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide group-hover:text-green-600 transition-colors">Beneficiaries</p>
            <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-20 mt-2" />
          ) : (
            <p className="text-3xl font-bold mt-2 text-slate-900">
              {stats?.beneficiaries.toLocaleString() || 0}
            </p>
          )}
        </Card>

        {/* Total Claims */}
        <Card
          onClick={() => handleKpiClick('CLAIMS')}
          className="p-6 bg-white shadow-sm border border-slate-200 hover:shadow-lg hover:border-amber-200 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide group-hover:text-amber-600 transition-colors">Total Claims</p>
            <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-20 mt-2" />
          ) : (
            <p className="text-3xl font-bold mt-2 text-slate-900">
              {stats?.claims.total.toLocaleString() || 0}
            </p>
          )}
          {!loading && stats && (
            <div className="flex items-center gap-2 mt-2 text-xs font-medium">
              <span className="text-amber-600">{stats.claims.pending} Pending</span>
              <span className="text-slate-300">•</span>
              <span className="text-green-600">{stats.claims.approved} Approved</span>
            </div>
          )}
        </Card>

        {/* Claim Amount */}
        <Card
          onClick={() => handleKpiClick('DISBURSED')}
          className="p-6 bg-white shadow-sm border border-slate-200 hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide group-hover:text-indigo-600 transition-colors">Disbursed Amount</p>
            <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-20 mt-2" />
          ) : (
            <p className="text-3xl font-bold mt-2 text-blue-600">
              ₹{((stats?.claims.totalAmount || 0) / 100000).toFixed(1)}L
            </p>
          )}
        </Card>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* DISTRICT COVERAGE */}
        <Card className="p-4 md:p-6 bg-white shadow-lg border-0">
          <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base text-slate-800">
            Coverage by District
          </h3>

          <div className="h-[200px] md:h-[250px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              {loading || !stats ? (
                <div className="flex h-full items-center justify-center">
                  <Skeleton className="h-[200px] w-full" />
                </div>
              ) : stats.coverage && stats.coverage.length > 0 ? (
                <BarChart data={stats.coverage}>
                  <XAxis dataKey="district" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="families" fill="#2563eb" />
                </BarChart>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  No data available
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </Card>

        {/* CLAIMS TREND */}
        <Card className="p-4 md:p-6 bg-white shadow-lg border-0">
          <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base text-slate-800">
            Claims Trend (Monthly)
          </h3>

          <div className="h-[200px] md:h-[250px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              {loading || !stats ? (
                <div className="flex h-full items-center justify-center">
                  <Skeleton className="h-[200px] w-full" />
                </div>
              ) : stats.trends && stats.trends.length > 0 ? (
                <LineChart data={stats.trends}>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="claims" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  No data available
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* DETAILS MODAL */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold capitalize">
              {selectedKpi?.toLowerCase().replace('_', ' ')} Details
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {renderModalContent()}
          </div>
        </DialogContent>
      </Dialog>
    </RouteGuard>
  );
}
