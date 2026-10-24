import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { ApplicationStatus } from '../../types';
import confetti from 'canvas-confetti';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  Calendar,
  AlertCircle,
  Ban,
  PartyPopper,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface MyApplicationsProps {
  onNavigate: (view: string, param?: string) => void;
}

export const MyApplications: React.FC<MyApplicationsProps> = ({ onNavigate }) => {
  const { studentProfile } = useAuth();

  if (!studentProfile) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        Please sign in with a student profile.
      </div>
    );
  }

  const applications = storage.getApplicationsByStudent(studentProfile.id);
  const [filter, setFilter] = useState<string>('all');

  const filteredApps = applications.filter((app) => {
    if (filter === 'all') return true;
    if (filter === 'active') {
      return !['Rejected', 'Withdrawn', 'Offer Accepted'].includes(app.currentStatus);
    }
    if (filter === 'offers') {
      return ['Offer Released', 'Offer Accepted'].includes(app.currentStatus);
    }
    return app.currentStatus.toLowerCase() === filter.toLowerCase();
  });

  const handleWithdraw = (appId: string) => {
    if (window.confirm('Are you certain you want to withdraw this application? This action will be recorded in the audit trail.')) {
      storage.withdrawApplication(appId);
    }
  };

  const handleAcceptOffer = (appId: string) => {
    storage.updateApplicationStatus(appId, 'Offer Accepted');
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Placement Applications ({applications.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track recruitment round milestones, assessments, and offer releases in real time.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl dark:bg-slate-800 self-start sm:self-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'active', label: 'In Progress' },
            { id: 'offers', label: 'Offers' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === f.id
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No applications found in this category
          </p>
          <button
            onClick={() => onNavigate('student_opportunities')}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Browse Eligible Opportunities
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const job = storage.getJobById(app.jobOpportunityId);
            const comp = job ? storage.getCompanyById(job.companyId) : undefined;
            const isOffer = app.currentStatus === 'Offer Released';
            const isAccepted = app.currentStatus === 'Offer Accepted';

            return (
              <div
                key={app.id}
                className={`rounded-2xl border bg-white p-5 shadow-xs transition-all dark:bg-slate-900 ${
                  isOffer
                    ? 'border-emerald-300 ring-2 ring-emerald-500/20 dark:border-emerald-700'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Header row inside card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 p-1.5 dark:bg-slate-800 dark:border-slate-700">
                      <img
                        src={comp?.logo || 'https://www.google.com/favicon.ico'}
                        alt={comp?.name}
                        className="h-7 w-7 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {job?.title || 'Position'}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {comp?.name} · <span className="font-mono text-slate-400">ID: {app.id}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                        isAccepted
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : isOffer
                          ? 'bg-emerald-600 text-white animate-bounce'
                          : app.currentStatus === 'Rejected'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                          : app.currentStatus === 'Withdrawn'
                          ? 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                          : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300'
                      }`}
                    >
                      {app.currentStatus}
                    </span>
                  </div>
                </div>

                {/* Offer Callout Banner if Offer Released */}
                {isOffer && (
                  <div className="my-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-2.5">
                      <PartyPopper className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-emerald-900 dark:text-emerald-100">
                          Congratulations! Placement Offer Released
                        </p>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                          {comp?.name} has extended an official employment offer for {job?.compensation.salaryRange}.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAcceptOffer(app.id)}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition-colors shrink-0"
                    >
                      Accept Employment Offer
                    </button>
                  </div>
                )}

                {/* Recruitment Rounds Timeline Pipeline */}
                {job && job.recruitmentRounds.length > 0 && (
                  <div className="mt-4 pt-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Recruitment Round Timeline:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {job.recruitmentRounds.map((rnd) => {
                        const isCompleted = app.currentRoundNumber > rnd.roundNumber;
                        const isCurrent = app.currentRoundNumber === rnd.roundNumber;

                        return (
                          <div
                            key={rnd.id}
                            className={`rounded-xl p-2.5 border text-xs ${
                              isCompleted
                                ? 'border-emerald-200 bg-emerald-50/50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200'
                                : isCurrent
                                ? 'border-indigo-300 bg-indigo-50/50 text-indigo-900 ring-1 ring-indigo-500/30 dark:border-indigo-800 dark:bg-indigo-950/20 dark:text-indigo-200'
                                : 'border-slate-100 bg-slate-50/50 text-slate-400 dark:border-slate-800 dark:bg-slate-800/20'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold">R{rnd.roundNumber}</span>
                              {isCompleted ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                              ) : isCurrent ? (
                                <Clock className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                              ) : null}
                            </div>
                            <p className="font-semibold truncate mt-1">{rnd.name}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer info: Submission timestamp and withdraw button */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span>
                      Applied: {new Date(app.appliedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span>·</span>
                    <button
                      onClick={() => onNavigate('job_detail', app.jobOpportunityId)}
                      className="text-indigo-600 hover:underline dark:text-indigo-400 inline-flex items-center gap-1"
                    >
                      <span>View Opportunity</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>

                  {!['Withdrawn', 'Rejected', 'Offer Accepted'].includes(app.currentStatus) && (
                    <button
                      onClick={() => handleWithdraw(app.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Ban className="h-3 w-3" />
                      Withdraw Application
                    </button>
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
