import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  ArrowRight,
  Star,
  MapPin,
  Calendar,
  Sparkles,
  Bot,
  ChevronRight,
  ShieldAlert,
  Search,
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { useAuth } from '../context/AuthContext';

export const CitizenDashboard: React.FC<{ onOpenChat?: () => void }> = ({ onOpenChat }) => {
  const { complaints, stats, notifications } = useComplaints();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [trackSearchId, setTrackSearchId] = React.useState('');

  // Filter complaints for current citizen or show all if demo
  const citizenComplaints = complaints.filter(
    (c) => c.citizenId === currentUser.id || currentUser.role === 'citizen'
  );

  // Resolved complaints awaiting citizen feedback
  const feedbackAwaiting = citizenComplaints.filter(
    (c) => c.status === 'Resolved' && !c.feedback
  );

  // Recent complaints
  const recentComplaints = citizenComplaints.slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-900/60 text-blue-300 border-blue-700/60';
      case 'Under Review':
      case 'Verified':
        return 'bg-indigo-900/60 text-indigo-300 border-indigo-700/60';
      case 'Assigned':
      case 'In Progress':
        return 'bg-amber-900/60 text-amber-300 border-amber-700/60';
      case 'Awaiting Verification':
        return 'bg-purple-900/60 text-purple-300 border-purple-700/60';
      case 'Resolved':
        return 'bg-emerald-900/60 text-emerald-300 border-emerald-700/60';
      case 'Rejected':
        return 'bg-rose-900/60 text-rose-300 border-rose-700/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-950 text-rose-300 border-rose-800/80 font-bold';
      case 'High':
        return 'bg-orange-950 text-orange-300 border-orange-800/80 font-semibold';
      case 'Medium':
        return 'bg-yellow-950 text-yellow-300 border-yellow-800/80';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackSearchId.trim()) {
      navigate(`/complaint/${trackSearchId.trim()}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">
            Citizen Action Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Ward 112 • Active Civic Portal • Track your submitted reports in real-time
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onOpenChat && (
            <button
              onClick={onOpenChat}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-sm font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>CivicAI Assistant</span>
            </button>
          )}
          <Link
            to="/citizen/report"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-extrabold flex items-center gap-2 transition shadow-lg shadow-cyan-500/25 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report New Issue</span>
          </Link>
        </div>
      </div>

      {/* Resolution Feedback Banner if resolved complaints await rating */}
      {feedbackAwaiting.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Star className="w-5 h-5 fill-emerald-400 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Feedback Requested: Complaint #{feedbackAwaiting[0].id}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                The field team has resolved your reported {feedbackAwaiting[0].category}. Please verify and rate the repair!
              </p>
            </div>
          </div>
          <Link
            to={`/complaint/${feedbackAwaiting[0].id}`}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer shrink-0"
          >
            Rate & Review (1-5★)
          </Link>
        </div>
      )}

      {/* Live Calculated Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Total Filed</span>
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{citizenComplaints.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Calculated from local store</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Submitted</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-400">
            {citizenComplaints.filter((c) => c.status === 'Submitted').length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting officer triage</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">In Progress</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">
            {
              citizenComplaints.filter(
                (c) =>
                  c.status === 'Assigned' ||
                  c.status === 'In Progress' ||
                  c.status === 'Awaiting Verification'
              ).length
            }
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Field crew on-site</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
            {citizenComplaints.filter((c) => c.status === 'Resolved').length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Verified closed</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">High Priority</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-400">
            {
              citizenComplaints.filter((c) => c.priority === 'High' || c.priority === 'Urgent')
                .length
            }
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Critical public impact</p>
        </div>
      </div>

      {/* Main Content Grid: Recent Complaints + Quick Track & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Complaints */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>Recent Civic Complaints</span>
            </h2>
            <Link
              to="/citizen/complaints"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>View All ({citizenComplaints.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {recentComplaints.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
              <ShieldAlert className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No complaints filed yet</p>
              <p className="text-xs text-slate-500">
                Notice a pothole, broken streetlight, or garbage pile? Report it now!
              </p>
              <Link
                to="/citizen/report"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                <PlusCircle className="w-4 h-4" /> Report an Issue
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentComplaints.map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate(`/complaint/${c.id}`)}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl p-4.5 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4">
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
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getStatusBadge(
                            c.status
                          )}`}
                        >
                          {c.status}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] border ${getPriorityBadge(
                            c.priority
                          )}`}
                        >
                          {c.priority} Priority
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition line-clamp-1">
                        {c.category}: {c.description}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1 truncate max-w-[200px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" /> {c.location.address}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />{' '}
                          {new Date(c.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <span className="text-xs font-semibold text-slate-400 sm:hidden">Track Status</span>
                    <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-cyan-500 group-hover:text-slate-950 text-slate-400 flex items-center justify-center transition">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Quick ID Lookup & Notifications */}
        <div className="space-y-6">
          {/* Quick Track Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" /> Quick Complaint Tracker
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Enter any official CivicAI Complaint ID to view live resolution status.
            </p>
            <form onSubmit={handleTrackSearch} className="space-y-2">
              <input
                type="text"
                value={trackSearchId}
                onChange={(e) => setTrackSearchId(e.target.value)}
                placeholder="e.g. CIV-2026-RD4812"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold text-xs transition cursor-pointer"
              >
                Lookup Tracking Timeline
              </button>
            </form>
          </div>

          {/* Latest Notifications Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">Recent Updates</h3>
              <Link to="/notifications" className="text-xs text-cyan-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {notifications.slice(0, 3).map((n) => (
                <div
                  key={n.id}
                  onClick={() => navigate(`/complaint/${n.complaintId}`)}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
                >
                  <p className="text-xs font-semibold text-white leading-tight">{n.title}</p>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{n.message}</p>
                  <span className="text-[10px] text-slate-500 mt-1.5 block">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
