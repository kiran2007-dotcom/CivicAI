import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  SlidersHorizontal,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  HardHat,
  Eye,
  AlertTriangle,
  Building2,
  Calendar,
  MapPin,
  Clock,
  ArrowUpDown,
  X,
  Check,
  Star,
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { useAuth } from '../context/AuthContext';
import {
  Complaint,
  ComplaintStatus,
  IssueCategory,
  PriorityLevel,
} from '../types';
import { DEPARTMENTS, REGISTERED_WORKERS } from '../services/storage';

const CATEGORIES: IssueCategory[] = [
  'Pothole',
  'Road Damage',
  'Garbage',
  'Water Leakage',
  'Broken Streetlight',
  'Drainage',
  'Fallen Tree',
  'Other',
];

export const ComplaintManagementPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'ALL';

  const { complaints, updateComplaintStatus } = useComplaints();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'priority'>('date_desc');

  // Selected complaint for Officer Modal
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Form State inside Modal
  const [editCategory, setEditCategory] = useState<IssueCategory>('Pothole');
  const [editPriority, setEditPriority] = useState<PriorityLevel>('Medium');
  const [editDepartment, setEditDepartment] = useState<string>('Road Maintenance');
  const [editWorkerId, setEditWorkerId] = useState<string>('');
  const [officerNote, setOfficerNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Open modal & prepopulate
  const handleOpenReview = (c: Complaint) => {
    setSelectedComplaint(c);
    setEditCategory(c.category);
    setEditPriority(c.priority);
    setEditDepartment(c.department);
    setEditWorkerId(c.assignedWorkerId || '');
    setOfficerNote(c.officerNotes || '');
    setRejectionReason(c.rejectionReason || '');
    setActionSuccess(null);
  };

  // Perform Officer Action
  const handleUpdateComplaint = (newStatus: ComplaintStatus) => {
    if (!selectedComplaint) return;

    if (newStatus === 'Rejected' && !rejectionReason.trim()) {
      alert('Please provide a specific rejection reason for municipal records.');
      return;
    }

    const assignedWorker = REGISTERED_WORKERS.find((w) => w.id === editWorkerId);

    const updated = updateComplaintStatus(selectedComplaint.id, newStatus, {
      title:
        newStatus === 'Rejected'
          ? 'Complaint Rejected by Officer'
          : newStatus === 'Verified'
          ? 'Complaint Inspected & Verified'
          : newStatus === 'Assigned'
          ? `Dispatched to ${assignedWorker?.name || 'Technician'}`
          : newStatus === 'Resolved'
          ? 'Final Resolution Verified by Officer'
          : `Status changed to ${newStatus}`,
      description: officerNote || `Action authorized by ${currentUser.name}.`,
      category: editCategory,
      priority: editPriority,
      department: editDepartment,
      assignedWorkerId: editWorkerId || undefined,
      assignedWorkerName: assignedWorker?.name || undefined,
      officerNotes: officerNote,
      rejectionReason: newStatus === 'Rejected' ? rejectionReason : undefined,
    });

    if (updated) {
      setSelectedComplaint(updated);
      setActionSuccess(`Updated ticket #${updated.id} to ${newStatus}`);
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
    }
  };

  // Filter complaints
  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    const matchesPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;
    const matchesDepartment = departmentFilter === 'ALL' || c.department === departmentFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCategory &&
      matchesPriority &&
      matchesDepartment
    );
  });

  // Sort complaints
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
            <SlidersHorizontal className="w-7 h-7 text-indigo-400" />
            <span>Complaint Management Queue</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Master operational console • Review AI recommendations, override departments, verify completion proof
          </p>
        </div>

        <Link
          to="/officer/assignment"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition self-start sm:self-auto cursor-pointer shadow-md"
        >
          <HardHat className="w-4 h-4" />
          <span>Worker Dispatch View</span>
        </Link>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        {/* Search & Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, keyword, address, or citizen name..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="priority">Priority First</option>
            </select>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-800/80">
          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
            >
              <option value="ALL">All Statuses ({complaints.length})</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Verified">Verified</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Awaiting Verification">Awaiting Verification</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
            >
              <option value="ALL">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
              Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
            >
              <option value="ALL">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
              Department
            </label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
            >
              <option value="ALL">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Table & Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Category & Photo</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Department & Tech</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-850/60 transition">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                    {c.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                        <img src={c.photoUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-white leading-tight">{c.category}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-1 max-w-[200px]">
                          {c.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getStatusBadge(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] border ${getPriorityBadge(
                        c.priority
                      )}`}
                    >
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-indigo-300 leading-tight truncate max-w-[140px]">
                      {c.department}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {c.assignedWorkerName ? `Tech: ${c.assignedWorkerName}` : 'Unassigned'}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-slate-400 max-w-[160px] truncate">
                    {c.location.address}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleOpenReview(c)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer"
                    >
                      Inspect & Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Officer Review Drawer / Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {selectedComplaint.id}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getStatusBadge(
                    selectedComplaint.status
                  )}`}
                >
                  {selectedComplaint.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-semibold">
                {actionSuccess}
              </div>
            )}

            {/* Evidence Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Citizen Photo Evidence
                </span>
                <div className="rounded-xl overflow-hidden border border-slate-800 max-h-44 bg-slate-950">
                  <img
                    src={selectedComplaint.photoUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {selectedComplaint.completionEvidence ? (
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 block mb-1">
                    Worker Completion Proof
                  </span>
                  <div className="rounded-xl overflow-hidden border border-emerald-800 max-h-44 bg-slate-950">
                    <img
                      src={selectedComplaint.completionEvidence.photoUrl}
                      alt="Proof"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 italic">
                    "{selectedComplaint.completionEvidence.notes}"
                  </p>
                </div>
              ) : (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-1.5 flex flex-col justify-center">
                  <span className="font-bold text-slate-300">Incident Details:</span>
                  <p className="text-slate-400">{selectedComplaint.description}</p>
                  <p className="text-slate-500 font-mono text-[10px]">
                    Location: {selectedComplaint.location.address}
                  </p>
                </div>
              )}
            </div>

            {/* Editable Fields: Category, Priority, Department, Worker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Category</label>
                <select
                  value={editCategory}
                  onChange={(e: any) => setEditCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Priority</label>
                <select
                  value={editPriority}
                  onChange={(e: any) => setEditPriority(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Responsible Department
                </label>
                <select
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Assign Field Technician
                </label>
                <select
                  value={editWorkerId}
                  onChange={(e) => setEditWorkerId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="">Select Technician...</option>
                  {REGISTERED_WORKERS.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Officer Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Internal Officer Note / Instructions to Crew
              </label>
              <input
                type="text"
                value={officerNote}
                onChange={(e) => setOfficerNote(e.target.value)}
                placeholder="e.g. Ensure lane is barricaded before cold asphalt compaction..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            {/* Rejection Reason (If rejecting) */}
            <div>
              <label className="block text-xs font-semibold text-rose-400 mb-1">
                Rejection Reason (Required only if rejecting ticket)
              </label>
              <input
                type="text"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Private property outside BBMP jurisdiction, or duplicate..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleUpdateComplaint('Rejected')}
                className="px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold transition cursor-pointer"
              >
                Reject Complaint
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateComplaint('Verified')}
                  className="px-4 py-2 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-bold transition cursor-pointer"
                >
                  Mark Verified
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateComplaint('Assigned')}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold transition cursor-pointer"
                >
                  Save & Assign Worker
                </button>

                {selectedComplaint.completionEvidence && (
                  <button
                    type="button"
                    onClick={() => handleUpdateComplaint('Resolved')}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    Verify Proof & Mark Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
