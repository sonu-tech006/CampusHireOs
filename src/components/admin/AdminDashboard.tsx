import React, { useState, useMemo } from 'react';
import { storage } from '../../services/storage';
import {
  Users,
  Building2,
  Briefcase,
  FileCheck,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (view: string, param?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [selectedDept, setSelectedDept] = useState<string>('All');

  const students = storage.getStudents();
  const companies = storage.getCompanies();
  const jobs = storage.getJobs();
  const applications = storage.getApplications();
  const interviews = storage.getInterviews();

  // Filtered dataset if department selected
  const filteredStudents = useMemo(() => {
    if (selectedDept === 'All') return students;
    return students.filter((s) => s.department === selectedDept);
  }, [students, selectedDept]);

  const totalRegistered = filteredStudents.length;
  const activeStudents = filteredStudents.filter((s) => s.accountStatus === 'active').length;
  const publishedJobs = jobs.filter((j) => j.status === 'published').length;
  const closedJobs = jobs.filter((j) => j.status === 'closed').length;

  const filteredApps = useMemo(() => {
    if (selectedDept === 'All') return applications;
    return applications.filter((a) => {
      const snap = a.submittedProfileSnapshot;
      return snap.department === selectedDept;
    });
  }, [applications, selectedDept]);

  const uniqueApplicants = new Set(filteredApps.map((a) => a.studentId)).size;
  const shortlistedApps = filteredApps.filter((a) =>
    ['Shortlisted', 'Assessment Scheduled', 'Technical Round', 'HR Round', 'Selected', 'Offer Released', 'Offer Accepted'].includes(a.currentStatus)
  ).length;

  const placedStudents = new Set(
    filteredApps
      .filter((a) => a.currentStatus === 'Offer Accepted' || a.currentStatus === 'Offer Released')
      .map((a) => a.studentId)
  ).size;

  const placementRate = totalRegistered > 0 ? ((placedStudents / totalRegistered) * 100).toFixed(1) : '0';

  // Applications by Company distribution
  const companyAppCounts = useMemo(() => {
    const map: { [compName: string]: number } = {};
    filteredApps.forEach((a) => {
      const j = storage.getJobById(a.jobOpportunityId);
      const c = j ? storage.getCompanyById(j.companyId) : undefined;
      const name = c?.name || 'Other';
      map[name] = (map[name] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [filteredApps]);

  // Status breakdown
  const statusCounts = useMemo(() => {
    const counts: { [status: string]: number } = {};
    filteredApps.forEach((a) => {
      counts[a.currentStatus] = (counts[a.currentStatus] || 0) + 1;
    });
    return counts;
  }, [filteredApps]);

  // Department hiring distribution
  const deptHiring = useMemo(() => {
    const map: { [dept: string]: { total: number; placed: number } } = {};
    students.forEach((s) => {
      if (!map[s.department]) map[s.department] = { total: 0, placed: 0 };
      map[s.department].total += 1;
    });

    applications
      .filter((a) => a.currentStatus === 'Offer Accepted' || a.currentStatus === 'Offer Released')
      .forEach((a) => {
        const d = a.submittedProfileSnapshot.department;
        if (map[d]) {
          map[d].placed += 1;
        }
      });

    return Object.entries(map);
  }, [students, applications]);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Placement Cell Executive Overview
            </h1>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              Batch of 2026
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time verified metrics, company drives, candidate pipelines, and placement velocity.
          </p>
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science & Engineering">Computer Science & Engineering</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics & Communication">Electronics & Communication</option>
            <option value="Electrical & Electronics">Electrical & Electronics</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
            <option value="Master of Computer Applications">Master of Computer Applications</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[11px] font-medium text-slate-500">Registered Students</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {totalRegistered}
          </p>
          <span className="text-[10px] text-slate-400 font-mono">{activeStudents} active</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[11px] font-medium text-slate-500">Partner Companies</p>
          <p className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
            {companies.length}
          </p>
          <span className="text-[10px] text-slate-400">12 Tier-1 visiting</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[11px] font-medium text-slate-500">Published Openings</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
            {publishedJobs}
          </p>
          <span className="text-[10px] text-slate-400">{closedJobs} closed</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[11px] font-medium text-slate-500">Total Applications</p>
          <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono tabular-nums">
            {filteredApps.length}
          </p>
          <span className="text-[10px] text-slate-400 font-mono">{uniqueApplicants} candidates</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[11px] font-medium text-slate-500">Students Placed</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
            {placedStudents}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold">{placementRate}% rate</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[11px] font-medium text-slate-500">Interview Slots</p>
          <p className="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400 font-mono tabular-nums">
            {interviews.length}
          </p>
          <span className="text-[10px] text-purple-600">Active rounds</span>
        </div>
      </div>

      {/* Primary Analytics Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Applications by Company & Pipeline Funnel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Companies by Applications */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Applications by Recruiting Company
              </h2>
              <button
                onClick={() => onNavigate('admin_applicants')}
                className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Manage All Applicants →
              </button>
            </div>

            <div className="mt-4 space-y-3.5">
              {companyAppCounts.map(([compName, count]) => {
                const max = companyAppCounts[0]?.[1] || 1;
                const pct = Math.round((count / max) * 100);

                return (
                  <div key={compName} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {compName}
                      </span>
                      <span className="font-mono tabular-nums text-slate-500">
                        {count} applicants
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Department Placement Conversion Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Department-Wise Placement Conversion
              </h2>
              <button
                onClick={() => onNavigate('admin_analytics')}
                className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Full Analytics →
              </button>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold dark:border-slate-800">
                    <th className="pb-2.5">Branch / Department</th>
                    <th className="pb-2.5 text-right">Students</th>
                    <th className="pb-2.5 text-right">Placed</th>
                    <th className="pb-2.5 text-right">Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {deptHiring.map(([dept, data]) => {
                    const conv = data.total > 0 ? ((data.placed / data.total) * 100).toFixed(0) : '0';
                    return (
                      <tr key={dept} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 font-medium text-slate-900 dark:text-white">
                          {dept}
                        </td>
                        <td className="py-2.5 text-right font-mono text-slate-600 dark:text-slate-300 tabular-nums">
                          {data.total}
                        </td>
                        <td className="py-2.5 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">
                          {data.placed}
                        </td>
                        <td className="py-2.5 text-right font-mono font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
                          {conv}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Recruitment Funnel & Quick Actions */}
        <div className="space-y-6">
          {/* Recruitment Funnel Stages */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Application Pipeline Stages
            </h2>

            <div className="space-y-2 text-xs">
              {[
                { status: 'Applied', color: 'bg-blue-500', count: statusCounts['Applied'] || 0 },
                { status: 'Under Review', color: 'bg-slate-400', count: statusCounts['Under Review'] || 0 },
                { status: 'Shortlisted', color: 'bg-purple-500', count: statusCounts['Shortlisted'] || 0 },
                { status: 'Assessment Scheduled', color: 'bg-amber-500', count: statusCounts['Assessment Scheduled'] || 0 },
                { status: 'Technical Round', color: 'bg-indigo-500', count: statusCounts['Technical Round'] || 0 },
                { status: 'Selected', color: 'bg-emerald-500', count: statusCounts['Selected'] || 0 },
                { status: 'Offer Released', color: 'bg-emerald-600', count: statusCounts['Offer Released'] || 0 },
                { status: 'Offer Accepted', color: 'bg-emerald-700', count: statusCounts['Offer Accepted'] || 0 },
                { status: 'Rejected', color: 'bg-rose-500', count: statusCounts['Rejected'] || 0 },
              ].map((s) => (
                <div key={s.status} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
                    <span className="font-medium text-slate-700 dark:text-slate-300">{s.status}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    {s.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Triggers */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 dark:border-indigo-900/40 dark:bg-indigo-950/20 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
              Placement Cell Shortcuts
            </h2>

            <button
              onClick={() => onNavigate('admin_applicants')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-indigo-200 text-xs font-semibold text-slate-800 shadow-xs hover:border-indigo-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200"
            >
              <span>Download Official Applicant PDF</span>
              <ArrowUpRight className="h-4 w-4 text-indigo-600" />
            </button>

            <button
              onClick={() => onNavigate('admin_jobs')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-indigo-200 text-xs font-semibold text-slate-800 shadow-xs hover:border-indigo-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200"
            >
              <span>Publish New Job Posting</span>
              <ArrowUpRight className="h-4 w-4 text-indigo-600" />
            </button>

            <button
              onClick={() => onNavigate('admin_students')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-indigo-200 text-xs font-semibold text-slate-800 shadow-xs hover:border-indigo-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200"
            >
              <span>Import Students via CSV</span>
              <ArrowUpRight className="h-4 w-4 text-indigo-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
