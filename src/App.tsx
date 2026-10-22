import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ComplaintsProvider } from './context/ComplaintsContext';
import { Navbar } from './components/Navbar';
import { CivicAIChatbot } from './components/CivicAIChatbot';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Bot } from 'lucide-react';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { ComplaintDetailsPage } from './pages/ComplaintDetailsPage';
import { MyComplaintsPage } from './pages/MyComplaintsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { CitizenProfilePage } from './pages/CitizenProfilePage';
import { OfficerDashboard } from './pages/OfficerDashboard';
import { ComplaintManagementPage } from './pages/ComplaintManagementPage';
import { ComplaintAssignmentPage } from './pages/ComplaintAssignmentPage';
import { WorkerDashboard } from './pages/WorkerDashboard';
import { ComplaintResolutionPage } from './pages/ComplaintResolutionPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { CityMapPage } from './pages/CityMapPage';

// Role Guard Component
const ProtectedRoute: React.FC<{
  allowedRoles?: ('citizen' | 'officer' | 'worker')[];
  children: React.ReactNode;
}> = ({ allowedRoles, children }) => {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to user's appropriate home dashboard
    if (currentUser.role === 'citizen') return <Navigate to="/citizen/dashboard" replace />;
    if (currentUser.role === 'officer') return <Navigate to="/officer/dashboard" replace />;
    return <Navigate to="/worker/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      <Navbar onOpenChat={() => setChatOpen(true)} />

      <main className="flex-1">
        <Routes>
          {/* Public / Landing */}
          <Route path="/" element={<LandingPage onOpenChat={() => setChatOpen(true)} />} />
          <Route path="/landing" element={<LandingPage onOpenChat={() => setChatOpen(true)} />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          {/* Citizen Routes */}
          <Route
            path="/citizen/dashboard"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'officer', 'worker']}>
                <CitizenDashboard onOpenChat={() => setChatOpen(true)} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/report"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'officer', 'worker']}>
                <ReportIssuePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/complaints"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'officer', 'worker']}>
                <MyComplaintsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/profile"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'officer', 'worker']}>
                <CitizenProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Officer Routes */}
          <Route
            path="/officer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['officer', 'citizen', 'worker']}>
                <OfficerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/management"
            element={
              <ProtectedRoute allowedRoles={['officer', 'citizen', 'worker']}>
                <ComplaintManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/assignment"
            element={
              <ProtectedRoute allowedRoles={['officer', 'citizen', 'worker']}>
                <ComplaintAssignmentPage />
              </ProtectedRoute>
            }
          />

          {/* Worker Routes */}
          <Route
            path="/worker/dashboard"
            element={
              <ProtectedRoute allowedRoles={['worker', 'officer', 'citizen']}>
                <WorkerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/resolve/:id"
            element={
              <ProtectedRoute allowedRoles={['worker', 'officer', 'citizen']}>
                <ComplaintResolutionPage />
              </ProtectedRoute>
            }
          />

          {/* Shared Routes */}
          <Route path="/complaint/:id" element={<ComplaintDetailsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/map" element={<CityMapPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Floating CivicAI Chatbot Trigger Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          title="Open CivicAI Municipal Assistant"
          className="fixed bottom-5 right-5 z-40 p-3.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-2xl shadow-cyan-500/30 hover:scale-105 transition-all cursor-pointer flex items-center gap-2 group"
        >
          <Bot className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline text-xs font-extrabold tracking-wide">
            CivicAI Assistant
          </span>
        </button>
      )}

      {/* Floating CivicAI Chatbot Modal */}
      <CivicAIChatbot isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      {/* Offline Status Awareness Banner */}
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ComplaintsProvider>
          <AppContent />
        </ComplaintsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
