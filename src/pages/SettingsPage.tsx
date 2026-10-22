import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Sparkles,
  RefreshCw,
  PlayCircle,
  Database,
  Key,
  ShieldCheck,
  AlertTriangle,
  User,
  Building2,
  HardHat,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../services/storage';

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
    setNotice(`Created deterministic scenario #${scenario.id}!`);
    setTimeout(() => setNotice(null), 4000);
    navigate(`/complaint/${scenario.id}`);
  };

  const handleConfirmReset = () => {
    resetDemoData();
    setConfirmResetOpen(false);
    setNotice('Local storage successfully reset to factory demo state!');
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-cyan-400" />
          <span>Platform Settings & Demo Control Center</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Hackathon evaluation controls, AI vision configuration, and demo persona accounts
        </p>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Hackathon Demo Mode Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <h2 className="text-base font-bold text-white">Hackathon Demonstration Mode</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Active simulation mode provides bundled high-resolution defect images and deterministic municipal outputs.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isDemoModeActive}
              onChange={(e) => setIsDemoModeActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
          </label>
        </div>

        {/* Load Demo Scenario Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Load Bengaluru Pothole Scenario</span>
            </h3>
            <p className="text-xs text-slate-400">
              Generates a new High-priority pothole ticket on MG Road ready for Officer verification, Worker dispatch, and Citizen feedback.
            </p>
          </div>

          <button
            onClick={handleTriggerScenario}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs sm:text-sm transition shadow-lg shadow-cyan-500/20 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Load Demo Scenario</span>
          </button>
        </div>

        {/* Factory Reset Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-rose-400" />
              <span>Reset Local Storage Dataset</span>
            </h3>
            <p className="text-xs text-slate-400">
              Restores initial seeded complaints, timelines, and notifications if local storage becomes cluttered.
            </p>
          </div>

          <button
            onClick={() => setConfirmResetOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs transition shrink-0 cursor-pointer"
          >
            Reset Demo Data
          </button>
        </div>
      </div>

      {/* Demo Credentials Cheat Sheet for Evaluators */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Key className="w-5 h-5 text-amber-400" />
          <span>Demo Credentials & Instant Role Switcher</span>
        </h2>
        <p className="text-xs text-slate-400">
          Click any role card below to immediately switch context and evaluate role-based permissions:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Citizen */}
          <div
            onClick={() => {
              switchDemoRole('citizen');
              navigate('/citizen/dashboard');
            }}
            className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-3 ${
              currentUser.role === 'citizen'
                ? 'bg-cyan-950/60 border-cyan-500 shadow-md ring-1 ring-cyan-500'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <User className="w-4 h-4" /> Citizen
                </span>
                {currentUser.role === 'citizen' && (
                  <span className="text-[10px] bg-cyan-500 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-white mt-2">Kiran Manjunath</p>
              <p className="text-[11px] text-slate-400 font-mono">citizen@civicai.demo</p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">PW: Citizen123!</p>
            </div>
            <span className="text-[11px] font-bold text-cyan-400">Switch to Citizen →</span>
          </div>

          {/* Officer */}
          <div
            onClick={() => {
              switchDemoRole('officer');
              navigate('/officer/dashboard');
            }}
            className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-3 ${
              currentUser.role === 'officer'
                ? 'bg-indigo-950/60 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> Officer
                </span>
                {currentUser.role === 'officer' && (
                  <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.2 rounded">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-white mt-2">Inspector Rajesh Verma</p>
              <p className="text-[11px] text-slate-400 font-mono">officer@civicai.demo</p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">PW: Officer123!</p>
            </div>
            <span className="text-[11px] font-bold text-indigo-400">Switch to Officer →</span>
          </div>

          {/* Worker */}
          <div
            onClick={() => {
              switchDemoRole('worker');
              navigate('/worker/dashboard');
            }}
            className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-3 ${
              currentUser.role === 'worker'
                ? 'bg-amber-950/60 border-amber-500 shadow-md ring-1 ring-amber-500'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <HardHat className="w-4 h-4" /> Worker
                </span>
                {currentUser.role === 'worker' && (
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-white mt-2">Ramesh Gowda</p>
              <p className="text-[11px] text-slate-400 font-mono">worker@civicai.demo</p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">PW: Worker123!</p>
            </div>
            <span className="text-[11px] font-bold text-amber-400">Switch to Worker →</span>
          </div>
        </div>
      </div>

      {/* Backend & AI Connection Diagnostics */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span>System Architecture & API Diagnostics</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-semibold block uppercase text-[10px]">
              AI Vision Engine
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  systemStatus.hasGeminiKey ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span className="font-bold text-white">
                {systemStatus.hasGeminiKey
                  ? 'Gemini 3.8 Flash (Server-Side)'
                  : 'Honest Demo AI Simulation'}
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              {systemStatus.hasGeminiKey
                ? 'Backend connected via @google/genai SDK with structured JSON output schema.'
                : 'Using bundled municipal sample scenarios with deterministic confidence metrics.'}
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-semibold block uppercase text-[10px]">
              Storage Layer
            </span>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white">Persistent Browser Store</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Synchronized single-source-of-truth across Citizen, Officer, and Worker dashboards in this browser.
            </p>
          </div>
        </div>
      </div>

      {/* Confirm Reset Dialog */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-950/80 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Confirm Reset of Demo Data</h3>
            </div>
            <p className="text-xs text-slate-400">
              This will restore the original seeded complaints, initial timeline milestones, and clean demo notifications.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmResetOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
