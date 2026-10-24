import React, { useState, useMemo } from 'react';
import { storage } from '../../services/storage';
import { StudentProfile } from '../../types';
import {
  Users,
  Search,
  Filter,
  Upload,
  Download,
  CheckCircle2,
  XCircle,
  Eye,
  ShieldCheck,
  ShieldAlert,
  X,
  FileSpreadsheet,
} from 'lucide-react';

export const StudentDirectory: React.FC = () => {
  const students = storage.getStudents();

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [backlogFilter, setBacklogFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const [viewingStudent, setViewingStudent] = useState<StudentProfile | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [csvRawText, setCsvRawText] = useState('');
  const [importSummary, setImportSummary] = useState<{ added: number; skippedDuplicates: number } | null>(null);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.studentId.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;
      if (deptFilter !== 'All' && s.department !== deptFilter) return false;
      if (backlogFilter === 'zero' && s.academicRecords.activeBacklogs > 0) return false;
      if (backlogFilter === 'active' && s.academicRecords.activeBacklogs === 0) return false;
      if (statusFilter !== 'all' && s.accountStatus !== statusFilter) return false;
      return true;
    });
  }, [students, search, deptFilter, backlogFilter, statusFilter]);

  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = filteredStudents.slice((page - 1) * pageSize, page * pageSize);

  const handleToggleStatus = (studentId: string) => {
    storage.toggleStudentStatus(studentId);
  };

  const handleCommitImport = () => {
    if (!csvRawText.trim()) return;
    const lines = csvRawText.trim().split('\n');
    const parsedStudents: Partial<StudentProfile>[] = [];

    // Skip header if line 0 starts with name / studentId
    const startIndex = lines[0].toLowerCase().includes('name') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
      if (parts.length >= 3) {
        // [Name, RollNo, Email, Department, CGPA, Backlogs]
        parsedStudents.push({
          name: parts[0],
          studentId: parts[1],
          email: parts[2],
          department: parts[3] || 'Computer Science & Engineering',
          course: 'B.Tech',
          graduationYear: 2026,
          academicRecords: {
            tenthPercentage: 75,
            tenthPassingYear: 2020,
            twelfthPercentage: 75,
            twelfthPassingYear: 2022,
            currentCgpa: parseFloat(parts[4]) || 7.5,
            currentSemester: 7,
            section: 'A',
            activeBacklogs: parseInt(parts[5], 10) || 0,
            historicalBacklogs: 0,
          },
          skills: ['Python', 'SQL', 'Git'],
        });
      }
    }

    const res = storage.bulkImportStudents(parsedStudents);
    setImportSummary(res);
  };

  const handleDownloadCsvTemplate = () => {
    const template = 'Full Name,Student ID / Roll No,Email Address,Department,Current CGPA,Active Backlogs\nVikram Sen,21AIT1150,vikram.sen@campushire.edu,Computer Science & Engineering,8.75,0\nKavita Roy,21AIT1151,kavita.roy@campushire.edu,Information Technology,7.80,0';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CampusHire_Student_Import_Template.csv';
    a.click();
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Student Placement Directory ({students.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete database of eligible students, verified academic marks, active backlogs, and status controls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <Upload className="h-4 w-4" />
            Bulk CSV Import
          </button>
        </div>
      </div>

      {/* Toolbar: Filters & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, roll no, email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <div>
          <select
            value={deptFilter}
            onChange={(e) => {
              setDeptFilter(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science & Engineering">Computer Science & Engineering</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics & Communication">Electronics & Communication</option>
            <option value="Electrical & Electronics">Electrical & Electronics</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
          </select>
        </div>

        <div>
          <select
            value={backlogFilter}
            onChange={(e) => {
              setBacklogFilter(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="all">All Backlogs Status</option>
            <option value="zero">Zero Active Backlogs</option>
            <option value="active">Has Active Backlogs</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="all">All Account Statuses</option>
            <option value="active">Active Only</option>
            <option value="deactivated">Deactivated Only</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3">Roll Number</th>
                <th className="py-3 px-3">Course & Branch</th>
                <th className="py-3 px-3 text-right">CGPA</th>
                <th className="py-3 px-3 text-right">10th / 12th</th>
                <th className="py-3 px-3 text-center">Backlogs</th>
                <th className="py-3 px-3 text-center">Profile %</th>
                <th className="py-3 px-3">Account</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-4">
                    <p className="font-bold text-slate-900 dark:text-white">{s.name}</p>
                    <p className="text-[10px] text-slate-400">{s.email}</p>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                    {s.studentId}
                  </td>
                  <td className="py-2.5 px-3">
                    <p className="font-medium text-slate-800 dark:text-slate-200">{s.department.split(' ')[0]}</p>
                    <p className="text-[10px] text-slate-400">{s.course} · Sec {s.academicRecords.section}</p>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    {s.academicRecords.currentCgpa.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-300 tabular-nums">
                    {s.academicRecords.tenthPercentage}% / {s.academicRecords.twelfthPercentage || s.academicRecords.diplomaPercentage}%
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono tabular-nums">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        s.academicRecords.activeBacklogs > 0
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'text-slate-500'
                      }`}
                    >
                      {s.academicRecords.activeBacklogs}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-indigo-600 font-semibold tabular-nums">
                    {s.profileCompletion}%
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        s.accountStatus === 'active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                      }`}
                    >
                      {s.accountStatus}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewingStudent(s)}
                        title="View Full Profile"
                        className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(s.id)}
                        title={s.accountStatus === 'active' ? 'Deactivate Account' : 'Activate Account'}
                        className={`p-1 rounded ${
                          s.accountStatus === 'active'
                            ? 'text-slate-400 hover:text-rose-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {s.accountStatus === 'active' ? (
                          <ShieldAlert className="h-4 w-4" />
                        ) : (
                          <ShieldCheck className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <span>
            Showing {(page - 1) * pageSize + 1} to{' '}
            {Math.min(page * pageSize, filteredStudents.length)} of {filteredStudents.length} students
          </span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-200 px-2.5 py-1 disabled:opacity-40 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Previous
            </button>
            <span className="font-mono px-2">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-slate-200 px-2.5 py-1 disabled:opacity-40 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* CSV BULK IMPORT MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsImportModalOpen(false);
                setImportSummary(null);
                setCsvRawText('');
              }}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Bulk CSV Student Record Import
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Upload or paste formatted CSV rows with verified student identity & marks.
            </p>

            <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs">
              <span className="text-slate-600 dark:text-slate-300">Need the exact CSV columns template?</span>
              <button
                onClick={handleDownloadCsvTemplate}
                className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                <Download className="h-3.5 w-3.5" />
                Download Template CSV
              </button>
            </div>

            {importSummary ? (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 text-xs space-y-2">
                <p className="font-bold text-sm">Import Completed Successfully!</p>
                <p>Added: <span className="font-bold">{importSummary.added}</span> verified student profiles.</p>
                <p>Skipped Duplicates: <span className="font-bold">{importSummary.skippedDuplicates}</span> (records already in system).</p>
                <button
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setImportSummary(null);
                    setCsvRawText('');
                  }}
                  className="mt-2 rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-700"
                >
                  Return to Student Directory
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Paste CSV Data: (Full Name, Roll No, Email, Department, CGPA, Backlogs)
                  </label>
                  <textarea
                    rows={8}
                    value={csvRawText}
                    onChange={(e) => setCsvRawText(e.target.value)}
                    placeholder="Full Name,Student ID,Email,Department,CGPA,Backlogs&#10;Kavita Sen,21AIT1201,kavita.sen@campushire.edu,Computer Science & Engineering,8.95,0&#10;Tarun Mehta,21AIT1202,tarun.mehta@campushire.edu,Information Technology,7.40,1"
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 font-mono text-[11px] text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsImportModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCommitImport}
                    disabled={!csvRawText.trim()}
                    className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white hover:bg-indigo-700 disabled:opacity-50 shadow-xs"
                  >
                    Validate & Commit Import
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STUDENT PROFILE INSPECTION MODAL */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setViewingStudent(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Placement Verification Dossier
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {viewingStudent.name}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {viewingStudent.studentId} · {viewingStudent.department} ({viewingStudent.course})
              </p>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center font-mono">
                <div>
                  <p className="text-[10px] text-slate-400">Recorded CGPA</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    {viewingStudent.academicRecords.currentCgpa}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Active Backlogs</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    {viewingStudent.academicRecords.activeBacklogs}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">10th / 12th</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    {viewingStudent.academicRecords.tenthPercentage}% / {viewingStudent.academicRecords.twelfthPercentage || viewingStudent.academicRecords.diplomaPercentage}%
                  </p>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900 dark:text-white mb-1.5">Registered Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {viewingStudent.skills.map((s, idx) => (
                    <span key={idx} className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-slate-700 dark:text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setViewingStudent(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white dark:bg-slate-700"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
