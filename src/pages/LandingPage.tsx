import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Search,
  ArrowRight,
  CheckCircle2,
  Cpu,
  MapPin,
  Clock,
  Users,
  Building2,
  HardHat,
  Camera,
  FileCheck2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { REAL_CIVIC_PHOTOS } from '../data/sampleAssets';

export const LandingPage: React.FC<{ onOpenChat?: () => void }> = () => {
  const { stats, complaints } = useComplaints();
  const navigate = useNavigate();
  const [quickTrackId, setQuickTrackId] = useState('');
  const [trackError, setTrackError] = useState<string | null>(null);

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const query = quickTrackId.trim();
    if (!query) {
      setTrackError('Please enter a valid complaint identifier (e.g., CIV-2026-RD4812).');
      return;
    }
    setTrackError(null);
    navigate(`/complaint/${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* System Status Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold tracking-wide">
              <Shield className="w-3.5 h-3.5 text-sky-700 dark:text-cyan-400" />
              <span>Official Municipal Infrastructure Grievance Portal</span>
            </div>

            {/* Headline per specification */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Report civic issues. Track every update.
            </h1>

            {/* Supporting text per specification */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              CivicAI helps residents report local infrastructure and public-service problems, while authorized teams manage complaints and communicate progress.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/citizen/report"
                className="px-6 py-3 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm transition shadow-sm flex items-center gap-2 focus-visible:outline-2"
              >
                <Camera className="w-4 h-4" /> Report an Issue
              </Link>
              <a
                href="#quick-track"
                className="px-6 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition flex items-center gap-2"
              >
                <Search className="w-4 h-4 text-sky-700 dark:text-cyan-400" /> Track a Complaint
              </a>
            </div>

            {/* Quick Track Input Bar */}
            <div id="quick-track" className="pt-4 max-w-md mx-auto">
              <form
                onSubmit={handleQuickTrack}
                className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm"
              >
                <div className="pl-3 text-slate-400">
                  <Search className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                </div>
                <input
                  type="text"
                  value={quickTrackId}
                  onChange={(e) => {
                    setQuickTrackId(e.target.value);
                    if (trackError) setTrackError(null);
                  }}
                  placeholder="Enter Complaint ID (e.g. CIV-2026-RD4812)..."
                  aria-label="Complaint tracking ID"
                  className="w-full bg-transparent border-none text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 px-4 py-2 rounded-md bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs transition cursor-pointer"
                >
                  Lookup
                </button>
              </form>
              {trackError && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 text-left flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {trackError}
                </p>
              )}
            </div>
          </div>

          {/* Operational Metrics based on Real Database Queries */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {stats.total}
                </p>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mt-1">
                  Documented Issues
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Active municipal records</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-700 dark:text-amber-400">
                  {stats.inProgress + stats.submitted}
                </p>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mt-1">
                  In Progress / Review
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Assigned field tasks</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-sky-700 dark:text-cyan-400">
                  {stats.resolved}
                </p>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mt-1">
                  Completed Rectifications
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Verified with photo proof</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  24h
                </p>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mt-1">
                  Target SLA Benchmark
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Pothole & emergency repair SLA</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 text-center mt-3">
              Note: Database aggregates include current demonstration records clearly labeled within individual ticket views.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Who CivicAI Is For */}
      <section className="py-16 bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <h2 className="text-xs uppercase font-bold tracking-wider text-sky-700 dark:text-cyan-400">
              Role-Based Access
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Built for Citizens, Officers, and Field Operations
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Dedicated interfaces ensure clear responsibilities, data privacy, and accountability at every stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Citizen Role */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">For Citizens</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Report infrastructure issues in your neighborhood with real photo evidence and precise location coordinates.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                  <span>Transparent tracking with time-stamped status updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                  <span>Inspect before-and-after photographic evidence</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                  <span>Provide post-repair ratings and feedback</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  to="/citizen/report"
                  className="text-xs font-bold text-sky-700 dark:text-cyan-400 hover:underline inline-flex items-center gap-1"
                >
                  Open Citizen Reporting <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Municipal Officer Role */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5 text-sky-700 dark:text-cyan-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">For Municipal Officers</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Review grievances, audit automated department triage suggestions, and dispatch field technicians.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                  <span>Central audit queue with multi-filter sorting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                  <span>Technician dispatch by department and workload</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                  <span>Review completion proof prior to closing tickets</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  to="/officer/dashboard"
                  className="text-xs font-bold text-sky-700 dark:text-cyan-400 hover:underline inline-flex items-center gap-1"
                >
                  Officer Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Field Operations Role */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                <HardHat className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">For Field Operations</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Mobile-optimized task list displaying assigned work orders, incident locations, and required repairs.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                  <span>Strict access limited to assigned work orders</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                  <span>Update progress on-site (In Progress status)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                  <span>Upload verified completion photo evidence</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  to="/worker/dashboard"
                  className="text-xs font-bold text-sky-700 dark:text-cyan-400 hover:underline inline-flex items-center gap-1"
                >
                  Field Worker View <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: How Complaint Reporting & Management Works */}
      <section className="py-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <h2 className="text-xs uppercase font-bold tracking-wider text-sky-700 dark:text-cyan-400">
              Operational Workflow
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              How Civic Complaints Move from Report to Resolution
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              A synchronized five-step municipal process eliminating communication breakdowns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Capture Issue',
                desc: 'Citizen uploads genuine photographic evidence with street address or device GPS.',
                icon: Camera,
              },
              {
                step: '02',
                title: 'Triage & Route',
                desc: 'Multimodal vision analysis assesses category and recommends official department.',
                icon: Cpu,
              },
              {
                step: '03',
                title: 'Officer Dispatch',
                desc: 'Municipal supervisor reviews ticket validity and assigns a field crew technician.',
                icon: Building2,
              },
              {
                step: '04',
                title: 'Field Execution',
                desc: 'Crew commences on-site repairs and uploads verified after-work photographic proof.',
                icon: HardHat,
              },
              {
                step: '05',
                title: 'Verification',
                desc: 'Ticket closed with audit notes; citizen receives completion notice and rates work.',
                icon: FileCheck2,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-400">{item.step}</span>
                      <Icon className="w-4 h-4 text-sky-700 dark:text-cyan-400" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section: Authentic Interface Preview Card */}
      <section className="py-16 bg-slate-100 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <h2 className="text-xs uppercase font-bold tracking-wider text-sky-700 dark:text-cyan-400">
                Transparent Tracking
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Authentic Case Records with Timestamped Evidence
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                CivicAI gives citizens and officers full visibility into complaint status. Every record includes collision-resistant ticket codes, exact geographic references, technician assignments, and genuine photographic evidence.
              </p>

              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-700 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Collision-Resistant IDs:</strong> Every complaint receives an immutable reference code (e.g., CIV-2026-RD4812).</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-700 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Verified Real Photography:</strong> Initial reports and completed work require genuine photo attachments.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-700 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Departmental SLA Targets:</strong> Transparent target resolution hours set by municipal service codes.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/map"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs transition"
                >
                  <MapPin className="w-4 h-4" /> View Live City Defect Map
                </Link>
              </div>
            </div>

            {/* Authentic Product UI Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-sky-700 dark:text-cyan-400">
                    CIV-2026-RD4812
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                    Ward 112 • MG Road
                  </span>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  In Progress
                </span>
              </div>

              <div className="mt-4 relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                <img
                  src={REAL_CIVIC_PHOTOS.pothole.url}
                  alt={REAL_CIVIC_PHOTOS.pothole.altText}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white">
                  Photo: {REAL_CIVIC_PHOTOS.pothole.photographer} (Unsplash)
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>Category:</span>
                  <span className="font-bold text-slate-900 dark:text-white">Pothole (Road Maintenance)</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>Assigned Field Worker:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Ramesh Gowda (Dispatched)</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>Target SLA:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">24 Hours (Cold-mix asphalt)</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-[11px] text-slate-500">Last updated 2 hours ago</span>
                <Link
                  to="/complaint/CIV-2026-RD4812"
                  className="text-xs font-bold text-sky-700 dark:text-cyan-400 hover:underline"
                >
                  View Case Timeline →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
