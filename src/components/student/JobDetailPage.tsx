import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { evaluateEligibility } from '../../services/eligibilityEngine';
import { generateStudentInterviewPrep } from '../../services/gemini';
import confetti from 'canvas-confetti';
import {
  Building2,
  MapPin,
  Globe,
  Briefcase,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Sparkles,
  ArrowLeft,
  FileText,
  UserCheck,
  Send,
  X,
  Share2,
} from 'lucide-react';

interface JobDetailPageProps {
  jobId: string;
  onNavigate: (view: string, param?: string) => void;
}

export const JobDetailPage: React.FC<JobDetailPageProps> = ({ jobId, onNavigate }) => {
  const { studentProfile } = useAuth();
  const job = storage.getJobById(jobId);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [statement, setStatement] = useState('');
  const [answers, setAnswers] = useState<{ [qId: string]: string }>({});
  const [applyResult, setApplyResult] = useState<{ success?: boolean; message?: string } | null>(null);

  // AI Prep guide state
  const [isGeneratingAiPrep, setIsGeneratingAiPrep] = useState(false);
  const [aiPrepText, setAiPrepText] = useState<string | null>(null);

  if (!job) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">Job opportunity not found.</p>
        <button
          onClick={() => onNavigate('student_opportunities')}
          className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
        >
          Back to Opportunities
        </button>
      </div>
    );
  }

  const company = storage.getCompanyById(job.companyId);
  const applications = studentProfile ? storage.getApplicationsByStudent(studentProfile.id) : [];
  const existingApp = applications.find((a) => a.jobOpportunityId === job.id);

  // Run eligibility rules
  const evalResult = studentProfile
    ? evaluateEligibility(studentProfile, job.eligibilityRules)
    : null;

  const handleApplyConfirm = () => {
    if (!studentProfile) return;

    const formattedAnswers = (job.customQuestions || []).map((q) => ({
      questionId: q.id,
      question: q.question,
      answer: answers[q.id] || '',
    }));

    const result = storage.applyToJob({
      student: studentProfile,
      job,
      statementOfInterest: statement,
      answers: formattedAnswers,
    });

    setApplyResult(result);

    if (result.success) {
      // Trigger joyful confetti
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }
  };

  const handleGenerateAiPrep = async () => {
    if (!studentProfile) return;
    setIsGeneratingAiPrep(true);
    const advice = await generateStudentInterviewPrep(job, studentProfile);
    setAiPrepText(advice);
    setIsGeneratingAiPrep(false);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => onNavigate('student_opportunities')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Opportunities
      </button>

      {/* Hero Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 border border-slate-200 p-2 dark:bg-slate-800 dark:border-slate-700">
              <img
                src={company?.logo || 'https://www.google.com/favicon.ico'}
                alt={company?.name}
                className="h-10 w-10 object-contain"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {job.title}
                </h1>
                <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {job.jobType}
                </span>
              </div>
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                {company?.name} · <span className="text-slate-500">{company?.industry}</span>
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.workMode} ({job.location})
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-rose-500" />
                  Deadline: {new Date(job.deadline).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Block: Apply / Status Button */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-right">
              <p className="text-[11px] text-slate-400">Offered CTC / Compensation</p>
              <p className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                {job.compensation.salaryRange}
              </p>
            </div>

            {existingApp ? (
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-100 px-4 py-2.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  Application Submitted ({existingApp.currentStatus})
                </span>
                <span className="text-[10px] text-slate-400">ID: {existingApp.id}</span>
              </div>
            ) : evalResult?.isEligible ? (
              <button
                onClick={() => {
                  setApplyResult(null);
                  setIsApplyModalOpen(true);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
              >
                <Send className="h-4 w-4" />
                I'm Interested — Apply Now
              </button>
            ) : (
              <button
                disabled
                className="cursor-not-allowed rounded-xl bg-slate-200 px-6 py-3 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              >
                Ineligible to Apply
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ELIGIBILITY DIAGNOSTIC BANNER */}
      {evalResult && (
        <div
          className={`rounded-2xl border p-5 transition-all ${
            evalResult.isEligible
              ? 'border-emerald-200 bg-emerald-50/70 text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-100'
              : evalResult.status === 'Review Required'
              ? 'border-amber-200 bg-amber-50/70 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-100'
              : 'border-rose-200 bg-rose-50/70 text-rose-950 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-100'
          }`}
        >
          <div className="flex items-start gap-3.5">
            {evalResult.isEligible ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Automated Eligibility Status:
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                    evalResult.isEligible
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {evalResult.status}
                </span>
              </div>

              <p className="text-xs leading-relaxed font-medium">
                {evalResult.summary}
              </p>

              {/* Conditions Breakdown */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-black/5 dark:border-white/5 text-[11px]">
                <div>
                  <p className="font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
                    Criteria Satisfied:
                  </p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {evalResult.passedConditions.map((cond, idx) => (
                      <li key={idx}>{cond}</li>
                    ))}
                  </ul>
                </div>

                {evalResult.failedConditions.length > 0 && (
                  <div>
                    <p className="font-semibold text-rose-800 dark:text-rose-300 mb-1">
                      Unmet Criteria:
                    </p>
                    <ul className="list-disc list-inside space-y-0.5">
                      {evalResult.failedConditions.map((cond, idx) => (
                        <li key={idx}>{cond}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Job Details & Sidebar Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Description & Recruitment Process */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Overview & Responsibilities */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Role Overview
              </h2>
              <p className="mt-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {job.responsibilities.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                  Key Roles & Responsibilities
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {job.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                Required Technical & Domain Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {job.requiredSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recruitment Rounds Timeline */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Recruitment Process & Selection Timeline ({job.recruitmentRounds.length} Rounds)
            </h2>

            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {job.recruitmentRounds.map((rnd) => (
                <div key={rnd.id} className="relative flex items-start gap-4 pl-8">
                  <div className="absolute left-1.5 top-1 h-3.5 w-3.5 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-900" />
                  <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Round {rnd.roundNumber}: {rnd.name}
                      </p>
                      <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                        {rnd.type}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                      {rnd.description}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                      {rnd.duration && <span>Duration: {rnd.duration}</span>}
                      {rnd.scheduledDate && (
                        <span>
                          Scheduled: {new Date(rnd.scheduledDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Personalized Preparation Guide Section */}
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-6 dark:border-indigo-900/50 dark:bg-indigo-950/20">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  AI Interview Preparation Roadmap
                </h3>
              </div>
              <button
                onClick={handleGenerateAiPrep}
                disabled={isGeneratingAiPrep}
                className="rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {isGeneratingAiPrep ? 'Analyzing Profile...' : aiPrepText ? 'Regenerate' : 'Generate Roadmap'}
              </button>
            </div>

            {aiPrepText ? (
              <div className="mt-4 rounded-xl border border-indigo-100 bg-white p-4 text-xs text-slate-700 leading-relaxed dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 whitespace-pre-line">
                {aiPrepText}
              </div>
            ) : (
              <p className="mt-2 text-xs text-slate-500">
                Get a customized technical study plan based on your recorded branch ({studentProfile?.department}), skills, and this company's interview rounds.
              </p>
            )}
          </div>
        </div>

        {/* Right Sidebar: Corporate Snapshot & Requirements */}
        <div className="space-y-6">
          {/* Academic Criteria Specification */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Academic Eligibility Matrix
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Minimum CGPA:</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">
                  {job.eligibilityRules.minCgpa.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Min 10th / 12th:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {job.eligibilityRules.minTenthPercentage}% / {job.eligibilityRules.minTwelfthPercentage}%
                </span>
              </div>

              <div className="flex justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Active Backlogs:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {job.eligibilityRules.allowActiveBacklogs
                    ? `Allowed (Max ${job.eligibilityRules.maxActiveBacklogsAllowed})`
                    : 'Strictly 0'}
                </span>
              </div>

              <div className="flex justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Passing Batch:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {job.eligibilityRules.eligibleGraduationYears.join(', ')}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block mb-1">Eligible Courses & Branches:</span>
                <div className="flex flex-wrap gap-1">
                  {job.eligibilityRules.eligibleBranches.map((b, i) => (
                    <span key={i} className="text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Company Info Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              About Recruiting Organization
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {company?.description}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              {company?.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>{company.website}</span>
                </a>
              )}
              <div className="text-slate-500">
                <span className="font-medium">Campus Point of Contact:</span> {company?.contactPerson}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRMATION APPLY MODAL */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Confirm Placement Application
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review your verified academic snapshot before submitting to {company?.name}.
            </p>

            {applyResult ? (
              <div
                className={`mt-4 rounded-xl p-4 text-xs ${
                  applyResult.success
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200'
                    : 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200'
                }`}
              >
                <p className="font-bold">{applyResult.message}</p>
                {applyResult.success && (
                  <div className="mt-3">
                    <button
                      onClick={() => {
                        setIsApplyModalOpen(false);
                        onNavigate('student_applications');
                      }}
                      className="rounded-lg bg-emerald-600 px-3.5 py-1.5 font-semibold text-white hover:bg-emerald-700"
                    >
                      View in My Applications
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {/* Verified Snapshot Box */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 space-y-1">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {studentProfile?.name} ({studentProfile?.studentId})
                  </p>
                  <p>
                    {studentProfile?.course} in {studentProfile?.department} · Batch {studentProfile?.graduationYear}
                  </p>
                  <p className="font-mono">
                    Recorded CGPA: <span className="font-bold">{studentProfile?.academicRecords.currentCgpa}</span> | Active Backlogs:{' '}
                    <span className="font-bold">{studentProfile?.academicRecords.activeBacklogs}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 pt-1">
                    Snapshot will be permanently recorded with timestamp for audit verification.
                  </p>
                </div>

                {/* Custom Application Questions if configured */}
                {(job.customQuestions || []).map((q) => (
                  <div key={q.id}>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {q.question} {q.isRequired && '*'}
                    </label>
                    <input
                      type="text"
                      required={q.isRequired}
                      value={answers[q.id] || ''}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      placeholder="Your response..."
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Statement of Interest (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly state why you are enthusiastic about this specific role..."
                    value={statement}
                    onChange={(e) => setStatement(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setIsApplyModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyConfirm}
                    className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs"
                  >
                    Confirm & Submit Application
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
