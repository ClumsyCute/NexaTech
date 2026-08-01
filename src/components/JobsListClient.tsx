'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, MapPin, Briefcase, GraduationCap, DollarSign, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  experience: string;
  skills: string;
  salary: string | null;
  employmentType: string;
  deadline: string | Date;
  status: string;
  createdAt: string | Date;
}

interface JobsListClientProps {
  initialJobs: Job[];
}

export default function JobsListClient({ initialJobs }: JobsListClientProps) {
  const [search, setSearch] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Derived filter options
  const locations = useMemo(() => {
    const set = new Set(initialJobs.map((j) => j.location));
    return Array.from(set);
  }, [initialJobs]);

  const experiences = ['Entry Level', 'Mid Level', 'Senior', 'Lead'];
  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];

  const toggleLocation = (loc: string) => {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc],
    );
  };

  const toggleExperience = (exp: string) => {
    setSelectedExperience((prev) =>
      prev.includes(exp) ? prev.filter((e) => e !== exp) : [...prev, exp],
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedLocations([]);
    setSelectedExperience([]);
    setSelectedTypes([]);
  };

  // Filter logic
  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      // 1. Search Query Match
      const matchesSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.skills.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase());

      // 2. Location Match
      const matchesLocation =
        selectedLocations.length === 0 || selectedLocations.includes(job.location);

      // 3. Experience Match
      const matchesExperience =
        selectedExperience.length === 0 || selectedExperience.includes(job.experience);

      // 4. Employment Type Match
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(job.employmentType);

      return matchesSearch && matchesLocation && matchesExperience && matchesType;
    });
  }, [initialJobs, search, selectedLocations, selectedExperience, selectedTypes]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center md:text-left mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Current Career Opportunities
        </h1>
        <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
          Find your next challenge. Apply to join our team of innovators.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Left Column: Sidebar Filters */}
        <div className="space-y-6 lg:col-span-1">
          {/* Search Box */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Search Jobs</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Title, skills, keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm text-slate-950 bg-slate-50 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
            </div>
          </div>

          {/* Filters Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Filter Results</h2>
              {(selectedLocations.length > 0 ||
                selectedExperience.length > 0 ||
                selectedTypes.length > 0 ||
                search.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Employment Type Filter */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Job Type</h3>
              <div className="space-y-2">
                {employmentTypes.map((type) => (
                  <label key={type} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleType(type)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-850 dark:bg-slate-950"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Location</h3>
              <div className="space-y-2">
                {locations.map((loc) => (
                  <label key={loc} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(loc)}
                      onChange={() => toggleLocation(loc)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-850 dark:bg-slate-950"
                    />
                    <span>{loc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Experience Level</h3>
              <div className="space-y-2">
                {experiences.map((exp) => (
                  <label key={exp} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedExperience.includes(exp)}
                      onChange={() => toggleExperience(exp)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-850 dark:bg-slate-950"
                    />
                    <span>{exp}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Jobs list */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4 px-1">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing <span className="font-semibold text-slate-900 dark:text-white">{filteredJobs.length}</span> job openings
            </p>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job, idx) => (
                  <motion.div
                    key={job.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-950/40 dark:text-indigo-400 dark:ring-indigo-500/20">
                          {job.employmentType}
                        </span>
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {job.experience}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {job.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          {job.location}
                        </span>
                        {job.salary && (
                          <span className="flex items-center gap-0.5">
                            <DollarSign className="h-4 w-4 text-slate-400" />
                            {job.salary}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4 text-slate-400" />
                          Deadline: {new Date(job.deadline).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </span>
                      </div>

                      {/* Displaying brief skills tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                        {job.skills.split(',').map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-xs text-slate-600 border border-slate-200/60 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="w-full md:w-auto text-center rounded-lg bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-all flex items-center justify-center gap-1 group/btn dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-900/40"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                      </Link>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-16 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <Briefcase className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">No jobs found</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Try adjusting your search query or clear all filters.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={clearFilters}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
