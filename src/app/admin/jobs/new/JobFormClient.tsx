'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, FilePlus } from 'lucide-react';

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
        <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-4 text-sm text-rose-700 border border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Job Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. Senior Software Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 block w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-950 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Location *</label>
          <input
            type="text"
            required
            placeholder="e.g. Remote, San Francisco, CA"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-2 block w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-950 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Salary Range</label>
          <input
            type="text"
            placeholder="e.g. $130,000 - $160,000"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="mt-2 block w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-950 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Employment Type *</label>
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="mt-2 block w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-955 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Experience Level *</label>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="mt-2 block w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-955 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          >
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Core Required Skills *</label>
          <input
            type="text"
            required
            placeholder="React, Node.js, TypeScript (comma-separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="mt-2 block w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-955 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Application Deadline *</label>
          <input
            type="date"
            required
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="mt-2 block w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-955 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Job Description * (Supports spacing)</label>
          <textarea
            required
            rows={10}
            placeholder="Enter role overview, responsibilities, and requirements..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 block w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-sm text-slate-955 bg-slate-50 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white font-mono"
          />
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex justify-end gap-3">
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
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50 transition-all flex items-center gap-1.5"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Publishing...
            </>
          ) : (
            'Publish Job Opening'
          )}
        </button>
      </div>
    </form>
  );
}
