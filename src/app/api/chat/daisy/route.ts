import { z } from 'zod';
import { wrapRouteHandler, successResponse, errorResponse } from '@/lib/api-utils';

const messageSchema = z.object({
  message: z.string().min(1, 'Please enter a message'),
  history: z
    .array(
      z.object({
        sender: z.enum(['user', 'daisy']),
        text: z.string(),
      })
    )
    .optional(),
});

/**
 * Intelligent response generation for Daisy the AI Career Assistant
 */
function getDaisyResponse(input: string): string {
  const query = input.toLowerCase().trim();

  // Offer Letter questions
  if (
    query.includes('offer') ||
    query.includes('letter') ||
    query.includes('accept') ||
    query.includes('package') ||
    query.includes('salary')
  ) {
    return (
      "Yay! 🎉 When the NexaTech hiring team releases your official employment offer, you'll see a bright **'View & Download Offer Letter'** button right on your **Candidate Dashboard**!\n\n" +
      "Inside the offer viewer, you can:\n" +
      "• 📄 **View full compensation & benefits**\n" +
      "• 🖨️ **Print or Save as PDF** with official corporate letterhead\n" +
      "• ✍️ **Formally Accept Offer** with a single click!\n\n" +
      "Need help with anything else on your journey? 🌼"
    );
  }

  // Application status & tracking
  if (
    query.includes('status') ||
    query.includes('track') ||
    query.includes('application') ||
    query.includes('check') ||
    query.includes('shortlist') ||
    query.includes('progress')
  ) {
    return (
      "Tracking your progress is super easy! ✨\n\n" +
      "1. Sign in to your candidate account at `/login`.\n" +
      "2. Go to your **Candidate Dashboard** (`/dashboard`).\n" +
      "3. Each application displays its live status:\n" +
      "   • 🔵 **Submitted**: Successfully received by our recruiters.\n" +
      "   • 🟣 **Shortlisted**: Your profile passed the initial screen!\n" +
      "   • 🟡 **Interview Scheduled**: Check your notifications & email for calendar invites.\n" +
      "   • 🟢 **Offer Released**: Your official offer letter is ready for review & download!\n" +
      "   • 🤝 **Accepted**: Welcome to the NexaTech team!\n\n" +
      "You'll also get instant in-app alerts whenever your status updates! 🔔"
    );
  }

  // Benefits, perks, and compensation
  if (
    query.includes('benefit') ||
    query.includes('perk') ||
    query.includes('remote') ||
    query.includes('pto') ||
    query.includes('health') ||
    query.includes('insurance') ||
    query.includes('equity')
  ) {
    return (
      "NexaTech takes amazing care of our team! Here are some of our core perks 🌟:\n\n" +
      "• 🏖️ **Flexible Unlimited PTO** + 12 paid holidays\n" +
      "• 🩺 **100% Employer-Covered Health, Dental & Vision**\n" +
      "• 💻 **$2,500 Remote Home Office & Equipment Allowance**\n" +
      "• 📚 **$2,000 Annual Learning & Conference Budget**\n" +
      "• 📈 **Equity & RSU Grants** for all full-time team members\n" +
      "• 🌍 **Remote-First Culture** with worldwide talent hubs!\n\n" +
      "Is there a specific role you're eyeing? 💼"
    );
  }

  // Interview preparation & tips
  if (
    query.includes('interview') ||
    query.includes('prepare') ||
    query.includes('tip') ||
    query.includes('advice') ||
    query.includes('round') ||
    query.includes('question')
  ) {
    return (
      "Here are Daisy's top interview tips for shining at NexaTech! 🌸✨\n\n" +
      "1. 💡 **Focus on Real Architecture**: We love hearing about systems you built, tradeoffs you evaluated, and how you solved edge cases.\n" +
      "2. 🤝 **Collaborative Mindset**: Our engineering sessions are structured like pair programming with teammates, not trivia contests!\n" +
      "3. 🎯 **Ask Big Questions**: Prepare thoughtful questions for our engineering directors about our roadmap and tech stack.\n\n" +
      "You've got this! Good luck! 💫"
    );
  }

  // Password reset / login issues
  if (
    query.includes('password') ||
    query.includes('forgot') ||
    query.includes('reset') ||
    query.includes('login') ||
    query.includes('credentials')
  ) {
    return (
      "Don't worry, we've got you covered! 🔑\n\n" +
      "If you've forgotten your candidate login password:\n" +
      "1. Head over to the **[Forgot Password Page](/forgot-password)** (or click 'Forgot password?' on the login screen).\n" +
      "2. Enter your registered email address to generate a secure reset link.\n" +
      "3. Set your new password and sign right back in!\n\n" +
      "Let me know if you need help with anything else! 🌼"
    );
  }

  // Tech stack & company info
  if (
    query.includes('tech stack') ||
    query.includes('technology') ||
    query.includes('about') ||
    query.includes('what is nexatech') ||
    query.includes('stack')
  ) {
    return (
      "NexaTech builds high-performance autonomous infrastructure and developer platforms! 🚀\n\n" +
      "Our core stack includes:\n" +
      "• **Frontend**: Next.js, React 19, TypeScript, Tailwind CSS & Framer Motion\n" +
      "• **Backend**: Node.js microservices, Prisma ORM, Distributed Data Pipelines\n" +
      "• **Infrastructure**: Kubernetes, Edge Serverless Compute, Rust & Go for core runtime engines\n\n" +
      "Check out all our open positions on the **[Career Openings Page](/jobs)**! 🌟"
    );
  }

  // Greetings & casual chat
  if (
    query.includes('hello') ||
    query.includes('hi') ||
    query.includes('hey') ||
    query.includes('daisy') ||
    query.includes('who are you')
  ) {
    return (
      "Hi there! I'm **Daisy** 🌼, your cute AI career assistant at NexaTech!\n\n" +
      "I'm here to help you navigate open jobs, track applications, view & download your offer letters, learn about our benefits, and prepare for interviews.\n\n" +
      "What can I help you explore today? ✨"
    );
  }

  if (query.includes('thank') || query.includes('thanks') || query.includes('awesome') || query.includes('great')) {
    return "You're so very welcome! 🌸 Best of luck on your career journey with NexaTech. Let me know whenever you need anything! 🌼💖";
  }

  // Default fallback response
  return (
    `I'd love to help you with that! 🌼\n\n` +
    `As your NexaTech career assistant, you can ask me about:\n` +
    `• 📄 **Offer letters**: How to view, download, or accept your offer\n` +
    `• 🔍 **Application statuses**: Explaining each review step\n` +
    `• 🎁 **Perks & Culture**: Remote policy, PTO, learning stipends, health benefits\n` +
    `• 💡 **Interview advice**: Tips to excel in our engineering loops\n` +
    `• 🔑 **Account help**: Password resets & dashboard guidance\n\n` +
    `Feel free to try asking one of the suggestions above! ✨`
  );
}

export const POST = wrapRouteHandler(async (req: Request) => {
  const body = await req.json();
  const parsed = messageSchema.parse(body);

  const reply = getDaisyResponse(parsed.message);

  return successResponse({
    reply,
    sender: 'daisy',
    timestamp: new Date().toISOString(),
  });
});
