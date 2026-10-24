import {
  User,
  StudentProfile,
  Company,
  JobOpportunity,
  Application,
  InterviewSchedule,
  NotificationItem,
  Announcement,
  AuditLog,
} from '../types';
import { evaluateEligibility } from '../services/eligibilityEngine';

export const ADMIN_USER: User = {
  id: 'usr_admin_01',
  email: 'admin@campushire.edu',
  role: 'admin',
  name: 'Dr. Arvind Sharma',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  accountStatus: 'active',
  createdAt: '2025-08-01T08:00:00Z',
};

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp_google',
    name: 'Google India',
    logo: 'https://www.google.com/favicon.ico',
    description: 'Global technology leader specializing in internet-related services, cloud computing, software engineering, and AI.',
    industry: 'Software / IT',
    website: 'https://careers.google.com',
    location: 'Bengaluru / Hyderabad, India',
    contactPerson: 'Meera Nambiar (Campus University Relations)',
    contactEmail: 'campus-in@google.com',
    contactPhone: '+91 80 6721 8000',
    status: 'active',
    notes: 'Premium Tier-1 Day 1 Partner. High coding bar.',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'comp_microsoft',
    name: 'Microsoft IDC',
    logo: 'https://c.s-microsoft.com/favicon.ico',
    description: 'Empowering every person and organization on the planet to achieve more through world-class enterprise software and cloud platforms.',
    industry: 'Software / IT',
    website: 'https://careers.microsoft.com',
    location: 'Hyderabad / Noida, India',
    contactPerson: 'Karan Malhotra (University Talent Lead)',
    contactEmail: 'idc-recruiting@microsoft.com',
    contactPhone: '+91 40 6695 0000',
    status: 'active',
    notes: 'Excellent full-time and summer intern conversion.',
    createdAt: '2026-01-12T10:00:00Z',
  },
  {
    id: 'comp_amazon',
    name: 'Amazon Development Centre',
    logo: 'https://www.amazon.com/favicon.ico',
    description: 'Guided by four principles: customer obsession, passion for invention, commitment to operational excellence, and long-term thinking.',
    industry: 'E-Commerce / Cloud',
    website: 'https://amazon.jobs',
    location: 'Bengaluru / Chennai, India',
    contactPerson: 'Siddharth Roy (Campus Recruiting)',
    contactEmail: 'in-campus-hires@amazon.com',
    contactPhone: '+91 80 4331 4000',
    status: 'active',
    createdAt: '2026-01-15T11:00:00Z',
  },
  {
    id: 'comp_goldman',
    name: 'Goldman Sachs',
    logo: 'https://www.goldmansachs.com/favicon.ico',
    description: 'Leading global investment banking, securities and investment management firm.',
    industry: 'Fintech / Banking',
    website: 'https://goldmansachs.com/careers',
    location: 'Bengaluru, India',
    contactPerson: 'Pooja Iyer (Human Capital Management)',
    contactEmail: 'campushires@gs.com',
    status: 'active',
    createdAt: '2026-01-18T09:00:00Z',
  },
  {
    id: 'comp_deloitte',
    name: 'Deloitte USI',
    logo: 'https://www2.deloitte.com/favicon.ico',
    description: 'Industry-leading consulting, audit, tax, and risk advisory services.',
    industry: 'Consulting / Analytics',
    website: 'https://deloitte.com/careers',
    location: 'Hyderabad / Mumbai / Gurugram',
    contactPerson: 'Rajesh Varma (Campus Lead)',
    contactEmail: 'deloitte-campus@deloitte.com',
    status: 'active',
    createdAt: '2026-01-20T12:00:00Z',
  },
  {
    id: 'comp_cisco',
    name: 'Cisco Systems',
    logo: 'https://www.cisco.com/favicon.ico',
    description: 'Worldwide leader in networking, enterprise security, and internet infrastructure.',
    industry: 'Networking / Hardware',
    website: 'https://cisco.com/careers',
    location: 'Bengaluru, India',
    contactPerson: 'Ananya Deshmukh',
    contactEmail: 'cisco-university@cisco.com',
    status: 'active',
    createdAt: '2026-01-22T10:00:00Z',
  },
  {
    id: 'comp_infosys',
    name: 'Infosys Limited',
    logo: 'https://www.infosys.com/favicon.ico',
    description: 'Global leader in next-generation digital services, cloud transformation, and consulting.',
    industry: 'IT Services / Digital',
    website: 'https://infosys.com/careers',
    location: 'Multiple Locations / PAN India',
    contactPerson: 'Deepak Singhania',
    contactEmail: 'campusconnect@infosys.com',
    status: 'active',
    createdAt: '2026-01-25T14:00:00Z',
  },
  {
    id: 'comp_tcs',
    name: 'Tata Consultancy Services',
    logo: 'https://www.tcs.com/favicon.ico',
    description: 'Pioneering IT services, consulting, and business solutions across sectors.',
    industry: 'IT Services',
    website: 'https://tcs.com/careers',
    location: 'PAN India',
    contactPerson: 'Gaurav Kulkarni (TCS NextGen Hiring)',
    contactEmail: 'tcs-campus@tcs.com',
    status: 'active',
    createdAt: '2026-01-27T10:00:00Z',
  },
  {
    id: 'comp_uber',
    name: 'Uber Technologies',
    logo: 'https://www.uber.com/favicon.ico',
    description: 'Igniting opportunity by setting the world in motion with urban mobility and hyper-scale routing.',
    industry: 'Mobility / Tech',
    website: 'https://uber.com/careers',
    location: 'Bengaluru / Hyderabad',
    contactPerson: 'Vikram Joshi',
    contactEmail: 'uber-university@uber.com',
    status: 'active',
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'comp_adobe',
    name: 'Adobe India',
    logo: 'https://www.adobe.com/favicon.ico',
    description: 'Changing the world through digital experiences, creative cloud, and document intelligence.',
    industry: 'Software / Creative Tech',
    website: 'https://adobe.com/careers',
    location: 'Noida / Bengaluru',
    contactPerson: 'Sanya Kapoor',
    contactEmail: 'adobe-campus@adobe.com',
    status: 'active',
    createdAt: '2026-02-03T11:00:00Z',
  },
  {
    id: 'comp_nvidia',
    name: 'NVIDIA Corporation',
    logo: 'https://www.nvidia.com/favicon.ico',
    description: 'World leader in accelerated computing, GPU architecture, AI supercomputers, and autonomous systems.',
    industry: 'Semiconductors / AI',
    website: 'https://nvidia.com/careers',
    location: 'Bengaluru / Pune',
    contactPerson: 'Dr. Tarun Sen',
    contactEmail: 'nvidia-university@nvidia.com',
    status: 'active',
    createdAt: '2026-02-05T09:00:00Z',
  },
  {
    id: 'comp_oracle',
    name: 'Oracle Corporation',
    logo: 'https://www.oracle.com/favicon.ico',
    description: 'Integrated cloud applications and platform services powering mission-critical enterprise systems.',
    industry: 'Database / Cloud',
    website: 'https://oracle.com/careers',
    location: 'Bengaluru / Hyderabad',
    contactPerson: 'Rohan Mehra',
    contactEmail: 'oracle-campus@oracle.com',
    status: 'active',
    createdAt: '2026-02-07T12:00:00Z',
  },
];

