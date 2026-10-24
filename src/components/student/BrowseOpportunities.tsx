import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { evaluateEligibility } from '../../services/eligibilityEngine';
import { JobOpportunity } from '../../types';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  Calendar,
  Briefcase,
  MapPin,
  Clock,
  Sparkles,
  ArrowUpDown,
  Check,
} from 'lucide-react';

interface BrowseOpportunitiesProps {
  onNavigate: (view: string, param?: string) => void;
}

export const BrowseOpportunities: React.FC<BrowseOpportunitiesProps> = ({ onNavigate }) => {
  const { studentProfile } = useAuth();
  const jobs = storage.getJobs();
  const companies = storage.getCompanies();
  const applications = studentProfile
    ? storage.getApplicationsByStudent(studentProfile.id)
    : [];

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'eligible' | 'applied' | 'shortlisted' | 'closed'>('all');
  const [selectedJobType, setSelectedJobType] = useState<string>('all');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'deadline' | 'company' | 'salary'>('newest');

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const comp = storage.getCompanyById(job.companyId);
      const companyName = comp?.name || '';
      const matchesSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        companyName.toLowerCase().includes(search.toLowerCase()) ||
        job.requiredSkills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

      if (!matchesSearch) return false;

      // Filter by type
      if (selectedJobType !== 'all' && job.jobType !== selectedJobType) return false;
      if (selectedWorkMode !== 'all' && job.workMode !== selectedWorkMode) return false;

      // Tabs filter
      const hasApplied = applications.some((a) => a.jobOpportunityId === job.id);
      const app = applications.find((a) => a.jobOpportunityId === job.id);

      if (activeTab === 'closed') {
        return job.status === 'closed';
      }

      // For other tabs, only published
      if (job.status !== 'published') return false;

      if (activeTab === 'applied') return hasApplied;
      if (activeTab === 'shortlisted') {
        return (
          hasApplied &&
          app &&
          ['Shortlisted', 'Assessment Scheduled', 'Technical Round', 'HR Round', 'Selected', 'Offer Released', 'Offer Accepted'].includes(
            app.currentStatus
          )
        );
      }

      if (activeTab === 'eligible' && studentProfile) {
        const evalRes = evaluateEligibility(studentProfile, job.eligibilityRules);
        return evalRes.isEligible;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'deadline') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortBy === 'company') {
        const compA = storage.getCompanyById(a.companyId)?.name || '';
        const compB = storage.getCompanyById(b.companyId)?.name || '';
        return compA.localeCompare(compB);
      }
      return 0;
    });
  }, [jobs, search, activeTab, selectedJobType, selectedWorkMode, sortBy, applications, studentProfile]);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Campus Placement Opportunities
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse published corporate drives, check criteria with our automated eligibility engine, and apply.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl dark:bg-slate-800 self-start md:self-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Jobs' },
            { id: 'eligible', label: 'Eligible for Me' },
            { id: 'applied', label: 'Applied' },
            { id: 'shortlisted', label: 'Shortlisted' },
            { id: 'closed', label: 'Closed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search company, job role, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <div>
          <select
            value={selectedJobType}
            onChange={(e) => setSelectedJobType(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="all">All Job Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Internship">Internship</option>
            <option value="Internship-to-PPO">Internship-to-PPO</option>
            <option value="Trainee">Trainee</option>
          </select>
        </div>

        <div>
          <select
            value={selectedWorkMode}
            onChange={(e) => setSelectedWorkMode(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="all">All Work Modes</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="deadline">Sort: Deadline Soonest</option>
            <option value="company">Sort: Company Name</option>
          </select>
        </div>
      </div>

      {/* Job Cards Grid */}
      {filteredJobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No matching opportunities found
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search keywords, clear filters, or check the 'All Jobs' tab.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => {
            const comp = storage.getCompanyById(job.companyId);
            const appliedApp = applications.find((a) => a.jobOpportunityId === job.id);
            const applicantTotal = storage.getApplicationsByJob(job.id).length;

            let evalResult = null;
            if (studentProfile) {
              evalResult = evaluateEligibility(studentProfile, job.eligibilityRules);
            }

            return (
              <div
                key={job.id}
                onClick={() => onNavigate('job_detail', job.id)}
                className="group cursor-pointer flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
              >
                <div>
                  {/* Top Bar inside Card: Logo + Eligibility Pill */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 p-1.5 dark:bg-slate-800 dark:border-slate-700">
                      <img
                        src={comp?.logo || 'https://www.google.com/favicon.ico'}
                        alt={comp?.name}
                        className="h-7 w-7 object-contain"
                      />
                    </div>

                    {/* Eligibility Badge */}
                    {appliedApp ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                        <Check className="h-3 w-3" />
                        Applied · {appliedApp.currentStatus}
                      </span>
                    ) : evalResult ? (
                      evalResult.isEligible ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                          <CheckCircle2 className="h-3 w-3" />
                          Eligible
                        </span>
                      ) : evalResult.status === 'Review Required' ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                          <AlertCircle className="h-3 w-3" />
                          Review Required
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                          <XCircle className="h-3 w-3" />
                          Ineligible
                        </span>
                      )
                    ) : null}
                  </div>

                  {/* Job Title & Company */}
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                    {comp?.name}
                  </p>

                  {/* Key Metadata Row */}
                  <div className="mt-3 flex flex-wrap items-center gap-y-1 gap-x-2.5 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.workMode} ({job.location})
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {job.jobType}
                    </span>
                  </div>

                  {/* CTC / Stipend */}
                  <div className="mt-3 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Compensation:</span>
                    <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                      {job.compensation.salaryRange}
                    </span>
                  </div>

                  {/* Academic Requirements snippet */}
                  <div className="mt-3 space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                    <p>
                      <span className="text-slate-400">Min CGPA:</span>{' '}
                      <span className="font-semibold font-mono text-slate-700 dark:text-slate-200">
                        {job.eligibilityRules.minCgpa}
                      </span>{' '}
                      · <span className="text-slate-400">Backlogs:</span>{' '}
                      <span className="font-semibold">
                        {job.eligibilityRules.allowActiveBacklogs ? 'Allowed' : 'Strict 0'}
                      </span>
                    </p>
                    <p className="truncate">
                      <span className="text-slate-400">Branches:</span>{' '}
                      {job.eligibilityRules.eligibleBranches.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Footer of Card: Deadline & Applicant Count */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="h-3 w-3 text-slate-400" />
                    Deadline: {new Date(job.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>

                  {job.showApplicantCountToStudents && (
                    <span className="tabular-nums font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                      {applicantTotal} applied
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
