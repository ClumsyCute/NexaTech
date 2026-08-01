'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  Printer,
  Download,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Building2,
  Calendar,
  DollarSign,
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  FileCheck2,
} from 'lucide-react';

interface OfferPayload {
  offerReference: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateAddress: string;
  jobTitle: string;
  department: string;
  employmentType: string;
  location: string;
  experienceLevel: string;
  status: string;
  issuedDate: string;
  joiningDate: string;
  compensation: {
    baseSalary: string;
    annualPerformanceBonus: string;
    equityGrant: string;
    healthBenefits: string;
    remoteStipend: string;
    learningBudget: string;
    paidTimeOff: string;
  };
  executives: Array<{
    name: string;
    title: string;
    company: string;
  }>;
}

export default function OfferLetterPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const applicationId = resolvedParams.id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offer, setOffer] = useState<OfferPayload | null>(null);
  const [status, setStatus] = useState<string>('');
  const [accepting, setAccepting] = useState(false);
  const [acceptSuccess, setAcceptSuccess] = useState(false);

  useEffect(() => {
    async function fetchOffer() {
      try {
        setLoading(true);
        const res = await fetch(`/api/candidate/offer/${applicationId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to load offer letter.');
        }

        setOffer(data.data.offer);
        setStatus(data.data.application.status);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOffer();
  }, [applicationId]);

  const handlePrint = () => {
    window.print();
  };

  const handleAcceptOffer = async () => {
    setAccepting(true);
    try {
      const res = await fetch(`/api/candidate/offer/${applicationId}/accept`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to accept offer.');
      }

      setStatus('ACCEPTED');
      setAcceptSuccess(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center pt-20">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500 mb-4" />
        <p className="text-sm font-semibold text-zinc-400">Preparing official offer letter...</p>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 min-h-screen pt-32">
        <div className="glass-card rounded-3xl p-8 text-center border border-red-500/20">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Unable to load offer letter</h2>
          <p className="text-sm text-zinc-400 mb-6">{error || 'Offer letter is not accessible.'}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-zinc-950 hover:bg-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isAccepted = status === 'ACCEPTED';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Top Action Bar (hidden on print) */}
      <div className="mx-auto max-w-4xl mb-8 print:hidden">
        <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/dashboard"
              className="flex items-center justify-center h-10 w-10 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {offer.offerReference}
                </span>
                {isAccepted ? (
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Offer Accepted
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    Awaiting Candidate Decision
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-1">Official Employment Offer &bull; NexaTech Systems</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 text-xs font-bold text-white transition-all hover:scale-105 shadow-sm cursor-pointer"
            >
              <Printer className="h-4 w-4 text-emerald-400" />
              Print / Save as PDF
            </button>

            {!isAccepted && (
              <button
                type="button"
                onClick={handleAcceptOffer}
                disabled={accepting}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 px-5 py-2.5 text-xs font-extrabold text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
              >
                {accepting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Accepting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Accept Offer
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {acceptSuccess && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.15)] animate-in fade-in slide-in-from-top duration-300">
            <Sparkles className="h-5 w-5 text-emerald-400 flex-shrink-0" />
            <div className="text-xs">
              <strong className="font-bold text-white text-sm block">Offer Officially Accepted!</strong>
              Congratulations! Your acceptance confirmation has been registered. Welcome to NexaTech.
            </div>
          </div>
        )}
      </div>

      {/* Official Offer Letter Document Container */}
      <div
        id="offer-letter-document"
        className="mx-auto max-w-4xl bg-zinc-900 border border-white/10 rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden print:bg-white print:text-black print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none"
      >
        {/* Background Watermark (screen only) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.015] font-black text-[120px] pointer-events-none select-none tracking-widest uppercase rotate-[-25deg] print:hidden">
          NEXATECH
        </div>

        {/* Top Letterhead */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-8 mb-8 print:border-zinc-300 print:pb-6 print:mb-6">
          <div className="flex items-center gap-3.5 mb-4 sm:mb-0">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 print:bg-transparent print:border-emerald-700 print:text-emerald-700">
              <Briefcase className="h-7 w-7" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white print:text-black">
                Nexa<span className="text-emerald-400 print:text-emerald-700">Tech</span>
              </span>
              <p className="text-[11px] uppercase tracking-widest text-zinc-400 print:text-zinc-600 font-semibold">
                Autonomous Systems &bull; Global Talent
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <p className="text-xs font-mono font-bold text-emerald-400 print:text-emerald-700">
              REF: {offer.offerReference}
            </p>
            <p className="text-xs text-zinc-400 print:text-zinc-600">
              Date: <span className="font-semibold text-white print:text-black">{offer.issuedDate}</span>
            </p>
            <p className="text-xs text-zinc-500 print:text-zinc-500">
              San Francisco, CA &bull; Global Remote HQ
            </p>
          </div>
        </div>

        {/* Candidate Salutation */}
        <div className="mb-8 space-y-2 text-sm text-zinc-300 print:text-zinc-800">
          <p className="text-xs uppercase tracking-wider font-bold text-zinc-500 print:text-zinc-600">
            CONFIDENTIAL EMPLOYMENT OFFER FOR:
          </p>
          <h2 className="text-2xl font-extrabold text-white print:text-black">{offer.candidateName}</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-zinc-400 print:text-zinc-600 pt-1">
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-emerald-400 print:text-emerald-700" />
              {offer.candidateEmail}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-emerald-400 print:text-emerald-700" />
              {offer.candidatePhone}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-emerald-400 print:text-emerald-700" />
              {offer.candidateAddress}
            </span>
          </div>
        </div>

        {/* Introduction Paragraph */}
        <div className="mb-8 text-sm leading-relaxed text-zinc-300 print:text-zinc-800 space-y-3">
          <p>
            Dear <strong>{offer.candidateName}</strong>,
          </p>
          <p>
            On behalf of the executive leadership and engineering division at{' '}
            <strong>NexaTech Autonomous Systems, Inc.</strong>, we are thrilled to extend this formal offer of employment for the position of{' '}
            <strong className="text-emerald-400 print:text-black underline decoration-emerald-500/40">
              {offer.jobTitle}
            </strong>
            .
          </p>
          <p>
            Our interview panel was deeply impressed by your technical depth, domain expertise, and shared vision for building resilient, next-generation platforms. We are confident your contributions will make a transformative impact on our mission.
          </p>
        </div>

        {/* Position & Role Details Card */}
        <div className="mb-8 p-6 rounded-2xl bg-black/40 border border-white/5 print:bg-zinc-50 print:border-zinc-300 space-y-4">
          <h3 className="text-xs uppercase tracking-wider font-bold text-emerald-400 print:text-emerald-800 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Position & Schedule Overview
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-zinc-500 print:text-zinc-600 block">Position Title:</span>
              <span className="font-bold text-white print:text-black text-sm">{offer.jobTitle}</span>
            </div>
            <div>
              <span className="text-zinc-500 print:text-zinc-600 block">Department:</span>
              <span className="font-bold text-white print:text-black text-sm">{offer.department}</span>
            </div>
            <div>
              <span className="text-zinc-500 print:text-zinc-600 block">Location & Workplace:</span>
              <span className="font-bold text-white print:text-black text-sm">
                {offer.location} ({offer.employmentType})
              </span>
            </div>
            <div>
              <span className="text-zinc-500 print:text-zinc-600 block">Anticipated Start Date:</span>
              <span className="font-bold text-emerald-400 print:text-emerald-800 text-sm">
                {offer.joiningDate}
              </span>
            </div>
          </div>
        </div>

        {/* Compensation & Benefits Package */}
        <div className="mb-8 space-y-4">
          <h3 className="text-xs uppercase tracking-wider font-bold text-emerald-400 print:text-emerald-800 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Total Rewards & Compensation Package
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 print:bg-white print:border-zinc-300">
              <span className="text-[11px] uppercase font-bold text-zinc-500 print:text-zinc-600 block mb-1">
                Annual Base Compensation
              </span>
              <span className="text-2xl font-black text-white print:text-black">
                {offer.compensation.baseSalary}
              </span>
              <p className="text-[11px] text-zinc-400 print:text-zinc-600 mt-1">
                Paid semi-monthly in accordance with standard payroll cycles.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 print:bg-white print:border-zinc-300">
              <span className="text-[11px] uppercase font-bold text-zinc-500 print:text-zinc-600 block mb-1">
                Equity Grant (RSUs)
              </span>
              <span className="text-sm font-bold text-emerald-300 print:text-emerald-900 block">
                {offer.compensation.equityGrant}
              </span>
              <p className="text-[11px] text-zinc-400 print:text-zinc-600 mt-1">
                Subject to standard 1-year cliff and monthly vesting schedule.
              </p>
            </div>
          </div>

          {/* Additional Perks List */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 print:bg-white print:border-zinc-300 space-y-2.5 text-xs text-zinc-300 print:text-zinc-800">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 print:text-emerald-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Incentive Bonus:</strong> {offer.compensation.annualPerformanceBonus}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 print:text-emerald-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Comprehensive Healthcare:</strong> {offer.compensation.healthBenefits}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 print:text-emerald-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Workplace Setup:</strong> {offer.compensation.remoteStipend}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 print:text-emerald-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Continuous Learning:</strong> {offer.compensation.learningBudget}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 print:text-emerald-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Time Off:</strong> {offer.compensation.paidTimeOff}
              </div>
            </div>
          </div>
        </div>

        {/* Terms of Employment & Contingencies */}
        <div className="mb-10 text-xs leading-relaxed text-zinc-400 print:text-zinc-700 space-y-2 border-t border-white/5 pt-6 print:border-zinc-200">
          <p className="font-bold text-zinc-300 print:text-zinc-900 uppercase tracking-wider text-[10px]">
            General Terms & Employment Agreement
          </p>
          <p>
            This offer is contingent upon successful completion of standard background verification and authorization to work. Employment at NexaTech is at-will and subject to standard employee proprietary information and inventions assignment agreements.
          </p>
        </div>

        {/* Authorized Signatures & Authentication Stamp */}
        <div className="border-t border-white/10 pt-8 print:border-zinc-300 grid grid-cols-1 sm:grid-cols-2 gap-8 items-end">
          {offer.executives.map((exec, idx) => (
            <div key={idx} className="space-y-2">
              <div className="h-12 flex items-end">
                <span className="font-serif italic text-xl text-emerald-400/90 print:text-zinc-900 tracking-wider">
                  {exec.name}
                </span>
              </div>
              <div className="w-48 h-px bg-zinc-600 print:bg-zinc-400" />
              <p className="text-xs font-bold text-white print:text-black">{exec.name}</p>
              <p className="text-[11px] text-zinc-400 print:text-zinc-600">{exec.title}</p>
              <p className="text-[10px] text-zinc-500 print:text-zinc-500">{exec.company}</p>
            </div>
          ))}
        </div>

        {/* Digital Verification Seal */}
        <div className="mt-8 pt-6 border-t border-white/5 print:border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-zinc-500 print:text-zinc-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400 print:text-emerald-700" />
            <span>Cryptographically Verified NexaTech Digital Document</span>
          </div>
          <span className="font-mono">AUTH: {offer.offerReference}-SECURE-VERIFIED</span>
        </div>
      </div>
    </div>
  );
}
