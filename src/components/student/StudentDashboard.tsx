import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { evaluateEligibility } from '../../services/eligibilityEngine';
import {
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Clock,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Building2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (view: string, param?: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { studentProfile } = useAuth();

  if (!studentProfile) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">Please sign in with a student profile.</p>
      </div>
    );
  }

  const jobs = storage.getJobs().filter((j) => j.status === 'published');
  const companies = storage.getCompanies();
  const applications = storage.getApplicationsByStudent(studentProfile.id);
  const interviews = storage.getInterviews().filter((i) => i.studentId === studentProfile.id);

  // Evaluate eligibility across published jobs
  const eligibleJobs = jobs.filter((job) => {
    const res = evaluateEligibility(studentProfile, job.eligibilityRules);
    return res.isEligible;
  });

  const shortlistedApps = applications.filter(
    (a) =>
      a.currentStatus === 'Shortlisted' ||
      a.currentStatus === 'Assessment Scheduled' ||
      a.currentStatus === 'Technical Round' ||
      a.currentStatus === 'HR Round' ||
      a.currentStatus === 'Selected' ||
      a.currentStatus === 'Offer Released' ||
      a.currentStatus === 'Offer Accepted'
  );

  const underReviewApps = applications.filter((a) => a.currentStatus === 'Under Review' || a.currentStatus === 'Applied');

  // Identify upcoming deadlines (next 7 days)
  const now = new Date();
  const upcomingDeadlines = jobs.filter((job) => {
    const d = new Date(job.deadline);
    const diffDays = (d.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diffDays >= 0 && diffDays <= 7;
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 text-white shadow-md dark:border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-0.5 text-xs text-indigo-200">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>{studentProfile.department} · {studentProfile.course} ({studentProfile.graduationYear})</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {studentProfile.name.split(' ')[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
              Your registered CGPA is{' '}
              <span className="font-bold text-white font-mono tabular-nums">
                {studentProfile.academicRecords.currentCgpa}
              </span>{' '}
              with{' '}
              <span className="font-bold text-white font-mono tabular-nums">
                {studentProfile.academicRecords.activeBacklogs}
              </span>{' '}
              active backlogs. You qualify for{' '}
              <span className="font-bold text-emerald-300 font-mono tabular-nums">
                {eligibleJobs.length}
              </span>{' '}
              active campus placement drives.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onNavigate('student_opportunities')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-indigo-900 hover:bg-indigo-50 shadow-xs transition-colors"
            >
              <Briefcase className="h-4 w-4" />
              Explore Eligible Jobs ({eligibleJobs.length})
            </button>
            <button
              onClick={() => onNavigate('student_profile')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Stat Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[11px] font-medium text-slate-500">Available Companies</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {companies.length}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <p className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300">Eligible Drives</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
            {eligibleJobs.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[11px] font-medium text-slate-500">Applications Sent</p>
          <p className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
            {applications.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[11px] font-medium text-slate-500">Under Review</p>
          <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
            {underReviewApps.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[11px] font-medium text-slate-500">Shortlisted</p>
          <p className="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400 font-mono tabular-nums">
            {shortlistedApps.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[11px] font-medium text-slate-500">Interviews</p>
          <p className="mt-1 text-2xl font-bold text-rose-600 dark:text-rose-400 font-mono tabular-nums">
            {interviews.length}
          </p>
        </div>
      </div>

      {/* Profile Completion Callout */}
      {studentProfile.profileCompletion < 100 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-xs font-mono">
              {studentProfile.profileCompletion}%
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Profile Completeness: {studentProfile.profileCompletion}%
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                {!studentProfile.resumeUrl
                  ? 'Add your updated Resume PDF for automatic recruiter matching.'
                  : studentProfile.projects.length === 0
                  ? 'Add at least 1 technical project to showcase your hands-on expertise.'
                  : 'Add your GitHub & LinkedIn profiles to maximize shortlist rate.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('student_profile')}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shrink-0"
          >
            Complete Profile
          </button>
        </div>
      )}

      {/* Main 2-Column Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Priority Opportunities & Recent Applications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Matching Opportunities */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Eligible Campus Drives For You
                </h2>
              </div>
              <button
                onClick={() => onNavigate('student_opportunities')}
                className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                <span>View all ({jobs.length})</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {eligibleJobs.slice(0, 4).map((job) => {
                const comp = storage.getCompanyById(job.companyId);
                const hasApplied = applications.some((a) => a.jobOpportunityId === job.id);

                return (
                  <div
                    key={job.id}
                    onClick={() => onNavigate('job_detail', job.id)}
                    className="group cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-800/40 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 p-1">
                        <img
                          src={comp?.logo || 'https://www.google.com/favicon.ico'}
                          alt={comp?.name}
                          className="h-6 w-6 object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span>{comp?.name}</span>
                          <span>·</span>
                          <span>{job.workMode}</span>
                          <span>·</span>
                          <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                            {job.compensation.salaryRange}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center">
                      {hasApplied ? (
                        <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                          Applied
                        </span>
                      ) : (
                        <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                          Eligible
                        </span>
                      )}
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Applications Activity */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                My Active Applications ({applications.length})
              </h2>
              <button
                onClick={() => onNavigate('student_applications')}
                className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                <span>Track stages</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {applications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                You haven't submitted any applications yet. Browse eligible companies to apply!
              </div>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 4).map((app) => {
                  const job = storage.getJobById(app.jobOpportunityId);
                  const comp = job ? storage.getCompanyById(job.companyId) : undefined;

                  return (
                    <div
                      key={app.id}
                      onClick={() => onNavigate('student_applications')}
                      className="cursor-pointer flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {job?.title || 'Position'}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {comp?.name} · Applied on {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {app.currentStatus}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Upcoming Deadlines & Interview Alert */}
        <div className="space-y-6">
          {/* Upcoming Interview Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Upcoming Interviews
              </h2>
            </div>

            {interviews.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">
                No interview rounds scheduled yet. You will be notified when companies shortlist your application.
              </p>
            ) : (
              <div className="space-y-3">
                {interviews.map((int) => (
                  <div
                    key={int.id}
                    className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 dark:border-amber-900/40 dark:bg-amber-950/20"
                  >
                    <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                      {int.roundName}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      {int.companyName}
                    </p>
                    <div className="mt-2 text-[11px] font-mono font-medium text-amber-800 dark:text-amber-300">
                      {new Date(int.startTime).toLocaleString()}
                    </div>
                    {int.locationOrMeetingLink && (
                      <a
                        href={int.locationOrMeetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2.5 inline-block text-[11px] font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        Join Meeting Link →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approaching Application Deadlines */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-rose-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Approaching Deadlines
              </h2>
            </div>

            <div className="space-y-2.5">
              {upcomingDeadlines.slice(0, 4).map((job) => {
                const comp = storage.getCompanyById(job.companyId);
                return (
                  <div
                    key={job.id}
                    onClick={() => onNavigate('job_detail', job.id)}
                    className="cursor-pointer flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[160px]">
                        {job.title}
                      </p>
                      <p className="text-[10px] text-slate-500">{comp?.name}</p>
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-rose-600 dark:text-rose-400">
                      {new Date(job.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
