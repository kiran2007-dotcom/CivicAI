import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cpu,
  MapPin,
  Clock,
  Star,
  Users,
  Building,
  CheckCircle,
  BarChart,
  HardHat,
  Search,
  Eye,
  Camera,
  PlayCircle,
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { useAuth } from '../context/AuthContext';
import { SAMPLE_POTHOLE_SVG } from '../data/sampleAssets';

export const LandingPage: React.FC<{ onOpenChat?: () => void }> = ({ onOpenChat }) => {
  const { stats, loadDemoScenario } = useComplaints();
  const { switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const [quickTrackId, setQuickTrackId] = React.useState('');

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackId.trim()) {
      navigate(`/complaint/${quickTrackId.trim()}`);
    }
  };

  const handleQuickDemoRole = (role: 'citizen' | 'officer' | 'worker') => {
    switchDemoRole(role);
    if (role === 'citizen') navigate('/citizen/dashboard');
    else if (role === 'officer') navigate('/officer/dashboard');
    else navigate('/worker/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-radial from-blue-900/40 via-slate-950 to-slate-950 border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Smart Cities & Civic Tech Innovation Platform</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Smarter Cities.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                Better Lives.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-normal">
              CivicAI is the intelligent municipal complaint platform connecting{' '}
              <strong className="text-white font-medium">citizens</strong>,{' '}
              <strong className="text-white font-medium">government officers</strong>, and{' '}
              <strong className="text-white font-medium">field workers</strong> through multimodal vision AI, automated department dispatch, and transparent live tracking.
            </p>

            {/* Quick Track Input Bar */}
            <form
              onSubmit={handleQuickTrack}
              className="max-w-md mx-auto flex items-center gap-2 p-1.5 bg-slate-900/90 border border-slate-700 rounded-2xl shadow-xl shadow-cyan-950/20"
            >
              <div className="pl-3 text-slate-400">
                <Search className="w-5 h-5 text-cyan-400" />
              </div>
              <input
                type="text"
                value={quickTrackId}
                onChange={(e) => setQuickTrackId(e.target.value)}
                placeholder="Track Complaint ID (e.g. CIV-2026-RD4812)..."
                className="w-full bg-transparent border-none text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                Track Now
              </button>
            </form>

            {/* Primary CTAs */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/citizen/report"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm sm:text-base transition shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer"
              >
                <Camera className="w-5 h-5" /> Report Civic Issue
              </Link>
              <button
                onClick={() => {
                  const demo = loadDemoScenario();
                  navigate(`/complaint/${demo.id}`);
                }}
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm sm:text-base transition flex items-center gap-2 cursor-pointer"
              >
                <PlayCircle className="w-5 h-5 text-cyan-400" /> Load Demo Scenario
              </button>
            </div>

            {/* Quick Role Jump for Hackathon Judges */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span>Instant Persona Login:</span>
              <button
                onClick={() => handleQuickDemoRole('citizen')}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer"
              >
                Citizen Portal
              </button>
              <button
                onClick={() => handleQuickDemoRole('officer')}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 cursor-pointer"
              >
                Officer Bureau
              </button>
              <button
                onClick={() => handleQuickDemoRole('worker')}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 cursor-pointer"
              >
                Field Crew
              </button>
            </div>
          </div>

          {/* Live Data Dashboard Counters (Derived from real storage!) */}
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 text-center">
              <p className="text-3xl font-extrabold text-white">{stats.total}</p>
              <p className="text-xs text-slate-400 font-medium uppercase mt-1">Total Reported Issues</p>
              <p className="text-[11px] text-cyan-400 mt-1">Stored Municipal Records</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 text-center">
              <p className="text-3xl font-extrabold text-emerald-400">{stats.resolved}</p>
              <p className="text-xs text-slate-400 font-medium uppercase mt-1">Resolved Complaints</p>
              <p className="text-[11px] text-emerald-300 mt-1">{stats.resolutionRate}% Live Resolution Rate</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 text-center">
              <p className="text-3xl font-extrabold text-amber-400">{stats.inProgress}</p>
              <p className="text-xs text-slate-400 font-medium uppercase mt-1">In Field Execution</p>
              <p className="text-[11px] text-amber-300 mt-1">Assigned Technicians Active</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 text-center">
              <p className="text-3xl font-extrabold text-cyan-400">
                {stats.satisfactionRating > 0 ? `${stats.satisfactionRating}★` : '5.0★'}
              </p>
              <p className="text-xs text-slate-400 font-medium uppercase mt-1">Citizen Satisfaction</p>
              <p className="text-[11px] text-slate-400 mt-1">
                {stats.satisfactionCount > 0 ? `${stats.satisfactionCount} Verified Ratings` : 'Verified Post-Repair'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Primary End-to-End Workflow Section */}
      <section className="py-20 bg-slate-900/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <h2 className="text-xs uppercase font-bold tracking-widest text-cyan-400">The Core Workflow</h2>
            <p className="text-3xl font-extrabold text-white">How CivicAI Solves Municipal Bottlenecks</p>
            <p className="text-slate-400 text-sm">
              From raw citizen photograph to verified field repair in six synchronized milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                step: '01',
                title: 'Citizen Photo',
                desc: 'Upload defect image with GPS or address description.',
                icon: Camera,
                color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40',
              },
              {
                step: '02',
                title: 'AI Vision Triage',
                desc: 'Evaluates severity, confidence & routes to official department.',
                icon: Cpu,
                color: 'text-sky-400 border-sky-500/30 bg-sky-950/40',
              },
              {
                step: '03',
                title: 'Complaint ID',
                desc: 'Collision-resistant tracking code saved in persistence store.',
                icon: CheckCircle2,
                color: 'text-blue-400 border-blue-500/30 bg-blue-950/40',
              },
              {
                step: '04',
                title: 'Officer Review',
                desc: 'Government official audits diagnosis and dispatches technician.',
                icon: Building,
                color: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/40',
              },
              {
                step: '05',
                title: 'Worker Evidence',
                desc: 'Field crew commences work & uploads photographic completion proof.',
                icon: HardHat,
                color: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
              },
              {
                step: '06',
                title: 'Citizen Feedback',
                desc: 'Citizen is notified and rates work quality 1-5 stars.',
                icon: Star,
                color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
              },
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-slate-500">{st.step}</span>
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${st.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="font-bold text-white text-base mb-1.5">{st.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Issue Detection Feature Showcase */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Multimodal Vision Triage Engine</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                No Guesswork. Instant AI Diagnosis with Guaranteed Routing.
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                When a citizen snaps a photo of road damage, garbage, or water leaks, CivicAI's server-side vision model analyzes defect depth, hazard radius, and municipal safety implications.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Automated Department Routing</h4>
                    <p className="text-xs text-slate-400">
                      Instantly directs potholes to Road Maintenance, bursts to Water Supply, and luminaire defects to Electrical without administrative delay.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Confidence & Severity Assessment</h4>
                    <p className="text-xs text-slate-400">
                      Calculates diagnostic confidence (e.g. 94%) and flags Critical safety situations for urgent human officer review.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Honest Demo Mode with Sample Assets</h4>
                    <p className="text-xs text-slate-400">
                      When API keys are offline, deterministic sample scenarios with high-fidelity visual evidence demonstrate the exact municipal workflow transparently.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/citizen/report"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition"
                >
                  <span>Test AI Analysis Live</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Visual Preview Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                  <span className="ml-2 text-xs font-mono text-slate-400">CIV-AI-VISION-DIAGNOSTIC</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20">
                  94% Confidence
                </span>
              </div>

              <div className="mt-4 relative rounded-2xl overflow-hidden border border-slate-800">
                <img
                  src={SAMPLE_POTHOLE_SVG}
                  alt="Bengaluru Pothole Sample"
                  className="w-full h-52 object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-semibold text-white border border-slate-700">
                  MG Road • East Zone
                </div>
              </div>

              <div className="mt-5 space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Detected Category:</span>
                  <span className="font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded">Pothole</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Severity Assessment:</span>
                  <span className="font-bold text-rose-400 bg-rose-950/60 px-2.5 py-0.5 rounded border border-rose-800/40">
                    High (Safety Hazard)
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Recommended Department:</span>
                  <span className="font-bold text-cyan-400">Road Maintenance Bureau</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Estimated Resolution:</span>
                  <span className="font-semibold text-slate-300">24 Hours (SLA Target)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Citizen & Government Benefits */}
      <section className="py-20 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Citizen Benefits */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">For Citizens</h3>
              <p className="text-slate-400 text-sm">
                Empowering everyday residents with zero-friction reporting and total accountability from municipal authorities.
              </p>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  <span>Report in 30 seconds with automatic GPS & AI photo triage</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  <span>Transparent stage-by-stage timeline updates (No black boxes)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  <span>Before & after photographic completion evidence verification</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  <span>Post-repair 1 to 5 star citizen satisfaction rating</span>
                </li>
              </ul>
            </div>

            {/* Government Benefits */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">For Municipal Officers & Crews</h3>
              <p className="text-slate-400 text-sm">
                Operational command centers that slash redundant manual sorting and optimize field workforce deployment.
              </p>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span>Centralized management queue with multi-filtering and priority sort</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span>Direct technician dispatch with real-time crew workload tracking</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span>Field worker mobile work-order dashboard with proof upload</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span>Comprehensive civic analytics & SLA resolution time tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 text-slate-400 text-xs border-t border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">CivicAI — Smart Citizen Platform</p>
              <p className="text-slate-500">Smarter Cities. Better Lives.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link to="/citizen/dashboard" className="hover:text-cyan-400 transition">
              Citizen Portal
            </Link>
            <Link to="/officer/dashboard" className="hover:text-cyan-400 transition">
              Officer Dashboard
            </Link>
            <Link to="/worker/dashboard" className="hover:text-cyan-400 transition">
              Worker Tasks
            </Link>
            <Link to="/analytics" className="hover:text-cyan-400 transition">
              Analytics
            </Link>
            <Link to="/settings" className="hover:text-cyan-400 transition">
              Demo Credentials
            </Link>
          </div>

          <p className="text-slate-500">Built for Smart Cities & Civic Tech Innovation.</p>
        </div>
      </footer>
    </div>
  );
};
