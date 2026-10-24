import React, { useState } from 'react';
import { storage } from '../../services/storage';
import { History, Shield, Search, Filter } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const logs = storage.getAuditLogs();
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('all');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.changeSummary.toLowerCase().includes(search.toLowerCase()) ||
      log.actorName.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (entityFilter !== 'all' && log.entityType !== entityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <History className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Administrative Audit Trail & Security Logs ({logs.length})
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Immutable chronological ledger tracking company setups, job publications, applicant status shifts, and report exports.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[260px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by action, summary, or actor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          <option value="all">All Entity Types</option>
          <option value="JobOpportunity">Job Opportunities</option>
          <option value="Company">Companies</option>
          <option value="Application">Applications</option>
          <option value="Export">PDF / CSV Exports</option>
          <option value="Student">Student Accounts</option>
          <option value="Interview">Interviews</option>
          <option value="Announcement">Announcements</option>
        </select>
      </div>

      {/* Audit Log Entries List */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded text-[10px]">
                    {log.action}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                    {log.entityType}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  {log.changeSummary}
                </p>
                <p className="text-[10px] text-slate-400">
                  Actor: <span className="font-medium text-slate-600 dark:text-slate-300">{log.actorName}</span> ({log.actorRole})
                </p>
              </div>

              <div className="text-right text-[11px] font-mono text-slate-400 sm:self-center shrink-0">
                {new Date(log.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
