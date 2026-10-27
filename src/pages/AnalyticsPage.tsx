import React from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
  Star,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { DEPARTMENTS } from '../services/storage';

export const AnalyticsPage: React.FC = () => {
  const { complaints, stats } = useComplaints();

  // 1. Complaints by Category
  const categoryCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryCounts).map(([cat, count]) => ({
    cat,
    count,
  }));
  const maxCategoryCount = Math.max(...categoryData.map((d) => d.count), 1);

  // 2. Priority Distribution
  const priorityCounts = {
    Urgent: complaints.filter((c) => c.priority === 'Urgent').length,
    High: complaints.filter((c) => c.priority === 'High').length,
    Medium: complaints.filter((c) => c.priority === 'Medium').length,
    Low: complaints.filter((c) => c.priority === 'Low').length,
  };

  // 3. Status Breakdown
  const statusCounts = {
    Submitted: complaints.filter((c) => c.status === 'Submitted').length,
    'In Review': complaints.filter((c) => c.status === 'Under Review' || c.status === 'Verified').length,
    'In Progress': complaints.filter(
      (c) =>
        c.status === 'Assigned' ||
        c.status === 'In Progress' ||
        c.status === 'Awaiting Verification'
    ).length,
    Resolved: complaints.filter((c) => c.status === 'Resolved').length,
    Rejected: complaints.filter((c) => c.status === 'Rejected').length,
  };

  // 4. Department Workload Efficiency
  const deptStats = DEPARTMENTS.map((dept) => {
    const list = complaints.filter((c) => c.department === dept);
    const resolved = list.filter((c) => c.status === 'Resolved').length;
    const rate = list.length > 0 ? Math.round((resolved / list.length) * 100) : 0;
    return { dept, total: list.length, resolved, rate };
  }).filter((d) => d.total > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          <BarChart3 className="w-4 h-4" /> Real-Time Municipal Analytics
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Civic Intelligence & Performance Metrics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Dynamically computed from {complaints.length} active and resolved municipal complaint records.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Resolution Rate</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">{stats.resolutionRate}%</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {stats.resolved} of {stats.total} complaints closed
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Avg Resolution Time</span>
            <Clock className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-cyan-400">{stats.avgResolutionHours} hrs</p>
          <p className="text-[11px] text-slate-400 mt-1">From submission to verified signoff</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Citizen Satisfaction</span>
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400">
            {stats.satisfactionRating > 0 ? `${stats.satisfactionRating} / 5` : 'No ratings'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {stats.satisfactionCount} verified feedback submissions
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">High Priority / SLA</span>
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold text-rose-400">{stats.urgentHigh}</p>
          <p className="text-[11px] text-slate-400 mt-1">Urgent road, pipe, and power hazards</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Complaints by Category (SVG Horizontal Bar Chart) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <span>Complaints by Issue Category</span>
            </h2>
            <span className="text-xs text-slate-400">Total: {complaints.length}</span>
          </div>

          <div className="space-y-3 pt-2">
            {categoryData.map((d) => {
              const pct = Math.round((d.count / maxCategoryCount) * 100);
              return (
                <div key={d.cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{d.cat}</span>
                    <span className="text-cyan-400">
                      {d.count} report{d.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Status Lifecycle Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-400" />
              <span>Status Lifecycle Distribution</span>
            </h2>
            <span className="text-xs text-slate-400">Live Stages</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {Object.entries(statusCounts).map(([status, count]) => {
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={status} className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium block truncate">
                    {status}
                  </span>
                  <p className="text-2xl font-extrabold text-white mt-1">{count}</p>
                  <p className="text-[10px] text-cyan-400 mt-0.5">{pct}% of total</p>
                </div>
              );
            })}
          </div>

          {/* Priority Matrix */}
          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Severity / Priority Matrix
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-rose-950/60 border border-rose-800/60 p-2.5 rounded-xl">
                <span className="text-[10px] text-rose-300 font-bold uppercase block">Urgent</span>
                <span className="text-lg font-bold text-white mt-0.5 block">
                  {priorityCounts.Urgent}
                </span>
              </div>
              <div className="bg-orange-950/60 border border-orange-800/60 p-2.5 rounded-xl">
                <span className="text-[10px] text-orange-300 font-bold uppercase block">High</span>
                <span className="text-lg font-bold text-white mt-0.5 block">
                  {priorityCounts.High}
                </span>
              </div>
              <div className="bg-yellow-950/60 border border-yellow-800/60 p-2.5 rounded-xl">
                <span className="text-[10px] text-yellow-300 font-bold uppercase block">Medium</span>
                <span className="text-lg font-bold text-white mt-0.5 block">
                  {priorityCounts.Medium}
                </span>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Low</span>
                <span className="text-lg font-bold text-white mt-0.5 block">
                  {priorityCounts.Low}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Department Efficiency Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-400" />
          <span>Department Performance & Resolution Rate</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Municipal Department</th>
                <th className="py-3 px-4 text-center">Total Assigned</th>
                <th className="py-3 px-4 text-center">Completed</th>
                <th className="py-3 px-4 text-center">Pending</th>
                <th className="py-3 px-4 text-right">Completion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {deptStats.map((d) => (
                <tr key={d.dept} className="hover:bg-slate-850/60 transition">
                  <td className="py-3 px-4 font-bold text-white">{d.dept}</td>
                  <td className="py-3 px-4 text-center font-semibold">{d.total}</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-semibold">
                    {d.resolved}
                  </td>
                  <td className="py-3 px-4 text-center text-amber-400 font-semibold">
                    {d.total - d.resolved}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`px-2.5 py-0.5 rounded-md font-bold ${
                        d.rate >= 50
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {d.rate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
