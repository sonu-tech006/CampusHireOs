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
  ApplicationStatus,
} from '../types';
import {
  ADMIN_USER,
  INITIAL_COMPANIES,
  INITIAL_JOBS,
  generateSeedStudents,
  generateSeedApplications,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockSeedData';
import { evaluateEligibility } from './eligibilityEngine';

const STORAGE_KEYS = {
  COMPANIES: 'campushire_companies_v1',
  JOBS: 'campushire_jobs_v1',
  STUDENTS: 'campushire_students_v1',
  APPLICATIONS: 'campushire_applications_v1',
  INTERVIEWS: 'campushire_interviews_v1',
  NOTIFICATIONS: 'campushire_notifications_v1',
  ANNOUNCEMENTS: 'campushire_announcements_v1',
  AUDIT_LOGS: 'campushire_audit_logs_v1',
  INITIALIZED: 'campushire_initialized_v1',
};

class StorageService {
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.ensureInitialized();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.COMPANIES);
    localStorage.removeItem(STORAGE_KEYS.JOBS);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.INTERVIEWS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
    this.ensureInitialized(true);
    this.notify();
  }

  private ensureInitialized(force = false) {
    if (!force && localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      return;
    }

    const seedStudents = generateSeedStudents();
    const seedApplications = generateSeedApplications(seedStudents, INITIAL_JOBS);

    // Initial interview schedules for shortlisted students
    const seedInterviews: InterviewSchedule[] = [
      {
        id: 'int_1',
        jobOpportunityId: 'job_goog_swe',
        roundId: 'rnd_goog_2',
        roundName: 'Technical Virtual Onsite Round 1',
        companyName: 'Google India',
        studentId: seedStudents[0].id,
        studentName: seedStudents[0].name,
        studentRollNo: seedStudents[0].studentId,
        startTime: '2026-11-06T10:00:00Z',
        endTime: '2026-11-06T10:45:00Z',
        locationOrMeetingLink: 'https://meet.google.com/ch-goog-tech',
        interviewer: 'Sundar K. (Staff Software Engineer)',
        attendance: 'Scheduled',
        outcome: 'Pending',
      },
      {
        id: 'int_2',
        jobOpportunityId: 'job_msft_sde',
        roundId: 'rnd_msft_2',
        roundName: 'Technical Interview Round 1',
        companyName: 'Microsoft IDC',
        studentId: seedStudents[1].id,
        studentName: seedStudents[1].name,
        studentRollNo: seedStudents[1].studentId,
        startTime: '2026-11-07T14:00:00Z',
        endTime: '2026-11-07T15:00:00Z',
        locationOrMeetingLink: 'https://teams.microsoft.com/l/meetup-join/msft-sde',
        interviewer: 'Ananya S. (Principal SDE)',
        attendance: 'Scheduled',
        outcome: 'Pending',
      },
    ];

    const seedNotifications: NotificationItem[] = [
      {
        id: 'notif_1',
        recipientId: 'all',
        recipientRole: 'all',
        type: 'opportunity',
        title: 'New Tier-1 Opportunity: Google SWE Open',
        message: 'Google has released its University Graduate SWE hiring for 2026 batch. Deadline: Nov 2, 2026.',
        relatedEntityId: 'job_goog_swe',
        read: false,
        createdAt: '2026-10-23T09:00:00Z',
      },
      {
        id: 'notif_2',
        recipientId: seedStudents[0].userId,
        recipientRole: 'student',
        type: 'interview',
        title: 'Interview Scheduled with Google India',
        message: 'Your Technical Virtual Onsite Round 1 has been scheduled for Nov 6, 2026 at 10:00 AM IST.',
        relatedEntityId: 'job_goog_swe',
        read: false,
        createdAt: '2026-10-23T11:00:00Z',
      },
      {
        id: 'notif_3',
        recipientId: 'admin',
        recipientRole: 'admin',
        type: 'application',
        title: '25 New Applications for Microsoft IDC',
        message: 'Student registrations crossed 25 for Microsoft SDE-1 opportunity.',
        relatedEntityId: 'job_msft_sde',
        read: false,
        createdAt: '2026-10-23T12:00:00Z',
      },
    ];

    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(INITIAL_COMPANIES));
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_JOBS));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(seedStudents));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(seedApplications));
    localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(seedInterviews));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(seedNotifications));
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }

  // --- COMPANIES ---
  public getCompanies(): Company[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPANIES);
    return raw ? JSON.parse(raw) : [];
  }

  public getCompanyById(id: string): Company | undefined {
    return this.getCompanies().find((c) => c.id === id);
  }

  public saveCompany(companyData: Omit<Company, 'id' | 'createdAt'> & { id?: string }): Company {
    const companies = this.getCompanies();
    if (companyData.id) {
      const idx = companies.findIndex((c) => c.id === companyData.id);
      if (idx !== -1) {
        companies[idx] = { ...companies[idx], ...companyData };
        localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
        this.addAuditLog('UPDATE_COMPANY', 'Company', companyData.id, `Updated details for ${companyData.name}`);
        this.notify();
        return companies[idx];
      }
    }

    const newCompany: Company = {
      ...companyData,
      id: `comp_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    companies.unshift(newCompany);
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
    this.addAuditLog('CREATE_COMPANY', 'Company', newCompany.id, `Created company ${newCompany.name}`);
    this.notify();
    return newCompany;
  }

  public archiveCompany(id: string) {
    const companies = this.getCompanies();
    const c = companies.find((item) => item.id === id);
    if (c) {
      c.status = c.status === 'archived' ? 'active' : 'archived';
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
      this.addAuditLog('ARCHIVE_COMPANY', 'Company', id, `Toggled archive status to ${c.status} for ${c.name}`);
      this.notify();
    }
  }

  // --- JOBS ---
  public getJobs(): JobOpportunity[] {
    const raw = localStorage.getItem(STORAGE_KEYS.JOBS);
    return raw ? JSON.parse(raw) : [];
  }

  public getJobById(id: string): JobOpportunity | undefined {
    return this.getJobs().find((j) => j.id === id);
  }

  public saveJob(jobData: Partial<JobOpportunity> & { title: string; companyId: string }): JobOpportunity {
    const jobs = this.getJobs();
    if (jobData.id) {
      const idx = jobs.findIndex((j) => j.id === jobData.id);
      if (idx !== -1) {
        jobs[idx] = { ...jobs[idx], ...jobData } as JobOpportunity;
        localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
        this.addAuditLog('UPDATE_JOB', 'JobOpportunity', jobData.id, `Updated job post: ${jobData.title}`);
        this.notify();
        return jobs[idx];
      }
    }

    const newJob: JobOpportunity = {
      id: `job_${Date.now()}`,
      companyId: jobData.companyId,
      title: jobData.title,
      jobCategory: jobData.jobCategory || 'Software Engineering',
      description: jobData.description || '',
      responsibilities: jobData.responsibilities || [],
      requiredSkills: jobData.requiredSkills || [],
      jobType: jobData.jobType || 'Full-Time',
      workMode: jobData.workMode || 'Hybrid',
      location: jobData.location || 'Pan India',
      compensation: jobData.compensation || { salaryRange: 'Competitive' },
      eligibilityRules: jobData.eligibilityRules || {
        eligibleCourses: ['B.Tech'],
        eligibleBranches: ['All'],
        eligibleGraduationYears: [2026],
        minTenthPercentage: 60,
        minTwelfthPercentage: 60,
        minCgpa: 6.5,
        allowActiveBacklogs: false,
        maxActiveBacklogsAllowed: 0,
        allowHistoricalBacklogs: true,
      },
      recruitmentRounds: jobData.recruitmentRounds || [
        {
          id: `rnd_${Date.now()}_1`,
          roundNumber: 1,
          name: 'Online Technical Test',
          type: 'Coding',
          description: 'Aptitude and coding assessment',
          duration: '60 mins',
        },
      ],
      openingDate: jobData.openingDate || new Date().toISOString().split('T')[0],
      deadline: jobData.deadline || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      openingsCount: jobData.openingsCount || 10,
      status: jobData.status || 'published',
      requiredDocuments: jobData.requiredDocuments || ['Resume'],
      customQuestions: jobData.customQuestions || [],
      showApplicantCountToStudents: jobData.showApplicantCountToStudents ?? true,
      publishedAt: jobData.status === 'published' ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
    };

    jobs.unshift(newJob);
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    this.addAuditLog('CREATE_JOB', 'JobOpportunity', newJob.id, `Created job opening ${newJob.title}`);

    // Broadcast notification to students
    this.addNotification({
      recipientId: 'all',
      recipientRole: 'student',
      type: 'opportunity',
      title: `New Opening: ${newJob.title}`,
      message: `A new placement opportunity for ${newJob.title} is now open for applications.`,
      relatedEntityId: newJob.id,
    });

    this.notify();
    return newJob;
  }

  public updateJobStatus(jobId: string, status: JobOpportunity['status']) {
    const jobs = this.getJobs();
    const j = jobs.find((item) => item.id === jobId);
    if (j) {
      j.status = status;
      if (status === 'published' && !j.publishedAt) {
        j.publishedAt = new Date().toISOString();
      }
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
      this.addAuditLog('UPDATE_JOB_STATUS', 'JobOpportunity', jobId, `Changed status of ${j.title} to ${status}`);
      this.notify();
    }
  }

  // --- STUDENTS ---
  public getStudents(): StudentProfile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return raw ? JSON.parse(raw) : [];
  }

  public getStudentById(id: string): StudentProfile | undefined {
    return this.getStudents().find((s) => s.id === id || s.userId === id);
  }

  public saveStudent(student: StudentProfile): StudentProfile {
    const students = this.getStudents();
    const idx = students.findIndex((s) => s.id === student.id || s.userId === student.userId);
    if (idx !== -1) {
      students[idx] = student;
    } else {
      students.unshift(student);
    }
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    this.notify();
    return student;
  }

  public toggleStudentStatus(studentId: string) {
    const students = this.getStudents();
    const s = students.find((item) => item.id === studentId);
    if (s) {
      s.accountStatus = s.accountStatus === 'active' ? 'deactivated' : 'active';
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      this.addAuditLog(
        'TOGGLE_STUDENT_STATUS',
        'Student',
        studentId,
        `Toggled student status to ${s.accountStatus} for ${s.name} (${s.studentId})`
      );
      this.notify();
    }
  }

  public bulkImportStudents(newStudents: Partial<StudentProfile>[]): { added: number; skippedDuplicates: number } {
    const existing = this.getStudents();
    const existingRolls = new Set(existing.map((s) => s.studentId.toUpperCase().trim()));
    const existingEmails = new Set(existing.map((s) => s.email.toLowerCase().trim()));

    let addedCount = 0;
    let dupCount = 0;

    const imported: StudentProfile[] = [];

    newStudents.forEach((raw, idx) => {
      const roll = (raw.studentId || `21AIT${Date.now() + idx}`).toUpperCase().trim();
      const email = (raw.email || `student${Date.now() + idx}@campushire.edu`).toLowerCase().trim();

      if (existingRolls.has(roll) || existingEmails.has(email)) {
        dupCount++;
        return;
      }

      existingRolls.add(roll);
      existingEmails.add(email);

      const profile: StudentProfile = {
        id: `std_imp_${Date.now()}_${idx}`,
        userId: `usr_imp_${Date.now()}_${idx}`,
        studentId: roll,
        name: raw.name || 'Unnamed Student',
        email,
        phone: raw.phone || '+91 9876543210',
        gender: raw.gender || 'Prefer not to say',
        collegeName: raw.collegeName || 'Apex Institute of Technology',
        department: raw.department || 'Computer Science & Engineering',
        course: raw.course || 'B.Tech',
        specialization: raw.specialization || 'Software Systems',
        graduationYear: raw.graduationYear || 2026,
        academicRecords: raw.academicRecords || {
          tenthPercentage: 75,
          tenthPassingYear: 2020,
          twelfthPercentage: 75,
          twelfthPassingYear: 2022,
          currentCgpa: 7.5,
          currentSemester: 7,
          section: 'A',
          activeBacklogs: 0,
          historicalBacklogs: 0,
        },
        skills: raw.skills || ['Python', 'SQL', 'Git'],
        projects: raw.projects || [],
        experience: raw.experience || [],
        certifications: raw.certifications || [],
        profileCompletion: 80,
        accountStatus: 'active',
        createdAt: new Date().toISOString(),
      };

      imported.push(profile);
      addedCount++;
    });

    const updated = [...imported, ...existing];
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updated));
    this.addAuditLog(
      'BULK_IMPORT_STUDENTS',
      'Student',
      'bulk',
      `Imported ${addedCount} new student records. Skipped ${dupCount} duplicates.`
    );
    this.notify();
    return { added: addedCount, skippedDuplicates: dupCount };
  }

  // --- APPLICATIONS ---
  public getApplications(): Application[] {
    const raw = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return raw ? JSON.parse(raw) : [];
  }

  public getApplicationsByJob(jobId: string): Application[] {
    return this.getApplications().filter((a) => a.jobOpportunityId === jobId);
  }

  public getApplicationsByStudent(studentId: string): Application[] {
    return this.getApplications().filter((a) => a.studentId === studentId);
  }

  public applyToJob({
    student,
    job,
    statementOfInterest,
    answers,
  }: {
    student: StudentProfile;
    job: JobOpportunity;
    statementOfInterest?: string;
    answers?: { questionId: string; question: string; answer: string }[];
  }): { success: boolean; application?: Application; message: string } {
    // 1. Check if opportunity is open
    if (job.status !== 'published') {
      return { success: false, message: 'This placement opportunity is not currently open for applications.' };
    }

    const now = new Date();
    const deadline = new Date(job.deadline);
    deadline.setHours(23, 59, 59, 999);
    if (now > deadline) {
      return { success: false, message: 'The application deadline for this position has passed.' };
    }

    // 2. Prevent duplicate applications
    const apps = this.getApplications();
    const existing = apps.find(
      (a) => a.studentId === student.id && a.jobOpportunityId === job.id && a.currentStatus !== 'Withdrawn'
    );
    if (existing) {
      return { success: false, message: 'You have already submitted an application for this opportunity.' };
    }

    // 3. Re-evaluate eligibility server-side
    const evalResult = evaluateEligibility(student, job.eligibilityRules);
    if (!evalResult.isEligible) {
      return {
        success: false,
        message: `Eligibility validation failed: ${evalResult.summary}`,
      };
    }

    // 4. Create unique application record with immutable profile snapshot
    const appId = `APP-2026-${job.id.substring(4, 8).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: Application = {
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
      answers,
      statementOfInterest,
      eligibilityEvaluation: evalResult,
      currentStatus: 'Applied',
      currentRoundNumber: 1,
      roundHistory: [
        {
          roundName: job.recruitmentRounds[0]?.name || 'Application Screening',
          roundNumber: 1,
          status: 'Pending',
          updatedAt: new Date().toISOString(),
        },
      ],
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    apps.unshift(newApp);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));

    // Audit and notify
    this.addAuditLog(
      'SUBMIT_APPLICATION',
      'Application',
      newApp.id,
      `Student ${student.name} (${student.studentId}) applied to ${job.title}`
    );

    this.addNotification({
      recipientId: student.userId,
      recipientRole: 'student',
      type: 'application',
      title: `Application Submitted: ${job.title}`,
      message: `Your application (${newApp.id}) for ${job.title} has been recorded and submitted to the placement cell.`,
      relatedEntityId: job.id,
    });

    this.addNotification({
      recipientId: 'admin',
      recipientRole: 'admin',
      type: 'application',
      title: `New Applicant for ${job.title}`,
      message: `${student.name} (${student.studentId}, CGPA: ${student.academicRecords.currentCgpa}) applied to ${job.title}.`,
      relatedEntityId: job.id,
    });

    this.notify();
    return { success: true, application: newApp, message: 'Application submitted successfully!' };
  }

  public updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
    internalNotes?: string
  ) {
    const apps = this.getApplications();
    const app = apps.find((a) => a.id === applicationId);
    if (app) {
      const prevStatus = app.currentStatus;
      app.currentStatus = status;
      app.updatedAt = new Date().toISOString();
      if (internalNotes !== undefined) {
        app.internalNotes = internalNotes;
      }
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));

      this.addAuditLog(
        'UPDATE_APPLICATION_STATUS',
        'Application',
        applicationId,
        `Changed applicant ${app.studentName} status from ${prevStatus} to ${status}`
      );

      // Notify the student
      const student = this.getStudentById(app.studentId);
      if (student) {
        this.addNotification({
          recipientId: student.userId,
          recipientRole: 'student',
          type: 'application',
          title: `Application Status Updated: ${status}`,
          message: `Your application for ${app.jobOpportunityId} has transitioned to "${status}". Check your dashboard for next steps.`,
          relatedEntityId: app.jobOpportunityId,
        });
      }

      this.notify();
    }
  }

  public bulkUpdateApplicationStatus(
    applicationIds: string[],
    newStatus: ApplicationStatus
  ) {
    const apps = this.getApplications();
    let updatedCount = 0;
    applicationIds.forEach((id) => {
      const app = apps.find((a) => a.id === id);
      if (app) {
        app.currentStatus = newStatus;
        app.updatedAt = new Date().toISOString();
        updatedCount++;
      }
    });

    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    this.addAuditLog(
      'BULK_UPDATE_APPLICATIONS',
      'Application',
      'bulk',
      `Updated ${updatedCount} applicants to status "${newStatus}"`
    );
    this.notify();
  }

  public withdrawApplication(applicationId: string): boolean {
    const apps = this.getApplications();
    const app = apps.find((a) => a.id === applicationId);
    if (app) {
      app.currentStatus = 'Withdrawn';
      app.withdrawnAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
      this.addAuditLog('WITHDRAW_APPLICATION', 'Application', applicationId, `Student withdrawn application ${applicationId}`);
      this.notify();
      return true;
    }
    return false;
  }

  // --- INTERVIEWS ---
  public getInterviews(): InterviewSchedule[] {
    const raw = localStorage.getItem(STORAGE_KEYS.INTERVIEWS);
    return raw ? JSON.parse(raw) : [];
  }

  public scheduleInterview(interview: Omit<InterviewSchedule, 'id'>): InterviewSchedule {
    const interviews = this.getInterviews();
    const newInt: InterviewSchedule = {
      ...interview,
      id: `int_${Date.now()}`,
    };
    interviews.unshift(newInt);
    localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(interviews));
    this.addAuditLog('SCHEDULE_INTERVIEW', 'Interview', newInt.id, `Scheduled interview for ${interview.studentName}`);

    // Notify student
    const student = this.getStudentById(interview.studentId);
    if (student) {
      this.addNotification({
        recipientId: student.userId,
        recipientRole: 'student',
        type: 'interview',
        title: `Interview Scheduled: ${interview.roundName}`,
        message: `Interview with ${interview.companyName} is scheduled on ${new Date(interview.startTime).toLocaleString()}. Link: ${interview.locationOrMeetingLink}`,
        relatedEntityId: interview.jobOpportunityId,
      });
    }

    this.notify();
    return newInt;
  }

  // --- ANNOUNCEMENTS ---
  public getAnnouncements(): Announcement[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    return raw ? JSON.parse(raw) : [];
  }

  public addAnnouncement(announcementData: Omit<Announcement, 'id' | 'createdAt'>): Announcement {
    const announcements = this.getAnnouncements();
    const newAnn: Announcement = {
      ...announcementData,
      id: `ann_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    announcements.unshift(newAnn);
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
    this.addAuditLog('CREATE_ANNOUNCEMENT', 'Announcement', newAnn.id, `Broadcasted announcement: ${newAnn.title}`);

    // Broadcast notification to all
    this.addNotification({
      recipientId: 'all',
      recipientRole: 'all',
      type: 'announcement',
      title: `Notice: ${newAnn.title}`,
      message: newAnn.content,
    });

    this.notify();
    return newAnn;
  }

  // --- NOTIFICATIONS ---
  public getNotifications(userId?: string, role?: string): NotificationItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const all: NotificationItem[] = raw ? JSON.parse(raw) : [];
    if (!userId) return all;

    return all.filter((n) => {
      if (n.recipientId === 'all') return true;
      if (role && n.recipientRole === role) return true;
      if (n.recipientId === userId) return true;
      if (role === 'admin' && n.recipientId === 'admin') return true;
      return false;
    });
  }

  public addNotification(notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>): NotificationItem {
    const notifications = this.getNotifications();
    const newN: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    notifications.unshift(newN);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    this.notify();
    return newN;
  }

  public markNotificationAsRead(id: string) {
    const notifications = this.getNotifications();
    const n = notifications.find((item) => item.id === id);
    if (n) {
      n.read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      this.notify();
    }
  }

  public markAllNotificationsAsRead(userId?: string) {
    const notifications = this.getNotifications();
    notifications.forEach((n) => {
      if (!userId || n.recipientId === userId || n.recipientId === 'all' || (userId === 'admin' && n.recipientId === 'admin')) {
        n.read = true;
      }
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    this.notify();
  }

  // --- AUDIT LOGS ---
  public getAuditLogs(): AuditLog[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return raw ? JSON.parse(raw) : [];
  }

  public addAuditLog(
    action: string,
    entityType: AuditLog['entityType'],
    entityId: string,
    changeSummary: string,
    actorName = 'Dr. Arvind Sharma',
    actorRole: User['role'] = 'admin'
  ) {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      actorId: actorRole === 'admin' ? ADMIN_USER.id : 'student',
      actorName,
      actorRole,
      action,
      entityType,
      entityId,
      changeSummary,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog);
    // keep max 500 logs
    if (logs.length > 500) logs.pop();
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  }
}

export const storage = new StorageService();
