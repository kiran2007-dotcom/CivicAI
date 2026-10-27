import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  ArrowUpDown,
  MapPin,
  Calendar,
  ChevronRight,
  PlusCircle,
  ShieldAlert,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { useAuth } from '../context/AuthContext';
import { ComplaintStatus, IssueCategory, PriorityLevel } from '../types';

export const MyComplaintsPage: React.FC = () => {
  const { complaints } = useComplaints();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'priority'>('date_desc');

  // Filter complaints
  const userComplaints = complaints.filter(
    (c) => c.citizenId === currentUser.id || currentUser.role === 'citizen'
  );

  const filtered = userComplaints.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'ALL' ||
      c.status === selectedStatus ||
      (selectedStatus === 'IN_PROGRESS' &&
        (c.status === 'Assigned' || c.status === 'In Progress' || c.status === 'Awaiting Verification'));

    const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Sort
  filtered.sort((a, b) => {
    if (sortBy === 'date_desc') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'date_asc') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === 'priority') {
      const pMap: Record<PriorityLevel, number> = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
      return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
    }
    return 0;
  });

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-cyan-400" />
            <span>My Submitted Complaints</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tracking {userComplaints.length} registered civic issues in Bengaluru
          </p>
        </div>

        <Link
          to="/citizen/report"
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 transition shadow-md shadow-cyan-500/20 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Issue</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative sm:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Complaint ID (CIV-...), description, or address..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="priority">Highest Priority First</option>
            </select>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <span className="text-xs text-slate-400 font-semibold mr-1 shrink-0">Status:</span>
          {[
            { id: 'ALL', label: 'All' },
            { id: 'Submitted', label: 'Submitted' },
            { id: 'IN_PROGRESS', label: 'In Execution' },
            { id: 'Resolved', label: 'Resolved' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setSelectedStatus(pill.id)}
              className={`px-3 py-1 rounded-md text-xs font-semibold shrink-0 transition cursor-pointer ${
                selectedStatus === pill.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Complaints List */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No complaints match your filters</h3>
          <p className="text-xs text-slate-400">
            Try resetting your search query or status filter to see all complaints.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedStatus('ALL');
              setSelectedCategory('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 text-cyan-400 text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/complaint/${c.id}`)}
              className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl p-4.5 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
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
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold border ${getStatusBadge(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] border ${getPriorityBadge(
                        c.priority
                      )}`}
                    >
                      {c.priority} Priority
                    </span>
                    <span className="text-[11px] text-cyan-300 font-medium">
                      Dept: {c.department}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition">
                    {c.category}: {c.description}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" /> {c.location.address}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />{' '}
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                    {c.feedback && (
                      <span className="inline-flex items-center gap-1 text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.2 rounded border border-amber-800/40">
                        <Star className="w-3 h-3 fill-amber-400" /> {c.feedback.rating}★ Rated
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <span className="text-xs text-cyan-400 font-bold group-hover:underline">
                  View Timeline & Details
                </span>
                <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-cyan-500 group-hover:text-slate-950 text-slate-400 flex items-center justify-center transition">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
