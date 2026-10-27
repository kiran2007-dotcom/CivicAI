import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield,
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
  Menu,
  X,
  CheckCircle2,
  Bot,
  PlayCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintsContext';
import { PWAInstallButton } from './PWAInstallButton';
import { ThemeSwitcher } from './ThemeSwitcher';

export const Navbar: React.FC<{ onOpenChat?: () => void }> = ({ onOpenChat }) => {
  const { currentUser, switchDemoRole, logout } = useAuth();
  const { unreadNotificationCount, loadDemoScenario, isDemoModeActive } = useComplaints();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scenarioSuccess, setScenarioSuccess] = useState<string | null>(null);

  const handleLoadScenario = () => {
    const created = loadDemoScenario();
    setScenarioSuccess(`Loaded Sample #${created.id}`);
    setTimeout(() => setScenarioSuccess(null), 4000);
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
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
            <User className="w-3 h-3" /> Citizen
          </span>
        );
      case 'officer':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
            <Building2 className="w-3 h-3 text-sky-600 dark:text-cyan-400" /> Municipal Officer
          </span>
        );
      case 'worker':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <HardHat className="w-3 h-3" /> Field Technician
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
      {/* Top Bar: Official Municipal Gateway Bar */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs text-slate-400 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-200 tracking-wide flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-sky-400" /> Municipal Operations Gateway
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">
            Civic Infrastructure Management Portal
          </span>
        </div>

        <div className="flex items-center gap-3">
          {scenarioSuccess && (
            <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> {scenarioSuccess}
            </span>
          )}
          <button
            onClick={handleLoadScenario}
            title="Load an official sample complaint scenario for inspection"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700 cursor-pointer"
          >
            <PlayCircle className="w-3.5 h-3.5 text-sky-400" />
            <span>Load Sample Case</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-sky-700 flex items-center justify-center text-white font-bold shadow-sm">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                  Civic<span className="text-sky-400">AI</span>
                </span>
                <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-1">
                  Smart Citizen Platform
                </span>
              </div>
            </Link>

            {/* Role-Based Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
              {currentUser.role === 'citizen' && (
                <>
                  <Link
                    to="/citizen/dashboard"
                    className={`px-3 py-1.5 rounded-md transition ${
                      isActive('/citizen/dashboard')
                        ? 'bg-sky-700 text-white font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/citizen/report"
                    className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                      isActive('/citizen/report')
                        ? 'bg-sky-700 text-white font-bold'
                        : 'text-sky-400 hover:text-sky-300 hover:bg-slate-800'
                    }`}
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Report Issue
                  </Link>
                  <Link
                    to="/citizen/complaints"
                    className={`px-3 py-1.5 rounded-md transition ${
                      isActive('/citizen/complaints')
                        ? 'bg-sky-700 text-white font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    My Complaints
                  </Link>
                  <Link
                    to="/map"
                    className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition ${
                      isActive('/map')
                        ? 'bg-sky-700 text-white font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" /> City Map
                  </Link>
                </>
              )}

              {currentUser.role === 'officer' && (
                <>
                  <Link
                    to="/officer/dashboard"
                    className={`px-3 py-1.5 rounded-md transition ${
                      isActive('/officer/dashboard')
                        ? 'bg-sky-700 text-white font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/officer/management"
                    className={`px-3 py-1.5 rounded-md transition ${
                      isActive('/officer/management')
                        ? 'bg-sky-700 text-white font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Complaint Queue
                  </Link>
                  <Link
                    to="/officer/assignment"
                    className={`px-3 py-1.5 rounded-md transition ${
                      isActive('/officer/assignment')
                        ? 'bg-sky-700 text-white font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Worker Dispatch
                  </Link>
                  <Link
                    to="/map"
                    className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition ${
                      isActive('/map')
                        ? 'bg-sky-700 text-white font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" /> Map View
                  </Link>
                </>
              )}

              {currentUser.role === 'worker' && (
                <>
                  <Link
                    to="/worker/dashboard"
                    className={`px-3 py-1.5 rounded-md transition ${
                      isActive('/worker/dashboard')
                        ? 'bg-amber-600 text-white font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Work Orders
                  </Link>
                  <Link
                    to="/map"
                    className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition ${
                      isActive('/map')
                        ? 'bg-amber-600 text-white font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" /> Field Map
                  </Link>
                </>
              )}

              {/* Shared Links */}
              <Link
                to="/analytics"
                className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition ${
                  isActive('/analytics')
                    ? 'bg-sky-700 text-white font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" /> Analytics
              </Link>
              <Link
                to="/settings"
                className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition ${
                  isActive('/settings')
                    ? 'bg-sky-700 text-white font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Settings className="w-3.5 h-3.5" /> Settings
              </Link>
            </nav>
          </div>

          {/* Right Controls: Persona Switcher, Notification, User Profile */}
          <div className="flex items-center gap-2.5">
            {/* Role Switcher Toolbar */}
            <div className="hidden lg:flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700 text-xs">
              <span className="px-2 text-slate-400 font-semibold uppercase text-[10px]">Role:</span>
              <button
                onClick={() => {
                  switchDemoRole('citizen');
                  navigate('/citizen/dashboard');
                }}
                className={`px-2 py-1 rounded transition cursor-pointer font-medium ${
                  currentUser.role === 'citizen'
                    ? 'bg-sky-700 text-white font-bold shadow-sm'
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
                className={`px-2 py-1 rounded transition cursor-pointer font-medium ${
                  currentUser.role === 'officer'
                    ? 'bg-slate-700 text-white font-bold shadow-sm'
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
                className={`px-2 py-1 rounded transition cursor-pointer font-medium ${
                  currentUser.role === 'worker'
                    ? 'bg-amber-600 text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Worker
              </button>
            </div>

            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Theme Switcher Toggle */}
            <ThemeSwitcher />

            {/* Chat Assistant trigger */}
            {onOpenChat && (
              <button
                onClick={onOpenChat}
                title="Open CivicAI Assistant"
                className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer border border-slate-700"
              >
                <Bot className="w-4 h-4 text-sky-400" />
              </button>
            )}

            {/* Notification Bell */}
            <Link
              to="/notifications"
              className="relative p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition border border-slate-700"
              title="View in-app notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded bg-rose-600 text-[10px] font-bold text-white">
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </span>
              )}
            </Link>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <Link to="/citizen/profile" className="flex items-center gap-2 hover:opacity-90">
                <div className="w-7 h-7 rounded-md bg-slate-800 flex items-center justify-center font-bold text-xs text-sky-400 border border-slate-700">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <p className="font-semibold text-white leading-tight truncate max-w-[110px]">
                    {currentUser.name}
                  </p>
                  <p className="text-slate-400 text-[10px] capitalize">{currentUser.role}</p>
                </div>
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                title="Log out / switch account"
                className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs text-slate-400">Current Role:</span>
            {getRoleBadge()}
          </div>

          <div className="grid grid-cols-3 gap-1 bg-slate-800 p-1 rounded-md text-center text-xs">
            <button
              onClick={() => {
                switchDemoRole('citizen');
                navigate('/citizen/dashboard');
                setMobileMenuOpen(false);
              }}
              className={`py-1.5 rounded-md font-semibold ${
                currentUser.role === 'citizen' ? 'bg-sky-700 text-white' : 'text-slate-300'
              }`}
            >
              Citizen
            </button>
            <button
              onClick={() => {
                switchDemoRole('officer');
                navigate('/officer/dashboard');
                setMobileMenuOpen(false);
              }}
              className={`py-1.5 rounded-md font-semibold ${
                currentUser.role === 'officer' ? 'bg-slate-700 text-white' : 'text-slate-300'
              }`}
            >
              Officer
            </button>
            <button
              onClick={() => {
                switchDemoRole('worker');
                navigate('/worker/dashboard');
                setMobileMenuOpen(false);
              }}
              className={`py-1.5 rounded-md font-semibold ${
                currentUser.role === 'worker' ? 'bg-amber-600 text-white' : 'text-slate-300'
              }`}
            >
              Worker
            </button>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Theme:</span>
            <ThemeSwitcher variant="segmented" />
          </div>

          <nav className="flex flex-col gap-1 text-sm font-medium pt-2">
            {currentUser.role === 'citizen' && (
              <>
                <Link
                  to="/citizen/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200"
                >
                  Citizen Dashboard
                </Link>
                <Link
                  to="/citizen/report"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md bg-sky-700 text-white font-bold flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" /> Report Civic Issue
                </Link>
                <Link
                  to="/citizen/complaints"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200"
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
                  className="px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200"
                >
                  Officer Dashboard
                </Link>
                <Link
                  to="/officer/management"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200"
                >
                  Complaint Queue
                </Link>
                <Link
                  to="/officer/assignment"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200"
                >
                  Worker Dispatch
                </Link>
              </>
            )}

            {currentUser.role === 'worker' && (
              <Link
                to="/worker/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200"
              >
                My Work Orders
              </Link>
            )}

            <Link
              to="/map"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200 flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-sky-400" /> Smart City Map
            </Link>
            <Link
              to="/analytics"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200 flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-sky-400" /> Civic Analytics
            </Link>
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200 flex items-center gap-2"
            >
              <Settings className="w-4 h-4 text-sky-400" /> System Settings & Domain
            </Link>
            <Link
              to="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200 flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-slate-400" /> Privacy Policy
            </Link>
            <Link
              to="/terms"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200 flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-slate-400" /> Terms and Conditions
            </Link>
            <Link
              to="/notifications"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-sky-400" /> Notifications
              </span>
              {unreadNotificationCount > 0 && (
                <span className="px-2 py-0.5 rounded bg-rose-600 text-xs font-bold text-white">
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
