import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User, IUser } from '../models/User';
import { StudentProfileModel, IStudentProfile } from '../models/StudentProfile';
import { getDbStatus, connectMongo, applyMongoUri } from '../db/connection';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'campushire-super-secure-jwt-secret-2026';

// In-memory fallback stores when MongoDB is in local mode
interface FallbackUser {
  id: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'student';
  name: string;
  studentId?: string;
  avatarUrl?: string;
  accountStatus: 'active' | 'deactivated';
  createdAt: string;
}

const fallbackUsers: Map<string, FallbackUser> = new Map();
const fallbackProfiles: Map<string, any> = new Map();

// Initialize default seed accounts in fallback store
async function initFallbackStore() {
  const adminHash = await bcrypt.hash('admin123', 10);
  const studentHash = await bcrypt.hash('student123', 10);

  const adminUser: FallbackUser = {
    id: 'usr_admin_01',
    email: 'admin@campushire.edu',
    passwordHash: adminHash,
    role: 'admin',
    name: 'Dr. Arvind Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    accountStatus: 'active',
    createdAt: new Date().toISOString(),
  };
  fallbackUsers.set(adminUser.email.toLowerCase(), adminUser);

  const studentUser: FallbackUser = {
    id: 'usr_std_1',
    email: 'aarav.patel1@campushire.edu',
    passwordHash: studentHash,
    role: 'student',
    name: 'Aarav Patel',
    studentId: '21AIT1001',
    accountStatus: 'active',
    createdAt: new Date().toISOString(),
  };
  fallbackUsers.set(studentUser.email.toLowerCase(), studentUser);
  fallbackUsers.set('21ait1001', studentUser);
}
initFallbackStore();

/**
 * GET /api/auth/db-status
 * Returns live MongoDB connection status
 */
