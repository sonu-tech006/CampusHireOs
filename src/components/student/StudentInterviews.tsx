import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { Calendar, Clock, Video, MapPin, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

export const StudentInterviews: React.FC = () => {
  const { studentProfile } = useAuth();

  if (!studentProfile) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        Please sign in with a student profile.
      </div>
    );
  }

  const interviews = storage.getInterviews().filter((i) => i.studentId === studentProfile.id);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Scheduled Interviews & Assessments ({interviews.length})
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your scheduled technical interviews, video meeting links, and interviewer instructions.
        </p>
      </div>

      {interviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <Calendar className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No Interview Slots Scheduled Yet
          </p>
          <p className="text-xs text-slate-500 mt-1">
            When a recruiter shortlists your application for online or onsite rounds, the placement office will assign your interview slot here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {int.roundName}
                  </h3>
                </div>
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                  {int.attendance}
                </span>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-mono font-medium text-slate-900 dark:text-white">
                    {new Date(int.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
                {int.interviewer && (
                  <p className="text-[11px] text-slate-500">
                    Evaluator: <span className="font-semibold text-slate-700 dark:text-slate-300">{int.interviewer}</span>
                  </p>
                )}
              </div>

              {int.locationOrMeetingLink && (
                <div className="pt-2">
                  <a
                    href={int.locationOrMeetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
                  >
                    <Video className="h-3.5 w-3.5" />
                    Join Video Conference
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
