import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, MapPin, BarChart3, Settings, HelpCircle, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-400 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Brand & Description */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-sky-700 dark:bg-sky-600 flex items-center justify-center text-white font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                Civic<span className="text-sky-600 dark:text-cyan-400">AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Civic infrastructure reporting and automated department dispatch platform connecting citizens, municipal authorities, and field crews.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 text-[11px] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Municipal Gateway Active</span>
            </div>
          </div>

          {/* Citizen Portals */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Citizen Services
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/citizen/report" className="hover:text-sky-600 dark:hover:text-cyan-400 transition">
                  Report an Issue
                </Link>
              </li>
              <li>
                <Link to="/citizen/dashboard" className="hover:text-sky-600 dark:hover:text-cyan-400 transition">
                  Citizen Dashboard
                </Link>
              </li>
              <li>
                <Link to="/citizen/complaints" className="hover:text-sky-600 dark:hover:text-cyan-400 transition">
                  My Complaint History
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-sky-600 dark:hover:text-cyan-400 transition">
                  Smart City Defect Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Operations & Administration */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Operations & Administration
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/officer/dashboard" className="hover:text-sky-600 dark:hover:text-cyan-400 transition">
                  Officer Command Center
                </Link>
              </li>
              <li>
                <Link to="/officer/management" className="hover:text-sky-600 dark:hover:text-cyan-400 transition">
                  Complaint Audit Queue
                </Link>
              </li>
              <li>
                <Link to="/worker/dashboard" className="hover:text-sky-600 dark:hover:text-cyan-400 transition">
                  Field Operations Tasks
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-sky-600 dark:hover:text-cyan-400 transition">
                  SLA & Performance Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Privacy */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Governance & Policies
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/privacy" className="hover:text-sky-600 dark:hover:text-cyan-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-sky-600 dark:hover:text-cyan-400 transition">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-sky-600 dark:hover:text-cyan-400 transition">
                  System Diagnostics & Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 CivicAI Smart Citizen Platform. Operating in authorized municipal service districts.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:underline">
              Privacy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:underline">
              Terms
            </Link>
            <span>•</span>
            <Link to="/settings" className="hover:underline">
              Domain & System Info
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
