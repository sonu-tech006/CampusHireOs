import React, { useState } from 'react';
import { storage } from '../../services/storage';
import { ApplicationStatus, Application } from '../../types';
import { FileCheck, Search, Filter, ExternalLink, ArrowRight } from 'lucide-react';

interface ApplicationPipelineProps {
  onNavigate: (view: string, param?: string) => void;
}

export const ApplicationPipeline: React.FC<ApplicationPipelineProps> = ({ onNavigate }) => {
  const applications = storage.getApplications();
  const jobs = storage.getJobs();
  const companies = storage.getCompanies();

  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState('all');

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(search.toLowerCase()) ||
      app.studentRollNo.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedJob !== 'all' && app.jobOpportunityId !== selectedJob) return false;
    return true;
  });

  const stages: { status: ApplicationStatus; label: string; bg: string }[] = [
    { status: 'Applied', label: 'Applied', bg: 'border-blue-400 bg-blue-50/40 dark:bg-blue-950/20' },
    { status: 'Under Review', label: 'Screening', bg: 'border-slate-300 bg-slate-50/40 dark:bg-slate-800/20' },
    { status: 'Shortlisted', label: 'Shortlisted', bg: 'border-purple-400 bg-purple-50/40 dark:bg-purple-950/20' },
    { status: 'Technical Round', label: 'Technical', bg: 'border-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/20' },
    { status: 'Selected', label: 'Selected', bg: 'border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20' },
    { status: 'Offer Released', label: 'Offered', bg: 'border-emerald-500 bg-emerald-100/40 dark:bg-emerald-950/40' },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Centralized Recruitment Pipeline ({applications.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visual stage progression across all active companies and candidate pools.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="all">All Recruiting Companies</option>
            {jobs.map((j) => {
              const comp = storage.getCompanyById(j.companyId);
              return (
                <option key={j.id} value={j.id}>
                  {comp?.name} — {j.title}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Kanban / Multi-Column Stage Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const appsInStage = filteredApps.filter((a) => a.currentStatus === stage.status);

          return (
            <div
              key={stage.status}
              className={`rounded-2xl border p-3 flex flex-col h-[70vh] ${stage.bg} dark:border-slate-800`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5 mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {stage.label}
                </span>
                <span className="rounded-full bg-white dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 shadow-xs tabular-nums">
                  {appsInStage.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {appsInStage.map((app) => {
                  const job = storage.getJobById(app.jobOpportunityId);
                  const comp = job ? storage.getCompanyById(job.companyId) : undefined;
                  const snap = app.submittedProfileSnapshot;

                  return (
                    <div
                      key={app.id}
                      className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900 text-xs space-y-1.5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <p className="font-bold text-slate-900 dark:text-white truncate">
                          {app.studentName}
                        </p>
                        <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {snap.cgpa ? snap.cgpa.toFixed(1) : ''}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono truncate">
                        {app.studentRollNo} · {snap.department.split(' ')[0]}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {comp?.name}
                      </p>

                      <div className="pt-1 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-[10px]">
                        <span className="text-slate-400">
                          {new Date(app.appliedAt).toLocaleDateString([], { month: 'numeric', day: 'numeric' })}
                        </span>
                        <select
                          value={app.currentStatus}
                          onChange={(e) =>
                            storage.updateApplicationStatus(app.id, e.target.value as ApplicationStatus)
                          }
                          className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-[10px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Under Review">Screening</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Technical Round">Technical</option>
                          <option value="Selected">Selected</option>
                          <option value="Offer Released">Offer</option>
                          <option value="Rejected">Reject</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