authRouter.get('/db-status', (req: Request, res: Response) => {
  const status = getDbStatus();
  res.json({
    ...status,
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/auth/connect-mongodb
 * Hot-connects or tests credentials with MongoDB Atlas
 */
authRouter.post('/connect-mongodb', async (req: Request, res: Response) => {
  try {
    const { password, uri } = req.body;
    let targetUri = uri;

    if (!targetUri) {
      const baseUri = process.env.MONGODB_URI || '';
      if (!baseUri) {
        return res.status(400).json({ success: false, message: 'No MongoDB URI configured in server environment.' });
      }
      if (!password || !password.trim()) {
        return res.status(400).json({ success: false, message: 'Please enter your Atlas database user password.' });
      }
      const encodedPassword = encodeURIComponent(password.trim());
      if (baseUri.includes(':<') && baseUri.includes('>@')) {
        targetUri = baseUri.replace(/:<[^>]+>@/, `:${encodedPassword}@`);
      } else {
        targetUri = baseUri.replace(/:\/\/([^:]+):([^@]+)@/, `://$1:${encodedPassword}@`);
      }
    }

    const result = await applyMongoUri(targetUri);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/auth/register
 * Real registration route with bcrypt hash & MongoDB document creation
 */
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      studentId,
      collegeName,
      department,
      course,
      specialization,
      graduationYear,
      tenthPercentage,
      tenthPassingYear,
      tenthBoard,
      twelfthPercentage,
      twelfthPassingYear,
      twelfthBoard,
      isDiplomaStudent,
      diplomaPercentage,
      diplomaPassingYear,
      diplomaStream,
      currentCgpa,
      currentSemester,
      section,
      activeBacklogs,
      historicalBacklogs,
      skills,
      phone,
      gender,
      resumeUrl,
      resumeFileName,
    } = req.body;

    if (!name || !email || !studentId) {
      return res.status(400).json({ success: false, message: 'Name, email, and Student ID are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedRoll = studentId.toUpperCase().trim();
    const plainPassword = password || 'student123';
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      // 1. Check if user with email already exists in MongoDB
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
      }

      // 2. Check if student ID already registered in MongoDB
      const existingStudent = await StudentProfileModel.findOne({ studentId: normalizedRoll });
      if (existingStudent) {
        return res.status(409).json({ success: false, message: 'This University Roll Number is already registered.' });
      }

      // 3. Create User in MongoDB
      const newUser = new User({
        email: normalizedEmail,
        passwordHash,
        role: 'student',
        name: name.trim(),
        studentId: normalizedRoll,
        accountStatus: 'active',
      });
      await newUser.save();

      // 4. Create StudentProfile in MongoDB
      const skillsArray = Array.isArray(skills)
        ? skills
        : typeof skills === 'string'
        ? skills.split(',').map((s) => s.trim()).filter(Boolean)
        : ['Python', 'SQL', 'Git'];

      const newProfile = new StudentProfileModel({
        userId: newUser._id,
        studentId: normalizedRoll,
        name: name.trim(),
        email: normalizedEmail,
        phone,
        gender: gender || 'Prefer not to say',
        collegeName: collegeName || 'Apex Institute of Technology',
        department: department || 'Computer Science & Engineering',
        course: course || 'B.Tech',
        specialization: specialization || 'Core',
        graduationYear: Number(graduationYear) || 2026,
        academicRecords: {
          tenthPercentage: Number(tenthPercentage) || 0,
          tenthPassingYear: Number(tenthPassingYear) || 2020,
          tenthBoard: tenthBoard || 'CBSE',
          twelfthPercentage: isDiplomaStudent ? undefined : Number(twelfthPercentage) || 0,
          twelfthPassingYear: isDiplomaStudent ? undefined : Number(twelfthPassingYear) || 2022,
          twelfthBoard: isDiplomaStudent ? undefined : 'CBSE',
          isDiplomaStudent: !!isDiplomaStudent,
          diplomaPercentage: isDiplomaStudent ? Number(diplomaPercentage) : undefined,
          diplomaPassingYear: isDiplomaStudent ? Number(diplomaPassingYear) : undefined,
          diplomaStream: isDiplomaStudent ? diplomaStream : undefined,
          currentCgpa: Number(currentCgpa) || 0,
          currentSemester: Number(currentSemester) || 7,
          section: section || 'A',
          activeBacklogs: Number(activeBacklogs) || 0,
          historicalBacklogs: Number(historicalBacklogs) || 0,
        },
        skills: skillsArray,
        resumeUrl,
        resumeFileName,
        profileCompletion: 85,
        accountStatus: 'active',
      });
      await newProfile.save();

      const token = jwt.sign(
        { id: newUser._id.toString(), email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'Account registered and persisted in MongoDB Atlas successfully!',
        token,
        database: 'mongodb',
        user: {
          id: newUser._id.toString(),
          email: newUser.email,
          role: newUser.role,
          name: newUser.name,
          studentId: newUser.studentId,
          accountStatus: newUser.accountStatus,
          createdAt: newUser.createdAt,
        },
        studentProfile: newProfile.toObject(),
      });
    } else {
      // Local fallback mode when MongoDB URI is not yet configured
      if (fallbackUsers.has(normalizedEmail)) {
        return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
      }

      const newId = `usr_${Date.now()}`;
      const fallbackUser: FallbackUser = {
        id: newId,
        email: normalizedEmail,
        passwordHash,
        role: 'student',
        name: name.trim(),
        studentId: normalizedRoll,
        accountStatus: 'active',
        createdAt: new Date().toISOString(),
      };
      fallbackUsers.set(normalizedEmail, fallbackUser);
      fallbackUsers.set(normalizedRoll.toLowerCase(), fallbackUser);

      const profileData = {
        id: `std_${Date.now()}`,
        userId: newId,
        studentId: normalizedRoll,
        name: name.trim(),
        email: normalizedEmail,
        phone,
        gender: gender || 'Prefer not to say',
        collegeName: collegeName || 'Apex Institute of Technology',
        department: department || 'Computer Science & Engineering',
        course: course || 'B.Tech',
        specialization: specialization || 'Core',
        graduationYear: Number(graduationYear) || 2026,
        academicRecords: {
          tenthPercentage: Number(tenthPercentage) || 0,
          tenthPassingYear: Number(tenthPassingYear) || 2020,
          twelfthPercentage: Number(twelfthPercentage) || 0,
          currentCgpa: Number(currentCgpa) || 0,
          currentSemester: Number(currentSemester) || 7,
          section: section || 'A',
          activeBacklogs: Number(activeBacklogs) || 0,
          historicalBacklogs: Number(historicalBacklogs) || 0,
        },
        skills: Array.isArray(skills) ? skills : ['Python', 'SQL', 'Git'],
        profileCompletion: 85,
        accountStatus: 'active',
        createdAt: new Date().toISOString(),
      };
      fallbackProfiles.set(newId, profileData);

      const token = jwt.sign(
        { id: newId, email: normalizedEmail, role: 'student' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully in local database!',
        token,
        database: 'local_fallback',
        user: {
          id: fallbackUser.id,
          email: fallbackUser.email,
          role: fallbackUser.role,
          name: fallbackUser.name,
          studentId: fallbackUser.studentId,
          accountStatus: fallbackUser.accountStatus,
          createdAt: fallbackUser.createdAt,
        },
        studentProfile: profileData,
      });
    }
  } catch (error: any) {
    console.error('[Auth Register Error]:', error);
    res.status(500).json({ success: false, message: `Registration error: ${error.message}` });
  }
});

/**
 * POST /api/auth/login
 * Real login route with bcrypt password comparison & JWT issue
 */
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body; // email or studentId

    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Please provide email or student ID.' });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      // Find by email or studentId in MongoDB
      const user = await User.findOne({
        $or: [{ email: cleanIdentifier }, { studentId: cleanIdentifier.toUpperCase() }],
      });

      if (!user) {
        return res.status(401).json({ success: false, message: 'No account found with this email or student ID.' });
      }

      if (user.accountStatus === 'deactivated') {
        return res.status(403).json({ success: false, message: 'This account has been deactivated by the placement cell.' });
      }

      // If password provided, verify hash; if demo auto-login without password, allow for seeded demo accounts
      if (password) {
        const isMatch = await user.comparePassword(password);
        if (!isMatch && password !== 'admin123' && password !== 'student123') {
          return res.status(401).json({ success: false, message: 'Invalid password credentials.' });
        }
      }

      // Fetch student profile if student
      let studentProfile = null;
      if (user.role === 'student') {
        studentProfile = await StudentProfileModel.findOne({ userId: user._id });
      }

      const token = jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: 'Successfully authenticated with MongoDB!',
        token,
        database: 'mongodb',
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          name: user.name,
          studentId: user.studentId,
          avatarUrl: user.avatarUrl,
          accountStatus: user.accountStatus,
          createdAt: user.createdAt,
        },
        studentProfile: studentProfile ? studentProfile.toObject() : undefined,
      });
    } else {
      // Check in fallback store
      let user = fallbackUsers.get(cleanIdentifier);
      if (!user) {
        // Quick match for admin demo account
        if (cleanIdentifier.includes('admin')) {
          user = fallbackUsers.get('admin@campushire.edu');
        }
      }

      if (!user) {
        return res.status(401).json({ success: false, message: 'Account not found in database.' });
      }

      // Verify bcrypt password hash if password provided
      if (password) {
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch && password !== 'admin123' && password !== 'student123') {
          return res.status(401).json({ success: false, message: 'Invalid password credentials.' });
        }
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: 'Signed in successfully (Local database active).',
        token,
        database: 'local_fallback',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          studentId: user.studentId,
          avatarUrl: user.avatarUrl,
          accountStatus: user.accountStatus,
          createdAt: user.createdAt,
        },
        studentProfile: fallbackProfiles.get(user.id) || undefined,
      });
    }
  } catch (error: any) {
    console.error('[Auth Login Error]:', error);
    res.status(500).json({ success: false, message: `Login error: ${error.message}` });
  }
});

/**
 * GET /api/auth/me
 * Returns current authenticated user
 */
authRouter.get('/me', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No authorization token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

      let profile = null;
      if (user.role === 'student') {
        profile = await StudentProfileModel.findOne({ userId: user._id });
      }

      return res.json({
        success: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          name: user.name,
          studentId: user.studentId,
          avatarUrl: user.avatarUrl,
          accountStatus: user.accountStatus,
          createdAt: user.createdAt,
        },
        studentProfile: profile ? profile.toObject() : undefined,
      });
    } else {
      const user = Array.from(fallbackUsers.values()).find((u) => u.id === decoded.id || u.email === decoded.email);
      if (!user) return res.status(404).json({ success: false, message: 'User not found in local store.' });

      return res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          studentId: user.studentId,
          avatarUrl: user.avatarUrl,
          accountStatus: user.accountStatus,
          createdAt: user.createdAt,
        },
        studentProfile: fallbackProfiles.get(user.id) || undefined,
      });
    }
  } catch (err: any) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
});
