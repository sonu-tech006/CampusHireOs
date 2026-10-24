import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentProfile, StudentProject, StudentExperience } from '../../types';
import {
  UserCircle,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Link,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Save,
  Eye,
  X,
  Upload,
} from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const { studentProfile, updateProfile } = useAuth();

  if (!studentProfile) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        No student profile loaded.
      </div>
    );
  }

  const [formData, setFormData] = useState<StudentProfile>({ ...studentProfile });
  const [skillInput, setSkillInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // New project modal or form
  const [newProject, setNewProject] = useState({ title: '', description: '', technologies: '', link: '' });
  const [showAddProject, setShowAddProject] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    if (!formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
  };

  const handleAddProjectSubmit = () => {
    if (!newProject.title.trim()) return;
    const proj: StudentProject = {
      id: `prj_${Date.now()}`,
      title: newProject.title.trim(),
      description: newProject.description.trim(),
      technologies: newProject.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      link: newProject.link.trim() || undefined,
    };
    setFormData({ ...formData, projects: [...formData.projects, proj] });
    setNewProject({ title: '', description: '', technologies: '', link: '' });
    setShowAddProject(false);
  };

  const handleRemoveProject = (id: string) => {
    setFormData({ ...formData, projects: formData.projects.filter((p) => p.id !== id) });
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Student Academic Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Keep your academic data verified for automated eligibility screening.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreviewModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <Eye className="h-4 w-4" />
            Recruiter Preview
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 shadow-xs transition-colors"
          >
            <Save className="h-4 w-4" />
            Save Profile Changes
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3.5 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
          <Check className="h-4 w-4 shrink-0" />
          <span>Profile updated and synchronized successfully!</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Personal & Contact */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            1. Personal & Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                University Roll No (Student ID)
              </label>
              <input
                type="text"
                disabled
                value={formData.studentId}
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs text-slate-600 font-mono dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Gender
              </label>
              <select
                value={formData.gender || 'Prefer not to say'}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Section
              </label>
              <input
                type="text"
                value={formData.academicRecords.section}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    academicRecords: { ...formData.academicRecords, section: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Academic Credentials */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            2. Academic Records & Backlogs
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Degree / Course
              </label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Current CGPA (out of 10)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.academicRecords.currentCgpa}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    academicRecords: {
                      ...formData.academicRecords,
                      currentCgpa: Number(e.target.value),
                    },
                  })
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 font-mono font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Active Backlogs
              </label>
              <input
                type="number"
                value={formData.academicRecords.activeBacklogs}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    academicRecords: {
                      ...formData.academicRecords,
                      activeBacklogs: Number(e.target.value),
                    },
                  })
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 font-mono font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                10th Percentage (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.academicRecords.tenthPercentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    academicRecords: {
                      ...formData.academicRecords,
                      tenthPercentage: Number(e.target.value),
                    },
                  })
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                12th Percentage (%)
              </label>
              <input
                type="number"
                step="0.1"
                disabled={formData.academicRecords.isDiplomaStudent}
                value={formData.academicRecords.twelfthPercentage || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    academicRecords: {
                      ...formData.academicRecords,
                      twelfthPercentage: Number(e.target.value),
                    },
                  })
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-800/60"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Diploma Percentage (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.academicRecords.diplomaPercentage || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    academicRecords: {
                      ...formData.academicRecords,
                      diplomaPercentage: Number(e.target.value),
                      isDiplomaStudent: true,
                    },
                  })
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Graduation Year
              </label>
              <input
                type="number"
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Technical Skills */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            3. Technical Skills
          </h2>

          <div className="flex flex-wrap gap-2 mb-3">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              placeholder="Add skill (e.g. Next.js, Docker, Kubernetes)..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-700"
            >
              Add
            </button>
          </div>
        </div>

        {/* Section 4: Projects */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              4. Software Projects ({formData.projects.length})
            </h2>
            <button
              type="button"
              onClick={() => setShowAddProject(!showAddProject)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Project
            </button>
          </div>

          {showAddProject && (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-4 space-y-3 dark:border-indigo-900/50 dark:bg-indigo-950/20">
              <input
                type="text"
                placeholder="Project Title"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <textarea
                rows={2}
                placeholder="Brief description of architecture, performance, or problems solved..."
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <input
                type="text"
                placeholder="Technologies used (comma separated: React, Python, PostgreSQL)"
                value={newProject.technologies}
                onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="rounded-lg px-3 py-1 text-xs text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddProjectSubmit}
                  className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white"
                >
                  Save Project
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {formData.projects.map((proj) => (
              <div
                key={proj.id}
                className="flex items-start justify-between gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {proj.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {proj.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveProject(proj.id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Resume & Links */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            5. Resume & Public Portfolios
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Resume Document Name
              </label>
              <input
                type="text"
                placeholder="e.g. Aarav_Patel_Resume.pdf"
                value={formData.resumeFileName || ''}
                onChange={(e) => setFormData({ ...formData, resumeFileName: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                GitHub URL
              </label>
              <input
                type="text"
                value={formData.githubUrl || ''}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="text"
                value={formData.linkedinUrl || ''}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Save button bottom */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white hover:bg-indigo-700 shadow-md transition-colors"
          >
            Save All Profile Updates
          </button>
        </div>
      </form>

      {/* RECRUITER PREVIEW MODAL */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsPreviewModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Placement Verification Dossier
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {formData.name}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {formData.studentId} · {formData.department} ({formData.course})
              </p>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center">
                <div>
                  <p className="text-[10px] text-slate-400">Recorded CGPA</p>
                  <p className="text-base font-bold font-mono text-slate-900 dark:text-white">
                    {formData.academicRecords.currentCgpa}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Active Backlogs</p>
                  <p className="text-base font-bold font-mono text-slate-900 dark:text-white">
                    {formData.academicRecords.activeBacklogs}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">10th / 12th</p>
                  <p className="text-base font-bold font-mono text-slate-900 dark:text-white">
                    {formData.academicRecords.tenthPercentage}% / {formData.academicRecords.twelfthPercentage || formData.academicRecords.diplomaPercentage}%
                  </p>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900 dark:text-white mb-1.5">Core Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {formData.skills.map((s, idx) => (
                    <span key={idx} className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-slate-700 dark:text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {formData.projects.length > 0 && (
                <div>
                  <p className="font-bold text-slate-900 dark:text-white mb-1.5">Key Projects:</p>
                  <div className="space-y-2">
                    {formData.projects.map((p) => (
                      <div key={p.id} className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{p.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white dark:bg-slate-700"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
