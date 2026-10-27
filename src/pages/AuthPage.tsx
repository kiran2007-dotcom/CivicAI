import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ShieldAlert,
  User,
  Building2,
  HardHat,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isRegisterParam = searchParams.get('mode') === 'register';
  const [isRegister, setIsRegister] = useState(isRegisterParam);

  const [role, setRole] = useState<UserRole>('citizen');
  const [email, setEmail] = useState('citizen@civicai.demo');
  const [password, setPassword] = useState('Citizen123!');
  const [name, setName] = useState('Kiran Manjunath');
  const [department, setDepartment] = useState('Road Maintenance');
  const [error, setError] = useState<string | null>(null);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setError(null);
    if (!isRegister) {
      if (selectedRole === 'citizen') {
        setEmail('citizen@civicai.demo');
        setPassword('Citizen123!');
      } else if (selectedRole === 'officer') {
        setEmail('officer@civicai.demo');
        setPassword('Officer123!');
      } else {
        setEmail('worker@civicai.demo');
        setPassword('Worker123!');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isRegister) {
      const res = register(name, email, role, department);
      if (res.success) {
        redirectToDashboard(role);
      } else {
        setError(res.error || 'Failed to register account.');
      }
    } else {
      const res = login(email, password);
      if (res.success) {
        redirectToDashboard(role);
      } else {
        setError(res.error || 'Login failed. Please verify demo credentials.');
      }
    }
  };

  const redirectToDashboard = (userRole: UserRole) => {
    if (userRole === 'citizen') navigate('/citizen/dashboard');
    else if (userRole === 'officer') navigate('/officer/dashboard');
    else navigate('/worker/dashboard');
  };

  const handleOneClickDemo = (demoRole: UserRole) => {
    handleRoleSelect(demoRole);
    let demoEmail = 'citizen@civicai.demo';
    let demoPass = 'Citizen123!';
    if (demoRole === 'officer') {
      demoEmail = 'officer@civicai.demo';
      demoPass = 'Officer123!';
    } else if (demoRole === 'worker') {
      demoEmail = 'worker@civicai.demo';
      demoPass = 'Worker123!';
    }
    const res = login(demoEmail, demoPass);
    if (res.success) {
      redirectToDashboard(demoRole);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-extrabold text-white">
          {isRegister ? 'Create your CivicAI Account' : 'Sign in to CivicAI'}
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Smart Citizen Platform • Select a role to test role-based access
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        {/* Staging & Verified Profile Quick-Logins */}
        <div className="mb-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Preconfigured Municipal Role Profiles:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleOneClickDemo('citizen')}
              className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-800/60 hover:border-cyan-500 text-left transition cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs">
                <User className="w-3.5 h-3.5" /> Citizen
              </div>
              <p className="text-[10px] text-slate-400 mt-1 truncate">citizen@civicai.demo</p>
              <span className="text-[10px] text-cyan-300 font-semibold group-hover:underline mt-0.5 block">
                Instant Login →
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleOneClickDemo('officer')}
              className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-800/60 hover:border-indigo-500 text-left transition cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-xs">
                <Building2 className="w-3.5 h-3.5" /> Officer
              </div>
              <p className="text-[10px] text-slate-400 mt-1 truncate">officer@civicai.demo</p>
              <span className="text-[10px] text-indigo-300 font-semibold group-hover:underline mt-0.5 block">
                Instant Login →
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleOneClickDemo('worker')}
              className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/60 hover:border-amber-500 text-left transition cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                <HardHat className="w-3.5 h-3.5" /> Worker
              </div>
              <p className="text-[10px] text-slate-400 mt-1 truncate">worker@civicai.demo</p>
              <span className="text-[10px] text-amber-300 font-semibold group-hover:underline mt-0.5 block">
                Instant Login →
              </span>
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 sm:px-10 rounded-2xl shadow-xl">
          {/* Role Selection Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-300 mb-2">Select User Persona</label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => handleRoleSelect('citizen')}
                className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'citizen'
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" /> Citizen
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('officer')}
                className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'officer'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Officer
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('worker')}
                className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'worker'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <HardHat className="w-3.5 h-3.5" /> Worker
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-300">Password</label>
                <span className="text-[10px] text-slate-500">
                  Demo: {role === 'citizen' ? 'Citizen123!' : role === 'officer' ? 'Officer123!' : 'Worker123!'}
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {isRegister && role === 'worker' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Road Maintenance">Road Maintenance</option>
                  <option value="Sanitation Department">Sanitation Department</option>
                  <option value="Water Supply Department">Water Supply Department</option>
                  <option value="Electrical Department">Electrical Department</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isRegister ? 'Register & Enter Portal' : 'Sign In as ' + role.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
            >
              {isRegister
                ? 'Already have demo credentials? Sign in'
                : "Need a custom user profile? Register new account"}
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-500">
          Demo credentials are for demonstration and judging only.
        </p>
      </div>
    </div>
  );
};
