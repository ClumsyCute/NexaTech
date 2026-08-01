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
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 pt-24 min-h-[90vh]">
      {/* Header */}
      <div className="text-center md:text-left mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          Current Career Opportunities
        </h1>
        <p className="mt-4 text-lg text-zinc-400 max-w-2xl">
          Find your next challenge. Apply to join our team of innovators.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 relative z-10">
        {/* Left Column: Sidebar Filters */}
        <div className="space-y-6 lg:col-span-1">
          {/* Search Box */}
          <div className="rounded-2xl glass-card p-5">
            <h2 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">Search Jobs</h2>
            <div className="relative group">
              <input
                type="text"
                placeholder="Title, skills, keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 py-2.5 pl-10 pr-4 text-sm text-white bg-black/20 focus:border-emerald-500/50 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
              />
              <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
            </div>
          </div>

          {/* Filters Card */}
          <div className="rounded-2xl glass-card p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <h2 className="text-sm font-semibold text-white tracking-wide uppercase">Filters</h2>
              {(selectedLocations.length > 0 ||
                selectedExperience.length > 0 ||
                selectedTypes.length > 0 ||
                search.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-400/10 hover:bg-emerald-400/20 px-2 py-1 rounded-md"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Employment Type Filter */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
                <Briefcase className="h-3 w-3" /> Job Type
              </h3>
              <div className="space-y-2.5">
                {employmentTypes.map((type) => (
                  <label key={type} className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white cursor-pointer transition-colors group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                        className="peer h-4 w-4 appearance-none rounded border border-white/20 bg-black/20 checked:border-emerald-500 checked:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                      />
                      <svg className="absolute w-2.5 h-2.5 text-zinc-950 opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
                <MapPin className="h-3 w-3" /> Location
              </h3>
              <div className="space-y-2.5">
                {locations.map((loc) => (
                  <label key={loc} className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white cursor-pointer transition-colors group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(loc)}
                        onChange={() => toggleLocation(loc)}
                        className="peer h-4 w-4 appearance-none rounded border border-white/20 bg-black/20 checked:border-emerald-500 checked:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                      />
                      <svg className="absolute w-2.5 h-2.5 text-zinc-950 opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>{loc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
                <GraduationCap className="h-3 w-3" /> Experience Level
              </h3>
              <div className="space-y-2.5">
                {experiences.map((exp) => (
                  <label key={exp} className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white cursor-pointer transition-colors group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={selectedExperience.includes(exp)}
                        onChange={() => toggleExperience(exp)}
                        className="peer h-4 w-4 appearance-none rounded border border-white/20 bg-black/20 checked:border-emerald-500 checked:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                      />
                      <svg className="absolute w-2.5 h-2.5 text-zinc-950 opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>{exp}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Jobs list */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6 px-1">
            <p className="text-sm text-zinc-400">
              Showing <span className="font-semibold text-white">{filteredJobs.length}</span> open positions
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
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="group glass-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                          {job.employmentType}
                        </span>
                        <span className="inline-flex items-center rounded-lg bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-300 border border-white/10">
                          {job.experience}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {job.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-400">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-zinc-500" />
                          {job.location}
                        </span>
                        {job.salary && (
                          <span className="flex items-center gap-1.5">
                            <DollarSign className="h-4 w-4 text-zinc-500" />
                            {job.salary}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <GraduationCap className="h-4 w-4 text-zinc-500" />
                          Deadline: {new Date(job.deadline).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </span>
                      </div>

                      {/* Displaying brief skills tags */}
                      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-white/5">
                        {job.skills.split(',').map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center rounded-md bg-white/5 px-2 py-1 text-xs text-zinc-400 border border-white/5"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center md:pl-4">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="w-full md:w-auto text-center rounded-xl bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500 hover:text-zinc-950 transition-all duration-300 flex items-center justify-center gap-2 group/btn border border-white/10 hover:border-emerald-500"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 rounded-2xl border border-dashed border-white/10 glass bg-black/20"
                >
                  <Briefcase className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
                  <h3 className="text-lg font-semibold text-white">No jobs found</h3>
                  <p className="mt-2 text-sm text-zinc-400 max-w-sm mx-auto">
                    Try adjusting your search query or clear all filters to see more open positions.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={clearFilters}
                      className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
