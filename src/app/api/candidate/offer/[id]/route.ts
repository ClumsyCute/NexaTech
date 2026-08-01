import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt-utils';
import { wrapRouteHandler, errorResponse, successResponse } from '@/lib/api-utils';

/**
 * GET /api/candidate/offer/[id]
 * Retrieves the official offer letter details for a specific application.
 */
export const GET = wrapRouteHandler(async (
  req: Request,
  props: { params: Promise<{ id: string }> }
) => {
  const { id } = await props.params;

  // 1. Authenticate user
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session) {
    return errorResponse('Unauthorized. Login required.', 401);
  }

  // 2. Fetch Application with Job and Candidate details
  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      job: true,
      candidate: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!application) {
    return errorResponse('Application not found.', 404);
  }

  // 3. Authorization Check
  const isAdmin = session.role === 'ADMIN';
  const isOwner = application.candidateId === session.id;

  if (!isAdmin && !isOwner) {
    return errorResponse('Access denied. You do not have permission to view this offer.', 403);
  }

  // 4. Status Check for candidate (Admins can preview at any point)
  if (!isAdmin && application.status !== 'OFFER_RELEASED' && application.status !== 'ACCEPTED') {
    return errorResponse('Offer letter is not yet available for this application.', 400);
  }

  // 5. Build structured offer details
  const offerReference = `NX-OFR-${application.id.slice(0, 8).toUpperCase()}`;
  const baseSalary = application.job.salary || (application.expectedCtc ? `$${application.expectedCtc}` : '$135,000');
  
  // Calculate estimated joining date (e.g. 14-30 days from updated/created date)
  const baseDate = new Date(application.updatedAt);
  const joiningDate = new Date(baseDate.setDate(baseDate.getDate() + 21)).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const offerDetails = {
    offerReference,
    candidateName: application.name || application.candidate.name,
    candidateEmail: application.email || application.candidate.email,
    candidatePhone: application.phone,
    candidateAddress: application.address || 'Remote, Global Workforce',
    jobTitle: application.job.title,
    department: 'Engineering & Innovation',
    employmentType: application.job.employmentType,
    location: application.job.location,
    experienceLevel: application.job.experience,
    status: application.status,
    issuedDate: application.updatedAt.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    joiningDate,
    compensation: {
      baseSalary,
      annualPerformanceBonus: 'Up to 15% of annual base salary',
      equityGrant: '12,500 NexaTech Restricted Stock Units (RSUs) vesting over 4 years',
      healthBenefits: 'Comprehensive Health, Dental, Vision & Wellness (100% employer covered)',
      remoteStipend: '$2,500 Home Office & Tech Equipment Allowance',
      learningBudget: '$2,000 Annual Professional Development Stipend',
      paidTimeOff: 'Flexible Unlimited PTO + 12 Official Corporate Holidays',
    },
    executives: [
      {
        name: 'Elena Rostova',
        title: 'Chief Technology Officer',
        company: 'NexaTech Autonomous Systems, Inc.',
      },
      {
        name: 'Marcus Vance',
        title: 'VP of Global People Operations',
        company: 'NexaTech Autonomous Systems, Inc.',
      },
    ],
  };

  return successResponse({
    application: {
      id: application.id,
      jobId: application.jobId,
      status: application.status,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
    },
    offer: offerDetails,
    viewerRole: session.role,
    isCandidateOwner: isOwner && session.role === 'CANDIDATE',
  });
});

