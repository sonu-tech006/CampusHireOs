import React, { useState, useMemo } from 'react';
import { storage } from '../../services/storage';
import { exportApplicantsToPdf, exportApplicantsToCsv } from '../../services/pdfExport';
import { Application, ApplicationStatus, StudentProfile } from '../../types';
import {
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  FileText,
  UserCheck,
  CheckSquare,
  Square,
  Sparkles,
  ArrowUpDown,
  X,
  MessageSquare,
  Building2,
  Save,
} from 'lucide-react';

export const ApplicantManagement: React.FC = () => {
  const jobs = storage.getJobs();
  const companies = storage.getCompanies();

  // Active selected Job
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const activeJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];
  const activeCompany = activeJob ? storage.getCompanyById(activeJob.companyId) : undefined;

  // Applicant query & filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [eligibilityFilter, setEligibilityFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [selectedApplicantIds, setSelectedApplicantIds] = useState<Set<string>>(new Set());

  // Modal states
  const [viewingStudent, setViewingStudent] = useState<StudentProfile | null>(null);
  const [editingNotesApp, setEditingNotesApp] = useState<Application | null>(null);
  const [notesText, setNotesText] = useState('');
  const [showPdfOptions, setShowPdfOptions] = useState(false);

  const allApplicantsForJob = useMemo(() => {
    if (!activeJob) return [];
    return storage.getApplicationsByJob(activeJob.id);
  }, [activeJob, storage]);

  // Filtered applicants
  const filteredApplicants = useMemo(() => {
    return allApplicantsForJob.filter((app) => {
      const snap = app.submittedProfileSnapshot;
      const matchesSearch =
        app.studentName.toLowerCase().includes(search.toLowerCase()) ||
        app.studentRollNo.toLowerCase().includes(search.toLowerCase()) ||
        app.studentEmail.toLowerCase().includes(search.toLowerCase()) ||
        snap.department.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter !== 'all' && app.currentStatus !== statusFilter) return false;
      if (eligibilityFilter !== 'all' && app.eligibilityEvaluation.status !== eligibilityFilter) return false;
      if (branchFilter !== 'all' && snap.department !== branchFilter) return false;

      return true;
    });
  }, [allApplicantsForJob, search, statusFilter, eligibilityFilter, branchFilter]);

  // Statistics calculation for the active job
  const totalCount = allApplicantsForJob.length;
  const eligibleCount = allApplicantsForJob.filter((a) => a.eligibilityEvaluation.isEligible).length;
  const ineligibleCount = totalCount - eligibleCount;
  const shortlistedCount = allApplicantsForJob.filter((a) =>
    ['Shortlisted', 'Assessment Scheduled', 'Technical Round', 'HR Round', 'Selected', 'Offer Released', 'Offer Accepted'].includes(a.currentStatus)
  ).length;
  const selectedCount = allApplicantsForJob.filter((a) => ['Selected', 'Offer Released', 'Offer Accepted'].includes(a.currentStatus)).length;
  const rejectedCount = allApplicantsForJob.filter((a) => a.currentStatus === 'Rejected').length;
  const withdrawnCount = allApplicantsForJob.filter((a) => a.currentStatus === 'Withdrawn').length;

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedApplicantIds.size === filteredApplicants.length) {
      setSelectedApplicantIds(new Set());
    } else {
      setSelectedApplicantIds(new Set(filteredApplicants.map((a) => a.id)));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    const next = new Set(selectedApplicantIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedApplicantIds(next);
  };

  const handleBulkStatusChange = (newStatus: ApplicationStatus) => {
    if (selectedApplicantIds.size === 0) return;
    storage.bulkUpdateApplicationStatus(Array.from(selectedApplicantIds), newStatus);
    setSelectedApplicantIds(new Set());
  };

  const handleSingleStatusChange = (appId: string, status: ApplicationStatus) => {
    storage.updateApplicationStatus(appId, status);
  };

  const handleOpenNotes = (app: Application) => {
    setEditingNotesApp(app);
    setNotesText(app.internalNotes || '');
  };

  const handleSaveNotes = () => {
    if (editingNotesApp) {
      storage.updateApplicationStatus(editingNotesApp.id, editingNotesApp.currentStatus, notesText);
      setEditingNotesApp(null);
    }
  };

  const handleExportPdf = (mode: 'filtered' | 'all' | 'eligible' | 'shortlisted' | 'selected') => {
    if (!activeCompany || !activeJob) return;

    let targetApplicants: Application[] = [];
    let label = 'Filtered Applicants';

    if (mode === 'all') {
      targetApplicants = allApplicantsForJob;
      label = 'All Registered Applicants';
    } else if (mode === 'eligible') {
      targetApplicants = allApplicantsForJob.filter((a) => a.eligibilityEvaluation.isEligible);
      label = 'Eligible Applicants Only';
    } else if (mode === 'shortlisted') {
      targetApplicants = allApplicantsForJob.filter((a) =>
        ['Shortlisted', 'Assessment Scheduled', 'Technical Round', 'HR Round', 'Selected', 'Offer Released', 'Offer Accepted'].includes(a.currentStatus)
      );
      label = 'Shortlisted Candidates';
    } else if (mode === 'selected') {
      targetApplicants = allApplicantsForJob.filter((a) =>
        ['Selected', 'Offer Released', 'Offer Accepted'].includes(a.currentStatus)
      );
      label = 'Selected / Offered Candidates';
    } else {
      targetApplicants = filteredApplicants;
      label = `Custom Filtered List (${filteredApplicants.length} records)`;
    }

    exportApplicantsToPdf({
      company: activeCompany,
      job: activeJob,
      applicants: targetApplicants,
      filterLabel: label,
      collegeName: 'Apex Institute of Technology — Training & Placement Cell',
    });

    storage.addAuditLog(
      'EXPORT_PDF_REPORT',
      'Export',
      activeJob.id,
      `Exported official PDF report for ${activeCompany.name} - ${activeJob.title} (${targetApplicants.length} candidates, filter: ${label})`
    );

    setShowPdfOptions(false);
  };

  const handleExportCsv = () => {
    if (!activeCompany || !activeJob) return;
    exportApplicantsToCsv({
      company: activeCompany,
      job: activeJob,
      applicants: filteredApplicants,
    });
    storage.addAuditLog(
      'EXPORT_CSV_REPORT',
      'Export',
      activeJob.id,
      `Exported CSV file for ${activeCompany.name} (${filteredApplicants.length} rows)`
    );
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Top Bar with Job Selector & Official Export Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Company-Wise Applicant Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time candidate tracking, verified academic records, multi-criteria filtering, and institutional PDF export.
          </p>
        </div>

        {/* Job Selector Dropdown */}
        <div className="flex flex-wrap items-center gap-2.5">
          <label className="text-xs font-semibold text-slate-500">Recruitment Drive:</label>
          <select
            value={selectedJobId}
            onChange={(e) => {
              setSelectedJobId(e.target.value);
              setSelectedApplicantIds(new Set());
            }}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white max-w-xs"
          >
            {jobs.map((job) => {
              const comp = storage.getCompanyById(job.companyId);
              return (
                <option key={job.id} value={job.id}>
                  {comp?.name} — {job.title} ({storage.getApplicationsByJob(job.id).length} apps)
                </option>
              );
            })}
          </select>

          {/* PDF EXPORT DROPDOWN BUTTON */}
          <div className="relative">
            <button
              onClick={() => setShowPdfOptions(!showPdfOptions)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download Applicant Report (PDF)
            </button>

            {showPdfOptions && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 z-50 text-xs">
                <div className="px-3 py-1.5 font-bold uppercase text-[10px] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  Select PDF Export Scope
                </div>
                <div className="py-1">
                  <button
                    onClick={() => handleExportPdf('filtered')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200"
                  >
                    Current Filtered View ({filteredApplicants.length} applicants)
                  </button>
                  <button
                    onClick={() => handleExportPdf('all')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200"
                  >
                    All Applied Students ({allApplicantsForJob.length} total)
                  </button>
                  <button
                    onClick={() => handleExportPdf('eligible')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-emerald-700 dark:text-emerald-400 font-medium"
                  >
                    Eligible Candidates Only ({eligibleCount})
                  </button>
                  <button
                    onClick={() => handleExportPdf('shortlisted')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-purple-700 dark:text-purple-400 font-medium"
                  >
                    Shortlisted / Technical Round ({shortlistedCount})
                  </button>
                  <button
                    onClick={() => handleExportPdf('selected')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-indigo-700 dark:text-indigo-400 font-medium"
                  >
                    Selected / Placed Final List ({selectedCount})
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleExportCsv}
            title="Download CSV Spreadsheet"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <Download className="h-3.5 w-3.5" />
            CSV Export
          </button>
        </div>
      </div>

      {/* Active Drive KPI Ribbon */}
      {activeJob && activeCompany && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 p-1.5 dark:bg-slate-800 dark:border-slate-700">
                <img
                  src={activeCompany.logo}
                  alt={activeCompany.name}
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {activeCompany.name} — {activeJob.title}
                </h2>
                <p className="text-xs text-slate-500">
                  {activeJob.workMode} · {activeJob.jobType} · Min CGPA: {activeJob.eligibilityRules.minCgpa} · Deadline: {new Date(activeJob.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Package:</span>
              <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                {activeJob.compensation.salaryRange}
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-4 text-center">
            <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/40">
              <p className="text-[10px] font-semibold text-slate-400">Total Applicants</p>
              <p className="text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {totalCount}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50/60 p-2.5 dark:bg-emerald-950/20">
              <p className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">Eligible</p>
              <p className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                {eligibleCount}
              </p>
            </div>
            <div className="rounded-xl bg-rose-50/60 p-2.5 dark:bg-rose-950/20">
              <p className="text-[10px] font-semibold text-rose-800 dark:text-rose-300">Ineligible</p>
              <p className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums">
                {ineligibleCount}
              </p>
            </div>
            <div className="rounded-xl bg-purple-50/60 p-2.5 dark:bg-purple-950/20">
              <p className="text-[10px] font-semibold text-purple-800 dark:text-purple-300">Shortlisted</p>
              <p className="text-lg font-bold font-mono text-purple-600 dark:text-purple-400 tabular-nums">
                {shortlistedCount}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-100/60 p-2.5 dark:bg-emerald-950/40">
              <p className="text-[10px] font-semibold text-emerald-900 dark:text-emerald-200">Selected / Placed</p>
              <p className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-300 tabular-nums">
                {selectedCount}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/40">
              <p className="text-[10px] font-semibold text-slate-400">Rejected</p>
              <p className="text-lg font-bold font-mono text-slate-600 dark:text-slate-400 tabular-nums">
                {rejectedCount}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/40">
              <p className="text-[10px] font-semibold text-slate-400">Withdrawn</p>
              <p className="text-lg font-bold font-mono text-slate-500 tabular-nums">
                {withdrawnCount}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar: Filters, Search & Bulk Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, roll, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="all">All Application Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Assessment Scheduled">Assessment Scheduled</option>
            <option value="Technical Round">Technical Round</option>
            <option value="HR Round">HR Round</option>
            <option value="Selected">Selected</option>
            <option value="Offer Released">Offer Released</option>
            <option value="Offer Accepted">Offer Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>

          <select
            value={eligibilityFilter}
            onChange={(e) => setEligibilityFilter(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="all">All Eligibility</option>
            <option value="Eligible">Eligible Only</option>
            <option value="Not Eligible">Ineligible Only</option>
            <option value="Review Required">Review Required</option>
          </select>
        </div>

        {/* Bulk Action Controls */}
        {selectedApplicantIds.size > 0 && (
          <div className="flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-1.5 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800">
            <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
              {selectedApplicantIds.size} Selected
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-600 dark:text-slate-400">Move to:</span>
            <button
              onClick={() => handleBulkStatusChange('Shortlisted')}
              className="rounded-md bg-purple-600 px-2 py-0.5 text-[11px] font-semibold text-white hover:bg-purple-700"
            >
              Shortlist
            </button>
            <button
              onClick={() => handleBulkStatusChange('Technical Round')}
              className="rounded-md bg-indigo-600 px-2 py-0.5 text-[11px] font-semibold text-white hover:bg-indigo-700"
            >
              Technical
            </button>
            <button
              onClick={() => handleBulkStatusChange('Selected')}
              className="rounded-md bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white hover:bg-emerald-700"
            >
              Select
            </button>
            <button
              onClick={() => handleBulkStatusChange('Rejected')}
              className="rounded-md bg-rose-600 px-2 py-0.5 text-[11px] font-semibold text-white hover:bg-rose-700"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      {/* Main Applicant Data Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
                <th className="py-3 px-3 w-8">
                  <button onClick={handleToggleSelectAll} className="flex items-center text-slate-500">
                    {selectedApplicantIds.size === filteredApplicants.length && filteredApplicants.length > 0 ? (
                      <CheckSquare className="h-4 w-4 text-indigo-600" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-2">#</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Roll No</th>
                <th className="py-3 px-3">Branch & Deg</th>
                <th className="py-3 px-2 text-right">CGPA</th>
                <th className="py-3 px-2 text-right">10th%</th>
                <th className="py-3 px-2 text-right">12th%</th>
                <th className="py-3 px-2 text-center">Backlogs</th>
                <th className="py-3 px-3">Applied</th>
                <th className="py-3 px-3">Eligibility</th>
                <th className="py-3 px-3">Current Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-12 text-center text-xs text-slate-400">
                    No applicants match the current search or filters.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app, index) => {
                  const snap = app.submittedProfileSnapshot;
                  const isSelected = selectedApplicantIds.has(app.id);
                  const isEligible = app.eligibilityEvaluation.isEligible;

                  return (
                    <tr
                      key={app.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                        isSelected ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <button onClick={() => handleToggleSelectOne(app.id)}>
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-indigo-600" />
                          ) : (
                            <Square className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                      </td>
                      <td className="py-2.5 px-2 font-mono text-slate-400 tabular-nums">
                        {index + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <p className="font-bold text-slate-900 dark:text-white">{app.studentName}</p>
                        <p className="text-[10px] text-slate-400">{app.studentEmail}</p>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                        {app.studentRollNo}
                      </td>
                      <td className="py-2.5 px-3">
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          {snap.department.split(' ')[0]}
                        </p>
                        <p className="text-[10px] text-slate-400">{snap.course}</p>
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        {snap.cgpa ? snap.cgpa.toFixed(2) : 'N/A'}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-slate-600 dark:text-slate-300 tabular-nums">
                        {snap.tenthPercentage}%
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-slate-600 dark:text-slate-300 tabular-nums">
                        {snap.twelfthPercentage ? `${snap.twelfthPercentage}%` : 'Dip'}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono tabular-nums">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            snap.activeBacklogs > 0
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : 'text-slate-500'
                          }`}
                        >
                          {snap.activeBacklogs}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                        {new Date(app.appliedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            isEligible
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}
                        >
                          {isEligible ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {app.eligibilityEvaluation.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <select
                          value={app.currentStatus}
                          onChange={(e) => handleSingleStatusChange(app.id, e.target.value as ApplicationStatus)}
                          className={`rounded-lg px-2 py-1 text-[11px] font-bold border transition-colors ${
                            app.currentStatus === 'Offer Accepted' || app.currentStatus === 'Offer Released'
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
                              : app.currentStatus === 'Rejected'
                              ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                              : 'border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <option value="Applied">Applied</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Assessment Scheduled">Assessment Scheduled</option>
                          <option value="Technical Round">Technical Round</option>
                          <option value="HR Round">HR Round</option>
                          <option value="Selected">Selected</option>
                          <option value="Offer Released">Offer Released</option>
                          <option value="Offer Accepted">Offer Accepted</option>
                          <option value="Offer Declined">Offer Declined</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Withdrawn">Withdrawn</option>
                        </select>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              const std = storage.getStudentById(app.studentId);
                              if (std) setViewingStudent(std);
                            }}
                            title="Inspect Candidate Profile"
                            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleOpenNotes(app)}
                            title="Internal Recruiter Notes"
                            className={`p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${
                              app.internalNotes ? 'text-indigo-600' : 'text-slate-400'
                            }`}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INTERNAL NOTES MODAL */}
      {editingNotesApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Internal Placement Notes — {editingNotesApp.studentName}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Confidential comments visible only to placement cell officers and evaluators.
            </p>

            <textarea
              rows={4}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="e.g. Cleared round 1 with distinction. High coding proficiency in C++ and trees."
              className="mt-3 w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setEditingNotesApp(null)}
                className="rounded-xl px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT PROFILE INSPECTION MODAL */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setViewingStudent(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Official Student Record
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {viewingStudent.name}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {viewingStudent.studentId} · {viewingStudent.department} ({viewingStudent.course})
              </p>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center font-mono">
                <div>
                  <p className="text-[10px] text-slate-400">Recorded CGPA</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    {viewingStudent.academicRecords.currentCgpa}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Active Backlogs</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    {viewingStudent.academicRecords.activeBacklogs}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">10th / 12th</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    {viewingStudent.academicRecords.tenthPercentage}% / {viewingStudent.academicRecords.twelfthPercentage || viewingStudent.academicRecords.diplomaPercentage}%
                  </p>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900 dark:text-white mb-1.5">Registered Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {viewingStudent.skills.map((s, idx) => (
                    <span key={idx} className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-slate-700 dark:text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {viewingStudent.projects.length > 0 && (
                <div>
                  <p className="font-bold text-slate-900 dark:text-white mb-1.5">Project Highlights:</p>
                  <div className="space-y-2">
                    {viewingStudent.projects.map((p) => (
                      <div key={p.id} className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{p.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setViewingStudent(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white dark:bg-slate-700"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
