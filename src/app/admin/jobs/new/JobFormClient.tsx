'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, Sparkles, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function JobFormClient() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Remote');
  const [experience, setExperience] = useState('Mid Level');
  const [skills, setSkills] = useState('');
  const [salary, setSalary] = useState('');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [deadline, setDeadline] = useState('');

  // Status State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !description || !location || !skills || !deadline) {
      return setError('Please fill out all required fields.');
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          location,
          experience,
          skills,
          salary: salary || undefined,
          employmentType,
          deadline,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create job opening.');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 rounded-2xl bg-rose-500/10 p-4 text-xs text-rose-400 border border-rose-500/20"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Job Title <span className="text-emerald-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Principal Distributed Systems Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-white/10 py-3 px-4 text-sm text-white bg-white/[0.03] focus:border-emerald-500/50 focus:bg-white/[0.06] focus:outline-none placeholder:text-zinc-600 transition-all shadow-inner"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Location <span className="text-emerald-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Remote, San Francisco, CA"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-xl border border-white/10 py-3 px-4 text-sm text-white bg-white/[0.03] focus:border-emerald-500/50 focus:bg-white/[0.06] focus:outline-none placeholder:text-zinc-600 transition-all shadow-inner"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Compensation Range
          </label>
          <input
            type="text"
            placeholder="e.g. $160,000 - $210,000 + Equity"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full rounded-xl border border-white/10 py-3 px-4 text-sm text-white bg-white/[0.03] focus:border-emerald-500/50 focus:bg-white/[0.06] focus:outline-none placeholder:text-zinc-600 transition-all shadow-inner"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Employment Type <span className="text-emerald-400">*</span>
          </label>
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="w-full rounded-xl border border-white/10 py-3 px-4 text-sm text-zinc-200 bg-zinc-900 focus:border-emerald-500/50 focus:outline-none transition-all cursor-pointer shadow-inner"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Experience Level <span className="text-emerald-400">*</span>
          </label>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full rounded-xl border border-white/10 py-3 px-4 text-sm text-zinc-200 bg-zinc-900 focus:border-emerald-500/50 focus:outline-none transition-all cursor-pointer shadow-inner"
          >
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Core Required Skills <span className="text-emerald-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="React, TypeScript, Go, Distributed Systems"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full rounded-xl border border-white/10 py-3 px-4 text-sm text-white bg-white/[0.03] focus:border-emerald-500/50 focus:bg-white/[0.06] focus:outline-none placeholder:text-zinc-600 transition-all shadow-inner"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Application Deadline <span className="text-emerald-400">*</span>
          </label>
          <input
            type="date"
            required
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full rounded-xl border border-white/10 py-3 px-4 text-sm text-white bg-white/[0.03] focus:border-emerald-500/50 focus:bg-white/[0.06] focus:outline-none placeholder:text-zinc-600 transition-all shadow-inner [color-scheme:dark]"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Job Description & Responsibilities <span className="text-emerald-400">*</span>
          </label>
          <textarea
            required
            rows={8}
            placeholder="Provide a comprehensive breakdown of mission objectives, daily responsibilities, qualification requirements, and benefits..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-2xl border border-white/10 py-3.5 px-4 text-sm text-zinc-200 bg-white/[0.03] focus:border-emerald-500/50 focus:bg-white/[0.06] focus:outline-none placeholder:text-zinc-600 transition-all shadow-inner font-mono leading-relaxed"
          />
        </div>
      </div>

      <div className="border-t border-white/5 pt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.45)] hover:scale-[1.02] disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Publishing position...
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5" />
              Publish Job Opening
            </>
          )}
        </button>
      </div>
    </form>
  );
}
