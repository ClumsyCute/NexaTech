'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Briefcase,
  Calendar,
  FileText,
  Download,
  ExternalLink,
  ChevronLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  Inbox,
  User,
  Phone,
  Mail,
  Building,
  DollarSign,
  Clock,
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  location: string;
  experience: string;
  employmentType: string;
  status: string;
  deadline: string;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
}

interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  status: string;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  resumePath: string;
  linkedIn: string | null;
  gitHub: string | null;
  portfolio: string | null;
  yearsOfExperience: number;
  skills: string;
  currentCompany: string | null;
  currentCtc: string | null;
  expectedCtc: string | null;
  noticePeriod: string | null;
  coverLetter: string | null;
  createdAt: string;
  job: Job;
  candidate: Candidate;
}

interface ApplicationsPanelClientProps {
  initialApplications: Application[];
}

export default function ApplicationsPanelClient({ initialApplications }: ApplicationsPanelClientProps) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(
    initialApplications.length > 0 ? initialApplications[0].id : null,
  );

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Form State for updates
  const [updateStatus, setUpdateStatus] = useState('');
  const [customNotification, setCustomNotification] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Derived filter options
  const rolesList = useMemo(() => {
    const set = new Set(applications.map((app) => app.job.title));
    return Array.from(set);
  }, [applications]);

  // Selected Application Details
  const selectedApp = useMemo(() => {
    const found = applications.find((app) => app.id === selectedAppId);
    if (found) {
      // Sync form values on selection change
      setUpdateStatus(found.status);
      setCustomNotification('');
      setUpdateError(null);
      setUpdateSuccess(false);
    }
    return found || null;
  }, [selectedAppId, applications]);

  // Filtered applications list
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        app.skills.toLowerCase().includes(search.toLowerCase()) ||
        app.job.title.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
      const matchesRole = roleFilter === 'ALL' || app.job.title === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [applications, search, statusFilter, roleFilter]);

  const handleUpdateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setSubmitting(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: updateStatus,
          customNotification: customNotification || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update application status.');
      }

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedApp.id ? { ...app, status: updateStatus } : app,
        ),
      );

      setUpdateSuccess(true);
      setCustomNotification('');
    } catch (err: any) {
      setUpdateError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900';
      case 'SHORTLISTED':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900';
      case 'INTERVIEW_SCHEDULED':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900';
      case 'OFFER_RELEASED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'ACCEPTED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col h-[calc(100vh-4rem)]">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Review Pipeline</h1>
          <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5">Filter candidates, download resumes, and manage interview schedules.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-grow sm:flex-grow-0">
            <input
              type="text"
              placeholder="Search candidate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-60 rounded-lg border border-slate-200 py-1.5 pl-8 pr-3 text-xs text-slate-950 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-slate-200 py-1.5 px-2.5 text-xs text-slate-700 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          >
            <option value="ALL">All Roles</option>
            {rolesList.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 py-1.5 px-2.5 text-xs text-slate-700 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
            <option value="OFFER_RELEASED">Offer Released</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Master-Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow overflow-hidden">
        {/* Left Column: Candidates list */}
        <div className="lg:col-span-1 border border-slate-200 bg-white rounded-2xl dark:border-slate-800 dark:bg-slate-900 overflow-y-auto flex flex-col max-h-[300px] lg:max-h-full">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
            <span className="text-xs font-semibold text-slate-500">
              Applications ({filteredApps.length})
            </span>
          </div>

          {filteredApps.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-850 flex-grow">
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`w-full text-left p-4 hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-all flex flex-col gap-1 ${
                    selectedAppId === app.id
                      ? 'bg-indigo-50/30 border-l-4 border-indigo-650 dark:bg-indigo-950/10'
                      : 'border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate max-w-[150px]">
                      {app.name}
                    </h3>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${getStatusBadgeClass(
                        app.status,
                      )}`}
                    >
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-655 dark:text-indigo-400 font-semibold truncate">
                    {app.job.title}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span>Exp: {app.yearsOfExperience} yrs</span>
                    <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 flex-grow flex flex-col justify-center">
              <Inbox className="mx-auto h-8 w-8 text-slate-350" />
              <p className="text-xs text-slate-500 mt-2">No applications match criteria.</p>
            </div>
          )}
        </div>

        {/* Right Column: Candidate review sheet */}
        <div className="lg:col-span-2 border border-slate-200 bg-white rounded-2xl dark:border-slate-800 dark:bg-slate-900 overflow-y-auto max-h-[calc(100vh-16rem)] lg:max-h-full">
          {selectedApp ? (
            <div className="p-8 space-y-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-100 dark:border-slate-805 pb-6">
                <div>
                  <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
                    {selectedApp.job.title}
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                    {selectedApp.name}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    Applied: {new Date(selectedApp.createdAt).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}
                  </p>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`/api/admin/resumes/download/${selectedApp.resumePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-indigo-50 px-4 py-2.5 text-xs font-bold text-indigo-755 hover:bg-indigo-100 transition-colors flex items-center gap-1 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-900/40"
                  >
                    <Download className="h-4 w-4" />
                    Open PDF Resume
                  </a>
                </div>
              </div>

              {/* Grid detail cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Contact Card */}
                <div className="rounded-xl border border-slate-150 p-5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Contact Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-650 dark:text-slate-350">
                      <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <a href={`mailto:${selectedApp.email}`} className="hover:text-indigo-650 hover:underline">
                        {selectedApp.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-slate-650 dark:text-slate-350">
                      <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span>{selectedApp.phone}</span>
                    </div>
                    {selectedApp.address && (
                      <div className="flex items-center gap-2 text-slate-650 dark:text-slate-350">
                        <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        <span>{selectedApp.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Professional details */}
                <div className="rounded-xl border border-slate-150 p-5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Professional Stats</h3>
                  <div className="space-y-2 text-sm text-slate-650 dark:text-slate-350">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Experience:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{selectedApp.yearsOfExperience} years</span>
                    </div>
                    {selectedApp.currentCompany && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Current Company:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{selectedApp.currentCompany}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">Notice Period:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{selectedApp.noticePeriod || 'N/A'}</span>
                    </div>
                    {(selectedApp.currentCtc || selectedApp.expectedCtc) && (
                      <div className="flex justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800">
                        <span className="text-slate-400">CTC (Curr / Exp):</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {selectedApp.currentCtc || 'N/A'} / {selectedApp.expectedCtc || 'N/A'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Profiles */}
              {(selectedApp.linkedIn || selectedApp.gitHub || selectedApp.portfolio) && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 mb-3">Social & Portfolios</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {selectedApp.linkedIn && (
                      <a
                        href={selectedApp.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors"
                      >
                        LinkedIn
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {selectedApp.gitHub && (
                      <a
                        href={selectedApp.gitHub}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors"
                      >
                        GitHub
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {selectedApp.portfolio && (
                      <a
                        href={selectedApp.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors"
                      >
                        Portfolio
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Skills Tags */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-455 mb-2">Core Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApp.skills.split(',').map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-full bg-indigo-50/50 px-3 py-1 text-xs text-indigo-755 border border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cover Letter */}
              {selectedApp.coverLetter && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-455 mb-2">Cover Letter</h3>
                  <div className="rounded-xl border border-slate-150 p-5 bg-slate-50/30 text-sm text-slate-650 dark:border-slate-800 dark:bg-slate-950/20 dark:text-slate-350 whitespace-pre-wrap leading-relaxed">
                    {selectedApp.coverLetter}
                  </div>
                </div>
              )}

              {/* Action Update Form */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Application Decision & Notes</h3>
                
                <form onSubmit={handleUpdateApplication} className="space-y-4">
                  {updateSuccess && (
                    <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900">
                      <CheckCircle className="h-5 w-5 flex-shrink-0" />
                      <span>Application decision saved and candidate notified successfully.</span>
                    </div>
                  )}

                  {updateError && (
                    <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-4 text-sm text-rose-700 border border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900">
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <span>{updateError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Pipeline Status
                      </label>
                      <select
                        value={updateStatus}
                        onChange={(e) => setUpdateStatus(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-950 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      >
                        <option value="SUBMITTED">Submitted</option>
                        <option value="SHORTLISTED">Shortlist</option>
                        <option value="INTERVIEW_SCHEDULED">Schedule Interview</option>
                        <option value="OFFER_RELEASED">Release Offer</option>
                        <option value="ACCEPTED">Mark as Accepted</option>
                        <option value="REJECTED">Reject Applicant</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Message / Custom Notification (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Add a custom update message sent directly to the candidate..."
                        value={customNotification}
                        onChange={(e) => setCustomNotification(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-955 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-lg bg-indigo-650 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-600 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Action & Notify'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="text-center py-24 flex flex-col justify-center h-full">
              <User className="mx-auto h-12 w-12 text-slate-350" />
              <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">No candidate selected</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Select an applicant from the left pane to review their details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
