import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt-utils';
import { wrapRouteHandler, errorResponse, successResponse } from '@/lib/api-utils';

/**
 * POST /api/candidate/offer/[id]/accept
 * Allows candidate to formally accept their released offer.
 */
export const POST = wrapRouteHandler(async (
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

  // 2. Fetch Application
  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      job: true,
    },
  });

  if (!application) {
    return errorResponse('Application not found.', 404);
  }

  // 3. Authorization check
  if (application.candidateId !== session.id) {
    return errorResponse('Access denied. You cannot accept this offer.', 403);
  }

  if (application.status === 'ACCEPTED') {
    return successResponse({
      message: 'Offer is already accepted.',
      status: 'ACCEPTED',
    });
  }

  if (application.status !== 'OFFER_RELEASED') {
    return errorResponse('This application is not currently in a state to accept an offer.', 400);
  }

  // 4. Update status to ACCEPTED
  const updatedApplication = await prisma.application.update({
    where: { id },
    data: {
      status: 'ACCEPTED',
    },
  });

  // 5. Create congratulatory notification for the candidate
  await prisma.notification.create({
    data: {
      userId: session.id,
      title: '🎉 Welcome to NexaTech! Offer Accepted',
      message: `Congratulations on accepting your offer for "${application.job.title}"! Our People Operations and IT Onboarding teams are preparing your welcome kit and next steps.`,
      type: 'STATUS_CHANGE',
    },
  });

  return successResponse({
    message: 'Offer accepted successfully! Welcome to the team.',
    status: 'ACCEPTED',
    application: updatedApplication,
  });
});
