export type Role = 'admin' | 'student';

export interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
  studentId?: string;
  avatarUrl?: string;
  accountStatus: 'active' | 'deactivated';
  createdAt: string;
}

export interface AcademicRecord {
  tenthPercentage: number;
  tenthPassingYear: number;
  tenthBoard?: string;
  twelfthPercentage?: number;
  twelfthPassingYear?: number;
  twelfthBoard?: string;
  isDiplomaStudent?: boolean;
  diplomaPercentage?: number;
  diplomaPassingYear?: number;
  diplomaStream?: string;
  currentCgpa: number; // e.g. 8.4
  currentSemester: number;
  section: string;
  activeBacklogs: number;
  historicalBacklogs: number;
}

export interface StudentProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface StudentExperience {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface StudentCertification {
  id: string;
  name: string;
  issuer: string;
  issueYear: number;
  credentialUrl?: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  studentId: string; // University Roll Number e.g. 21BCE1042
  name: string;
  email: string;
  phone?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  collegeName: string;
  department: string; // e.g. 'Computer Science & Engineering'
  course: string; // 'B.Tech', 'M.Tech', 'MCA', 'BBA', 'MBA'
  specialization: string; // e.g. 'Artificial Intelligence & Data Science'
  graduationYear: number; // e.g. 2026
  academicRecords: AcademicRecord;
  profilePhoto?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  skills: string[];
  projects: StudentProject[];
  experience: StudentExperience[];
  certifications: StudentCertification[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  profileCompletion: number; // 0-100%
  accountStatus: 'active' | 'deactivated';
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  industry: string; // 'Software / IT', 'Fintech', 'Consulting', 'E-Commerce', etc.
  website: string;
  location: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone?: string;
  status: 'active' | 'archived';
  notes?: string;
  createdAt: string;
}

export interface EligibilityRules {
  eligibleCourses: string[]; // e.g. ['B.Tech', 'MCA']
  eligibleBranches: string[]; // e.g. ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication']
  eligibleGraduationYears: number[]; // e.g. [2026]
  minTenthPercentage: number; // e.g. 60
  minTwelfthPercentage: number; // e.g. 60
  minCgpa: number; // e.g. 7.5
  allowActiveBacklogs: boolean;
  maxActiveBacklogsAllowed: number; // 0 or more
  allowHistoricalBacklogs: boolean;
  additionalConditions?: string;
}

export interface RecruitmentRound {
  id: string;
  roundNumber: number;
  name: string; // e.g. 'Online Aptitude & Coding Assessment'
  type: 'Aptitude' | 'Coding' | 'Technical Interview' | 'HR Interview' | 'Group Discussion' | 'Assessment' | 'Custom';
  description: string;
  scheduledDate?: string;
  duration?: string; // e.g. '90 mins'
  locationOrMeetingLink?: string;
  instructions?: string;
}

export interface JobOpportunity {
  id: string;
  companyId: string;
  title: string; // e.g. 'Software Development Engineer - I'
  jobCategory: string; // 'Software Engineering', 'Data Analyst', 'Cloud Consultant'
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  jobType: 'Full-Time' | 'Internship' | 'Trainee' | 'Internship-to-PPO';
  workMode: 'On-site' | 'Hybrid' | 'Remote';
  location: string;
  compensation: {
    salaryRange: string; // e.g. '₹14 - ₹18 LPA' or '₹45,000 / month'
    stipend?: string;
    benefits?: string[];
  };
  eligibilityRules: EligibilityRules;
  recruitmentRounds: RecruitmentRound[];
  openingDate: string;
  deadline: string;
  openingsCount?: number;
  status: 'draft' | 'published' | 'paused' | 'closed' | 'archived';
  requiredDocuments: string[];
  customQuestions?: { id: string; question: string; isRequired: boolean }[];
  showApplicantCountToStudents: boolean;
  publishedAt?: string;
  createdAt: string;
}

export type ApplicationStatus =
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Assessment Scheduled'
  | 'Technical Round'
  | 'HR Round'
  | 'Selected'
  | 'Offer Released'
  | 'Offer Accepted'
  | 'Offer Declined'
  | 'Rejected'
  | 'Withdrawn';

export interface EligibilityResult {
  isEligible: boolean;
  status: 'Eligible' | 'Not Eligible' | 'Review Required';
  passedConditions: string[];
  failedConditions: string[];
  missingInformation: string[];
  summary: string;
}

export interface Application {
  id: string; // e.g. 'APP-2026-GOOG-01'
  studentId: string; // Reference to StudentProfile.id
  studentRollNo: string;
  studentName: string;
  studentEmail: string;
  jobOpportunityId: string;
  companyId: string;
  submittedProfileSnapshot: {
    name: string;
    email: string;
    phone?: string;
    course: string;
    department: string;
    graduationYear: number;
    cgpa: number;
    tenthPercentage: number;
    twelfthPercentage?: number;
    activeBacklogs: number;
    resumeUrl?: string;
    skills: string[];
  };
  answers?: { questionId: string; question: string; answer: string }[];
  statementOfInterest?: string;
  eligibilityEvaluation: EligibilityResult;
  currentStatus: ApplicationStatus;
  currentRoundNumber: number;
  roundHistory: {
    roundName: string;
    roundNumber: number;
    status: 'Pending' | 'Cleared' | 'Failed' | 'Skipped';
    updatedAt: string;
    notes?: string;
  }[];
  internalNotes?: string;
  appliedAt: string;
  updatedAt: string;
  withdrawnAt?: string;
}

export interface NotificationItem {
  id: string;
  recipientId: string; // 'all', or userId / 'admin'
  recipientRole?: Role | 'all';
  type: 'opportunity' | 'application' | 'interview' | 'announcement' | 'system';
  title: string;
  message: string;
  relatedEntityId?: string;
  read: boolean;
  createdAt: string;
}

export interface InterviewSchedule {
  id: string;
  jobOpportunityId: string;
  roundId: string;
  roundName: string;
  companyName: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  startTime: string; // ISO string
  endTime: string;
  locationOrMeetingLink: string;
  interviewer?: string;
  attendance: 'Scheduled' | 'Present' | 'Absent';
  outcome?: 'Cleared' | 'Rejected' | 'Pending';
  notes?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: Role;
  action: string;
  entityType: 'Company' | 'JobOpportunity' | 'Application' | 'Student' | 'Export' | 'Interview' | 'Announcement';
  entityId: string;
  changeSummary: string;
  timestamp: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'Normal' | 'High' | 'Urgent';
  targetBranches: string[]; // ['All'] or specific branches
  targetGraduationYears: number[]; // [0] for all or specific
  createdBy: string;
  createdAt: string;
}
