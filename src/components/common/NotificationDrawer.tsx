import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { NotificationItem } from '../../types';
import { Bell, CheckCheck, X, Briefcase, Calendar, Megaphone, Info } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { user, role } = useAuth();
  const notifications = storage.getNotifications(user?.id, role || undefined);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    storage.markAllNotificationsAsRead(user?.id);
  };

  const handleNotificationClick = (n: NotificationItem) => {
    storage.markNotificationAsRead(n.id);
    if (n.type === 'opportunity') {
      onNavigate(role === 'admin' ? 'admin_jobs' : 'student_opportunities');
    } else if (n.type === 'interview') {
      onNavigate(role === 'admin' ? 'admin_interviews' : 'student_interviews');
    } else if (n.type === 'application') {
      onNavigate(role === 'admin' ? 'admin_applicants' : 'student_applications');
    } else if (n.type === 'announcement') {
      onNavigate(role === 'admin' ? 'admin_announcements' : 'student_announcements');
    }
    onClose();
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'opportunity':
        return <Briefcase className="h-4 w-4 text-indigo-500" />;
      case 'interview':
        return <Calendar className="h-4 w-4 text-amber-500" />;
      case 'announcement':
        return <Megaphone className="h-4 w-4 text-rose-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="h-full w-full max-w-md bg-white shadow-2xl dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Notifications & Alerts
            </h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              {notifications.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No notifications right now. You are all caught up!
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`cursor-pointer rounded-xl p-3 border transition-all ${
                  n.read
                    ? 'border-slate-100 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/60'
                    : 'border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 dark:border-indigo-900/50 dark:bg-indigo-950/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs font-semibold truncate ${n.read ? 'text-slate-800 dark:text-slate-200' : 'text-indigo-900 dark:text-indigo-200'}`}>
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="h-2 w-2 rounded-full bg-indigo-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
