import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  HardHat,
  Building2,
  CheckCircle2,
  User,
  ArrowRight,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  Send,
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { useAuth } from '../context/AuthContext';
import { REGISTERED_WORKERS } from '../services/storage';
import { Complaint } from '../types';

export const ComplaintAssignmentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedComplaintId = searchParams.get('complaintId');

  const { complaints, updateComplaintStatus } = useComplaints();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Filter unassigned or pending complaints
  const unassignedList = complaints.filter(
    (c) =>
      c.status === 'Submitted' ||
      c.status === 'Under Review' ||
      c.status === 'Verified' ||
      !c.assignedWorkerId
  );

  const [selectedComplaintId, setSelectedComplaintId] = useState<string>(
    preselectedComplaintId || (unassignedList[0]?.id || '')
  );
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(REGISTERED_WORKERS[0]?.id || '');
  const [assignmentNote, setAssignmentNote] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const activeComplaint = complaints.find((c) => c.id === selectedComplaintId);

  // Calculate each worker's active workload
  const workersWithWorkload = REGISTERED_WORKERS.map((w) => {
    const activeTasks = complaints.filter(
      (c) =>
        c.assignedWorkerId === w.id &&
        c.status !== 'Resolved' &&
        c.status !== 'Rejected'
    ).length;
    return { ...w, activeTasks };
  });

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint) return;

    const worker = REGISTERED_WORKERS.find((w) => w.id === selectedWorkerId);
    if (!worker) return;

    const updated = updateComplaintStatus(activeComplaint.id, 'Assigned', {
      title: `Dispatched to Field Crew: ${worker.name}`,
      description:
        assignmentNote ||
        `Work order assigned by Officer ${currentUser.name} to ${worker.name} (${worker.department}).`,
      assignedWorkerId: worker.id,
      assignedWorkerName: worker.name,
      officerNotes: assignmentNote,
    });

    if (updated) {
      setSuccessMessage(`Successfully dispatched ticket #${updated.id} to ${worker.name}!`);
      setTimeout(() => {
        setSuccessMessage(null);
        navigate('/officer/management');
      }, 2500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
          <HardHat className="w-7 h-7 text-indigo-400" />
          <span>Field Crew Dispatch & Assignment</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Route open municipal grievances to certified field technicians based on department skills and live queue load.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-sm font-bold flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Select Open Complaint (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              1. Select Open Complaint ({unassignedList.length})
            </h2>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {unassignedList.map((c) => {
              const isSelected = c.id === selectedComplaintId;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedComplaintId(c.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-indigo-950/70 border-indigo-500 shadow-lg shadow-indigo-950/30 ring-1 ring-indigo-500'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                    <img src={c.photoUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-mono text-xs font-bold text-cyan-400">{c.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 font-bold text-white">
                        {c.priority} Priority
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white truncate">{c.category}</p>
                    <p className="text-[11px] text-slate-400 truncate">{c.location.address}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Assignment Details & Worker Selection (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeComplaint ? (
            <form
              onSubmit={handleDispatch}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6"
            >
              <div className="pb-4 border-b border-slate-800">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                  Target Work Order
                </span>
                <h3 className="text-lg font-bold text-white">
                  #{activeComplaint.id} • {activeComplaint.category}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{activeComplaint.description}</p>
                <div className="flex items-center gap-2 text-xs text-slate-300 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{activeComplaint.location.address}</span>
                </div>
              </div>

              {/* Select Technician */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                  2. Select Field Technician
                </label>

                <div className="space-y-2.5">
                  {workersWithWorkload.map((w) => {
                    const isSelected = w.id === selectedWorkerId;
                    return (
                      <label
                        key={w.id}
                        className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'bg-indigo-950/60 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="worker"
                            value={w.id}
                            checked={isSelected}
                            onChange={() => setSelectedWorkerId(w.id)}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-white">{w.name}</p>
                            <p className="text-[11px] text-slate-400">{w.department} • {w.email}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              w.activeTasks === 0
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : w.activeTasks < 3
                                ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            {w.activeTasks} Active Order{w.activeTasks !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Officer Instructions / Site Safety Directives
                </label>
                <textarea
                  rows={2}
                  value={assignmentNote}
                  onChange={(e) => setAssignmentNote(e.target.value)}
                  placeholder="e.g. Inspect foundation sub-base before asphalt fill. High traffic arterial road..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Submit Dispatch */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Confirm Dispatch & Notify Crew</span>
              </button>
            </form>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-sm">
              Please choose a complaint from the left queue to begin worker assignment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