export const INITIAL_JOBS: JobOpportunity[] = [
  {
    id: 'job_goog_swe',
    companyId: 'comp_google',
    title: 'Software Engineer (University Graduate)',
    jobCategory: 'Software Engineering',
    description: 'Join Google as a Software Engineer to develop next-generation technologies that change how millions of users connect, explore, and interact with information and one another. You will work on distributed systems, large-scale search engines, AI models, and cloud infrastructure.',
    responsibilities: [
      'Write server-side and client-side code for web applications and microservices.',
      'Design robust distributed architectures capable of handling billions of queries.',
      'Collaborate with product managers and engineers across global offices.',
      'Optimize algorithms for latency, scalability, and high fault-tolerance.',
    ],
    requiredSkills: ['Data Structures & Algorithms', 'C++', 'Java', 'Python', 'System Design', 'Git'],
    jobType: 'Full-Time',
    workMode: 'Hybrid',
    location: 'Bengaluru / Hyderabad',
    compensation: {
      salaryRange: '₹28 - ₹34 LPA',
      benefits: ['Free meals & transport', 'Comprehensive medical cover', 'Relocation assistance', 'Stock grants (GSUs)'],
    },
    eligibilityRules: {
      eligibleCourses: ['B.Tech', 'M.Tech', 'MCA'],
      eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication'],
      eligibleGraduationYears: [2026],
      minTenthPercentage: 75,
      minTwelfthPercentage: 75,
      minCgpa: 8.0,
      allowActiveBacklogs: false,
      maxActiveBacklogsAllowed: 0,
      allowHistoricalBacklogs: true,
      additionalConditions: 'Applicants must have completed at least 2 relevant software engineering projects or open source contributions.',
    },
    recruitmentRounds: [
      {
        id: 'rnd_goog_1',
        roundNumber: 1,
        name: 'Online Coding Challenge (Google Online Challenge)',
        type: 'Coding',
        description: '2 algorithmic coding problems based on Dynamic Programming, Graphs, and Data Structures.',
        duration: '90 mins',
        scheduledDate: '2026-11-05T10:00:00Z',
        instructions: 'Proctored browser window. HackerEarth platform. Plagiarism detection strictly active.',
      },
      {
        id: 'rnd_goog_2',
        roundNumber: 2,
        name: 'Technical Virtual Onsite Round 1',
        type: 'Technical Interview',
        description: 'Live coding on Google Docs or collaborative IDE with focus on problem solving and complexity analysis.',
        duration: '45 mins',
      },
      {
        id: 'rnd_goog_3',
        roundNumber: 3,
        name: 'Technical Virtual Onsite Round 2',
        type: 'Technical Interview',
        description: 'Deep dive into computer fundamentals, concurrency, memory management, and advanced data structures.',
        duration: '45 mins',
      },
      {
        id: 'rnd_goog_4',
        roundNumber: 4,
        name: 'Googliness & Leadership Values (HR Round)',
        type: 'HR Interview',
        description: 'Scenario-based behavioral assessment of teamwork, intellectual humility, and handling ambiguity.',
        duration: '45 mins',
      },
    ],
    openingDate: '2026-10-15',
    deadline: '2026-11-02',
    openingsCount: 15,
    status: 'published',
    requiredDocuments: ['Updated Resume (PDF)', 'Official College Transcript', 'Govt ID Proof'],
    customQuestions: [
      { id: 'q1', question: 'Paste your competitive programming profile (LeetCode / Codeforces / CodeChef) URL:', isRequired: true },
      { id: 'q2', question: 'Briefly highlight your most complex technical project and your specific contribution:', isRequired: false },
    ],
    showApplicantCountToStudents: true,
    publishedAt: '2026-10-15T09:00:00Z',
    createdAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'job_msft_sde',
    companyId: 'comp_microsoft',
    title: 'Software Development Engineer - I',
    jobCategory: 'Software Engineering',
    description: 'Microsoft India Development Center (IDC) is hiring fresh graduates to build cutting-edge solutions for Azure, Office 365, Teams, and Bing AI. You will write high-performance cloud services and consumer applications.',
    responsibilities: [
      'Design, write, and review code in C#, Java, C++, or TypeScript.',
      'Deploy and monitor microservices in Azure cloud environments.',
      'Participate in agile sprints, code audits, and architectural reviews.',
    ],
    requiredSkills: ['Object Oriented Programming', 'C# / Java', 'Cloud Fundamentals', 'Data Structures', 'SQL'],
    jobType: 'Full-Time',
    workMode: 'Hybrid',
    location: 'Hyderabad / Noida',
    compensation: {
      salaryRange: '₹24 - ₹28 LPA',
      benefits: ['Health insurance', 'Wellness reimbursement', 'Home office allowance', 'Employee share purchase program'],
    },
    eligibilityRules: {
      eligibleCourses: ['B.Tech', 'M.Tech', 'MCA'],
      eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication', 'Electrical & Electronics'],
      eligibleGraduationYears: [2026],
      minTenthPercentage: 70,
      minTwelfthPercentage: 70,
      minCgpa: 7.5,
      allowActiveBacklogs: false,
      maxActiveBacklogsAllowed: 0,
      allowHistoricalBacklogs: true,
    },
    recruitmentRounds: [
      {
        id: 'rnd_msft_1',
        roundNumber: 1,
        name: 'Online Technical Assessment',
        type: 'Coding',
        description: '3 coding questions testing algorithms, strings, and tree traversals.',
        duration: '75 mins',
        scheduledDate: '2026-11-08T11:00:00Z',
      },
      {
        id: 'rnd_msft_2',
        roundNumber: 2,
        name: 'Technical Interview Round 1',
        type: 'Technical Interview',
        description: 'Problem solving, debugging, and clean code principles.',
        duration: '60 mins',
      },
      {
        id: 'rnd_msft_3',
        roundNumber: 3,
        name: 'Technical & System Architecture Round 2',
        type: 'Technical Interview',
        description: 'System design, database schemas, and OOP concepts.',
        duration: '60 mins',
      },
      {
        id: 'rnd_msft_4',
        roundNumber: 4,
        name: 'AA (As Appropriate) Director Round',
        type: 'HR Interview',
        description: 'Culture fit, growth mindset, and project discussion.',
        duration: '45 mins',
      },
    ],
    openingDate: '2026-10-18',
    deadline: '2026-11-05',
    openingsCount: 20,
    status: 'published',
    requiredDocuments: ['Resume', 'College ID Card', 'Latest Semester Grade Card'],
    showApplicantCountToStudents: true,
    publishedAt: '2026-10-18T10:00:00Z',
    createdAt: '2026-10-18T10:00:00Z',
  },
  {
    id: 'job_amzn_sde',
    companyId: 'comp_amazon',
    title: 'SDE-1 (Graduate Hiring)',
    jobCategory: 'Software Engineering',
    description: 'Amazon is hiring Software Development Engineers to invent on behalf of customers across Prime Video, AWS, Retail, and Logistics. We look for passionate builders who can write clean, scalable code.',
    responsibilities: [
      'Build scalable web services using AWS technologies (Lambda, DynamoDB, S3, ECS).',
      'Translate customer requirements into modular architecture.',
      'Write comprehensive unit and integration tests.',
    ],
    requiredSkills: ['Java', 'Algorithms', 'Distributed Systems', 'Linux', 'AWS Basics'],
    jobType: 'Full-Time',
    workMode: 'On-site',
    location: 'Bengaluru / Hyderabad',
    compensation: {
      salaryRange: '₹26 - ₹32 LPA',
      benefits: ['Relocation allowance', 'Amazon equity (RSUs)', 'Healthcare benefits'],
    },
    eligibilityRules: {
      eligibleCourses: ['B.Tech', 'M.Tech', 'MCA'],
      eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication'],
      eligibleGraduationYears: [2026],
      minTenthPercentage: 65,
      minTwelfthPercentage: 65,
      minCgpa: 7.0,
      allowActiveBacklogs: false,
      maxActiveBacklogsAllowed: 0,
      allowHistoricalBacklogs: true,
    },
    recruitmentRounds: [
      {
        id: 'rnd_amz_1',
        roundNumber: 1,
        name: 'Online Assessment (OA1 & OA2)',
        type: 'Assessment',
        description: 'Debugging questions, 2 coding problems, and Amazon Leadership Principles work simulation.',
        duration: '90 mins',
        scheduledDate: '2026-11-10T14:00:00Z',
      },
      {
        id: 'rnd_amz_2',
        roundNumber: 2,
        name: 'Technical Interview 1: Coding & Data Structures',
        type: 'Technical Interview',
        description: 'Live coding problem + 2 Leadership Principle behavioural questions.',
        duration: '60 mins',
      },
      {
        id: 'rnd_amz_3',
        roundNumber: 3,
        name: 'Technical Interview 2: Problem Solving & Design',
        type: 'Technical Interview',
        description: 'Object-oriented design and edge-case handling.',
        duration: '60 mins',
      },
      {
        id: 'rnd_amz_4',
        roundNumber: 4,
        name: 'Bar Raiser Round',
        type: 'Technical Interview',
        description: 'High-standard evaluation across technical and behavioral dimensions.',
        duration: '60 mins',
      },
    ],
    openingDate: '2026-10-20',
    deadline: '2026-11-08',
    openingsCount: 25,
    status: 'published',
    requiredDocuments: ['Resume (PDF)'],
    showApplicantCountToStudents: true,
    publishedAt: '2026-10-20T12:00:00Z',
    createdAt: '2026-10-20T12:00:00Z',
  },
  {
    id: 'job_gs_analyst',
    companyId: 'comp_goldman',
    title: 'Technology Analyst (Global Markets & Core Eng)',
    jobCategory: 'Fintech / Engineering',
    description: 'Goldman Sachs Engineers create solutions to solve complex financial problems for clients across the globe. You will develop low-latency electronic trading platforms, risk engines, and banking APIs.',
    responsibilities: [
      'Engineer low-latency microservices and high-throughput transaction pipelines.',
      'Work alongside traders, quants, and risk managers to automate financial workflows.',
      'Ensure 99.999% uptime for global exchange gateways.',
    ],
    requiredSkills: ['C++', 'Java', 'Python', 'Financial Mathematics', 'SQL', 'Algorithms'],
    jobType: 'Full-Time',
    workMode: 'On-site',
    location: 'Bengaluru',
    compensation: {
      salaryRange: '₹22 - ₹27 LPA',
      benefits: ['Annual discretionary bonus', 'Comprehensive medical insurance', 'Catered dining'],
    },
    eligibilityRules: {
      eligibleCourses: ['B.Tech', 'M.Tech', 'MCA'],
      eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication', 'Electrical & Electronics'],
      eligibleGraduationYears: [2026],
      minTenthPercentage: 70,
      minTwelfthPercentage: 70,
      minCgpa: 7.2,
      allowActiveBacklogs: false,
      maxActiveBacklogsAllowed: 0,
      allowHistoricalBacklogs: false,
      additionalConditions: 'Strictly zero past or active backlogs allowed by corporate HR policy.',
    },
    recruitmentRounds: [
      {
        id: 'rnd_gs_1',
        roundNumber: 1,
        name: 'Aptitude & Coding Online Test',
        type: 'Aptitude',
        description: 'Quantitative aptitude, logical reasoning, and 2 algorithmic questions.',
        duration: '105 mins',
      },
      {
        id: 'rnd_gs_2',
        roundNumber: 2,
        name: 'Technical Round 1',
        type: 'Technical Interview',
        description: 'Algorithms, OS threads, memory allocation, and database indexing.',
        duration: '45 mins',
      },
      {
        id: 'rnd_gs_3',
        roundNumber: 3,
        name: 'Technical Round 2',
        type: 'Technical Interview',
        description: 'System design for financial systems and real-time ledger simulation.',
        duration: '45 mins',
      },
    ],
    openingDate: '2026-10-16',
    deadline: '2026-11-04',
    openingsCount: 12,
    status: 'published',
    requiredDocuments: ['Resume', 'Marksheets (10th, 12th, Degree)'],
    showApplicantCountToStudents: true,
    publishedAt: '2026-10-16T10:00:00Z',
    createdAt: '2026-10-16T10:00:00Z',
  },
  {
    id: 'job_deloitte_analyst',
    companyId: 'comp_deloitte',
    title: 'Consulting Analyst — Technology & AI',
    jobCategory: 'Consulting',
    description: 'Deloitte USI helps Fortune 500 organizations transform their technology stack. You will analyze business problems, architect cloud migrations, and implement enterprise CRM and ERP software.',
    responsibilities: [
      'Gather and synthesize business requirements into technical blueprints.',
      'Develop custom enterprise components using cloud services and modern frameworks.',
      'Prepare executive presentations and progress scorecards.',
    ],
    requiredSkills: ['Problem Solving', 'Data Analytics', 'Python / SQL', 'Communication', 'Cloud Basics'],
    jobType: 'Full-Time',
    workMode: 'Hybrid',
    location: 'Hyderabad / Gurugram / Bengaluru',
    compensation: {
      salaryRange: '₹9.5 - ₹12 LPA',
      benefits: ['Certification sponsorships', 'Medical cover', 'Work from home stipend'],
    },
    eligibilityRules: {
      eligibleCourses: ['B.Tech', 'M.Tech', 'MCA', 'MBA'],
      eligibleBranches: ['All'],
      eligibleGraduationYears: [2026],
      minTenthPercentage: 60,
      minTwelfthPercentage: 60,
      minCgpa: 6.5,
      allowActiveBacklogs: false,
      maxActiveBacklogsAllowed: 0,
      allowHistoricalBacklogs: true,
    },
    recruitmentRounds: [
      {
        id: 'rnd_del_1',
        roundNumber: 1,
        name: 'Online Cognitive & Verbal Assessment',
        type: 'Aptitude',
        description: 'Cognitive ability, verbal reasoning, and business communication test.',
        duration: '60 mins',
      },
      {
        id: 'rnd_del_2',
        roundNumber: 2,
        name: 'Case Study & Group Discussion',
        type: 'Group Discussion',
        description: 'Discussion on digital transformation business scenario.',
        duration: '40 mins',
      },
      {
        id: 'rnd_del_3',
        roundNumber: 3,
        name: 'Technical & Behavioral Interview',
        type: 'Technical Interview',
        description: 'Discussion on resume projects, leadership experience, and problem solving.',
        duration: '40 mins',
      },
    ],
    openingDate: '2026-10-10',
    deadline: '2026-11-15',
    openingsCount: 50,
    status: 'published',
    requiredDocuments: ['Resume'],
    showApplicantCountToStudents: true,
    publishedAt: '2026-10-10T09:00:00Z',
    createdAt: '2026-10-10T09:00:00Z',
  },
  {
    id: 'job_cisco_swe',
    companyId: 'comp_cisco',
    title: 'Software Consulting Engineer / Network SWE',
    jobCategory: 'Networking & Systems',
    description: 'Work with the global leader in networking to build next-generation programmable networks, SD-WAN, and zero-trust cloud security software.',
    responsibilities: [
      'Implement protocols and network automation scripts in Python/Go.',
      'Troubleshoot and optimize high-throughput packet routing engines.',
    ],
    requiredSkills: ['Computer Networks', 'Python', 'C / C++', 'Linux', 'TCP/IP'],
    jobType: 'Full-Time',
    workMode: 'Hybrid',
    location: 'Bengaluru',
    compensation: {
      salaryRange: '₹16 - ₹20 LPA',
      benefits: ['Medical cover', 'Tuition reimbursement', 'Cisco employee discounts'],
    },
    eligibilityRules: {
      eligibleCourses: ['B.Tech', 'M.Tech'],
      eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication', 'Electrical & Electronics'],
      eligibleGraduationYears: [2026],
      minTenthPercentage: 65,
      minTwelfthPercentage: 65,
      minCgpa: 7.0,
      allowActiveBacklogs: false,
      maxActiveBacklogsAllowed: 0,
      allowHistoricalBacklogs: true,
    },
    recruitmentRounds: [
      { id: 'rnd_csc_1', roundNumber: 1, name: 'Online Networking & Coding Test', type: 'Coding', description: 'Network MCQs and 2 programming questions', duration: '90 mins' },
      { id: 'rnd_csc_2', roundNumber: 2, name: 'Technical Interview 1', type: 'Technical Interview', description: 'Deep dive into OSI layers, socket programming, and protocols', duration: '45 mins' },
      { id: 'rnd_csc_3', roundNumber: 3, name: 'Managerial & HR Round', type: 'HR Interview', description: 'Aptitude and cultural alignment', duration: '30 mins' },
    ],
    openingDate: '2026-10-21',
    deadline: '2026-11-12',
    openingsCount: 18,
    status: 'published',
    requiredDocuments: ['Resume', 'Degree Marksheet'],
    showApplicantCountToStudents: true,
    publishedAt: '2026-10-21T10:00:00Z',
    createdAt: '2026-10-21T10:00:00Z',
  },
  {
    id: 'job_uber_intern',
    companyId: 'comp_uber',
    title: 'Software Engineering Intern (Summer 2026 / PPO Opportunity)',
    jobCategory: 'Internship',
    description: '6-month software engineering internship with direct opportunity to convert into a full-time SDE-1 position based on performance. Work on real-time driver allocation and geospatial algorithms.',
    responsibilities: [
      'Design microservices that operate under strict latency budgets.',
      'Contribute to production deployments used by millions daily.',
    ],
    requiredSkills: ['Data Structures', 'Go / Java / Python', 'Algorithms', 'Kafka'],
    jobType: 'Internship-to-PPO',
    workMode: 'Hybrid',
    location: 'Bengaluru / Hyderabad',
    compensation: {
      salaryRange: '₹1,20,000 / month (Stipend) -> ₹32 LPA on PPO',
      stipend: '₹1,20,000 / month',
    },
    eligibilityRules: {
      eligibleCourses: ['B.Tech', 'M.Tech', 'MCA'],
      eligibleBranches: ['Computer Science & Engineering', 'Information Technology'],
      eligibleGraduationYears: [2026, 2027],
      minTenthPercentage: 70,
      minTwelfthPercentage: 70,
      minCgpa: 8.0,
      allowActiveBacklogs: false,
      maxActiveBacklogsAllowed: 0,
      allowHistoricalBacklogs: false,
    },
    recruitmentRounds: [
      { id: 'rnd_ub_1', roundNumber: 1, name: 'Uber CodeSignal Online Test', type: 'Coding', description: '4 algorithmic questions on CodeSignal General Coding Framework', duration: '70 mins' },
      { id: 'rnd_ub_2', roundNumber: 2, name: 'Technical Round 1', type: 'Technical Interview', description: 'Data structures & problem solving', duration: '60 mins' },
      { id: 'rnd_ub_3', roundNumber: 3, name: 'Technical Round 2 & Fitment', type: 'Technical Interview', description: 'Low level design and concurrency', duration: '60 mins' },
    ],
    openingDate: '2026-10-22',
    deadline: '2026-11-06',
    openingsCount: 10,
    status: 'published',
    requiredDocuments: ['Resume'],
    showApplicantCountToStudents: true,
    publishedAt: '2026-10-22T14:00:00Z',
    createdAt: '2026-10-22T14:00:00Z',
  },
  {
    id: 'job_tcs_digital',
    companyId: 'comp_tcs',
    title: 'TCS Digital / Innovator Cadre',
    jobCategory: 'Digital Engineering',
    description: 'Premier hiring category at TCS for top tech talent across India. Build AI solutions, cloud modernization architectures, and IoT devices.',
    responsibilities: [
      'Develop modern cloud-native microservices.',
      'Work with global Fortune 500 clients in banking, retail, and manufacturing.',
    ],
    requiredSkills: ['Java', 'Python', 'Web Technologies', 'SQL', 'Problem Solving'],
    jobType: 'Full-Time',
    workMode: 'On-site',
    location: 'PAN India',
    compensation: {
      salaryRange: '₹7.5 - ₹9.0 LPA',
      benefits: ['Comprehensive health cover', 'Continuous learning incentives'],
    },
    eligibilityRules: {
      eligibleCourses: ['B.Tech', 'M.Tech', 'MCA'],
      eligibleBranches: ['All'],
      eligibleGraduationYears: [2026],
      minTenthPercentage: 60,
      minTwelfthPercentage: 60,
      minCgpa: 6.0,
      allowActiveBacklogs: true,
      maxActiveBacklogsAllowed: 1, // allows 1 active backlog
      allowHistoricalBacklogs: true,
    },
    recruitmentRounds: [
      { id: 'rnd_tcs_1', roundNumber: 1, name: 'TCS NQT (National Qualifier Test)', type: 'Assessment', description: 'Advanced quantitative, reasoning, and coding section', duration: '110 mins' },
      { id: 'rnd_tcs_2', roundNumber: 2, name: 'Technical & HR Composite Interview', type: 'Technical Interview', description: 'Live project discussion and technical viva', duration: '35 mins' },
    ],
    openingDate: '2026-10-05',
    deadline: '2026-11-20',
    openingsCount: 80,
    status: 'published',
    requiredDocuments: ['Resume', '10th & 12th Certificates'],
    showApplicantCountToStudents: true,
    publishedAt: '2026-10-05T08:00:00Z',
    createdAt: '2026-10-05T08:00:00Z',
  },
  {
    id: 'job_infosys_sp',
    companyId: 'comp_infosys',
    title: 'Specialist Programmer (Power Programmer)',
    jobCategory: 'High Performance Coding',
    description: 'Specialist Programmer role in Infosys focused on building complex algorithmic engines, full-stack enterprise applications, and cloud-native microservices.',
    responsibilities: [
      'Lead sprint modules in complex enterprise software.',
      'Optimize algorithmic bottlenecks.',
    ],
    requiredSkills: ['Dynamic Programming', 'Java / Python', 'DBMS', 'Microservices'],
    jobType: 'Full-Time',
    workMode: 'On-site',
    location: 'Bengaluru / Pune / Hyderabad',
    compensation: {
      salaryRange: '₹9.5 - ₹11 LPA',
    },
    eligibilityRules: {
      eligibleCourses: ['B.Tech', 'M.Tech', 'MCA'],
      eligibleBranches: ['All'],
      eligibleGraduationYears: [2026],
      minTenthPercentage: 60,
      minTwelfthPercentage: 60,
      minCgpa: 6.5,
      allowActiveBacklogs: false,
      maxActiveBacklogsAllowed: 0,
      allowHistoricalBacklogs: true,
    },
    recruitmentRounds: [
      { id: 'rnd_inf_1', roundNumber: 1, name: 'InfyTQ / HackWithInfy Qualifier', type: 'Coding', description: '3 algorithmic problems on arrays, graphs, and DP', duration: '180 mins' },
      { id: 'rnd_inf_2', roundNumber: 2, name: 'Technical & Leadership Interview', type: 'Technical Interview', description: 'System implementation and problem solving', duration: '45 mins' },
    ],
    openingDate: '2026-10-08',
    deadline: '2026-11-18',
    openingsCount: 40,
    status: 'published',
    requiredDocuments: ['Resume'],
    showApplicantCountToStudents: true,
    publishedAt: '2026-10-08T09:00:00Z',
    createdAt: '2026-10-08T09:00:00Z',
  },
  {
    id: 'job_nvidia_arch',
    companyId: 'comp_nvidia',
    title: 'Hardware & System Software Engineer (GPU Architecture)',
    jobCategory: 'AI & Systems',
    description: 'Join the vanguard of the AI revolution at NVIDIA. You will design, model, and verify GPU hardware architectures, CUDA drivers, and deep learning acceleration libraries.',
    responsibilities: [
      'Model microarchitectures for next-generation Tensor Core GPUs.',
      'Develop kernel routines in CUDA and C++ for large language model inference.',
      'Benchmark hardware simulation performance against silicon targets.',
    ],
    requiredSkills: ['C / C++', 'CUDA', 'Computer Architecture', 'Digital Logic Design', 'Verilog Basics'],
    jobType: 'Full-Time',
    workMode: 'On-site',
    location: 'Bengaluru / Pune',
    compensation: {
      salaryRange: '₹25 - ₹30 LPA',
      benefits: ['NVIDIA ESPP', 'Comprehensive healthcare', 'GPU home workstation credit'],
    },
    eligibilityRules: {
      eligibleCourses: ['B.Tech', 'M.Tech'],
      eligibleBranches: ['Electronics & Communication', 'Electrical & Electronics', 'Computer Science & Engineering'],
      eligibleGraduationYears: [2026],
      minTenthPercentage: 75,
      minTwelfthPercentage: 75,
      minCgpa: 8.2,
      allowActiveBacklogs: false,
      maxActiveBacklogsAllowed: 0,
      allowHistoricalBacklogs: false,
    },
    recruitmentRounds: [
      { id: 'rnd_nv_1', roundNumber: 1, name: 'Hardware & Computer Arch Online Test', type: 'Assessment', description: 'Questions on C/C++, digital circuits, memory hierarchy, and caching', duration: '90 mins' },
      { id: 'rnd_nv_2', roundNumber: 2, name: 'Technical Round 1 (Architecture & Verilog)', type: 'Technical Interview', description: 'Pipeline hazard analysis, cache coherence, and RTL design', duration: '60 mins' },
      { id: 'rnd_nv_3', roundNumber: 3, name: 'Technical Round 2 (C++ & Concurrency)', type: 'Technical Interview', description: 'Multi-threading, mutexes, memory barriers, and CUDA concepts', duration: '60 mins' },
    ],
    openingDate: '2026-10-23',
    deadline: '2026-11-14',
    openingsCount: 8,
    status: 'published',
    requiredDocuments: ['Resume', 'Academic Transcript'],
    showApplicantCountToStudents: true,
    publishedAt: '2026-10-23T08:00:00Z',
    createdAt: '2026-10-23T08:00:00Z',
  },
  {
    id: 'job_adobe_mts',
    companyId: 'comp_adobe',
    title: 'Member of Technical Staff - 1',
    jobCategory: 'Software Engineering',
    description: 'Adobe is hiring MTS-1 engineers to invent next-generation generative AI tools for Photoshop, Premiere, and Firefly. Work on high-performance vector rendering, neural audio, and cloud services.',
    responsibilities: [
      'Build generative media pipelines and WebGL canvas applications.',
      'Optimize image processing routines using SIMD and WebAssembly.',
    ],
    requiredSkills: ['C++', 'JavaScript / TypeScript', 'Graphics Fundamentals', 'Data Structures'],
    jobType: 'Full-Time',
    workMode: 'Hybrid',
    location: 'Noida / Bengaluru',
    compensation: {
      salaryRange: '₹24 - ₹29 LPA',
    },
    eligibilityRules: {
      eligibleCourses: ['B.Tech', 'M.Tech', 'MCA'],
      eligibleBranches: ['Computer Science & Engineering', 'Information Technology'],
      eligibleGraduationYears: [2026],
      minTenthPercentage: 70,
      minTwelfthPercentage: 70,
      minCgpa: 7.8,
      allowActiveBacklogs: false,
      maxActiveBacklogsAllowed: 0,
      allowHistoricalBacklogs: true,
    },
    recruitmentRounds: [
      { id: 'rnd_ad_1', roundNumber: 1, name: 'Adobe Online Technical Test', type: 'Coding', description: '3 medium-to-hard coding problems on Hackerrank', duration: '90 mins' },
      { id: 'rnd_ad_2', roundNumber: 2, name: 'Technical Interview 1', type: 'Technical Interview', description: 'Data structures, algorithm proofs, and tree balancing', duration: '45 mins' },
      { id: 'rnd_ad_3', roundNumber: 3, name: 'Technical Interview 2', type: 'Technical Interview', description: 'Low level design and performance optimization', duration: '45 mins' },
    ],
    openingDate: '2026-10-14',
    deadline: '2026-11-09',
    openingsCount: 12,
    status: 'published',
    requiredDocuments: ['Resume'],
    showApplicantCountToStudents: true,
    publishedAt: '2026-10-14T09:00:00Z',
    createdAt: '2026-10-14T09:00:00Z',
  },
  {
    id: 'job_oracle_cloud',
    companyId: 'comp_oracle',
    title: 'Associate Cloud Engineer (OCI Infrastructure)',
    jobCategory: 'Cloud & Systems',
    description: 'Oracle Cloud Infrastructure (OCI) delivers high-performance compute and database services. You will build distributed storage, identity management, and virtual networking protocols.',
    responsibilities: [
      'Write Java and Go services for distributed orchestration.',
      'Build telemetry instrumentation and fault-recovery protocols.',
    ],
    requiredSkills: ['Java', 'Linux', 'Networking', 'Operating Systems', 'Docker'],
    jobType: 'Full-Time',
    workMode: 'Hybrid',
    location: 'Bengaluru / Hyderabad',
    compensation: {
      salaryRange: '₹17 - ₹21 LPA',
    },
    eligibilityRules: {
      eligibleCourses: ['B.Tech', 'M.Tech', 'MCA'],
      eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication', 'Electrical & Electronics'],
      eligibleGraduationYears: [2026],
      minTenthPercentage: 65,
      minTwelfthPercentage: 65,
      minCgpa: 7.2,
      allowActiveBacklogs: false,
      maxActiveBacklogsAllowed: 0,
      allowHistoricalBacklogs: true,
    },
    recruitmentRounds: [
      { id: 'rnd_or_1', roundNumber: 1, name: 'Online Assessment', type: 'Coding', description: 'MCQs on OS/DBMS + 2 Coding questions', duration: '90 mins' },
      { id: 'rnd_or_2', roundNumber: 2, name: 'Technical Round 1', type: 'Technical Interview', description: 'Data structures and multi-threaded programming', duration: '50 mins' },
      { id: 'rnd_or_3', roundNumber: 3, name: 'Technical & HR Round 2', type: 'Technical Interview', description: 'System concepts and teamwork', duration: '45 mins' },
    ],
    openingDate: '2026-10-17',
    deadline: '2026-11-11',
    openingsCount: 15,
    status: 'published',
    requiredDocuments: ['Resume'],
    showApplicantCountToStudents: true,
    publishedAt: '2026-10-17T11:00:00Z',
    createdAt: '2026-10-17T11:00:00Z',
  },
];

