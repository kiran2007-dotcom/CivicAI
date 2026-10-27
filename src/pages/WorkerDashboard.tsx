import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HardHat,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Calendar,
  ArrowRight,
  ShieldAlert,
  PlayCircle,
  FileCheck,
  CheckCircle,
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { useAuth } from '../context/AuthContext';

export const WorkerDashboard: React.FC = () => {
  const { complaints, updateComplaintStatus } = useComplaints();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Show ONLY tasks assigned to this worker (or if demo user, show tasks for worker 01)
  const myTasks = complaints.filter(
    (c) =>
      c.assignedWorkerId === currentUser.id ||
      c.assignedWorkerName === currentUser.name ||
      (currentUser.role === 'worker' && c.status === 'Assigned')
  );

  const pendingAccept = myTasks.filter((t) => t.status === 'Assigned');
  const inProgress = myTasks.filter((t) => t.status === 'In Progress');
  const awaitingVerification = myTasks.filter((t) => t.status === 'Awaiting Verification');
  const resolved = myTasks.filter((t) => t.status === 'Resolved');

  const handleStartWork = (e: React.MouseEvent, complaintId: string) => {
    e.stopPropagation();
    updateComplaintStatus(complaintId, 'In Progress', {
      title: 'Field Work Commenced',
      description: `Technician ${currentUser.name} arrived on site and began repairs.`,
    });
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-amber-950/60 to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
            Field Technician Terminal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Work Orders • {currentUser.name}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Department of {currentUser.department || 'Road Maintenance'} • Mobile Dispatch Console
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/map"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Field Map</span>
          </Link>
        </div>
      </div>

      {/* Task Status Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Newly Assigned</span>
            <HardHat className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">
            {pendingAccept.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Ready for on-site execution</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">In Progress</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400">
            {inProgress.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Active repair underway</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Awaiting Verification</span>
            <FileCheck className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-400">
            {awaitingVerification.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Proof submitted to officer</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Completed & Closed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
            {resolved.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Verified resolutions</p>
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <HardHat className="w-5 h-5 text-amber-400" />
          <span>Assigned Work Orders ({myTasks.length})</span>
        </h2>

        {myTasks.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">No pending tasks assigned to you</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              All work orders for your crew have been completed. Check back or click "Load Demo Scenario" in the top bar to simulate a new assigned work order.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => navigate(`/worker/resolve/${task.id}`)}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 transition cursor-pointer flex flex-col justify-between gap-4 group shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                        {task.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          task.status === 'Assigned'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : task.status === 'In Progress'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                            : task.status === 'Awaiting Verification'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] border ${getPriorityBadge(
                        task.priority
                      )}`}
                    >
                      {task.priority} Priority
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                      <img src={task.photoUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                        {task.category}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">
                        {task.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                    <p className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{task.location.address}</span>
                    </p>
                    {task.officerNotes && (
                      <p className="text-indigo-300 text-[11px] italic truncate">
                        Officer note: "{task.officerNotes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Worker Action Buttons */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500">
                    Assigned: {task.assignedAt ? new Date(task.assignedAt).toLocaleDateString() : 'Today'}
                  </span>

                  <div className="flex items-center gap-2">
                    {task.status === 'Assigned' && (
                      <button
                        type="button"
                        onClick={(e) => handleStartWork(e, task.id)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center gap-1"
                      >
                        <PlayCircle className="w-3.5 h-3.5" /> Start Work
                      </button>
                    )}

                    <span className="text-xs text-amber-400 font-bold group-hover:underline flex items-center gap-1">
                      <span>Resolve & Proof</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
