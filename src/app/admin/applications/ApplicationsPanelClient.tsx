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
  Sparkles,
  Send,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'SHORTLISTED':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'INTERVIEW_SCHEDULED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'OFFER_RELEASED':
      case 'ACCEPTED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'REJECTED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col h-[calc(100vh-4rem)] pt-20">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center pb-6 border-b border-white/5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white">Review Pipeline</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Admin Portal
            </span>
          </div>
          <p className="text-xs text-zinc-400">Filter candidates, download resumes, and manage interview schedules with realtime updates.</p>
        </div>
        <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-grow sm:flex-grow-0">
            <input
              type="text"
              placeholder="Search candidate or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 rounded-xl border border-white/10 py-2 pl-9 pr-3 text-xs text-white bg-white/[0.03] focus:border-emerald-500/50 focus:bg-white/[0.06] focus:outline-none placeholder:text-zinc-500 transition-all"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-white/10 py-2 px-3 text-xs text-zinc-300 bg-zinc-900 focus:border-emerald-500/50 focus:outline-none transition-all cursor-pointer"
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
            className="rounded-xl border border-white/10 py-2 px-3 text-xs text-zinc-300 bg-zinc-900 focus:border-emerald-500/50 focus:outline-none transition-all cursor-pointer"
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow overflow-hidden">
        {/* Left Column: Candidates list */}
        <div className="lg:col-span-4 glass-card rounded-2xl overflow-y-auto flex flex-col max-h-[320px] lg:max-h-full border border-white/10">
          <div className="px-5 py-3.5 border-b border-white/5 sticky top-0 bg-zinc-950/80 backdrop-blur-md z-10 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">
              Applications ({filteredApps.length})
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Live</span>
          </div>

          {filteredApps.length > 0 ? (
            <div className="divide-y divide-white/5 flex-grow">
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`w-full text-left p-4 hover:bg-white/[0.04] transition-all flex flex-col gap-1.5 relative ${
                    selectedAppId === app.id
                      ? 'bg-emerald-500/[0.07] border-l-2 border-emerald-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]'
                      : 'border-l-2 border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-white text-sm truncate max-w-[170px]">
                      {app.name}
                    </h3>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getStatusBadgeClass(
                        app.status,
                      )}`}
                    >
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 truncate">
                    {app.job.title}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-600" />
                      {app.yearsOfExperience} yrs exp
                    </span>
                    <span>{new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 flex-grow flex flex-col justify-center items-center">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                <Inbox className="h-6 w-6 text-zinc-500" />
              </div>
              <p className="text-xs text-zinc-400 font-medium">No applications match your criteria.</p>
            </div>
          )}
        </div>

        {/* Right Column: Candidate review sheet */}
        <div className="lg:col-span-8 glass-card rounded-2xl overflow-y-auto max-h-[calc(100vh-16rem)] lg:max-h-full border border-white/10">
          {selectedApp ? (
            <div className="p-6 sm:p-8 space-y-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-white/5 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                      {selectedApp.job.title}
                    </span>
                    <span className="text-xs text-zinc-500">• {selectedApp.job.location}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {selectedApp.name}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Submitted on {new Date(selectedApp.createdAt).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <a
                    href={`/dashboard/offer/${selectedApp.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 border border-emerald-500/20 shadow-sm"
                  >
                    <Award className="h-3.5 w-3.5" />
                    Preview Offer
                  </a>
                  <a
                    href={`/api/admin/resumes/download/${selectedApp.resumePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-zinc-950 text-white px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 border border-white/10 shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download Resume
                  </a>
                </div>
              </div>

              {/* Grid detail cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contact Card */}
                <div className="rounded-2xl border border-white/5 p-5 bg-white/[0.02]">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    Contact Information
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center gap-2.5 text-zinc-300">
                      <Mail className="h-4 w-4 text-zinc-500 flex-shrink-0" />
                      <a href={`mailto:${selectedApp.email}`} className="hover:text-emerald-400 hover:underline transition-colors">
                        {selectedApp.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2.5 text-zinc-300">
                      <Phone className="h-4 w-4 text-zinc-500 flex-shrink-0" />
                      <span>{selectedApp.phone}</span>
                    </div>
                    {selectedApp.address && (
                      <div className="flex items-center gap-2.5 text-zinc-300">
                        <MapPin className="h-4 w-4 text-zinc-500 flex-shrink-0" />
                        <span>{selectedApp.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Professional details */}
                <div className="rounded-2xl border border-white/5 p-5 bg-white/[0.02]">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3.5 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                    Professional Background
                  </h3>
                  <div className="space-y-2 text-xs text-zinc-300">
                    <div className="flex justify-between py-0.5">
                      <span className="text-zinc-500">Total Experience:</span>
                      <span className="font-semibold text-white">{selectedApp.yearsOfExperience} years</span>
                    </div>
                    {selectedApp.currentCompany && (
                      <div className="flex justify-between py-0.5">
                        <span className="text-zinc-500">Current Company:</span>
                        <span className="font-semibold text-white">{selectedApp.currentCompany}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-0.5">
                      <span className="text-zinc-500">Notice Period:</span>
                      <span className="font-semibold text-white">{selectedApp.noticePeriod || 'Immediate'}</span>
                    </div>
                    {(selectedApp.currentCtc || selectedApp.expectedCtc) && (
                      <div className="flex justify-between pt-2 border-t border-white/5">
                        <span className="text-zinc-500">CTC (Curr / Exp):</span>
                        <span className="font-semibold text-emerald-400">
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
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3">Links & Online Presence</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {selectedApp.linkedIn && (
                      <a
                        href={selectedApp.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-zinc-300 hover:bg-white/[0.08] hover:text-white transition-colors"
                      >
                        LinkedIn
                        <ExternalLink className="h-3 w-3 text-zinc-500" />
                      </a>
                    )}
                    {selectedApp.gitHub && (
                      <a
                        href={selectedApp.gitHub}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-zinc-300 hover:bg-white/[0.08] hover:text-white transition-colors"
                      >
                        GitHub
                        <ExternalLink className="h-3 w-3 text-zinc-500" />
                      </a>
                    )}
                    {selectedApp.portfolio && (
                      <a
                        href={selectedApp.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-zinc-300 hover:bg-white/[0.08] hover:text-white transition-colors"
                      >
                        Portfolio
                        <ExternalLink className="h-3 w-3 text-zinc-500" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Skills Tags */}
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2.5">Tagged Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedApp.skills.split(',').map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-xl bg-white/[0.04] px-3 py-1 text-xs text-zinc-200 border border-white/10"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cover Letter */}
              {selectedApp.coverLetter && (
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2.5">Cover Letter</h3>
                  <div className="rounded-2xl border border-white/5 p-5 bg-white/[0.02] text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {selectedApp.coverLetter}
                  </div>
                </div>
              )}

              {/* Action Update Form */}
              <div className="border-t border-white/5 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Application Decision & Notifications</h3>
                </div>
                
                <form onSubmit={handleUpdateApplication} className="space-y-4">
                  {updateSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2.5 rounded-xl bg-emerald-500/10 p-4 text-xs text-emerald-400 border border-emerald-500/20"
                    >
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                      <span>Application decision saved and candidate notified automatically.</span>
                    </motion.div>
                  )}

                  {updateError && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2.5 rounded-xl bg-rose-500/10 p-4 text-xs text-rose-400 border border-rose-500/20"
                    >
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{updateError}</span>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5">
                        Pipeline Status
                      </label>
                      <select
                        value={updateStatus}
                        onChange={(e) => setUpdateStatus(e.target.value)}
                        className="w-full rounded-xl border border-white/10 py-2.5 px-3.5 text-xs text-white bg-zinc-900 focus:border-emerald-500/50 focus:outline-none transition-all cursor-pointer"
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
                      <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5">
                        Custom Notification to Candidate (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 'We loved your profile and would like to set up an interview this Thursday.'"
                        value={customNotification}
                        onChange={(e) => setCustomNotification(e.target.value)}
                        className="w-full rounded-xl border border-white/10 py-2.5 px-3.5 text-xs text-white bg-white/[0.03] focus:border-emerald-500/50 focus:bg-white/[0.06] focus:outline-none placeholder:text-zinc-600 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:opacity-50 transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Saving changes...
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          Update & Notify
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="text-center py-28 flex flex-col justify-center items-center h-full">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                <User className="h-7 w-7 text-zinc-500" />
              </div>
              <h3 className="text-sm font-semibold text-white">No candidate selected</h3>
              <p className="mt-1 text-xs text-zinc-400 max-w-xs">
                Select an applicant from the left pane to review their background, skills, and resume.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
