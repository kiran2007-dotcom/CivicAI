import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Building2,
  HardHat,
  Bell,
  MapPin,
  BarChart3,
  Settings,
  PlusCircle,
  FileText,
  User,
  LogOut,
  Sparkles,
  PlayCircle,
  Menu,
  X,
  CheckCircle2,
  Bot,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintsContext';
import { PWAInstallButton } from './PWAInstallButton';

export const Navbar: React.FC<{ onOpenChat?: () => void }> = ({ onOpenChat }) => {
  const { currentUser, switchDemoRole, logout } = useAuth();
  const { unreadNotificationCount, loadDemoScenario, isDemoModeActive } = useComplaints();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scenarioSuccess, setScenarioSuccess] = useState<string | null>(null);

  const handleLoadScenario = () => {
    const created = loadDemoScenario();
    setScenarioSuccess(`Created Scenario #${created.id}`);
    setTimeout(() => setScenarioSuccess(null), 4000);
    // Navigate to complaint details or dashboard
    if (currentUser.role === 'citizen') {
      navigate(`/complaint/${created.id}`);
    } else if (currentUser.role === 'officer') {
      navigate('/officer/management');
    } else {
      navigate('/worker/dashboard');
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getRoleBadge = () => {
    switch (currentUser.role) {
      case 'citizen':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
            <User className="w-3 h-3 text-cyan-600" /> Citizen
          </span>
        );
      case 'officer':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Building2 className="w-3 h-3 text-indigo-600" /> Municipal Officer
          </span>
        );
      case 'worker':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <HardHat className="w-3 h-3 text-amber-600" /> Field Technician
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      {/* Top Banner: Hackathon Demo Mode Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-cyan-950 px-4 py-1.5 text-xs text-slate-300 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> HACKATHON DEMO ENVIRONMENT
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-300">
            {isDemoModeActive ? 'Honest AI Simulation & Sample Assets' : 'Connected to Gemini 3.8 Flash'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {scenarioSuccess && (
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" /> {scenarioSuccess}
            </span>
          )}
          <button
            onClick={handleLoadScenario}
            title="Instantly generate a deterministic Bengaluru pothole complaint for full workflow testing"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Load Demo Scenario</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-sky-400 p-0.5 shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                  Civic<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">AI</span>
                </span>
                <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-1">
                  Smart Citizen Platform
                </span>
              </div>
            </Link>

            {/* Role-Based Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              {currentUser.role === 'citizen' && (
                <>
                  <Link
                    to="/citizen/dashboard"
                    className={`px-3 py-1.5 rounded-lg transition ${
                      isActive('/citizen/dashboard')
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/citizen/report"
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                      isActive('/citizen/report')
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                        : 'text-cyan-400 hover:text-cyan-300 hover:bg-slate-800'
                    }`}
                  >
                    <PlusCircle className="w-4 h-4" /> Report Issue
                  </Link>
                  <Link
                    to="/citizen/complaints"
                    className={`px-3 py-1.5 rounded-lg transition ${
                      isActive('/citizen/complaints')
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    My Complaints
                  </Link>
                  <Link
                    to="/map"
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${
                      isActive('/map')
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <MapPin className="w-4 h-4" /> City Map
                  </Link>
                </>
              )}

              {currentUser.role === 'officer' && (
                <>
                  <Link
                    to="/officer/dashboard"
                    className={`px-3 py-1.5 rounded-lg transition ${
                      isActive('/officer/dashboard')
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/officer/management"
                    className={`px-3 py-1.5 rounded-lg transition ${
                      isActive('/officer/management')
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Complaint Queue
                  </Link>
                  <Link
                    to="/officer/assignment"
                    className={`px-3 py-1.5 rounded-lg transition ${
                      isActive('/officer/assignment')
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Worker Dispatch
                  </Link>
                  <Link
                    to="/map"
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${
                      isActive('/map')
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <MapPin className="w-4 h-4" /> Map View
                  </Link>
                </>
              )}

              {currentUser.role === 'worker' && (
                <>
                  <Link
                    to="/worker/dashboard"
                    className={`px-3 py-1.5 rounded-lg transition ${
                      isActive('/worker/dashboard')
                        ? 'bg-amber-600 text-white font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    My Work Orders
                  </Link>
                  <Link
                    to="/map"
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${
                      isActive('/map')
                        ? 'bg-amber-600 text-white font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <MapPin className="w-4 h-4" /> Field Map
                  </Link>
                </>
              )}

              {/* Shared Links */}
              <Link
                to="/analytics"
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${
                  isActive('/analytics')
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BarChart3 className="w-4 h-4" /> Analytics
              </Link>
              <Link
                to="/settings"
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${
                  isActive('/settings')
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Settings className="w-4 h-4" /> Settings
              </Link>
            </nav>
          </div>

          {/* Right Controls: Role Switcher, Notification, User Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Role Switcher Bar for Hackathon Judges */}
            <div className="hidden lg:flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700 text-xs">
              <span className="px-2 text-slate-400 font-semibold uppercase text-[10px]">Role:</span>
              <button
                onClick={() => {
                  switchDemoRole('citizen');
                  navigate('/citizen/dashboard');
                }}
                className={`px-2.5 py-1 rounded transition cursor-pointer font-medium ${
                  currentUser.role === 'citizen'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Citizen
              </button>
              <button
                onClick={() => {
                  switchDemoRole('officer');
                  navigate('/officer/dashboard');
                }}
                className={`px-2.5 py-1 rounded transition cursor-pointer font-medium ${
                  currentUser.role === 'officer'
                    ? 'bg-blue-600 text-white font-bold shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Officer
              </button>
              <button
                onClick={() => {
                  switchDemoRole('worker');
                  navigate('/worker/dashboard');
                }}
                className={`px-2.5 py-1 rounded transition cursor-pointer font-medium ${
                  currentUser.role === 'worker'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Worker
              </button>
            </div>

            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Chat Assistant trigger */}
            {onOpenChat && (
              <button
                onClick={onOpenChat}
                title="Open CivicAI Assistant"
                className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <Bot className="w-5 h-5 text-cyan-400" />
              </button>
            )}

            {/* Notification Bell */}
            <Link
              to="/notifications"
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="View in-app notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-slate-900">
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </span>
              )}
            </Link>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <Link to="/citizen/profile" className="flex items-center gap-2 hover:opacity-90">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm text-cyan-400 border border-slate-600">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <p className="font-semibold text-white leading-tight truncate max-w-[120px]">
                    {currentUser.name}
                  </p>
                  <p className="text-slate-400 text-[11px] capitalize">{currentUser.role}</p>
                </div>
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                title="Log out / switch account"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs text-slate-400">Current Role:</span>
            {getRoleBadge()}
          </div>

          <div className="grid grid-cols-3 gap-1 bg-slate-800 p-1 rounded-lg text-center text-xs">
            <button
              onClick={() => {
                switchDemoRole('citizen');
                navigate('/citizen/dashboard');
                setMobileMenuOpen(false);
              }}
              className={`py-1.5 rounded ${currentUser.role === 'citizen' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300'}`}
            >
              Citizen
            </button>
            <button
              onClick={() => {
                switchDemoRole('officer');
                navigate('/officer/dashboard');
                setMobileMenuOpen(false);
              }}
              className={`py-1.5 rounded ${currentUser.role === 'officer' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300'}`}
            >
              Officer
            </button>
            <button
              onClick={() => {
                switchDemoRole('worker');
                navigate('/worker/dashboard');
                setMobileMenuOpen(false);
              }}
              className={`py-1.5 rounded ${currentUser.role === 'worker' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'}`}
            >
              Worker
            </button>
          </div>

          <nav className="flex flex-col gap-1 text-sm font-medium pt-2">
            {currentUser.role === 'citizen' && (
              <>
                <Link
                  to="/citizen/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200"
                >
                  Citizen Dashboard
                </Link>
                <Link
                  to="/citizen/report"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" /> Report Civic Issue
                </Link>
                <Link
                  to="/citizen/complaints"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200"
                >
                  My Complaints
                </Link>
              </>
            )}

            {currentUser.role === 'officer' && (
              <>
                <Link
                  to="/officer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200"
                >
                  Officer Dashboard
                </Link>
                <Link
                  to="/officer/management"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200"
                >
                  Complaint Queue
                </Link>
                <Link
                  to="/officer/assignment"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200"
                >
                  Worker Dispatch
                </Link>
              </>
            )}

            {currentUser.role === 'worker' && (
              <Link
                to="/worker/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200"
              >
                My Assigned Work Orders
              </Link>
            )}

            <Link
              to="/map"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-cyan-400" /> Smart City Map
            </Link>
            <Link
              to="/analytics"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-cyan-400" /> Civic Analytics
            </Link>
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2"
            >
              <Settings className="w-4 h-4 text-cyan-400" /> Settings & Demo Credentials
            </Link>
            <Link
              to="/notifications"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-400" /> Notifications
              </span>
              {unreadNotificationCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-xs font-bold text-white">
                  {unreadNotificationCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
