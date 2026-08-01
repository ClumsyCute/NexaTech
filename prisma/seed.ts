import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { hashPassword } from '../src/lib/auth-utils';

const adapter = new PrismaBetterSqlite3({
  url: 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing data
  await prisma.notification.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('🧹 Cleaned existing database tables.');

  // 2. Create Users
  const adminPassword = hashPassword('AdminPassword123');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@nexatech.com',
      password: adminPassword,
      name: 'NexaTech Admin',
      role: 'ADMIN',
    },
  });
  console.log(`👤 Created Admin: ${admin.email}`);

  const candidatePassword = hashPassword('CandidatePassword123');
  const candidate = await prisma.user.create({
    data: {
      email: 'candidate@example.com',
      password: candidatePassword,
      name: 'John Doe',
      role: 'CANDIDATE',
    },
  });
  console.log(`👤 Created Candidate: ${candidate.email}`);

  // 3. Create Sample Jobs
  const jobsData = [
    {
      title: 'Senior Software Engineer (Full Stack)',
      description: `### Role Overview
We are looking for a Senior Full Stack Engineer to join our core product team. You will lead the design, development, and deployment of features that empower thousands of developers worldwide.

### Responsibilities
- Architect, build, and maintain scalable web applications.
- Collaborate with product managers, UX designers, and other engineers.
- Mentor junior engineers and champion clean code and architecture.
- Optimize application speed, scalability, and security.

### Requirements
- 5+ years of experience with Node.js, React, and TypeScript.
- Strong knowledge of database design (SQL and NoSQL).
- Experience with Next.js or React Server Components.
- Passion for crafting exceptional user experiences.`,
      location: 'Remote (US/Canada)',
      experience: 'Senior',
      skills: 'React, Node.js, TypeScript, Next.js, PostgreSQL, Tailwind CSS',
      salary: '$140,000 - $180,000',
      employmentType: 'Full-time',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'OPEN',
    },
    {
      title: 'Backend Engineer (API Platform)',
      description: `### Role Overview
Join NexaTech as a Backend Engineer on our API Infrastructure team. You will build and scale the APIs and real-time data pipelines that serve as the backbone of our services.

### Responsibilities
- Design and build robust, high-performance REST and GraphQL APIs.
- Enhance database queries, indexing, and connection pools.
- Write clean, comprehensive unit and integration tests.
- Participate in on-call rotations and troubleshoot production issues.

### Requirements
- 3+ years of professional backend development experience.
- Proficiency in Go, Rust, or Node.js (TypeScript).
- Deep understanding of relational databases and key-value stores.
- Familiarity with Docker and Kubernetes is a plus.`,
      location: 'New York, NY',
      experience: 'Mid Level',
      skills: 'Node.js, TypeScript, Express, PostgreSQL, Redis, Docker',
      salary: '$120,000 - $150,000',
      employmentType: 'Full-time',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      status: 'OPEN',
    },
    {
      title: 'AI/ML Engineer',
      description: `### Role Overview
NexaTech is building the next generation of AI-enabled developer tools. We are seeking an AI/ML Engineer to train, fine-tune, and deploy large language models (LLMs) and custom models into production.

### Responsibilities
- Develop and deploy scalable ML pipelines.
- Fine-tune Open Source LLMs (Llama, Mistral) for specific code-generation tasks.
- Implement efficient vector embedding generation and search strategies.
- Collaborate with frontend engineers to construct rich chat and autocomplete interfaces.

### Requirements
- 3+ years of experience in ML engineering.
- Strong programming skills in Python and PyTorch.
- Experience with LangChain, Hugging Face, or Vector DBs (Pinecone, pgvector).
- M.S. or Ph.D. in Computer Science, Math, or equivalent is preferred.`,
      location: 'San Francisco, CA (Hybrid)',
      experience: 'Senior',
      skills: 'Python, PyTorch, LLMs, Vector Databases, Hugging Face, LangChain',
      salary: '$160,000 - $210,000',
      employmentType: 'Full-time',
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
      status: 'OPEN',
    },
    {
      title: 'DevOps / Site Reliability Engineer',
      description: `### Role Overview
As a DevOps Engineer at NexaTech, you will ensure our infrastructure is secure, scalable, and highly available. You will help build our next-generation CI/CD pipelines and manage cloud infrastructure.

### Responsibilities
- Manage and scale our multi-region AWS cloud infrastructure using Terraform.
- Design, build, and optimize automated CI/CD pipelines.
- Implement comprehensive monitoring, alerting, and log aggregation.
- Perform vulnerability scans and enforce security best practices.

### Requirements
- 4+ years of experience in SRE, DevOps, or systems engineering.
- Strong expertise with AWS, Terraform, Docker, and Kubernetes.
- Experience scripting in Bash, Python, or Go.
- Passion for infrastructure-as-code and automation.`,
      location: 'Remote (Global)',
      experience: 'Senior',
      skills: 'AWS, Terraform, Kubernetes, Docker, CI/CD, GitHub Actions, Prometheus',
      salary: '$130,000 - $170,000',
      employmentType: 'Full-time',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      status: 'OPEN',
    },
    {
      title: 'Software Engineer Intern (Frontend)',
      description: `### Role Overview
We are looking for a Software Engineer Intern to join our Frontend Platform team for a 6-month internship. You will build user-facing features and improve NexaTech's UI component library.

### Responsibilities
- Build responsive web interfaces using React, Tailwind CSS, and Next.js.
- Work closely with designers to implement beautiful, pixel-perfect designs.
- Write clean, maintainable, and well-tested client-side code.
- Participate in design reviews and code reviews.

### Requirements
- Current student pursuing a B.S. or M.S. in Computer Science or related field, or recent bootcamp graduate.
- Solid understanding of HTML, CSS, JavaScript, and React.
- Basic knowledge of Git and command line utilities.
- Strong problem-solving and communication skills.`,
      location: 'Remote',
      experience: 'Entry Level',
      skills: 'HTML, CSS, JavaScript, React, Tailwind CSS, Git',
      salary: '$35 - $45 / hour',
      employmentType: 'Internship',
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      status: 'OPEN',
    },
    {
      title: 'Product Designer (UX/UI)',
      description: `### Role Overview
NexaTech is looking for a Product Designer to establish our brand style guide and design the interfaces for our main products. You will turn complex developer workflows into simple, elegant visual interfaces.

### Responsibilities
- Conduct user research and synthesize findings.
- Design high-fidelity UI layouts, wireframes, and prototypes in Figma.
- Establish and scale NexaTech's design system.
- Work alongside engineers to verify implementation details.

### Requirements
- 3+ years of experience as a UI/UX designer.
- Strong portfolio demonstrating elegant, modern, user-centric web/mobile layouts.
- Expertise in Figma, design systems, and visual layouts.
- Understanding of HTML/CSS is a major plus.`,
      location: 'San Francisco, CA',
      experience: 'Mid Level',
      skills: 'Figma, UI Design, UX Research, Prototyping, Design Systems',
      salary: '$110,000 - $140,000',
      employmentType: 'Full-time',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'CLOSED', // Start one as closed
    },
  ];

  const createdJobs = [];
  for (const jobData of jobsData) {
    const job = await prisma.job.create({
      data: jobData,
    });
    createdJobs.push(job);
    console.log(`💼 Created Job Opening: ${job.title} (${job.location})`);
  }

  // 4. Create Sample Applications for Candidate
  const offerApp = await prisma.application.create({
    data: {
      candidateId: candidate.id,
      jobId: createdJobs[0].id,
      name: 'John Doe',
      email: 'candidate@example.com',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace, San Francisco, CA 94107',
      resumePath: `${candidate.id}-1710000000000-John_Doe_Senior_Staff_Engineer.pdf`,
      linkedIn: 'https://linkedin.com/in/johndoe-dev',
      gitHub: 'https://github.com/johndoe-dev',
      portfolio: 'https://johndoe.dev',
      yearsOfExperience: 6,
      skills: 'React, Next.js, TypeScript, Distributed Systems, Node.js, GraphQL, Tailwind CSS',
      currentCompany: 'Apex Cloud Systems',
      currentCtc: '$145,000',
      expectedCtc: '$165,000',
      noticePeriod: '2 Weeks',
      coverLetter: 'I am thrilled to apply for the Senior Full Stack Engineer role at NexaTech. Having spent 6 years scaling real-time web applications and designing resilient developer infrastructure, I would love to bring my experience to your engineering organization.',
      status: 'OFFER_RELEASED',
    },
  });

  const interviewApp = await prisma.application.create({
    data: {
      candidateId: candidate.id,
      jobId: createdJobs[2].id,
      name: 'John Doe',
      email: 'candidate@example.com',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace, San Francisco, CA 94107',
      resumePath: `${candidate.id}-1710000000001-John_Doe_AI_Engineer.pdf`,
      yearsOfExperience: 5,
      skills: 'Python, PyTorch, LLMs, LangChain, Next.js',
      currentCompany: 'Apex Cloud Systems',
      currentCtc: '$145,000',
      expectedCtc: '$170,000',
      noticePeriod: '1 Month',
      status: 'INTERVIEW_SCHEDULED',
    },
  });

  // 5. Create sample Notifications for candidate
  await prisma.notification.create({
    data: {
      userId: candidate.id,
      title: 'Offer Released! 💌',
      message: `Congratulations! NexaTech has released an official employment offer for the "${createdJobs[0].title}" position. Please review and download your offer letter in your candidate dashboard.`,
      type: 'STATUS_CHANGE',
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: candidate.id,
      title: 'Interview Scheduled! 📅',
      message: `An interview has been scheduled for your application to "${createdJobs[2].title}". Please check your calendar invitation details.`,
      type: 'STATUS_CHANGE',
      isRead: false,
    },
  });

  console.log('🎉 Seeding successfully completed with sample applications and notifications!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
