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
      <div className="text-center py-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6 relative">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
          <FileCheck className="h-10 w-10 relative z-10" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Application Submitted!</h2>
        <p className="text-zinc-400 max-w-md mx-auto">
          Thank you for applying. We are redirecting you to your candidate dashboard to track progress...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-red-500/10 p-5 text-sm text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Section 1: Personal Details */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-sm border border-emerald-500/20">1</div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">
            Personal Details
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 bg-black/20 p-6 rounded-2xl border border-white/5">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500 mb-2">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 py-3 px-4 text-sm text-white bg-white/5 focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500 mb-2">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 py-3 px-4 text-sm text-white bg-white/5 focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500 mb-2">Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-white/10 py-3 px-4 text-sm text-white bg-white/5 focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500 mb-2">Address</label>
            <input
              type="text"
              placeholder="City, Country"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-white/10 py-3 px-4 text-sm text-white bg-white/5 focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Profiles & Links */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-sm border border-emerald-500/20">2</div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">
            Profiles & Links
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 bg-black/20 p-6 rounded-2xl border border-white/5">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500 mb-2">LinkedIn URL</label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/username"
              value={linkedIn}
              onChange={(e) => setLinkedIn(e.target.value)}
              className="w-full rounded-xl border border-white/10 py-3 px-4 text-sm text-white bg-white/5 focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500 mb-2">GitHub URL</label>
            <input
              type="url"
              placeholder="https://github.com/username"
              value={gitHub}
              onChange={(e) => setGitHub(e.target.value)}
              className="w-full rounded-xl border border-white/10 py-3 px-4 text-sm text-white bg-white/5 focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500 mb-2">Portfolio URL</label>
            <input
              type="url"
              placeholder="https://portfolio.me"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              className="w-full rounded-xl border border-white/10 py-3 px-4 text-sm text-white bg-white/5 focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Professional Experience */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-sm border border-emerald-500/20">3</div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">
            Professional Experience
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 bg-black/20 p-6 rounded-2xl border border-white/5">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500 mb-2">Years of Experience *</label>
            <input
              type="number"
              step="0.1"
              required
              placeholder="e.g. 3.5"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              className="w-full rounded-xl border border-white/10 py-3 px-4 text-sm text-white bg-white/5 focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500 mb-2">Core Skills *</label>
            <input
              type="text"
              required
              placeholder="React, TypeScript, Node.js"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full rounded-xl border border-white/10 py-3 px-4 text-sm text-white bg-white/5 focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500 mb-2">Current Company</label>
            <input
              type="text"
              placeholder="e.g. Acme Corp"
              value={currentCompany}
              onChange={(e) => setCurrentCompany(e.target.value)}
              className="w-full rounded-xl border border-white/10 py-3 px-4 text-sm text-white bg-white/5 focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500 mb-2">Notice Period</label>
            <select
              value={noticePeriod}
              onChange={(e) => setNoticePeriod(e.target.value)}
              className="w-full rounded-xl border border-white/10 py-3 px-4 text-sm text-white bg-white/5 focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none"
            >
              <option value="Immediate" className="bg-zinc-900">Immediate</option>
              <option value="15 days" className="bg-zinc-900">15 days</option>
              <option value="30 days" className="bg-zinc-900">30 days</option>
              <option value="60 days" className="bg-zinc-900">60 days</option>
              <option value="90 days" className="bg-zinc-900">90 days</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500 mb-2">Current Salary / CTC</label>
            <input
              type="text"
              placeholder="e.g. $110,000 / yr"
              value={currentCtc}
              onChange={(e) => setCurrentCtc(e.target.value)}
              className="w-full rounded-xl border border-white/10 py-3 px-4 text-sm text-white bg-white/5 focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500 mb-2">Expected Salary / CTC</label>
            <input
              type="text"
              placeholder="e.g. $135,000 / yr"
              value={expectedCtc}
              onChange={(e) => setExpectedCtc(e.target.value)}
              className="w-full rounded-xl border border-white/10 py-3 px-4 text-sm text-white bg-white/5 focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Resume & Cover Letter */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-sm border border-emerald-500/20">4</div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">
            Resume & Cover Letter
          </h3>
        </div>
        <div className="space-y-6 bg-black/20 p-6 rounded-2xl border border-white/5">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500 mb-2">Upload PDF Resume *</label>
            <div className="mt-2 flex justify-center rounded-xl border-2 border-dashed border-white/10 px-6 py-12 bg-white/5 hover:bg-white/10 hover:border-emerald-500/50 transition-all group relative">
              <input type="file" accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
              
              <div className="text-center pointer-events-none">
                {resume ? (
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                      <FileCheck className="h-8 w-8 text-emerald-400" />
                    </div>
                    <p className="text-sm font-bold text-white mb-1">{resume.name}</p>
                    <p className="text-xs text-zinc-500">{(resume.size / 1024 / 1024).toFixed(2)} MB &bull; PDF format</p>
                    <span className="mt-4 inline-block text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                      Click or drag to replace
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 group-hover:text-emerald-400 transition-all duration-300">
                      <Upload className="h-7 w-7 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <div className="mt-4 flex flex-col items-center text-sm">
                      <span className="font-semibold text-white group-hover:text-emerald-400 transition-colors mb-1">
                        Click to upload or drag and drop
                      </span>
                      <p className="text-xs text-zinc-500">PDF up to 10MB</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500 mb-2">Cover Letter</label>
            <textarea
              rows={4}
              placeholder="Introduce yourself and explain why you want to join NexaTech..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full rounded-xl border border-white/10 py-3 px-4 text-sm text-white bg-white/5 focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="border-t border-white/10 pt-8 flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-emerald-500 px-8 py-3.5 text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:opacity-50 transition-all flex items-center gap-2 hover:scale-105 disabled:hover:scale-100"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
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
