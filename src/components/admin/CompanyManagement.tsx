import React, { useState } from 'react';
import { storage } from '../../services/storage';
import { Company } from '../../types';
import { Building2, Plus, Globe, MapPin, Mail, Phone, Archive, Edit3, X, Check, Search } from 'lucide-react';

interface CompanyManagementProps {
  onNavigate: (view: string, param?: string) => void;
}

export const CompanyManagement: React.FC<CompanyManagementProps> = ({ onNavigate }) => {
  const companies = storage.getCompanies();
  const jobs = storage.getJobs();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    description: '',
    industry: 'Software / IT',
    website: '',
    location: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    status: 'active' as Company['status'],
    notes: '',
  });

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingCompany(null);
    setFormData({
      name: '',
      logo: 'https://www.google.com/favicon.ico',
      description: '',
      industry: 'Software / IT',
      website: 'https://',
      location: 'Bengaluru / Hyderabad, India',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      status: 'active',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (comp: Company) => {
    setEditingCompany(comp);
    setFormData({
      name: comp.name,
      logo: comp.logo,
      description: comp.description,
      industry: comp.industry,
      website: comp.website,
      location: comp.location,
      contactPerson: comp.contactPerson,
      contactEmail: comp.contactEmail,
      contactPhone: comp.contactPhone || '',
      status: comp.status,
      notes: comp.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCompany) {
      storage.saveCompany({
        ...formData,
        id: editingCompany.id,
      });
    } else {
      storage.saveCompany(formData);
    }
    setIsModalOpen(false);
  };

  const handleToggleArchive = (id: string) => {
    storage.archiveCompany(id);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Partner Recruiting Companies ({companies.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage corporate relationships, HR contact persons, visiting recruiter terms, and placement history.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add New Company
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="max-w-md relative">
        <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by company name, industry, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </div>

      {/* Company Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCompanies.map((comp) => {
          const compJobs = jobs.filter((j) => j.companyId === comp.id);
          const compApps = compJobs.flatMap((j) => storage.getApplicationsByJob(j.id));

          return (
            <div
              key={comp.id}
              className={`flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition-all dark:bg-slate-900 ${
                comp.status === 'archived'
                  ? 'border-slate-200 opacity-60 dark:border-slate-800'
                  : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 p-2 dark:bg-slate-800 dark:border-slate-700">
                    <img
                      src={comp.logo}
                      alt={comp.name}
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        comp.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                      }`}
                    >
                      {comp.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {comp.name}
                </h3>
                <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {comp.industry}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                  {comp.description}
                </p>

                <div className="mt-3.5 space-y-1.5 text-[11px] text-slate-500 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">{comp.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">{comp.contactEmail}</span>
                  </div>
                  {comp.website && (
                    <div className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-slate-400" />
                      <a
                        href={comp.website}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        {comp.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Card Controls */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-500 font-medium">
                  {compJobs.length} openings · {compApps.length} apps
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(comp)}
                    title="Edit Company Details"
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleToggleArchive(comp.id)}
                    title={comp.status === 'active' ? 'Archive Company' : 'Unarchive Company'}
                    className="p-1 text-slate-400 hover:text-amber-600"
                  >
                    <Archive className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT MODAL */}
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
              {editingCompany ? 'Edit Company Information' : 'Add New Corporate Partner'}
            </h3>

            <form onSubmit={handleSaveSubmit} className="mt-4 space-y-3.5 max-h-[70vh] overflow-y-auto pr-1 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Industry Sector
                  </label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Logo Favicon / URL
                  </label>
                  <input
                    type="text"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Company Overview & Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Website URL
                  </label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Headquarters / Office
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    HR Point of Contact
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Placement Cell Internal Notes (Confidential)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                >
                  Save Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
