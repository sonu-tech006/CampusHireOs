import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { AuthModal } from './components/public/AuthModal';
import { LandingPage } from './components/public/LandingPage';
import { StudentDashboard } from './components/student/StudentDashboard';
import { BrowseOpportunities } from './components/student/BrowseOpportunities';
import { JobDetailPage } from './components/student/JobDetailPage';
import { StudentProfileView } from './components/student/StudentProfile';
import { MyApplications } from './components/student/MyApplications';
import { StudentInterviews } from './components/student/StudentInterviews';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CompanyManagement } from './components/admin/CompanyManagement';
import { JobManagement } from './components/admin/JobManagement';
import { ApplicantManagement } from './components/admin/ApplicantManagement';
import { StudentDirectory } from './components/admin/StudentDirectory';
import { ApplicationPipeline } from './components/admin/ApplicationPipeline';
import { AdminInterviews } from './components/admin/AdminInterviews';
import { PlacementAnalytics } from './components/admin/PlacementAnalytics';
import { AnnouncementsView } from './components/admin/AnnouncementsView';
import { AuditLogsView } from './components/admin/AuditLogsView';

const MainApp: React.FC = () => {
  const { user, role } = useAuth();

  // Navigation view state
  const [currentView, setCurrentView] = useState<string>(
    user ? (role === 'admin' ? 'admin_dashboard' : 'student_dashboard') : 'landing'
  );
  const [selectedJobId, setSelectedJobId] = useState<string>('');

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const handleNavigate = (view: string, param?: string) => {
    if (view === 'login') {
      setAuthModalTab('login');
      setIsAuthModalOpen(true);
      return;
    }
    if (view === 'register') {
      setAuthModalTab('register');
      setIsAuthModalOpen(true);
      return;
    }
    if (view === 'job_detail' && param) {
      setSelectedJobId(param);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalTab(mode);
    setIsAuthModalOpen(true);
  };

  const renderContent = () => {
    if (currentView === 'landing' && !user) {
      return <LandingPage onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} />;
    }

    switch (currentView) {
      // Student Views
      case 'student_dashboard':
        return <StudentDashboard onNavigate={handleNavigate} />;
      case 'student_opportunities':
      case 'opportunities':
        return <BrowseOpportunities onNavigate={handleNavigate} />;
      case 'job_detail':
        return <JobDetailPage jobId={selectedJobId} onNavigate={handleNavigate} />;
      case 'student_profile':
        return <StudentProfileView />;
      case 'student_applications':
        return <MyApplications onNavigate={handleNavigate} />;
      case 'student_interviews':
        return <StudentInterviews />;
      case 'student_announcements':
        return <AnnouncementsView />;

      // Admin Views
      case 'admin_dashboard':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'admin_companies':
        return <CompanyManagement onNavigate={handleNavigate} />;
      case 'admin_jobs':
        return <JobManagement onNavigate={handleNavigate} />;
      case 'admin_applicants':
        return <ApplicantManagement />;
      case 'admin_students':
        return <StudentDirectory />;
      case 'admin_pipeline':
        return <ApplicationPipeline onNavigate={handleNavigate} />;
      case 'admin_interviews':
        return <AdminInterviews />;
      case 'admin_analytics':
        return <PlacementAnalytics />;
      case 'admin_announcements':
        return <AnnouncementsView />;
      case 'admin_audit':
        return <AuditLogsView />;

      default:
        return user ? (
          role === 'admin' ? (
            <AdminDashboard onNavigate={handleNavigate} />
          ) : (
            <StudentDashboard onNavigate={handleNavigate} />
          )
        ) : (
          <LandingPage onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--app-bg)] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onNavigate={handleNavigate}
        currentView={currentView}
      />

      {/* Main Workspace Canvas with Responsive Layout */}
      <div className="flex flex-1">
        {user && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            currentView={currentView}
            onNavigate={handleNavigate}
          />
        )}

        <main className="flex-1 min-w-0 pb-16">
          {renderContent()}
        </main>
      </div>

      {/* Drawers & Modals */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onNavigate={handleNavigate}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
        onSuccess={(view) => {
          handleNavigate(view);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
