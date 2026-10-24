import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import {
  X,
  ShieldCheck,
  UserCheck,
  Sparkles,
  Check,
  AlertCircle,
  Database,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
  onSuccess: (view: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  onSuccess,
}) => {
  const {
    loginAsAdmin,
    loginAsStudent,
    registerStudent,
    dbStatus,
    refreshDbStatus,
    connectMongoWithPassword,
  } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [atlasPasswordModal, setAtlasPasswordModal] = useState('');
  const [isConnectingAtlasModal, setIsConnectingAtlasModal] = useState(false);
  const [atlasModalMsg, setAtlasModalMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Student Registration form state
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    collegeName: 'Apex Institute of Technology',
    department: 'Computer Science & Engineering',
    course: 'B.Tech',
    specialization: 'Artificial Intelligence & Machine Learning',
    graduationYear: 2026,
    currentSemester: 7,
    section: 'A',
    gender: 'Male',
    phone: '+91 ',
    tenthPercentage: 85,
    tenthPassingYear: 2020,
    tenthBoard: 'CBSE',
    isDiplomaStudent: false,
    twelfthPercentage: 82,
    twelfthPassingYear: 2022,
    diplomaPercentage: 85,
    diplomaPassingYear: 2023,
    diplomaStream: 'Computer Engineering',
    currentCgpa: 8.5,
    activeBacklogs: 0,
    historicalBacklogs: 0,
    skills: 'React, Node.js, Python, SQL, MongoDB, Data Structures',
    resumeFileName: '',
  });

  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [showDbInfo, setShowDbInfo] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    const emailTrimmed = loginEmail.trim().toLowerCase();
    if (!emailTrimmed) {
      setLoginError('Please enter your email or roll number.');
      setIsSubmitting(false);
      return;
    }

    if (emailTrimmed.includes('admin') || emailTrimmed === 'admin@campushire.edu') {
      await loginAsAdmin();
      setIsSubmitting(false);
      onSuccess('admin_dashboard');
      onClose();
      return;
    }

    const success = await loginAsStudent(emailTrimmed, loginPassword);
    setIsSubmitting(false);

    if (success) {
      onSuccess('student_dashboard');
      onClose();
    } else {
      setLoginError('No matching student account found. Please check your credentials or test with one of the quick test accounts.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    setIsSubmitting(true);

    if (!regData.name.trim()) {
      setIsSubmitting(false);
      return setRegError('Full Name is required.');
    }
    if (!regData.email.trim()) {
      setIsSubmitting(false);
      return setRegError('Email is required.');
    }
    if (!regData.studentId.trim()) {
      setIsSubmitting(false);
      return setRegError('Student ID / University Roll Number is required.');
    }
    if (regData.password && regData.password !== regData.confirmPassword) {
      setIsSubmitting(false);
      return setRegError('Passwords do not match.');
    }
    if (regData.currentCgpa < 0 || regData.currentCgpa > 10) {
      setIsSubmitting(false);
      return setRegError('CGPA must be between 0.0 and 10.0');
    }
    if (regData.tenthPercentage < 0 || regData.tenthPercentage > 100) {
      setIsSubmitting(false);
      return setRegError('10th percentage must be between 0 and 100.');
    }

    const skillsArray = regData.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const result = await registerStudent({
      ...regData,
      skills: skillsArray,
      resumeUrl: regData.resumeFileName ? `/resumes/${regData.studentId}_Resume.pdf` : undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      setRegSuccess(result.message);
      setTimeout(() => {
        onSuccess('student_dashboard');
        onClose();
      }, 1200);
    } else {
      setRegError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex">
            <button
              onClick={() => setTab('login')}
              className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2 ${
                tab === 'login'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab('register')}
              className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2 ${
                tab === 'register'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Student Registration
            </button>
          </div>

          {/* Live MongoDB Status Indicator */}
          <div className="pb-2">
            <button
              onClick={() => setShowDbInfo(!showDbInfo)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                dbStatus.status === 'connected'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
              }`}
              title="Click to check MongoDB connection details"
            >
              <Database className="h-3 w-3" />
              <span>
                {dbStatus.status === 'connected' ? 'MongoDB Atlas Connected' : 'MongoDB: Local Storage Active'}
              </span>
            </button>
          </div>
        </div>

        {/* MongoDB Connection Info Callout (Toggleable) */}
        {showDbInfo && (
          <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Database className="h-4 w-4 text-emerald-600" />
                MongoDB Integration Status
              </span>
              <button
                onClick={refreshDbStatus}
                className="flex items-center gap-1 text-[11px] text-indigo-600 hover:underline dark:text-indigo-400 font-semibold"
              >
                <RefreshCw className="h-3 w-3" />
                Check Connection
              </button>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {dbStatus.message}
            </p>
            {dbStatus.status !== 'connected' && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Cluster User:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {dbStatus.detectedUser || 'sonukr7435_db_user'}
                  </span>
                </div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!atlasPasswordModal.trim()) return;
                    setIsConnectingAtlasModal(true);
                    setAtlasModalMsg(null);
                    const res = await connectMongoWithPassword(atlasPasswordModal);
                    setIsConnectingAtlasModal(false);
                    setAtlasModalMsg({ success: res.success, text: res.message });
                  }}
                  className="space-y-1.5"
                >
                  <label className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 block">
                    Enter password for {dbStatus.detectedUser || 'sonukr7435_db_user'} to connect:
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="password"
                      value={atlasPasswordModal}
                      onChange={(e) => setAtlasPasswordModal(e.target.value)}
                      placeholder="Atlas database user password"
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                    <button
                      type="submit"
                      disabled={isConnectingAtlasModal || !atlasPasswordModal.trim()}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1 shadow-xs"
                    >
                      {isConnectingAtlasModal ? <RefreshCw className="h-3 w-3 animate-spin" /> : 'Connect'}
                    </button>
                  </div>
                  {atlasModalMsg && (
                    <p
                      className={`text-[10px] leading-tight mt-1 ${
                        atlasModalMsg.success ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-medium'
                      }`}
                    >
                      {atlasModalMsg.text}
                    </p>
                  )}
                </form>
              </div>
            )}

            {dbStatus.hint && !atlasModalMsg?.text && (
              <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">
                <span className="font-semibold">💡 Setup Action: </span>{dbStatus.hint}
              </div>
            )}
          </div>
        )}

        {/* Quick Demo Fast-Logins Box */}
        <div className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3.5 dark:border-indigo-900/50 dark:bg-indigo-950/20">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-200 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Instant One-Click Login for Evaluation</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={async () => {
                await loginAsAdmin();
                onSuccess('admin_dashboard');
                onClose();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Dr. Arvind Sharma (Placement Officer Admin)
            </button>
            <button
              onClick={async () => {
                await loginAsStudent();
                onSuccess('student_dashboard');
                onClose();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
            >
              <UserCheck className="h-3.5 w-3.5" />
              Aarav Patel (Student: CGPA 9.4, 0 Backlogs)
            </button>
            <button
              onClick={async () => {
                const stds = storage.getStudents();
                const backlogged = stds.find((s) => s.academicRecords.activeBacklogs > 0);
                if (backlogged) await loginAsStudent(backlogged.id);
                onSuccess('student_dashboard');
                onClose();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-700 transition-colors"
            >
              <UserCheck className="h-3.5 w-3.5" />
              Student with 1 Active Backlog (Test Rules)
            </button>
          </div>
        </div>

        {tab === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                University Email or Roll Number
              </label>
              <input
                type="text"
                placeholder="e.g. admin@campushire.edu or 21AIT1001"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-xs"
            >
              {isSubmitting ? 'Verifying with Database...' : 'Sign In to Placement Portal'}
            </button>
          </form>
        ) : (
          /* STUDENT REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="max-h-[60vh] overflow-y-auto pr-1 space-y-4">
            {regError && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{regError}</span>
              </div>
            )}
            {regSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                <Check className="h-4 w-4 shrink-0" />
                <span>{regSuccess}</span>
              </div>
            )}

            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b pb-1 dark:border-slate-800">
              1. Basic & Identity Information
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ishita Sen"
                  value={regData.name}
                  onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Registered Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ishita.sen@campushire.edu"
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Create secure password"
                  value={regData.password}
                  onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Confirm password"
                  value={regData.confirmPassword}
                  onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Student ID / University Roll No *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 21AIT1099"
                  value={regData.studentId}
                  onChange={(e) => setRegData({ ...regData, studentId: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={regData.phone}
                  onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b pb-1 pt-2 dark:border-slate-800">
              2. Academic Records & Degree Details
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Course / Degree
                </label>
                <select
                  value={regData.course}
                  onChange={(e) => setRegData({ ...regData, course: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="MCA">MCA</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Department / Branch
                </label>
                <select
                  value={regData.department}
                  onChange={(e) => setRegData({ ...regData, department: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Electrical & Electronics">Electrical & Electronics</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Graduation Year
                </label>
                <input
                  type="number"
                  value={regData.graduationYear}
                  onChange={(e) => setRegData({ ...regData, graduationYear: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Current CGPA (out of 10) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={regData.currentCgpa}
                  onChange={(e) => setRegData({ ...regData, currentCgpa: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 font-mono focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Active Backlogs
                </label>
                <input
                  type="number"
                  value={regData.activeBacklogs}
                  onChange={(e) => setRegData({ ...regData, activeBacklogs: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 font-mono focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Section
                </label>
                <input
                  type="text"
                  value={regData.section}
                  onChange={(e) => setRegData({ ...regData, section: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b pb-1 pt-2 dark:border-slate-800">
              3. 10th & 12th / Diploma Records
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  10th Percentage (%) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={regData.tenthPercentage}
                  onChange={(e) => setRegData({ ...regData, tenthPercentage: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 font-mono focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="diplomaCheckbox"
                  checked={regData.isDiplomaStudent}
                  onChange={(e) => setRegData({ ...regData, isDiplomaStudent: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="diplomaCheckbox" className="text-xs text-slate-700 dark:text-slate-300">
                  I joined via Lateral Entry (Diploma) instead of 12th
                </label>
              </div>

              {!regData.isDiplomaStudent ? (
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    12th Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={regData.twelfthPercentage}
                    onChange={(e) => setRegData({ ...regData, twelfthPercentage: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 font-mono focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Diploma Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={regData.diplomaPercentage}
                    onChange={(e) => setRegData({ ...regData, diplomaPercentage: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 font-mono focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={regData.skills}
                  onChange={(e) => setRegData({ ...regData, skills: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-xs"
              >
                {isSubmitting ? 'Creating User & Storing in Database...' : 'Register & Enter Student Placement Portal'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
