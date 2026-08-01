'use client';

import Link from 'next/link';
import { ArrowRight, Compass, Heart, Award, Shield, Users, Zap } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

export default function HomePage() {
  const benefits = [
    {
      icon: <Award className="h-6 w-6 text-emerald-400" />,
      title: 'Competitive Compensation',
      desc: 'Top-tier base salaries, performance bonuses, and early-stage equity opportunities.',
    },
    {
      icon: <Compass className="h-6 w-6 text-emerald-400" />,
      title: 'Flexible & Remote-First',
      desc: 'Work from anywhere in the world. Choose your own hours and set up your optimal schedule.',
    },
    {
      icon: <Heart className="h-6 w-6 text-emerald-400" />,
      title: 'Premium Healthcare',
      desc: 'Comprehensive medical, dental, and vision insurance for you and your dependents.',
    },
    {
      icon: <Shield className="h-6 w-6 text-emerald-400" />,
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

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32 flex justify-center min-h-[90vh] items-center">
        {/* Animated Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 z-10">
          <motion.div 
            initial="hidden" 
            animate="show" 
            variants={staggerContainer}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-400 border border-emerald-500/20 mb-8 backdrop-blur-md">
              <Zap className="h-4 w-4" /> We are expanding our core team!
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl mb-8 leading-tight">
              Build the Next Generation of <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Developer Tools</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="mt-4 text-lg leading-relaxed text-zinc-400 max-w-2xl mx-auto">
              NexaTech is pioneering the next era of high-performance developer infrastructure, secure API orchestration, and real-time AI agents. Join our world-class remote engineering team.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link
                href="/jobs"
                className="w-full sm:w-auto rounded-xl bg-emerald-500 px-8 py-4 text-base font-semibold text-zinc-950 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all duration-300 flex items-center justify-center gap-2 group hover:scale-105"
              >
                Explore Job Openings
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link 
                href="#culture" 
                className="w-full sm:w-auto rounded-xl glass px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-white/5 flex items-center justify-center"
              >
                Learn about our culture
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Bento Grid */}
      <section className="py-12 relative z-20 -mt-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 gap-4 md:grid-cols-4"
          >
            {[
              { stat: '100%', label: 'Remote & Distributed' },
              { stat: '10M+', label: 'API Requests / Day' },
              { stat: 'Series A', label: 'Backed by Top VCs' },
              { stat: '$3,000', label: 'Annual Learning Allowance' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="glass-card rounded-2xl p-6 text-center group flex flex-col justify-center min-h-[160px]">
                <p className="text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">{item.stat}</p>
                <p className="mt-2 text-sm font-medium text-zinc-400">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section id="culture" className="py-24 scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Our Core Engineering Values
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              We focus on shipping reliable products that make software engineering better for everyone.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {coreValues.map((val, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="glass-card flex flex-col justify-between rounded-2xl p-8 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500 translate-x-4 -translate-y-4">
                  <Users className="h-24 w-24 text-emerald-400" />
                </div>
                <div className="relative z-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Users className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors duration-300">{val.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{val.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-zinc-950/50 border-y border-white/5" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Benefits & Perks
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              We support our team globally with wellness, technology, and learning programs designed for remote success.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {benefits.map((ben, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="glass-card rounded-2xl p-6 group"
              >
                <div className="mb-6 h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-all duration-300">
                  {ben.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{ben.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{ben.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Hiring Process Section */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Our Interview Process
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              We value your time. We aim to complete our full cycle in under two weeks.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-6 md:grid-cols-4 relative"
          >
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2 z-0" />
            
            {processSteps.map((step, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="relative z-10 glass-card p-6 rounded-2xl flex flex-col h-full group hover:-translate-y-2 transition-transform duration-300">
                <span className="text-4xl font-black text-white/5 group-hover:text-emerald-500/10 transition-colors duration-300 absolute top-4 right-4">{step.step}</span>
                <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] mb-6 ring-4 ring-zinc-950" />
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-zinc-400 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Ready to apply CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/5 border-t border-emerald-500/10" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[300px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none translate-y-1/2" />
        
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-6">Ready to write code that matters?</h2>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Check out our openings, find a match for your skills, and submit an application in minutes.
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-zinc-950 shadow-xl hover:bg-zinc-200 transition-all duration-300 hover:scale-105"
          >
            Browse Open Positions
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
