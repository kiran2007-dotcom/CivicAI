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
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { Footer } from './components/Footer';

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

          {/* Legal & Governance Routes */}
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Civic Footer */}
      <Footer />

      {/* Floating CivicAI Chatbot Trigger Button - Restrained styling */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          title="Open CivicAI Municipal Assistant"
          className="fixed bottom-5 right-5 z-40 px-3.5 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2 border border-sky-600 focus-visible:outline-2"
        >
          <Bot className="w-4 h-4 text-cyan-300" />
          <span className="hidden sm:inline text-xs font-bold tracking-wide">
            Civic Assistant
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

import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <ComplaintsProvider>
            <AppContent />
          </ComplaintsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
