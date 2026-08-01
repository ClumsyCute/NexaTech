'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Upload, FileCheck, AlertCircle } from 'lucide-react';

interface ApplyFormClientProps {
  jobId: string;
  candidateName: string;
  candidateEmail: string;
}

export default function ApplyFormClient({ jobId, candidateName, candidateEmail }: ApplyFormClientProps) {
  const router = useRouter();

  // Form State
  const [name, setName] = useState(candidateName);
  const [email, setEmail] = useState(candidateEmail);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [gitHub, setGitHub] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [currentCtc, setCurrentCtc] = useState('');
  const [expectedCtc, setExpectedCtc] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('Immediate');
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState<File | null>(null);

  // Status State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Only PDF resumes are supported.');
        setResume(null);
      } else if (file.size > 10 * 1024 * 1024) {
        setError('Resume size must be under 10MB.');
        setResume(null);
      } else {
        setError(null);
        setResume(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Manual Validation for required fields
    if (!phone) return setError('Phone number is required.');
    if (!yearsOfExperience || isNaN(parseFloat(yearsOfExperience))) {
      return setError('Please enter a valid number for years of experience.');
    }
    if (!skills) return setError('Please specify at least one skill.');
    if (!resume) return setError('Please upload your resume PDF.');

    setLoading(true);

    // Build form data
    const formData = new FormData();
    formData.append('jobId', jobId);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('linkedIn', linkedIn);
    formData.append('gitHub', gitHub);
    formData.append('portfolio', portfolio);
    formData.append('yearsOfExperience', yearsOfExperience);
    formData.append('skills', skills);
    formData.append('currentCompany', currentCompany);
    formData.append('currentCtc', currentCtc);
    formData.append('expectedCtc', expectedCtc);
    formData.append('noticePeriod', noticePeriod);
    formData.append('coverLetter', coverLetter);
    formData.append('resume', resume);

    try {
      const res = await fetch('/api/applications/apply', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed. Please try again.');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 mb-4">
          <FileCheck className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Application Submitted!</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Thank you for applying. We are redirecting you to your candidate dashboard to track progress...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-4 text-sm text-rose-700 border border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Section 1: Personal Details */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-4">
          1. Personal Details
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-955 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-955 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-955 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Address</label>
            <input
              type="text"
              placeholder="City, Country"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-955 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Profiles & Links */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-4">
          2. Profiles & Links
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">LinkedIn URL</label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/username"
              value={linkedIn}
              onChange={(e) => setLinkedIn(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-955 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">GitHub URL</label>
            <input
              type="url"
              placeholder="https://github.com/username"
              value={gitHub}
              onChange={(e) => setGitHub(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-955 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Portfolio URL</label>
            <input
              type="url"
              placeholder="https://portfolio.me"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-955 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Professional Experience */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-4">
          3. Professional Experience
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Years of Experience *</label>
            <input
              type="number"
              step="0.1"
              required
              placeholder="e.g. 3.5"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-955 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Core Skills *</label>
            <input
              type="text"
              required
              placeholder="React, TypeScript, Node.js (comma-separated)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-955 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Current Company</label>
            <input
              type="text"
              placeholder="e.g. Acme Corp"
              value={currentCompany}
              onChange={(e) => setCurrentCompany(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-955 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Notice Period</label>
            <select
              value={noticePeriod}
              onChange={(e) => setNoticePeriod(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-955 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            >
              <option value="Immediate">Immediate</option>
              <option value="15 days">15 days</option>
              <option value="30 days">30 days</option>
              <option value="60 days">60 days</option>
              <option value="90 days">90 days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Current Salary / CTC</label>
            <input
              type="text"
              placeholder="e.g. $110,000 / yr"
              value={currentCtc}
              onChange={(e) => setCurrentCtc(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-955 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Expected Salary / CTC</label>
            <input
              type="text"
              placeholder="e.g. $135,000 / yr"
              value={expectedCtc}
              onChange={(e) => setExpectedCtc(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-955 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Resume & Cover Letter */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-4">
          4. Resume & Cover Letter
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Upload PDF Resume *</label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-300 px-6 py-10 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20">
              <div className="text-center">
                {resume ? (
                  <div className="flex flex-col items-center">
                    <FileCheck className="mx-auto h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                    <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">{resume.name}</p>
                    <p className="text-xs text-slate-500">{(resume.size / 1024 / 1024).toFixed(2)} MB &bull; PDF format</p>
                    <label className="mt-4 cursor-pointer text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                      Change Resume
                      <input type="file" accept=".pdf" className="sr-only" onChange={handleFileChange} />
                    </label>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="mt-4 flex text-sm text-slate-650 justify-center">
                      <label className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 hover:text-indigo-500 focus-within:outline-none dark:text-indigo-400">
                        <span>Upload a file</span>
                        <input type="file" accept=".pdf" className="sr-only" onChange={handleFileChange} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500">PDF up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Cover Letter</label>
            <textarea
              rows={4}
              placeholder="Introduce yourself and explain why you want to join NexaTech..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-955 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50 transition-colors flex items-center gap-1.5"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>
    </form>
  );
}
