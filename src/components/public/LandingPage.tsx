import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import {
  GraduationCap,
  Building2,
  CheckCircle2,
  ShieldCheck,
  FileSpreadsheet,
  Download,
  Users,
  BarChart3,
  CalendarCheck,
  ArrowRight,
  Sparkles,
  Search,
  Briefcase,
  Lock,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenAuth }) => {
  const { loginAsAdmin, loginAsStudent } = useAuth();

  const companies = storage.getCompanies();
  const jobs = storage.getJobs();
  const students = storage.getStudents();
  const applications = storage.getApplications();

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Quick Access Demo Banner */}
      <div className="border-b border-indigo-100 bg-indigo-50/80 px-4 py-2.5 text-center text-xs dark:border-indigo-900/40 dark:bg-indigo-950/40">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 font-medium text-indigo-900 dark:text-indigo-200">
          <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>Interactive Live Demo — Experience CampusHire OS instantly:</span>
          <button
            onClick={() => {
              loginAsAdmin();
              onNavigate('admin_dashboard');
            }}
            className="rounded-md bg-indigo-600 px-2.5 py-0.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
          >
            Launch as Admin (Placement Cell)
          </button>
          <span className="text-slate-400">or</span>
          <button
            onClick={() => {
              loginAsStudent();
              onNavigate('student_dashboard');
            }}
            className="rounded-md bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
          >
            Launch as Student (Aarav Patel)
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-16 pb-20 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            2026 Campus Recruitment Season Live
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
            One platform.{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Every opportunity.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            CampusHire OS transforms college placements with automated eligibility validation,
            company-wise applicant tracking, one-click PDF reports, and real-time recruitment analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                loginAsAdmin();
                onNavigate('admin_dashboard');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
            >
              <ShieldCheck className="h-4 w-4" />
              Explore Admin Control Center
            </button>
            <button
              onClick={() => {
                loginAsStudent();
                onNavigate('student_opportunities');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-all"
            >
              <Search className="h-4 w-4" />
              Browse Student Opportunities
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6 border-y border-slate-200 py-8 dark:border-slate-800">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {students.length}+
            </p>
            <p className="text-xs text-slate-500 mt-1">Verified Students</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
              {companies.length}
            </p>
            <p className="text-xs text-slate-500 mt-1">Recruiting Companies</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
              {jobs.filter((j) => j.status === 'published').length}
            </p>
            <p className="text-xs text-slate-500 mt-1">Active Job Openings</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono tabular-nums">
              {applications.length}
            </p>
            <p className="text-xs text-slate-500 mt-1">Applications Processed</p>
          </div>
        </div>
      </section>

      {/* Featured Companies Logo Marquee */}
      <section className="border-b border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6">
            Trusted by Top Tier-1 Tech, Fintech & Consulting Recruiters
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-80">
            {companies.slice(0, 8).map((comp) => (
              <div key={comp.id} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-semibold text-sm">
                <img src={comp.logo} alt={comp.name} className="h-5 w-5 object-contain" />
                <span>{comp.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Platform Capabilities */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Purpose-Built Architecture
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Everything a Placement Cell & Student Body Needs
          </p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Engineered to replace scattered spreadsheets, late email notices, and manual verification errors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-indigo-300 transition-colors dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 mb-5">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Deterministic Eligibility Engine
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Automated multi-factor verification evaluating CGPA, 10th/12th marks, diploma streams,
              graduation year, active backlogs, and branch eligibility with human-readable diagnostic feedback.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-indigo-300 transition-colors dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 mb-5">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Company-Wise Applicant Management
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Dedicated candidate tracking per recruitment drive. Search, filter by CGPA/branch,
              execute bulk status transitions, and inspect applicant profile snapshots with verified data.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-indigo-300 transition-colors dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mb-5">
              <Download className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Official PDF & CSV Report Generator
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Export institutional-grade A4 PDF reports with verified academic credentials, repeated headers,
              confidentiality seals, and CSV sheets ready to hand over directly to HR panels.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-indigo-300 transition-colors dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 mb-5">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recruitment Timeline & Rounds
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Schedule coding challenges, technical onsite interviews, and HR rounds.
              Automatic slot clash detection and meeting link distribution to candidates.
            </p>
          </div>

          {/* Card 5 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-indigo-300 transition-colors dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 mb-5">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Executive Analytics & Placement Funnel
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Monitor placement conversion percentage, department hiring ratios, package distributions,
              and monthly recruitment velocity with interactive visual charts.
            </p>
          </div>

          {/* Card 6 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-indigo-300 transition-colors dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 mb-5">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              AI Job Description Parser
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Paste arbitrary corporate PDF/Email job circulars and let our AI parser extract structured
              eligibility criteria, required skills, and round formats ready for placement officer review.
            </p>
          </div>
        </div>
      </section>

      {/* Role Comparison Table: Students vs Placement Cell */}
      <section className="bg-slate-100/60 py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-200 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Tailored Experiences for Both Stakeholders
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Role-based access control guarantees privacy, auditability, and ease of use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Student Side */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">For Students</h3>
                  <p className="text-xs text-slate-500">Fast, transparent, and fair access to careers</p>
                </div>
              </div>

              <ul className="mt-6 space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Single verified profile covering 10th, 12th, diploma, CGPA, backlogs, projects, and resume.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Real-time eligibility badge showing exact reasons if ineligible (e.g. Min CGPA 8.0 vs your 7.8).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>One-click application with immutable profile snapshot preservation.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Full interview stage tracker and personalized AI interview prep roadmap.</span>
                </li>
              </ul>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    loginAsStudent();
                    onNavigate('student_dashboard');
                  }}
                  className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                >
                  Enter Student Portal
                </button>
              </div>
            </div>

            {/* Admin Side */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">For Placement Officers</h3>
                  <p className="text-xs text-slate-500">Unmatched control, data integrity, and compliance</p>
                </div>
              </div>

              <ul className="mt-6 space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>Create companies, define custom eligibility matrices, and publish job circulars.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>Company-wise applicant grid with instant multi-column search, filters, and bulk status updates.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>Server-generated official A4 PDF & CSV applicant lists with repeat headers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>Complete audit logs for every company creation, job status shift, and export event.</span>
                </li>
              </ul>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    loginAsAdmin();
                    onNavigate('admin_dashboard');
                  }}
                  className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
                >
                  Enter Placement Officer Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <footer className="border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">CampusHire OS</span>
            <span>— Smart College Placement Management Platform</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('admin_dashboard')} className="hover:text-indigo-600 transition-colors">
              Admin Portal
            </button>
            <button onClick={() => onNavigate('student_dashboard')} className="hover:text-indigo-600 transition-colors">
              Student Portal
            </button>
            <button onClick={() => onOpenAuth('register')} className="hover:text-indigo-600 transition-colors">
              Student Registration
            </button>
            <button onClick={() => onNavigate('admin_audit')} className="hover:text-indigo-600 transition-colors">
              Audit Trails
            </button>
          </div>

          <p>© 2026 CampusHire OS. Engineered for Excellence.</p>
        </div>
      </footer>
    </div>
  );
};
