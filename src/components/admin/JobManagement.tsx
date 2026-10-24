import React, { useState } from 'react';
import { storage } from '../../services/storage';
import { parseJobDescriptionWithAi } from '../../services/gemini';
import { JobOpportunity, EligibilityRules, RecruitmentRound } from '../../types';
import {
  Briefcase,
  Plus,
  Sparkles,
  Edit3,
  Copy,
  PauseCircle,
  PlayCircle,
  XCircle,
  Trash2,
  Calendar,
  Clock,
  Building2,
  X,
  Check,
  Search,
  ExternalLink,
} from 'lucide-react';

interface JobManagementProps {
  onNavigate: (view: string, param?: string) => void;
}

export const JobManagement: React.FC<JobManagementProps> = ({ onNavigate }) => {
  const jobs = storage.getJobs();
  const companies = storage.getCompanies();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  // AI JD Parser prompt modal state
  const [showAiModal, setShowAiModal] = useState(false);
  const [rawJdText, setRawJdText] = useState('');
  const [isParsingAi, setIsParsingAi] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<JobOpportunity>>({
    companyId: companies[0]?.id || '',
    title: '',
    jobCategory: 'Software Engineering',
    description: '',
    responsibilities: [],
    requiredSkills: ['Data Structures', 'Python', 'SQL'],
    jobType: 'Full-Time',
    workMode: 'Hybrid',
    location: 'Bengaluru / Hyderabad',
    compensation: { salaryRange: '₹14 - ₹18 LPA' },
    eligibilityRules: {
      eligibleCourses: ['B.Tech', 'M.Tech', 'MCA'],
      eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication'],
      eligibleGraduationYears: [2026],
      minTenthPercentage: 65,
      minTwelfthPercentage: 65,
      minCgpa: 7.0,
      allowActiveBacklogs: false,
      maxActiveBacklogsAllowed: 0,
      allowHistoricalBacklogs: true,
      additionalConditions: '',
    },
    recruitmentRounds: [
      {
        id: `rnd_${Date.now()}_1`,
        roundNumber: 1,
        name: 'Online Coding Challenge',
        type: 'Coding',
        description: 'Algorithmic assessment on arrays, strings, and graphs',
        duration: '90 mins',
      },
      {
        id: `rnd_${Date.now()}_2`,
        roundNumber: 2,
        name: 'Technical Interview',
        type: 'Technical Interview',
        description: 'Deep dive into computer fundamentals and resume projects',
        duration: '45 mins',
      },
    ],
    openingDate: new Date().toISOString().split('T')[0],
    deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    openingsCount: 15,
    status: 'published',
    requiredDocuments: ['Resume (PDF)'],
    showApplicantCountToStudents: true,
  });

  const filteredJobs = jobs.filter((j) => {
    const comp = storage.getCompanyById(j.companyId);
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      (comp?.name || '').toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && j.status !== statusFilter) return false;
    return true;
  });

  const handleOpenCreate = () => {
    setEditingJobId(null);
    setFormData({
      companyId: companies[0]?.id || '',
      title: '',
      jobCategory: 'Software Engineering',
      description: '',
      responsibilities: [],
      requiredSkills: ['Data Structures', 'Algorithms', 'Java / Python', 'Git'],
      jobType: 'Full-Time',
      workMode: 'Hybrid',
      location: 'Bengaluru / Hyderabad',
      compensation: { salaryRange: '₹15 - ₹20 LPA' },
      eligibilityRules: {
        eligibleCourses: ['B.Tech', 'MCA'],
        eligibleBranches: ['Computer Science & Engineering', 'Information Technology'],
        eligibleGraduationYears: [2026],
        minTenthPercentage: 70,
        minTwelfthPercentage: 70,
        minCgpa: 7.5,
        allowActiveBacklogs: false,
        maxActiveBacklogsAllowed: 0,
        allowHistoricalBacklogs: true,
      },
      recruitmentRounds: [
        {
          id: `rnd_${Date.now()}_1`,
          roundNumber: 1,
          name: 'Online Coding Challenge',
          type: 'Coding',
          description: 'Algorithmic assessment',
          duration: '90 mins',
        },
      ],
      openingDate: new Date().toISOString().split('T')[0],
      deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      openingsCount: 10,
      status: 'published',
      requiredDocuments: ['Resume (PDF)'],
      showApplicantCountToStudents: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (job: JobOpportunity) => {
    setEditingJobId(job.id);
    setFormData({ ...job });
    setIsModalOpen(true);
  };

  const handleDuplicate = (job: JobOpportunity) => {
    const duplicated: Partial<JobOpportunity> = {
      ...job,
      id: undefined,
      title: `${job.title} (Copy)`,
      status: 'draft',
    };
    storage.saveJob(duplicated as any);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.companyId) return;

    if (editingJobId) {
      storage.saveJob({ ...formData, id: editingJobId } as any);
    } else {
      storage.saveJob(formData as any);
    }
    setIsModalOpen(false);
  };

  const handleAiParse = async () => {
    if (!rawJdText.trim()) return;
    setIsParsingAi(true);
    const parsed = await parseJobDescriptionWithAi(rawJdText);
    setFormData((prev) => ({
      ...prev,
      title: parsed.title,
      jobCategory: parsed.category,
      eligibilityRules: parsed.eligibilityRules,
      requiredSkills: parsed.requiredSkills,
      recruitmentRounds: parsed.suggestedRounds.map((r, i) => ({
        id: `rnd_${Date.now()}_${i + 1}`,
        roundNumber: i + 1,
        name: r.name,
        type: r.type as any,
        description: r.description,
        duration: '60 mins',
      })),
    }));
    setIsParsingAi(false);
    setShowAiModal(false);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Campus Placement Drives & Job Postings ({jobs.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish eligibility criteria, schedule recruitment rounds, and control application openings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAiModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI Parse Job Description
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Job Opening
          </button>
        </div>
      </div>

      {/* Toolbar: Filters & Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[260px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search role title, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published (Active)</option>
          <option value="draft">Draft</option>
          <option value="paused">Paused</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Job Postings Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
                <th className="py-3 px-4">Position & Company</th>
                <th className="py-3 px-3">Mode & Type</th>
                <th className="py-3 px-3">Compensation</th>
                <th className="py-3 px-3 text-right">Min CGPA</th>
                <th className="py-3 px-3">Deadline</th>
                <th className="py-3 px-3 text-center">Applicants</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredJobs.map((job) => {
                const comp = storage.getCompanyById(job.companyId);
                const appCount = storage.getApplicationsByJob(job.id).length;

                return (
                  <tr key={job.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={comp?.logo || 'https://www.google.com/favicon.ico'}
                          alt={comp?.name}
                          className="h-6 w-6 object-contain shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{job.title}</p>
                          <p className="text-[11px] text-slate-500">{comp?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {job.workMode} · {job.jobType}
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-900 dark:text-white">
                      {job.compensation.salaryRange}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                      {job.eligibilityRules.minCgpa.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                      {new Date(job.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onNavigate('admin_applicants')}
                        className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold font-mono text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 tabular-nums"
                      >
                        {appCount}
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          job.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                            : job.status === 'draft'
                            ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            : job.status === 'paused'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(job)}
                          title="Edit Job Posting"
                          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(job)}
                          title="Duplicate Job Post"
                          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        {job.status === 'published' ? (
                          <button
                            onClick={() => storage.updateJobStatus(job.id, 'closed')}
                            title="Close Applications"
                            className="p-1 rounded text-slate-400 hover:text-rose-600"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => storage.updateJobStatus(job.id, 'published')}
                            title="Publish / Open Applications"
                            className="p-1 rounded text-slate-400 hover:text-emerald-600"
                          >
                            <PlayCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI PARSER MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  AI Job Description to Eligibility Form
                </h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Paste the text from a recruiter's email or placement brochure. Gemini will automatically extract
              the position title, eligible branches, minimum CGPA, 10th/12th criteria, backlog policy, and recruitment rounds.
            </p>

            <textarea
              rows={6}
              placeholder="e.g. Google India is hiring Software Engineers for 2026 batch. Eligibility: B.Tech CSE, IT with Min CGPA 8.0, 75% in 10th & 12th. Strictly zero backlogs. Rounds: Online coding followed by 2 technical interviews and HR round..."
              value={rawJdText}
              onChange={(e) => setRawJdText(e.target.value)}
              className="mt-3 w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowAiModal(false)}
                className="rounded-xl px-4 py-2 text-xs text-slate-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAiParse}
                disabled={isParsingAi || !rawJdText.trim()}
                className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {isParsingAi ? 'Analyzing Criteria...' : 'Parse & Populate Form'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT JOB OPPORTUNITY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {editingJobId ? 'Edit Job Opening & Criteria' : 'Post New Campus Job Opportunity'}
            </h3>

            <form onSubmit={handleSaveSubmit} className="mt-4 space-y-4 text-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b pb-1 dark:border-slate-800">
                1. Basic Position Information
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Recruiting Company *
                  </label>
                  <select
                    value={formData.companyId}
                    onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Software Development Engineer"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Job Type
                  </label>
                  <select
                    value={formData.jobType}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Internship-to-PPO">Internship-to-PPO</option>
                    <option value="Trainee">Trainee</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Work Mode
                  </label>
                  <select
                    value={formData.workMode}
                    onChange={(e) => setFormData({ ...formData, workMode: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Compensation (CTC / Stipend)
                  </label>
                  <input
                    type="text"
                    value={formData.compensation?.salaryRange}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        compensation: { ...formData.compensation, salaryRange: e.target.value },
                      })
                    }
                    placeholder="e.g. ₹22 - ₹28 LPA"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Job Description & Roles
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b pb-1 pt-2 dark:border-slate-800">
                2. Academic Eligibility Engine Criteria
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Minimum CGPA (out of 10) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.eligibilityRules?.minCgpa}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        eligibilityRules: {
                          ...formData.eligibilityRules!,
                          minCgpa: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Minimum 10th %
                  </label>
                  <input
                    type="number"
                    value={formData.eligibilityRules?.minTenthPercentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        eligibilityRules: {
                          ...formData.eligibilityRules!,
                          minTenthPercentage: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Minimum 12th %
                  </label>
                  <input
                    type="number"
                    value={formData.eligibilityRules?.minTwelfthPercentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        eligibilityRules: {
                          ...formData.eligibilityRules!,
                          minTwelfthPercentage: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="backlogCheck"
                    checked={formData.eligibilityRules?.allowActiveBacklogs}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        eligibilityRules: {
                          ...formData.eligibilityRules!,
                          allowActiveBacklogs: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4 rounded text-indigo-600"
                  />
                  <label htmlFor="backlogCheck" className="text-slate-700 dark:text-slate-300 font-medium">
                    Allow students with active backlogs
                  </label>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Max Permitted Active Backlogs
                  </label>
                  <input
                    type="number"
                    value={formData.eligibilityRules?.maxActiveBacklogsAllowed}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        eligibilityRules: {
                          ...formData.eligibilityRules!,
                          maxActiveBacklogsAllowed: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Publication Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="published">Published (Visible & Open for Apply)</option>
                  <option value="draft">Draft (Saved only in Admin)</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white hover:bg-indigo-700 shadow-xs"
                >
                  Save Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
