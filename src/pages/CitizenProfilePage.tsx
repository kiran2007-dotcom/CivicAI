import React from 'react';
import {
  User,
  Shield,
  MapPin,
  Phone,
  Mail,
  Award,
  CheckCircle2,
  Star,
  FileText,
  Calendar,
  Building2,
  HardHat,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintsContext';

export const CitizenProfilePage: React.FC = () => {
  const { currentUser, switchDemoRole } = useAuth();
  const { complaints } = useComplaints();

  const userComplaints = complaints.filter(
    (c) => c.citizenId === currentUser.id || currentUser.role === 'citizen'
  );
  const resolvedCount = userComplaints.filter((c) => c.status === 'Resolved').length;
  const feedbackCount = userComplaints.filter((c) => c.feedback).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-1 shadow-xl shadow-cyan-500/20 shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-[20px] flex items-center justify-center font-extrabold text-3xl text-cyan-400">
              {currentUser.name.charAt(0)}
            </div>
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {currentUser.name}
              </h1>
              <span className="px-3 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-800">
                {currentUser.role}
              </span>
            </div>

            <p className="text-sm text-slate-400">
              Registered Citizen • Smart City Bengaluru Resident
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-500" /> {currentUser.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-slate-500" /> {currentUser.phone || '+91 98450 12345'}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-500" /> {currentUser.ward || 'Ward 112 - Central Zone'}
              </span>
            </div>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="mt-8 grid grid-cols-3 gap-3 border-t border-slate-800 pt-6 text-center">
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
            <p className="text-2xl font-extrabold text-cyan-400">{userComplaints.length}</p>
            <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Issues Logged</p>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
            <p className="text-2xl font-extrabold text-emerald-400">{resolvedCount}</p>
            <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Resolved</p>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
            <p className="text-2xl font-extrabold text-amber-400">{feedbackCount}</p>
            <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Reviews Given</p>
          </div>
        </div>
      </div>

      {/* Civic Badges & Gamification */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Civic Participation Badges</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Civic Guardian</p>
              <p className="text-[10px] text-slate-400">Verified resident of Ward 112</p>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">AI Vision Pioneer</p>
              <p className="text-[10px] text-slate-400">Tested multimodal triage</p>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Feedback Contributor</p>
              <p className="text-[10px] text-slate-400">Quality review participant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Role Switcher for Authorized Personnel */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white">Authorized Role Simulator</h2>
        <p className="text-xs text-slate-400">
          Switch roles to verify how municipal officers and field technicians triage and resolve grievances:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => switchDemoRole('officer')}
            className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 hover:border-indigo-500 text-left transition cursor-pointer flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Government Officer</p>
              <p className="text-[11px] text-slate-400">Inspector Rajesh Verma • Triage & Dispatch</p>
            </div>
          </button>

          <button
            onClick={() => switchDemoRole('worker')}
            className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 hover:border-amber-500 text-left transition cursor-pointer flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Field Technician</p>
              <p className="text-[11px] text-slate-400">Ramesh Gowda • On-Site Repair & Proof</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
