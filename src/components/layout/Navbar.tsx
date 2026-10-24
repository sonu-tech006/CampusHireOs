import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme, AccentColor, BgTheme } from '../../context/ThemeContext';
import { storage } from '../../services/storage';
import {
  GraduationCap,
  Bell,
  Sun,
  Moon,
  ShieldCheck,
  UserCheck,
  LogOut,
  Menu,
  Sparkles,
  ChevronDown,
  RefreshCw,
  Database,
  Palette,
  Check,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenNotifications: () => void;
  onNavigate: (view: string) => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onOpenNotifications,
  onNavigate,
  currentView,
}) => {
  const {
    user,
    role,
    loginAsAdmin,
    loginAsStudent,
    logout,
    studentProfile,
    demoStudents,
    dbStatus,
    refreshDbStatus,
    connectMongoWithPassword,
  } = useAuth();
  const { isDark, toggleDark, setDarkMode, accent, setAccent, bgTheme, setBgTheme } = useTheme();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showDbMenu, setShowDbMenu] = useState(false);
  const [isRefreshingDb, setIsRefreshingDb] = useState(false);
  const [atlasPassword, setAtlasPassword] = useState('');
  const [isConnectingAtlas, setIsConnectingAtlas] = useState(false);
  const [atlasConnectMsg, setAtlasConnectMsg] = useState<{ success: boolean; text: string } | null>(null);

  const notifications = storage.getNotifications(user?.id, user?.role);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRefreshDb = async () => {
    setIsRefreshingDb(true);
    await refreshDbStatus();
    setTimeout(() => setIsRefreshingDb(false), 600);
  };

  const handleConnectAtlas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!atlasPassword.trim()) return;
    setIsConnectingAtlas(true);
    setAtlasConnectMsg(null);
    const res = await connectMongoWithPassword(atlasPassword);
    setIsConnectingAtlas(false);
    setAtlasConnectMsg({ success: res.success, text: res.message });
  };

  const bgOptions: { id: BgTheme; label: string; desc: string; lightDot: string; darkDot: string }[] = [
    { id: 'slate', label: 'Tech Slate', desc: 'Modern neutral slate', lightDot: '#f8fafc', darkDot: '#0b0f19' },
    { id: 'warm', label: 'Warm Sand', desc: 'Campus ivory cream', lightDot: '#faf7f2', darkDot: '#151310' },
    { id: 'midnight', label: 'Midnight Blue', desc: 'Deep corporate indigo navy', lightDot: '#f0f4f9', darkDot: '#080d1a' },
    { id: 'emerald', label: 'Emerald Sage', desc: 'Fresh green mint', lightDot: '#f2f8f4', darkDot: '#061510' },
    { id: 'oled', label: 'OLED Pure Black', desc: 'True pitch black (Dark)', lightDot: '#ffffff', darkDot: '#000000' },
  ];

  const accentOptions: { id: AccentColor; label: string; bg: string }[] = [
    { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-600' },
    { id: 'blue', label: 'Sky Blue', bg: 'bg-blue-600' },
    { id: 'violet', label: 'Violet', bg: 'bg-violet-600' },
    { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-600' },
    { id: 'rose', label: 'Rose', bg: 'bg-rose-600' },
    { id: 'amber', label: 'Amber', bg: 'bg-amber-600' },
  ];

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md transition-colors sm:px-6 dark:border-slate-800 dark:bg-slate-900/95">
      {/* Zone 1: Brand & Sidebar Toggle */}
      <div className="flex items-center gap-3">
        {user && (
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle Navigation"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <button
          onClick={() => onNavigate(user ? (role === 'admin' ? 'admin_dashboard' : 'student_dashboard') : 'landing')}
          className="flex items-center gap-2.5 text-left focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-500/20">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              CampusHire<span className="text-indigo-600 dark:text-indigo-400">OS</span>
            </span>
            <span className="hidden text-[10px] text-slate-500 sm:block dark:text-slate-400">
              Placement Management System
            </span>
          </div>
        </button>
      </div>

      {/* Zone 2: Contextual Navigation / Quick Role Indicator */}
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
        {!user ? (
          <>
            <button
              onClick={() => onNavigate('landing')}
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${currentView === 'landing' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''}`}
            >
              Overview
            </button>
            <button
              onClick={() => onNavigate('opportunities')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Explore Companies
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              For Universities
            </button>
          </>
        ) : role === 'admin' ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold dark:bg-slate-800 dark:text-slate-300">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Placement Officer Portal</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold dark:bg-slate-800 dark:text-slate-300">
            <UserCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Student Portal — {studentProfile?.course} {studentProfile?.department?.split(' ')[0]}</span>
          </div>
        )}
      </div>

      {/* Zone 3: Actions & Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Demo Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowThemeMenu(false);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            title="Switch Demo Role"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Role:</span>
            <span className="text-indigo-600 dark:text-indigo-400 capitalize">
              {role || 'Guest'}
            </span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 z-50">
              <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                Switch Test Account
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    loginAsAdmin();
                    setShowRoleMenu(false);
                    onNavigate('admin_dashboard');
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-xs rounded-lg text-left ${
                    role === 'admin'
                      ? 'bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-indigo-600" />
                    <div>
                      <p className="font-medium">Dr. Arvind Sharma</p>
                      <p className="text-[10px] text-slate-500">Placement Officer (Admin)</p>
                    </div>
                  </div>
                  {role === 'admin' && <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded">Active</span>}
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400">
                  Pre-Seeded Students:
                </div>

                {demoStudents.map((std) => (
                  <button
                    key={std.id}
                    onClick={() => {
                      loginAsStudent(std.id);
                      setShowRoleMenu(false);
                      onNavigate('student_dashboard');
                    }}
                    className={`flex w-full items-center justify-between px-3 py-1.5 text-xs rounded-lg text-left ${
                      studentProfile?.id === std.id
                        ? 'bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <p className="font-medium">{std.name}</p>
                      <p className="text-[10px] text-slate-500">
                        {std.department.split(' ')[0]} · CGPA {std.academicRecords.currentCgpa}
                        {std.academicRecords.activeBacklogs > 0 && ` · ${std.academicRecords.activeBacklogs} Backlog`}
                      </p>
                    </div>
                    {studentProfile?.id === std.id && (
                      <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded">Active</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-1 border-t border-slate-100 pt-1 dark:border-slate-800">
                <button
                  onClick={() => {
                    storage.resetAllData();
                    window.location.reload();
                  }}
                  className="flex w-full items-center gap-1.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg dark:hover:bg-rose-950/40"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Reset Demo Database
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MongoDB Connection Status Pill & Modal */}
        <div className="relative">
          <button
            onClick={() => {
              setShowDbMenu(!showDbMenu);
              setShowRoleMenu(false);
              setShowThemeMenu(false);
            }}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
              dbStatus.status === 'connected'
                ? 'border-emerald-200 bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
            title="MongoDB Database Status & Config"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                dbStatus.status === 'connected'
                  ? 'bg-emerald-500 animate-pulse'
                  : dbStatus.status === 'connecting'
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-emerald-500'
              }`}
            />
            <Database className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden xl:inline font-semibold">
              {dbStatus.status === 'connected' ? 'MongoDB Atlas' : 'MongoDB'}
            </span>
          </button>

          {showDbMenu && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3.5 shadow-xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 z-50">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    <Database className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">MongoDB Auth Database</h4>
                    <p className="text-[10px] text-slate-500">Sign In & Registration Pipeline</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    dbStatus.status === 'connected'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {dbStatus.status === 'connected' ? 'Atlas Connected' : 'Resilient Mode'}
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="rounded-lg bg-slate-50 p-2.5 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300 text-[11px] space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Status:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{dbStatus.message}</span>
                  </div>
                  {dbStatus.databaseName && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Database:</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400">{dbStatus.databaseName}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Security:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Bcrypt (Salt 10) + JWT</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Endpoints:</span>
                    <span className="font-mono text-slate-600 dark:text-slate-400">/api/auth/login, /register</span>
                  </div>
                </div>

                {dbStatus.status !== 'connected' && (
                  <div className="rounded-lg bg-emerald-50/60 p-2.5 border border-emerald-200/70 dark:bg-emerald-950/30 dark:border-emerald-800/40 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Atlas Cluster User:</span>
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {dbStatus.detectedUser || 'sonukr7435_db_user'}
                      </span>
                    </div>

                    <form onSubmit={handleConnectAtlas} className="space-y-1.5 pt-0.5">
                      <label className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 block">
                        Enter Atlas password to connect:
                      </label>
                      <div className="flex gap-1.5">
                        <input
                          type="password"
                          value={atlasPassword}
                          onChange={(e) => setAtlasPassword(e.target.value)}
                          placeholder="Your MongoDB user password"
                          className="flex-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                        <button
                          type="submit"
                          disabled={isConnectingAtlas || !atlasPassword.trim()}
                          className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1 shadow-xs"
                        >
                          {isConnectingAtlas ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            <span>Connect</span>
                          )}
                        </button>
                      </div>
                      {atlasConnectMsg && (
                        <p
                          className={`text-[10px] leading-tight mt-1 ${
                            atlasConnectMsg.success
                              ? 'text-emerald-600 font-semibold'
                              : 'text-rose-600 font-medium'
                          }`}
                        >
                          {atlasConnectMsg.text}
                        </p>
                      )}
                    </form>
                  </div>
                )}

                {dbStatus.hint && !atlasConnectMsg?.text && (
                  <div className="text-[10px] text-amber-800 dark:text-amber-300 leading-relaxed bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800/50">
                    <p className="font-semibold text-amber-900 dark:text-amber-200 mb-0.5 flex items-center gap-1">
                      <span>💡 Setup Guide:</span>
                    </p>
                    <p>{dbStatus.hint}</p>
                  </div>
                )}

                <div className="pt-1 flex gap-2">
                  <button
                    onClick={handleRefreshDb}
                    disabled={isRefreshingDb}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    <RefreshCw className={`h-3 w-3 ${isRefreshingDb ? 'animate-spin text-indigo-600' : ''}`} />
                    <span>{isRefreshingDb ? 'Testing Connection...' : 'Check Connection'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDbMenu(false);
                      onNavigate('login');
                    }}
                    className="flex items-center justify-center px-3 rounded-lg bg-indigo-600 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme & Background Customizer */}
        <div className="relative">
          <button
            onClick={() => {
              setShowThemeMenu(!showThemeMenu);
              setShowRoleMenu(false);
              setShowDbMenu(false);
            }}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            title="Customize Background & Colors"
          >
            <Palette className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Theme</span>
            <div className={`h-2.5 w-2.5 rounded-full ${accentOptions.find((a) => a.id === accent)?.bg || 'bg-indigo-600'}`} />
          </button>

          {showThemeMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Palette className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Theme & Background</span>
                </div>
                <span className="text-[10px] text-slate-400">Instant Live Preview</span>
              </div>

              {/* Mode: Light vs Dark */}
              <div className="mt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Appearance Mode</span>
                <div className="grid grid-cols-2 gap-1.5 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <button
                    onClick={() => {
                      setDarkMode(false);
                      if (bgTheme === 'oled') setBgTheme('slate');
                    }}
                    className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-all ${
                      !isDark
                        ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                    }`}
                  >
                    <Sun className="h-3.5 w-3.5 text-amber-500" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => setDarkMode(true)}
                    className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-all ${
                      isDark
                        ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                    }`}
                  >
                    <Moon className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>

              {/* Background Theme Styles */}
              <div className="mt-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Canvas Background</span>
                <div className="space-y-1">
                  {bgOptions.map((opt) => {
                    const isSelected = bgTheme === opt.id;
                    const previewColor = isDark ? opt.darkDot : opt.lightDot;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setBgTheme(opt.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                          isSelected
                            ? 'bg-indigo-50/80 font-bold text-indigo-900 border border-indigo-200/80 dark:bg-indigo-950/50 dark:text-indigo-200 dark:border-indigo-800'
                            : 'hover:bg-slate-50 text-slate-700 dark:hover:bg-slate-800/60 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-4 w-4 rounded-full border border-slate-300 dark:border-slate-700 shadow-xs shrink-0"
                            style={{ backgroundColor: previewColor }}
                          />
                          <div className="text-left">
                            <span className="block leading-none">{opt.label}</span>
                            <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">{opt.desc}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accent Color Selection */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Accent Color</span>
                <div className="flex items-center justify-between gap-1.5 px-0.5">
                  {accentOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setAccent(opt.id)}
                      className={`relative flex h-7 w-7 items-center justify-center rounded-full transition-transform hover:scale-110 ${opt.bg} ${
                        accent === opt.id ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105' : 'opacity-85 hover:opacity-100'
                      }`}
                      title={opt.label}
                    >
                      {accent === opt.id && <Check className="h-3.5 w-3.5 text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Dark Mode 1-Click Toggle */}
        <button
          onClick={toggleDark}
          aria-label="Toggle Dark Mode"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 transition-colors"
        >
          {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
        </button>

        {/* Notifications Bell */}
        {user && (
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        )}

        {/* User Account / Login Button */}
        {user ? (
          <div className="flex items-center gap-2 pl-1">
            <button
              onClick={() => onNavigate(role === 'admin' ? 'admin_dashboard' : 'student_profile')}
              className="flex items-center gap-2 text-left"
            >
              <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden ring-2 ring-indigo-600/30 dark:bg-slate-700">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="hidden lg:block leading-tight">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-500 capitalize">{role}</p>
              </div>
            </button>

            <button
              onClick={logout}
              title="Sign Out"
              className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('login')}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Student Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
