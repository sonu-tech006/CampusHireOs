import mongoose, { Document, Schema } from 'mongoose';

export interface IStudentProfile extends Document {
  userId: mongoose.Types.ObjectId;
  studentId: string;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  collegeName: string;
  department: string;
  course: string;
  specialization: string;
  graduationYear: number;
  academicRecords: {
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
    currentCgpa: number;
    currentSemester: number;
    section: string;
    activeBacklogs: number;
    historicalBacklogs: number;
  };
  profilePhoto?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  skills: string[];
  projects: {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    link?: string;
  }[];
  experience: {
    id: string;
    role: string;
    company: string;
    duration: string;
    description: string;
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    issueYear: number;
    credentialUrl?: string;
  }[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  profileCompletion: number;
  accountStatus: 'active' | 'deactivated';
  createdAt: Date;
  updatedAt: Date;
}

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    gender: { type: String, default: 'Prefer not to say' },
    collegeName: { type: String, default: 'Apex Institute of Technology' },
    department: { type: String, required: true, index: true },
    course: { type: String, default: 'B.Tech' },
    specialization: { type: String, default: 'Core' },
    graduationYear: { type: Number, default: 2026, index: true },
    academicRecords: {
      tenthPercentage: { type: Number, default: 0 },
      tenthPassingYear: { type: Number, default: 2020 },
      tenthBoard: { type: String, default: 'CBSE' },
      twelfthPercentage: { type: Number },
      twelfthPassingYear: { type: Number },
      twelfthBoard: { type: String },
      isDiplomaStudent: { type: Boolean, default: false },
      diplomaPercentage: { type: Number },
      diplomaPassingYear: { type: Number },
      diplomaStream: { type: String },
      currentCgpa: { type: Number, default: 0, index: true },
      currentSemester: { type: Number, default: 7 },
      section: { type: String, default: 'A' },
      activeBacklogs: { type: Number, default: 0, index: true },
      historicalBacklogs: { type: Number, default: 0 },
    },
    profilePhoto: { type: String },
    resumeUrl: { type: String },
    resumeFileName: { type: String },
    skills: [{ type: String }],
    projects: [
      {
        id: String,
        title: String,
        description: String,
        technologies: [String],
        link: String,
      },
    ],
    experience: [
      {
        id: String,
        role: String,
        company: String,
        duration: String,
        description: String,
      },
    ],
    certifications: [
      {
        id: String,
        name: String,
        issuer: String,
        issueYear: Number,
        credentialUrl: String,
      },
    ],
    githubUrl: { type: String },
    linkedinUrl: { type: String },
    portfolioUrl: { type: String },
    profileCompletion: { type: Number, default: 80 },
    accountStatus: { type: String, enum: ['active', 'deactivated'], default: 'active' },
  },
  {
    timestamps: true,
  }
);

export const StudentProfileModel =
  mongoose.models.StudentProfile ||
  mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);
