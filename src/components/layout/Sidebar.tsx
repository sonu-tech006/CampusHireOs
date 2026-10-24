import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Users,
  FileSpreadsheet,
  CalendarDays,
  BarChart3,
  Megaphone,
  History,
  UserCircle,
  FileCheck2,
  Sparkles,
  X,
  Compass,
  GraduationCap,
  Shield,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentView,
  onNavigate,
}) => {
  const { role, user, studentProfile } = useAuth();

  const applications = storage.getApplications();
  const jobs = storage.getJobs();
  const students = storage.getStudents();

  const studentApps = studentProfile
    ? storage.getApplicationsByStudent(studentProfile.id)
    : [];

  interface NavItem {
    id: string;
    label: string;
    icon: any;
    badge?: number;
    highlight?: boolean;
    subtitle?: string;
  }

  const adminNav: NavItem[] = [
    { id: 'admin_dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin_companies', label: 'Companies', icon: Building2, badge: storage.getCompanies().length },
    { id: 'admin_jobs', label: 'Job Openings', icon: Briefcase, badge: jobs.filter((j) => j.status === 'published').length },
    { id: 'admin_applicants', label: 'Applicant Management', icon: FileSpreadsheet, badge: applications.length, highlight: true },
    { id: 'admin_students', label: 'Student Directory', icon: Users, badge: students.length },
    { id: 'admin_pipeline', label: 'Recruitment Pipeline', icon: FileCheck2 },
    { id: 'admin_interviews', label: 'Interview Schedules', icon: CalendarDays },
    { id: 'admin_analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'admin_announcements', label: 'Announcements', icon: Megaphone },
    { id: 'admin_audit', label: 'Audit Logs', icon: History },
  ];

  const studentNav: NavItem[] = [
    { id: 'student_dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'student_opportunities', label: 'Browse Opportunities', icon: Compass, badge: jobs.filter((j) => j.status === 'published').length },
    { id: 'student_applications', label: 'My Applications', icon: FileCheck2, badge: studentApps.length },
    { id: 'student_interviews', label: 'Interview Schedule', icon: CalendarDays },
    { id: 'student_profile', label: 'My Profile', icon: UserCircle, subtitle: `${studentProfile?.profileCompletion || 0}% complete` },
    { id: 'student_announcements', label: 'Notices & Bulletins', icon: Megaphone },
  ];

  const navItems = role === 'admin' ? adminNav : studentNav;

  const handleItemClick = (id: string) => {
    onNavigate(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">CampusHire OS</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Institution Brand Badge */}
        <div className="hidden lg:flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-indigo-700 dark:bg-slate-800 dark:text-indigo-400">
            {role === 'admin' ? <Shield className="h-5 w-5" /> : <GraduationCap className="h-5 w-5" />}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
              Apex Institute of Technology
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {role === 'admin' ? 'Placement Cell Operations' : `Batch of ${studentProfile?.graduationYear || 2026}`}
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {role === 'admin' ? 'Placement Officer Console' : 'Student Career Center'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                    }`}
                  />
                  <div className="text-left truncate">
                    <span className="truncate block">{item.label}</span>
                    {item.subtitle && (
                      <span className={`text-[10px] block ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`ml-2 shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold tabular-nums ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.highlight
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Student Profile Completion Bar in Sidebar */}
        {role === 'student' && studentProfile && (
          <div className="p-4 mx-3 mb-3 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
              <span>Profile Status</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold tabular-nums">
                {studentProfile.profileCompletion}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden dark:bg-slate-700">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${studentProfile.profileCompletion}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              {studentProfile.profileCompletion === 100
                ? 'Your profile is 100% verified.'
                : 'Complete all sections for priority recruiter screening.'}
            </p>
          </div>
        )}

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center">
          <p className="font-semibold text-slate-600 dark:text-slate-300">CampusHire OS v2.4</p>
          <p className="text-[10px]">One platform. Every opportunity.</p>
        </div>
      </aside>
    </>
  );
};
