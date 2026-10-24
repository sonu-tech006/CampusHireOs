import React, { useState } from 'react';
import { storage } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { Announcement } from '../../types';
import { Megaphone, Plus, AlertCircle, Calendar, User, X } from 'lucide-react';

export const AnnouncementsView: React.FC = () => {
  const { role } = useAuth();
  const announcements = storage.getAnnouncements();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'Normal' as Announcement['priority'],
    targetBranches: ['All'],
    targetGraduationYears: [2026],
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    storage.addAnnouncement({
      title: formData.title,
      content: formData.content,
      priority: formData.priority,
      targetBranches: formData.targetBranches,
      targetGraduationYears: formData.targetGraduationYears,
      createdBy: 'Dr. Arvind Sharma (Placement Officer)',
    });

    setFormData({
      title: '',
      content: '',
      priority: 'Normal',
      targetBranches: ['All'],
      targetGraduationYears: [2026],
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Official Placement Bulletins & Circulars
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official guidelines, assessment test schedules, pre-placement talks, and campus recruitment directives.
          </p>
        </div>

        {role === 'admin' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Broadcast Notice
          </button>
        )}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`rounded-2xl border bg-white p-5 shadow-xs dark:bg-slate-900 ${
              ann.priority === 'Urgent'
                ? 'border-rose-200 bg-rose-50/20 dark:border-rose-900/40'
                : ann.priority === 'High'
                ? 'border-amber-200 bg-amber-50/20 dark:border-amber-900/40'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      ann.priority === 'Urgent'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : ann.priority === 'High'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {ann.priority} Priority
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(ann.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {ann.title}
                </h3>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {ann.content}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Author: {ann.createdBy}</span>
              <span>Audience: {ann.targetBranches.join(', ')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE ANNOUNCEMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Broadcast Placement Notice
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Publish official directive with push notifications to matching students.
            </p>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Bulletin Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandatory Pre-Placement Talk for Google SWE"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Priority Flag
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Announcement Content *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed instructions, reporting venue, dress code, documentation..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
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
                  Broadcast Notice Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