// Helper to generate 100 realistic student profiles
export function generateSeedStudents(): StudentProfile[] {
  const firstNames = [
    'Aarav', 'Priya', 'Rohan', 'Ananya', 'Aditya', 'Isha', 'Vikram', 'Neha', 'Siddharth', 'Divya',
    'Arjun', 'Sneha', 'Rahul', 'Tanvi', 'Kabir', 'Riya', 'Kunal', 'Pooja', 'Varun', 'Kavya',
    'Harsh', 'Shreya', 'Manish', 'Meera', 'Gaurav', 'Aditi', 'Pranav', 'Simran', 'Akash', 'Shruti',
    'Nikhil', 'Swati', 'Dev', 'Ritika', 'Ayush', 'Roshni', 'Karan', 'Anushka', 'Vivek', 'Bhavna',
    'Deepak', 'Aakanksha', 'Sachin', 'Sonali', 'Yash', 'Pallavi', 'Sameer', 'Natasha', 'Mayank', 'Geeta',
  ];

  const lastNames = [
    'Sharma', 'Patel', 'Verma', 'Gupta', 'Singh', 'Reddy', 'Iyer', 'Nair', 'Deshmukh', 'Joshi',
    'Malhotra', 'Bose', 'Chatterjee', 'Mehta', 'Kulkarni', 'Bhat', 'Agarwal', 'Chopra', 'Rao', 'Pandey',
  ];

  const departments = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Electrical & Electronics',
    'Mechanical Engineering',
    'Civil Engineering',
    'Master of Computer Applications',
  ];

  const skillPool = [
    'React', 'Node.js', 'Python', 'Java', 'C++', 'TypeScript', 'Tailwind CSS', 'SQL', 'MongoDB',
    'AWS', 'Docker', 'Git', 'Data Structures & Algorithms', 'Machine Learning', 'Linux', 'Kubernetes',
    'REST APIs', 'Spring Boot', 'Next.js', 'Figma', 'System Design', 'PostgreSQL',
  ];

  const students: StudentProfile[] = [];

  for (let i = 1; i <= 100; i++) {
    const fn = firstNames[(i - 1) % firstNames.length];
    const ln = lastNames[Math.floor((i - 1) / 2) % lastNames.length];
    const fullName = `${fn} ${ln}`;
    const studentRollNo = `21AIT${(1000 + i).toString()}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@campushire.edu`;
    
    // Distribute departments realistic for an engineering college
    let dept = departments[0]; // 50% CSE/IT
    if (i % 6 === 1 || i % 6 === 2) dept = 'Computer Science & Engineering';
    else if (i % 6 === 3) dept = 'Information Technology';
    else if (i % 6 === 4) dept = 'Electronics & Communication';
    else if (i % 6 === 5) dept = 'Electrical & Electronics';
    else if (i % 12 === 0) dept = 'Mechanical Engineering';
    else if (i % 15 === 0) dept = 'Civil Engineering';
    else if (i % 20 === 0) dept = 'Master of Computer Applications';

    const isDiploma = i % 18 === 0;
    // CGPAs distributed between 5.8 and 9.9
    const baseCgpa = 6.2 + ((i * 3.7) % 3.7);
    const cgpa = Number(Math.min(9.9, Math.max(5.8, baseCgpa)).toFixed(2));
    
    // Backlogs: most have 0, some have 1 or 2
    const activeBacklogs = (i % 14 === 0) ? (i % 28 === 0 ? 2 : 1) : 0;
    const historicalBacklogs = activeBacklogs > 0 ? activeBacklogs : (i % 11 === 0 ? 1 : 0);

    const tenth = Math.round(72 + ((i * 7) % 25));
    const twelfth = isDiploma ? undefined : Math.round(70 + ((i * 5) % 26));
    const diplomaPct = isDiploma ? Math.round(78 + ((i * 4) % 18)) : undefined;

    // Pick 4-6 skills
    const selectedSkills = [
      skillPool[i % skillPool.length],
      skillPool[(i + 3) % skillPool.length],
      skillPool[(i + 7) % skillPool.length],
      skillPool[(i + 11) % skillPool.length],
      skillPool[(i + 15) % skillPool.length],
    ];

    students.push({
      id: `std_${i}`,
      userId: `usr_std_${i}`,
      studentId: studentRollNo,
      name: fullName,
      email,
      phone: `+91 ${9800000000 + i * 1111}`,
      gender: i % 2 === 0 ? 'Female' : 'Male',
      collegeName: 'Apex Institute of Technology',
      department: dept,
      course: dept === 'Master of Computer Applications' ? 'MCA' : 'B.Tech',
      specialization: dept.includes('Computer Science')
        ? (i % 3 === 0 ? 'AI & Machine Learning' : i % 3 === 1 ? 'Cybersecurity' : 'Software Systems')
        : 'Core Discipline',
      graduationYear: 2026,
      academicRecords: {
        tenthPercentage: tenth,
        tenthPassingYear: 2020,
        tenthBoard: 'CBSE',
        twelfthPercentage: twelfth,
        twelfthPassingYear: isDiploma ? undefined : 2022,
        twelfthBoard: isDiploma ? undefined : 'CBSE',
        isDiplomaStudent: isDiploma,
        diplomaPercentage: diplomaPct,
        diplomaPassingYear: isDiploma ? 2023 : undefined,
        diplomaStream: isDiploma ? 'Diploma in Computer Tech' : undefined,
        currentCgpa: cgpa,
        currentSemester: 7,
        section: String.fromCharCode(65 + (i % 4)), // Section A, B, C, D
        activeBacklogs,
        historicalBacklogs,
      },
      profilePhoto: `https://images.unsplash.com/photo-${1530000000000 + (i * 1234567) % 50000000000}?w=150&auto=format&fit=crop&q=80`,
      resumeUrl: `/resumes/${studentRollNo}_Resume.pdf`,
      resumeFileName: `${studentRollNo}_Resume.pdf`,
      skills: selectedSkills,
      projects: [
        {
          id: `prj_${i}_1`,
          title: `${selectedSkills[0]} Full-Stack Microservices Platform`,
          description: 'Engineered high-performance real-time web application featuring resilient queuing, JWT auth, and automated testing.',
          technologies: [selectedSkills[0], selectedSkills[1], 'Tailwind CSS'],
          link: `https://github.com/${fn.toLowerCase()}/${fn.toLowerCase()}-project`,
        },
        {
          id: `prj_${i}_2`,
          title: 'Campus Event & Resource Management System',
          description: 'A responsive multi-tenant portal for student clubs to reserve campus spaces and broadcast event notices.',
          technologies: [selectedSkills[2], 'SQL', 'Git'],
        },
      ],
      experience: i % 3 === 0 ? [
        {
          id: `exp_${i}_1`,
          role: 'Summer Software Engineering Intern',
          company: 'InnoTech Solutions',
          duration: 'May 2025 – July 2025 (2 months)',
          description: 'Collaborated on frontend modernization and optimized query performance, boosting page load speeds by 28%.',
        },
      ] : [],
      certifications: [
        {
          id: `cert_${i}_1`,
          name: 'AWS Certified Cloud Practitioner',
          issuer: 'Amazon Web Services',
          issueYear: 2025,
          credentialUrl: 'https://aws.amazon.com/verification',
        },
      ],
      githubUrl: `https://github.com/${fn.toLowerCase()}${ln.toLowerCase()}`,
      linkedinUrl: `https://linkedin.com/in/${fn.toLowerCase()}-${ln.toLowerCase()}`,
      portfolioUrl: `https://${fn.toLowerCase()}.dev`,
      profileCompletion: Math.min(100, Math.round(75 + ((i * 3) % 25))),
      accountStatus: i === 99 ? 'deactivated' : 'active',
      createdAt: '2025-09-01T08:00:00Z',
    });
  }

  return students;
}

