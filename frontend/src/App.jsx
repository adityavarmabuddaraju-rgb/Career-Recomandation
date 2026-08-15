import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AnalysisProvider } from './context/AnalysisContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CareerDiscoveryPage from './pages/CareerDiscoveryPage';
import CareerExplorerPage from './pages/CareerExplorerPage';
import CareerDetailPage from './pages/CareerDetailPage';
import CompareCareerPage from './pages/CompareCareerPage';
import MySkillsPage from './pages/MySkillsPage';
import MyCareersPage from './pages/MyCareersPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AnalysisProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/career-assessment" element={<CareerDiscoveryPage />} />
              {/* Legacy route aliases */}
              <Route path="/career-discovery" element={<CareerDiscoveryPage />} />
              {/* New pages */}
              <Route path="/career-explorer" element={<CareerExplorerPage />} />
              <Route path="/career/:slug" element={<CareerDetailPage />} />
              <Route path="/compare-careers" element={<CompareCareerPage />} />
              <Route path="/my-skills" element={<MySkillsPage />} />
              <Route path="/my-careers" element={<MyCareersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              {/* Legacy redirect aliases */}
              <Route path="/careers" element={<Navigate to="/career-explorer" replace />} />
              <Route path="/career-discovery" element={<CareerDiscoveryPage />} />
              <Route path="/compare" element={<Navigate to="/compare-careers" replace />} />
            </Route>
          </Routes>
        </AnalysisProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
