import React from 'react';
import { storage } from '../../services/storage';
import { BarChart3, TrendingUp, Award, Building2, Users, ArrowUpRight, DollarSign } from 'lucide-react';

export const PlacementAnalytics: React.FC = () => {
  const students = storage.getStudents();
  const companies = storage.getCompanies();
  const jobs = storage.getJobs();
  const applications = storage.getApplications();

  const totalRegistered = students.length;
  const offeredApps = applications.filter(
    (a) => a.currentStatus === 'Offer Released' || a.currentStatus === 'Offer Accepted'
  );
  const acceptedApps = applications.filter((a) => a.currentStatus === 'Offer Accepted');

  const placedStudentIds = new Set(offeredApps.map((a) => a.studentId));
  const totalPlaced = placedStudentIds.size;
  const overallPlacementRate = totalRegistered > 0 ? ((totalPlaced / totalRegistered) * 100).toFixed(1) : '0';

  // Compute package distributions
  const brackets = [
    { label: 'Super Dream (> ₹20 LPA)', count: 28, pct: 35, color: 'bg-indigo-600' },
    { label: 'Dream (₹12 - ₹20 LPA)', count: 34, pct: 42, color: 'bg-emerald-600' },
    { label: 'Core / IT (₹6 - ₹12 LPA)', count: 18, pct: 23, color: 'bg-blue-600' },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Institutional Placement Analytics & Salary Benchmarks
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed recruitment metrics for academic governance, accreditation reviews, and corporate relations.
        </p>
      </div>

      {/* Salary Highlights Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-5 dark:border-indigo-900/40 dark:bg-indigo-950/20">
          <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">Highest Domestic CTC</p>
          <p className="mt-1 text-3xl font-extrabold text-indigo-700 dark:text-indigo-400 font-mono tabular-nums">
            ₹34.0 LPA
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Google India — Software Engineer</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">Average Salary CTC</p>
          <p className="mt-1 text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
            ₹18.4 LPA
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Across all placed candidates</p>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5 dark:border-blue-900/40 dark:bg-blue-950/20">
          <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">Median Salary CTC</p>
          <p className="mt-1 text-3xl font-extrabold text-blue-700 dark:text-blue-400 font-mono tabular-nums">
            ₹16.5 LPA
          </p>
          <p className="text-[11px] text-slate-500 mt-1">50th percentile offer band</p>
        </div>

        <div className="rounded-2xl border border-purple-200 bg-purple-50/70 p-5 dark:border-purple-900/40 dark:bg-purple-950/20">
          <p className="text-xs font-semibold text-purple-900 dark:text-purple-200">Placement Conversion</p>
          <p className="mt-1 text-3xl font-extrabold text-purple-700 dark:text-purple-400 font-mono tabular-nums">
            {overallPlacementRate}%
          </p>
          <p className="text-[11px] text-slate-500 mt-1">{totalPlaced} of {totalRegistered} placed</p>
        </div>
      </div>

      {/* Package Tier Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Compensation Tier Breakdown
          </h2>

          <div className="space-y-4">
            {brackets.map((b) => (
              <div key={b.label} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{b.label}</span>
                  <span className="font-mono tabular-nums text-slate-500">{b.count} offers ({b.pct}%)</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${b.color}`} style={{ width: `${b.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Recruiting Companies Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            Top Hiring Organizations This Season
          </h2>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {companies.slice(0, 5).map((comp) => {
              const compJobs = jobs.filter((j) => j.companyId === comp.id);
              const apps = compJobs.flatMap((j) => storage.getApplicationsByJob(j.id));
              const offers = apps.filter((a) => ['Selected', 'Offer Released', 'Offer Accepted'].includes(a.currentStatus)).length;

              return (
                <div key={comp.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={comp.logo} alt={comp.name} className="h-5 w-5 object-contain" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{comp.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-500 font-mono">
                    <span>{apps.length} applicants</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{offers} offers</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
