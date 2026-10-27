import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  HardHat,
  BarChart3,
  ArrowRight,
  ShieldAlert,
  Search,
  CheckCircle,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { useAuth } from '../context/AuthContext';
import { DEPARTMENTS } from '../services/storage';

export const OfficerDashboard: React.FC = () => {
  const { complaints, stats } = useComplaints();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Officer metrics computed from actual store
  const unreviewedComplaints = complaints.filter(
    (c) => c.status === 'Submitted' || c.status === 'Under Review'
  );
  const urgentHighComplaints = complaints.filter(
    (c) => c.priority === 'Urgent' || c.priority === 'High'
  );
  const assignedComplaints = complaints.filter((c) => c.status === 'Assigned');
  const awaitingVerification = complaints.filter((c) => c.status === 'Awaiting Verification');

  // Compute Department Workload from actual complaints
  const deptWorkload = DEPARTMENTS.map((dept) => {
    const deptComplaints = complaints.filter((c) => c.department === dept);
    const active = deptComplaints.filter((c) => c.status !== 'Resolved' && c.status !== 'Rejected').length;
    const resolved = deptComplaints.filter((c) => c.status === 'Resolved').length;
    return { dept, active, resolved, total: deptComplaints.length };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Officer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <span className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">
            Municipal Operations Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Officer Dashboard • {currentUser.name}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Bureau of Smart City Infrastructure • Live Triage & Workforce Command
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/officer/management"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-300 text-sm font-semibold flex items-center gap-2 transition cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Complaint Queue</span>
          </Link>
          <Link
            to="/officer/assignment"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-extrabold flex items-center gap-2 transition shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            <HardHat className="w-4 h-4" />
            <span>Dispatch Crew</span>
          </Link>
        </div>
      </div>

      {/* Awaiting Officer Verification Banner */}
      {awaitingVerification.length > 0 && (
        <div className="bg-slate-900 border border-blue-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
              <CheckCircle className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {awaitingVerification.length} Task(s) Awaiting Final Officer Verification
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Field technicians have submitted photographic completion proof. Inspect and close tickets to trigger citizen feedback.
              </p>
            </div>
          </div>
          <Link
            to="/officer/management?status=Awaiting%20Verification"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer shrink-0"
          >
            Inspect Evidence ({awaitingVerification.length})
          </Link>
        </div>
      )}

      {/* Operational Metric Tiles (Derived from actual database!) */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{stats.total}</p>
          <p className="text-[11px] text-slate-400 font-semibold uppercase mt-1">Total Registered</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400">
            {unreviewedComplaints.length}
          </p>
          <p className="text-[11px] text-slate-400 font-semibold uppercase mt-1">Unreviewed</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-400">
            {urgentHighComplaints.length}
          </p>
          <p className="text-[11px] text-slate-400 font-semibold uppercase mt-1">High / Urgent</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">
            {assignedComplaints.length}
          </p>
          <p className="text-[11px] text-slate-400 font-semibold uppercase mt-1">Assigned</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400">{stats.inProgress}</p>
          <p className="text-[11px] text-slate-400 font-semibold uppercase mt-1">In Execution</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{stats.resolved}</p>
          <p className="text-[11px] text-slate-400 font-semibold uppercase mt-1">
            {stats.resolutionRate}% Resolved
          </p>
        </div>
      </div>

      {/* Main Grid: Urgent Action Queue + Department Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Urgent Action Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Priority Action Queue (Needs Officer Review & Dispatch)</span>
            </h2>
            <Link
              to="/officer/management"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Full Queue ({complaints.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {complaints
              .filter((c) => c.status !== 'Resolved' && c.status !== 'Rejected')
              .slice(0, 5)
              .map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate(`/complaint/${c.id}`)}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                      <img
                        src={c.photoUrl}
                        alt={c.category}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-cyan-400">{c.id}</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                          {c.status}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            c.priority === 'Urgent'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-orange-950 text-orange-300 border border-orange-800'
                          }`}
                        >
                          {c.priority}
                        </span>
                        <span className="text-[11px] text-indigo-300 font-semibold">
                          {c.department}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
                        {c.category}: {c.description}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {c.location.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <Link
                      to={`/officer/assignment?complaintId=${c.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
                    >
                      Dispatch Tech
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right Col: Department Workload Matrix */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <span>Department Load Distribution</span>
              </h3>
              <span className="text-[10px] text-slate-400">Live Queue</span>
            </div>

            <div className="space-y-3">
              {deptWorkload.slice(0, 5).map((d) => (
                <div key={d.dept} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300 truncate max-w-[170px]">
                      {d.dept}
                    </span>
                    <span className="text-slate-400">
                      <strong className="text-amber-400">{d.active}</strong> Active /{' '}
                      <strong className="text-emerald-400">{d.resolved}</strong> Done
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${d.total > 0 ? (d.active / d.total) * 100 : 0}%` }}
                    />
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${d.total > 0 ? (d.resolved / d.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <Link to="/analytics" className="text-indigo-400 hover:underline font-semibold">
                View Full SLA Analytics →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
