import Link from 'next/link';
import { ArrowRight, Compass, Heart, Award, Shield, Users, Zap, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const benefits = [
    {
      icon: <Award className="h-6 w-6 text-indigo-600" />,
      title: 'Competitive Compensation',
      desc: 'Top-tier base salaries, performance bonuses, and early-stage equity opportunities.',
    },
    {
      icon: <Compass className="h-6 w-6 text-indigo-600" />,
      title: 'Flexible & Remote-First',
      desc: 'Work from anywhere in the world. Choose your own hours and set up your optimal schedule.',
    },
    {
      icon: <Heart className="h-6 w-6 text-indigo-600" />,
      title: 'Premium Healthcare',
      desc: 'Comprehensive medical, dental, and vision insurance for you and your dependents.',
    },
    {
      icon: <Shield className="h-6 w-6 text-indigo-600" />,
      title: 'Annual Learning Stipend',
      desc: '$3,000 yearly allowance for conferences, courses, books, and educational tools.',
    },
  ];

  const coreValues = [
    {
      title: 'Obsess Over Developer UX',
      desc: 'Everything we build is designed to make developer workflows faster, cleaner, and more enjoyable.',
    },
    {
      title: 'Take Complete Ownership',
      desc: 'We trust our team. You own your projects from concept and architecture to production deployment.',
    },
    {
      title: 'Continuous Growth',
      desc: 'We foster an environment of constant learning, mentoring, and experimenting with new tech stacks.',
    },
  ];

  const processSteps = [
    { step: '01', title: 'Resume Review', desc: 'Our team reviews your application, portfolio, and relevant skills.' },
    { step: '02', title: 'Technical Chat', desc: 'A 45-minute call to discuss your engineering background and system design.' },
    { step: '03', title: 'Practical Task', desc: 'A real-world take-home exercise or live pair programming session.' },
    { step: '04', title: 'Team Fit & Offer', desc: 'Meet the team, align on roles, and receive your personalized offer.' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-24 text-white sm:py-32">
        {/* Subtle mesh background grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-400 via-indigo-600 to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-4 py-1.5 text-sm font-semibold text-indigo-400 ring-1 ring-inset ring-indigo-500/20 mb-6">
              <Zap className="h-4 w-4" /> We are expanding our core team!
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Build the Next Generation of Developer Tools
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              NexaTech is pioneering the next era of high-performance developer infrastructure, secure API orchestration, and real-time AI agents. Join our world-class remote engineering team.
            </p>
            <div className="mt-10 flex items-center justify-center gap-6">
              <Link
                href="/jobs"
                className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-md hover:bg-indigo-500 transition-all flex items-center gap-2 group hover:shadow-indigo-500/15"
              >
                Explore Job Openings
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="#culture" className="text-sm font-semibold leading-6 text-white hover:text-indigo-400 transition-colors">
                Learn about our culture <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            <div>
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">100%</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Remote & Distributed</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">10M+</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">API Requests / Day</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">Series A</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Backed by Top VCs</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">$3,000</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Annual Learning Allowance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section id="culture" className="py-24 bg-slate-50 dark:bg-slate-950 scroll-mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Our Core Engineering Values
            </h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              We focus on shipping reliable products that make software engineering better for everyone.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {coreValues.map((val, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/50 mb-6">
                    <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{val.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-24 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Benefits & Perks
            </h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              We support our team globally with wellness, technology, and learning programs designed for remote success.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((ben, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-100 p-8 shadow-sm dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{ben.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{ben.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{ben.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring Process Section */}
      <section className="bg-slate-50 py-24 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Our Interview Process
            </h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              We value your time. We aim to complete our full cycle in under two weeks.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4 relative">
            {processSteps.map((step, idx) => (
              <div key={idx} className="relative bg-white p-8 rounded-2xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800 shadow-sm">
                <span className="absolute top-4 right-4 text-4xl font-extrabold text-indigo-50/80 dark:text-indigo-950/20">{step.step}</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ready to apply CTA */}
      <section className="bg-indigo-600 py-16 text-center text-white dark:bg-indigo-700">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Ready to write code that matters?</h2>
          <p className="mt-4 text-lg text-indigo-100">
            Check out our openings, find a match for your skills, and submit an application in minutes.
          </p>
          <div className="mt-8">
            <Link
              href="/jobs"
              className="rounded-lg bg-white px-6 py-3 text-base font-semibold text-indigo-600 shadow-md hover:bg-slate-50 transition-colors inline-flex items-center gap-2"
            >
              Browse Open Positions
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
