import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  ShieldCheck,
  RefreshCw,
  PlayCircle,
  Database,
  Key,
  Globe,
  AlertTriangle,
  User,
  Building2,
  HardHat,
  CheckCircle2,
  Cpu,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../services/storage';
import { ThemeSwitcher } from '../components/ThemeSwitcher';

export const SettingsPage: React.FC = () => {
  const {
    isDemoModeActive,
    setIsDemoModeActive,
    systemStatus,
    loadDemoScenario,
    resetDemoData,
  } = useComplaints();
  const { switchDemoRole, currentUser } = useAuth();
  const navigate = useNavigate();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleTriggerScenario = () => {
    const scenario = loadDemoScenario();
    setNotice(`Loaded sample scenario #${scenario.id}.`);
    setTimeout(() => setNotice(null), 4000);
    navigate(`/complaint/${scenario.id}`);
  };

  const handleConfirmReset = () => {
    resetDemoData();
    setConfirmResetOpen(false);
    setNotice('Local storage reset to baseline state.');
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-sky-700 dark:text-cyan-400" />
          <span>System Settings & Municipal Diagnostics</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Network configuration, domain deployment instructions, visual accessibility, and diagnostic accounts
        </p>
      </div>

      {notice && (
        <div className="p-4 rounded-lg bg-sky-50 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Appearance & Theme System */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Interface Theme & Visual Accessibility
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Select between light, dark, or system preference. High-contrast borders and surfaces adjust automatically.
            </p>
          </div>
          <ThemeSwitcher variant="segmented" />
        </div>
      </div>

      {/* Section 11: Professional Custom Domain & SSL Deployment Gateway */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-sky-700 dark:text-cyan-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Custom Domain & SSL Gateway Configuration
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
            HTTPS Ready
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          CivicAI is structured to bind to official municipal subdomains (e.g., <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-sky-700 dark:text-cyan-400">grievance.city.gov</code> or <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-sky-700 dark:text-cyan-400">civicai.gov</code>).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white block uppercase text-[10px] tracking-wider">
              DNS Record Setup (Target Host)
            </span>
            <div className="space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
              <p><strong>Type:</strong> CNAME</p>
              <p><strong>Host / Name:</strong> reports (or @ for root)</p>
              <p><strong>Points to:</strong> [DEPLOYMENT_TARGET_CNAME]</p>
              <p><strong>TTL:</strong> 300 (or Auto)</p>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              For root domain apex, configure an A record pointing to the hosting platform anycast IP.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white block uppercase text-[10px] tracking-wider">
              Supabase Auth & CORS Alignment
            </span>
            <div className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
              <p><strong>Site URL:</strong> Update in Supabase Dashboard &gt; Auth &gt; URL Config to custom domain.</p>
              <p><strong>Redirect URLs:</strong> Add <code className="text-sky-700 dark:text-cyan-400">https://your-domain.gov/**</code> to allowed redirect list.</p>
              <p><strong>CORS Header:</strong> Automatically managed by Express backend server.</p>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Ensure strict HTTPS encryption is enforced at the edge/CDN proxy level.
            </p>
          </div>
        </div>
      </div>

      {/* Real Photography Policy & Provenance Directory */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Real Photography Policy & Verified Asset Catalog</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Zero AI-generated illustrations or synthetic city mockups. All visual assets represent authentic real-world infrastructure defect photography.
            </p>
          </div>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            Real Photography
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {[
            {
              title: 'Pothole & Asphalt Damage',
              photographer: 'Marc-Olivier Jodoin',
              license: 'Unsplash Free License',
              source: 'Unsplash (photo-1515162816999-a0c47dc192f7)',
              url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=300',
            },
            {
              title: 'Garbage & Solid Waste Spill',
              photographer: 'John Cameron',
              license: 'Unsplash Free License',
              source: 'Unsplash (photo-1618477461853-cf6ed80faba5)',
              url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=300',
            },
            {
              title: 'Water Leakage & Pipeline Rupture',
              photographer: 'David Ballew',
              license: 'Unsplash Free License',
              source: 'Unsplash (photo-1516876437184-593fda40c7ce)',
              url: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?w=300',
            },
            {
              title: 'Broken Streetlight Luminaire',
              photographer: 'Arthur Edelman',
              license: 'Unsplash Free License',
              source: 'Unsplash (photo-1517457373958-b7bdd4587205)',
              url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=300',
            },
            {
              title: 'Field Worker Maintenance in Progress',
              photographer: 'Callum Shaw',
              license: 'Unsplash Free License',
              source: 'Unsplash (photo-1621905251189-08b45d6a269e)',
              url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300',
            },
            {
              title: 'Clean Resurfaced Street (Resolution Proof)',
              photographer: 'Dan Gold',
              license: 'Unsplash Free License',
              source: 'Unsplash (photo-1449824913935-59a10b8d2000)',
              url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300',
            },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <img
                src={item.url}
                alt={item.title}
                className="w-16 h-16 rounded-md object-cover shrink-0 border border-slate-200 dark:border-slate-800"
              />
              <div className="space-y-0.5 overflow-hidden">
                <p className="font-bold text-slate-900 dark:text-white truncate">{item.title}</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  By: <strong className="text-slate-800 dark:text-slate-300">{item.photographer}</strong>
                </p>
                <p className="text-[10px] text-sky-700 dark:text-cyan-400 truncate">{item.source}</p>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400">{item.license}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demonstration & Evaluation Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Demonstration Mode Controls
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              When enabled, deterministic municipal defect assets are loaded for testing without consuming live AI tokens.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isDemoModeActive}
              onChange={(e) => setIsDemoModeActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 rounded-md peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-md after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-700"></div>
          </label>
        </div>

        {/* Load Sample Case Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-sky-700 dark:text-cyan-400" />
              <span>Instantiate Sample Case (Pothole Defect)</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Generates a verified high-priority road damage case on MG Road to evaluate the multi-role lifecycle.
            </p>
          </div>

          <button
            onClick={handleTriggerScenario}
            className="px-4 py-2 rounded-md bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs transition shrink-0 cursor-pointer"
          >
            Load Sample Case
          </button>
        </div>

        {/* Reset Database */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-rose-600" />
              <span>Reset Local Workspace State</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Restores initial seeded municipal complaints, timeline milestones, and notification queues.
            </p>
          </div>

          <button
            onClick={() => setConfirmResetOpen(true)}
            className="px-4 py-2 rounded-md bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold text-xs transition shrink-0 cursor-pointer"
          >
            Reset Test Data
          </button>
        </div>
      </div>

      {/* Role Switcher Toolbar for Evaluation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Key className="w-5 h-5 text-amber-600" />
          <span>Role Switcher & Evaluator Personas</span>
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Switch active role context to evaluate role-specific views and permission constraints:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Citizen */}
          <div
            onClick={() => {
              switchDemoRole('citizen');
              navigate('/citizen/dashboard');
            }}
            className={`p-4 rounded-lg border transition cursor-pointer flex flex-col justify-between gap-3 ${
              currentUser.role === 'citizen'
                ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-800 dark:text-cyan-400 flex items-center gap-1.5">
                  <User className="w-4 h-4" /> Citizen
                </span>
                {currentUser.role === 'citizen' && (
                  <span className="text-[10px] bg-sky-700 text-white font-bold px-1.5 py-0.2 rounded">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white mt-2">Kiran Manjunath</p>
              <p className="text-[11px] text-slate-500 font-mono">citizen@civicai.demo</p>
            </div>
            <span className="text-[11px] font-bold text-sky-700 dark:text-cyan-400">Switch to Citizen →</span>
          </div>

          {/* Officer */}
          <div
            onClick={() => {
              switchDemoRole('officer');
              navigate('/officer/dashboard');
            }}
            className={`p-4 rounded-lg border transition cursor-pointer flex flex-col justify-between gap-3 ${
              currentUser.role === 'officer'
                ? 'bg-slate-200 dark:bg-slate-800 border-slate-500'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> Officer
                </span>
                {currentUser.role === 'officer' && (
                  <span className="text-[10px] bg-slate-700 text-white font-bold px-1.5 py-0.2 rounded">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white mt-2">Inspector Rajesh Verma</p>
              <p className="text-[11px] text-slate-500 font-mono">officer@civicai.demo</p>
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Switch to Officer →</span>
          </div>

          {/* Worker */}
          <div
            onClick={() => {
              switchDemoRole('worker');
              navigate('/worker/dashboard');
            }}
            className={`p-4 rounded-lg border transition cursor-pointer flex flex-col justify-between gap-3 ${
              currentUser.role === 'worker'
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                  <HardHat className="w-4 h-4" /> Field Worker
                </span>
                {currentUser.role === 'worker' && (
                  <span className="text-[10px] bg-amber-600 text-white font-bold px-1.5 py-0.2 rounded">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white mt-2">Ramesh Gowda</p>
              <p className="text-[11px] text-slate-500 font-mono">worker@civicai.demo</p>
            </div>
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400">Switch to Worker →</span>
          </div>
        </div>
      </div>

      {/* Backend & AI Diagnostics */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-sky-700 dark:text-cyan-400" />
          <span>System Architecture & API Diagnostics</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-slate-500 font-semibold block uppercase text-[10px]">
              Vision Triage Model
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  systemStatus.hasGeminiKey ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span className="font-bold text-slate-900 dark:text-white">
                {systemStatus.hasGeminiKey
                  ? 'Gemini 3.8 Flash (Server-Side @google/genai)'
                  : 'Deterministic Municipal Rule Engine'}
              </span>
            </div>
            <p className="text-slate-500 text-[11px]">
              {systemStatus.hasGeminiKey
                ? 'Server-side vision API key authenticated. Analyzes defect depth and department routing.'
                : 'Offline simulation using verified municipal samples with rule-based routing.'}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-slate-500 font-semibold block uppercase text-[10px]">
              Persistence Layer
            </span>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-700 dark:text-cyan-400" />
              <span className="font-bold text-slate-900 dark:text-white">Persistent Server Filesystem Store</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Synchronized single-source-of-truth across Citizen, Officer, and Worker roles with PostgreSQL schema parity.
            </p>
          </div>
        </div>
      </div>

      {/* Confirm Reset Dialog */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Confirm Reset of Sample Data</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              This will restore the baseline seeded municipal complaints, timeline milestones, and notifications.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmResetOpen(false)}
                className="px-4 py-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
