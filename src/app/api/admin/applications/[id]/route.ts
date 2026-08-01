import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { wrapRouteHandler, successResponse, errorResponse } from '@/lib/api-utils';

const updateApplicationSchema = z.object({
  status: z.enum(['SUBMITTED', 'SHORTLISTED', 'REJECTED', 'ACCEPTED', 'OFFER_RELEASED', 'INTERVIEW_SCHEDULED']),
  customNotification: z.string().optional(),
});

/**
 * PUT /api/admin/applications/[id]
 * Updates status of a candidate application, saves admin notes, and triggers notifications
 */
export const PUT = wrapRouteHandler(async (
  req: Request,
  props: { params: Promise<{ id: string }> }
) => {
  const { id } = await props.params;
  const body = await req.json();
  const parsed = updateApplicationSchema.parse(body);

  // 1. Fetch existing application along with job details
  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      job: true,
      candidate: true,
    },
  });

  if (!application) {
    return errorResponse('Application not found', 404);
  }

  const oldStatus = application.status;
  const newStatus = parsed.status;

  // 2. Update Application Status
  const updatedApplication = await prisma.application.update({
    where: { id },
    data: {
      status: newStatus,
    },
  });

  // 3. Status change notification trigger
  if (oldStatus !== newStatus) {
    let notificationTitle = 'Application Update';
    let notificationMessage = `The status of your application for "${application.job.title}" has been updated.`;

    switch (newStatus) {
      case 'SHORTLISTED':
        notificationTitle = 'Application Shortlisted! 🎉';
        notificationMessage = `Great news! Your profile has been shortlisted for the "${application.job.title}" position. Our recruiting team will review details and reach out for next steps soon.`;
        break;
      case 'INTERVIEW_SCHEDULED':
        notificationTitle = 'Interview Scheduled! 📅';
        notificationMessage = `An interview has been scheduled for your application to the "${application.job.title}" position. Please check your email for the calendar invitation and link details.`;
        break;
      case 'OFFER_RELEASED':
        notificationTitle = 'Offer Released! 💌';
        notificationMessage = `Congratulations! NexaTech has released an official employment offer for the "${application.job.title}" position. Please review the details in your candidate portal or email.`;
        break;
      case 'ACCEPTED':
        notificationTitle = 'Offer Accepted! 🤝';
        notificationMessage = `Welcome to NexaTech! We have received your acceptance of the offer for the "${application.job.title}" position. Our HR team will reach out with onboarding instructions shortly.`;
        break;
      case 'REJECTED':
        notificationTitle = 'Application Update';
        notificationMessage = `Thank you for your interest in NexaTech and the "${application.job.title}" position. After careful review, we have decided to move forward with other candidates at this time. We wish you success in your search.`;
        break;
    }

    await prisma.notification.create({
      data: {
        userId: application.candidateId,
        title: notificationTitle,
        message: notificationMessage,
        type: 'STATUS_CHANGE',
      },
    });
  }

  // 4. Custom notification trigger (if provided by admin)
  if (parsed.customNotification && parsed.customNotification.trim().length > 0) {
    await prisma.notification.create({
      data: {
        userId: application.candidateId,
        title: `Message from Hiring Team (${application.job.title})`,
        message: parsed.customNotification,
        type: 'CUSTOM',
      },
    });
  }

  return successResponse({ application: updatedApplication });
});