// Generate realistic applications for seed students
export function generateSeedApplications(
  students: StudentProfile[],
  jobs: JobOpportunity[]
): Application[] {
  const applications: Application[] = [];
  const statuses: Application['currentStatus'][] = [
    'Applied',
    'Under Review',
    'Shortlisted',
    'Assessment Scheduled',
    'Technical Round',
    'Selected',
    'Offer Released',
    'Offer Accepted',
    'Rejected',
  ];

  // Create applications for various jobs
  jobs.forEach((job, jobIdx) => {
    // Select a subset of students to apply (e.g. 15-25 students per job)
    const applicantCount = 18 + (jobIdx % 10);
    const eligibleStudents = students.filter((s) => {
      const evalRes = evaluateEligibility(s, job.eligibilityRules);
      return evalRes.isEligible;
    });

    const applicantsToSeed = eligibleStudents.slice(0, applicantCount);

    applicantsToSeed.forEach((student, appIdx) => {
      const appId = `APP-2026-${job.id.substring(4, 8).toUpperCase()}-${(100 + appIdx).toString()}`;
      const evalResult = evaluateEligibility(student, job.eligibilityRules);

      // Vary status realistically based on index
      let status: Application['currentStatus'] = 'Applied';
      if (appIdx === 0) status = 'Offer Accepted';
      else if (appIdx === 1) status = 'Offer Released';
      else if (appIdx < 4) status = 'Selected';
      else if (appIdx < 7) status = 'Technical Round';
      else if (appIdx < 11) status = 'Shortlisted';
      else if (appIdx < 14) status = 'Assessment Scheduled';
      else if (appIdx < 16) status = 'Under Review';
      else if (appIdx === 17) status = 'Rejected';

      const roundNumber = status === 'Offer Accepted' || status === 'Offer Released' || status === 'Selected'
        ? job.recruitmentRounds.length
        : status === 'Technical Round'
        ? 2
        : status === 'Assessment Scheduled'
        ? 1
        : 1;

      applications.push({
        id: appId,
        studentId: student.id,
        studentRollNo: student.studentId,
        studentName: student.name,
        studentEmail: student.email,
        jobOpportunityId: job.id,
        companyId: job.companyId,
        submittedProfileSnapshot: {
          name: student.name,
          email: student.email,
          phone: student.phone,
          course: student.course,
          department: student.department,
          graduationYear: student.graduationYear,
          cgpa: student.academicRecords.currentCgpa,
          tenthPercentage: student.academicRecords.tenthPercentage,
          twelfthPercentage: student.academicRecords.twelfthPercentage,
          activeBacklogs: student.academicRecords.activeBacklogs,
          resumeUrl: student.resumeUrl,
          skills: student.skills,
        },
        statementOfInterest: `I am highly enthusiastic about this role at ${job.companyId}. My technical background in ${student.department} and hands-on project work align closely with the responsibilities.`,
        eligibilityEvaluation: evalResult,
        currentStatus: status,
        currentRoundNumber: roundNumber,
        roundHistory: [
          {
            roundName: job.recruitmentRounds[0]?.name || 'Online Assessment',
            roundNumber: 1,
            status: status === 'Applied' ? 'Pending' : status === 'Rejected' && appIdx > 14 ? 'Failed' : 'Cleared',
            updatedAt: '2026-10-24T10:00:00Z',
          },
        ],
        internalNotes: appIdx < 3 ? 'Strong algorithmic foundation and solid communication in preliminary screening.' : undefined,
        appliedAt: new Date(Date.now() - (appIdx * 86400000 * 0.8)).toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  });

  return applications;
}

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_1',
    title: 'Google Online Challenge Scheduled for Nov 5, 2026',
    content: 'All shortlisted B.Tech CSE, IT, and ECE applicants for Google SWE must report to Central Computing Lab 3 or test from home with working webcams at 09:30 AM IST sharp.',
    priority: 'Urgent',
    targetBranches: ['All'],
    targetGraduationYears: [2026],
    createdBy: 'Dr. Arvind Sharma (Placement Officer)',
    createdAt: '2026-10-23T08:00:00Z',
  },
  {
    id: 'ann_2',
    title: 'Resume Verification Deadline — Oct 28, 2026',
    content: 'Ensure all CGPA updates up to Semester 6 and active backlogs status are certified by your respective department HOD before applying for Day-1 companies.',
    priority: 'High',
    targetBranches: ['All'],
    targetGraduationYears: [2026],
    createdBy: 'Placement Cell Secretariat',
    createdAt: '2026-10-22T10:00:00Z',
  },
  {
    id: 'ann_3',
    title: 'Deloitte Pre-Placement Talk (PPT) & Case Prep Session',
    content: 'Deloitte leadership will conduct a live pre-placement talk in the Main Auditorium on Oct 30, 2026 at 03:00 PM. Attendance is compulsory for registered applicants.',
    priority: 'Normal',
    targetBranches: ['All'],
    targetGraduationYears: [2026],
    createdBy: 'Prof. Anjali Saxena (Faculty Coordinator)',
    createdAt: '2026-10-21T14:00:00Z',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud_1',
    actorId: 'usr_admin_01',
    actorName: 'Dr. Arvind Sharma',
    actorRole: 'admin',
    action: 'PUBLISH_JOB',
    entityType: 'JobOpportunity',
    entityId: 'job_goog_swe',
    changeSummary: 'Published Google SWE with Min CGPA 8.0, 0 Active Backlogs rule.',
    timestamp: '2026-10-15T09:00:00Z',
  },
  {
    id: 'aud_2',
    actorId: 'usr_admin_01',
    actorName: 'Dr. Arvind Sharma',
    actorRole: 'admin',
    action: 'CREATE_COMPANY',
    entityType: 'Company',
    entityId: 'comp_nvidia',
    changeSummary: 'Added NVIDIA Corporation to campus recruitment directory.',
    timestamp: '2026-10-23T08:00:00Z',
  },
  {
    id: 'aud_3',
    actorId: 'usr_admin_01',
    actorName: 'Dr. Arvind Sharma',
    actorRole: 'admin',
    action: 'EXPORT_PDF_REPORT',
    entityType: 'Export',
    entityId: 'job_msft_sde',
    changeSummary: 'Exported applicant PDF report for Microsoft SDE-1 (20 applicants).',
    timestamp: '2026-10-23T11:15:00Z',
  },
];
