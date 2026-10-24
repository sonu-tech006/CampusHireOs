import React, { useState } from 'react';
import { storage } from '../../services/storage';
import { InterviewSchedule } from '../../types';
import {
  CalendarDays,
  Plus,
  Video,
  Clock,
  User,
  AlertTriangle,
  CheckCircle2,
  X,
  Search,
} from 'lucide-react';

export const AdminInterviews: React.FC = () => {
  const interviews = storage.getInterviews();
  const jobs = storage.getJobs();
  const companies = storage.getCompanies();
  const students = storage.getStudents();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    jobOpportunityId: jobs[0]?.id || '',
    roundName: 'Technical Interview Round 1',
    studentId: students[0]?.id || '',
    startTime: '2026-11-06T10:00',
    endTime: '2026-11-06T10:45',
    locationOrMeetingLink: 'https://meet.google.com/ch-eval-session',
    interviewer: 'Lead Technical Architect',
  });

  const handleOpenSchedule = () => {
    setConflictWarning(null);
    setIsModalOpen(true);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictWarning(null);

    const targetStudent = students.find((s) => s.id === formData.studentId);
    const targetJob = jobs.find((j) => j.id === formData.jobOpportunityId);
    const targetCompany = targetJob ? storage.getCompanyById(targetJob.companyId) : undefined;

    if (!targetStudent || !targetJob || !targetCompany) return;

    // Clash detection: check if student has any existing interview overlapping this time
    const newStart = new Date(formData.startTime).getTime();
    const newEnd = new Date(formData.endTime).getTime();

    const hasClash = interviews.some((existing) => {
      if (existing.studentId !== targetStudent.id) return false;
      const exStart = new Date(existing.startTime).getTime();
      const exEnd = new Date(existing.endTime).getTime();
      // Overlap condition
      return newStart < exEnd && newEnd > exStart;
    });

    if (hasClash) {
      setConflictWarning(
        `Time Slot Clash Detected! Student ${targetStudent.name} already has an active interview scheduled in this time interval. Please select a different time.`
      );
      return;
    }

    storage.scheduleInterview({
      jobOpportunityId: targetJob.id,
      roundId: `rnd_${Date.now()}`,
      roundName: formData.roundName,
      companyName: targetCompany.name,
      studentId: targetStudent.id,
      studentName: targetStudent.name,
      studentRollNo: targetStudent.studentId,
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      locationOrMeetingLink: formData.locationOrMeetingLink,
      interviewer: formData.interviewer,
      attendance: 'Scheduled',
      outcome: 'Pending',
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Interview Schedule & Slot Allocations ({interviews.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Coordinate virtual onsite interviews, evaluate panel availability, and enforce clash detection.
          </p>
        </div>

        <button
          onClick={handleOpenSchedule}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Schedule Interview Slot
        </button>
      </div>

      {/* Grid of Scheduled Interviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {interviews.map((int) => (
          <div
            key={int.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {int.companyName}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {int.roundName}
                </h3>
              </div>
              <span className="rounded px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                {int.attendance}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 space-y-1 text-xs">
              <p className="font-semibold text-slate-900 dark:text-white">
                Candidate: {int.studentName}
              </p>
              <p className="font-mono text-[11px] text-slate-500">
                Roll No: {int.studentRollNo}
              </p>
              <div className="pt-1 flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                <Clock className="h-3 w-3 text-slate-400" />
                <span>{new Date(int.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
            </div>

            {int.locationOrMeetingLink && (
              <div className="pt-2 flex items-center justify-between text-xs">
                <a
                  href={int.locationOrMeetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-600 hover:underline dark:text-indigo-400 font-medium"
                >
                  <Video className="h-3.5 w-3.5" />
                  <span>Join Session</span>
                </a>

                {int.interviewer && (
                  <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                    {int.interviewer}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* SCHEDULE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Schedule Candidate Interview Slot
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Assign shortlisted student and meeting location with clash validation.
            </p>

            {conflictWarning && (
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{conflictWarning}</span>
              </div>
            )}

            <form onSubmit={handleScheduleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Recruitment Position *
                </label>
                <select
                  value={formData.jobOpportunityId}
                  onChange={(e) => setFormData({ ...formData, jobOpportunityId: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {jobs.map((j) => {
                    const c = storage.getCompanyById(j.companyId);
                    return (
                      <option key={j.id} value={j.id}>
                        {c?.name} — {j.title}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Candidate (Shortlisted Student) *
                </label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {students.slice(0, 30).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.studentId}, {s.department.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Round Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.roundName}
                  onChange={(e) => setFormData({ ...formData, roundName: e.target.value })}
                  placeholder="e.g. Technical Round 1: Coding & Algorithms"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    End Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Video Conference / Room Link
                </label>
                <input
                  type="text"
                  value={formData.locationOrMeetingLink}
                  onChange={(e) => setFormData({ ...formData, locationOrMeetingLink: e.target.value })}
                  placeholder="https://meet.google.com/..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Interviewer / Panelist Name
                </label>
                <input
                  type="text"
                  value={formData.interviewer}
                  onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
                  placeholder="e.g. Dr. Ramesh Gupta (Technical Director)"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
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
                  Confirm Slot Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
