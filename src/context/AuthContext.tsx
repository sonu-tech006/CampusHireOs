import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, StudentProfile, Role } from '../types';
import { ADMIN_USER } from '../data/mockSeedData';
import { storage } from '../services/storage';

export interface DbStatus {
  status: 'connected' | 'connecting' | 'disconnected' | 'local_fallback';
  databaseName?: string;
  host?: string;
  isAtlas: boolean;
  message: string;
  hint?: string;
  detectedUser?: string;
  detectedCluster?: string;
  hasPasswordPlaceholder?: boolean;
}

interface AuthContextType {
  user: User | null;
  studentProfile: StudentProfile | null;
  role: Role | null;
  isAuthenticated: boolean;
  dbStatus: DbStatus;
  refreshDbStatus: () => Promise<void>;
  connectMongoWithPassword: (password: string) => Promise<{ success: boolean; message: string }>;
  loginAsAdmin: () => Promise<void>;
  loginAsStudent: (studentIdentifier?: string, password?: string) => Promise<boolean>;
  registerStudent: (formData: any) => Promise<{ success: boolean; message: string; database?: string }>;
  logout: () => void;
  updateProfile: (updated: StudentProfile) => void;
  demoStudents: StudentProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'campushire_auth_user_v1';
const AUTH_STUDENT_ID_KEY = 'campushire_auth_student_id_v1';
const AUTH_TOKEN_KEY = 'campushire_jwt_token_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [dbStatus, setDbStatus] = useState<DbStatus>({
    status: 'connecting',
    isAtlas: false,
    message: 'Checking MongoDB connection...',
  });

  const refreshDbStatus = async () => {
    try {
      const res = await fetch('/api/auth/db-status');
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch (e) {
      setDbStatus({
        status: 'local_fallback',
        isAtlas: false,
        message: 'Running in resilient local mode.',
      });
    }
  };

  const connectMongoWithPassword = async (password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setDbStatus((prev) => ({ ...prev, status: 'connecting', message: 'Connecting to MongoDB Atlas...' }));
      const res = await fetch('/api/auth/connect-mongodb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.status) {
        setDbStatus(data.status);
      } else {
        await refreshDbStatus();
      }
      return { success: data.success, message: data.message };
    } catch (e: any) {
      await refreshDbStatus();
      return { success: false, message: e.message || 'Failed to connect to MongoDB Atlas' };
    }
  };

  useEffect(() => {
    refreshDbStatus();
  }, []);

  // Load initial session
  useEffect(() => {
    const savedUserJson = localStorage.getItem(AUTH_USER_KEY);
    const savedStudentId = localStorage.getItem(AUTH_STUDENT_ID_KEY);

    if (savedUserJson) {
      try {
        const u: User = JSON.parse(savedUserJson);
        setUser(u);
        if (u.role === 'student' && savedStudentId) {
          const profile = storage.getStudentById(savedStudentId);
          if (profile) setStudentProfile(profile);
        }
      } catch (e) {
        console.error('Failed to parse auth user', e);
      }
    } else {
      // Default initial session: Dr. Arvind Sharma (Admin)
      setUser(ADMIN_USER);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(ADMIN_USER));
    }
  }, []);

  // Listen to storage changes to keep student profile synced
  useEffect(() => {
    const unsub = storage.subscribe(() => {
      if (studentProfile) {
        const fresh = storage.getStudentById(studentProfile.id);
        if (fresh) setStudentProfile(fresh);
      }
    });
    return unsub;
  }, [studentProfile]);

  const loginAsAdmin = async () => {
    try {
      // Try backend endpoint
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'admin@campushire.edu', password: 'admin123' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      }
    } catch (e) {
      // Ignore network errors in local dev
    }

    setUser(ADMIN_USER);
    setStudentProfile(null);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(ADMIN_USER));
    localStorage.removeItem(AUTH_STUDENT_ID_KEY);
  };

  const loginAsStudent = async (studentIdentifier?: string, password?: string): Promise<boolean> => {
    const cleanId = studentIdentifier || 'aarav.patel1@campushire.edu';

    try {
      // Authenticate with server MongoDB auth endpoint
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanId, password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token) localStorage.setItem(AUTH_TOKEN_KEY, data.token);

        const stdUser: User = {
          id: data.user.id,
          email: data.user.email,
          role: 'student',
          name: data.user.name,
          studentId: data.user.studentId,
          avatarUrl: data.user.avatarUrl,
          accountStatus: data.user.accountStatus,
          createdAt: data.user.createdAt,
        };

        setUser(stdUser);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(stdUser));

        // Find or build student profile
        let profile = data.studentProfile;
        if (!profile) {
          profile = storage.getStudentById(stdUser.id) || storage.getStudents().find(
            (s) => s.studentId === stdUser.studentId || s.email === stdUser.email
          );
        }

        if (profile) {
          setStudentProfile(profile);
          localStorage.setItem(AUTH_STUDENT_ID_KEY, profile.id);
        }
        return true;
      }
    } catch (err) {
      console.warn('Backend login endpoint unreachable, falling back to local store:', err);
    }

    // Local fallback
    const students = storage.getStudents();
    const student = students.find(
      (s) =>
        s.id === cleanId ||
        s.studentId.toLowerCase() === cleanId.toLowerCase() ||
        s.email.toLowerCase() === cleanId.toLowerCase()
    ) || students[0];

    if (!student) return false;

    const stdUser: User = {
      id: student.userId,
      email: student.email,
      role: 'student',
      name: student.name,
      studentId: student.studentId,
      avatarUrl: student.profilePhoto,
      accountStatus: student.accountStatus,
      createdAt: student.createdAt,
    };

    setUser(stdUser);
    setStudentProfile(student);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(stdUser));
    localStorage.setItem(AUTH_STUDENT_ID_KEY, student.id);
    return true;
  };

  const registerStudent = async (formData: any): Promise<{ success: boolean; message: string; database?: string }> => {
    try {
      // 1. Call Backend MongoDB Registration API
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.token) {
          localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        }

        const registeredUser: User = {
          id: data.user.id,
          email: data.user.email,
          role: 'student',
          name: data.user.name,
          studentId: data.user.studentId,
          accountStatus: 'active',
          createdAt: data.user.createdAt,
        };

        setUser(registeredUser);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(registeredUser));

        if (data.studentProfile) {
          const profileWithId = {
            ...data.studentProfile,
            id: data.studentProfile.id || data.studentProfile._id || `std_${Date.now()}`,
          };
          setStudentProfile(profileWithId);
          localStorage.setItem(AUTH_STUDENT_ID_KEY, profileWithId.id);
          storage.saveStudent(profileWithId);
        }

        storage.addAuditLog(
          'REGISTER_STUDENT',
          'Student',
          data.user.id,
          `Student ${data.user.name} registered and saved in database (${data.database || 'mongodb'}).`
        );

        refreshDbStatus();
        return {
          success: true,
          message: data.message || 'Registration completed successfully with MongoDB!',
          database: data.database,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Registration failed.',
        };
      }
    } catch (e: any) {
      console.warn('Backend register endpoint error, using local fallback:', e);

      // Local fallback in case server route is offline
      const existing = storage.getStudents();
      const emailExists = existing.some(
        (s) => s.email.toLowerCase() === (formData.email || '').toLowerCase().trim()
      );
      if (emailExists) {
        return { success: false, message: 'An account with this email address is already registered.' };
      }

      const rollExists = existing.some(
        (s) => s.studentId.toUpperCase() === (formData.studentId || '').toUpperCase().trim()
      );
      if (rollExists) {
        return { success: false, message: 'This University Roll Number is already registered.' };
      }

      const newId = `std_reg_${Date.now()}`;
      const newUserId = `usr_${newId}`;

      const newProfile: StudentProfile = {
        id: newId,
        userId: newUserId,
        studentId: formData.studentId.toUpperCase().trim(),
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone,
        gender: formData.gender,
        collegeName: formData.collegeName || 'Apex Institute of Technology',
        department: formData.department,
        course: formData.course || 'B.Tech',
        specialization: formData.specialization || 'Core',
        graduationYear: Number(formData.graduationYear) || 2026,
        academicRecords: {
          tenthPercentage: Number(formData.tenthPercentage) || 0,
          tenthPassingYear: Number(formData.tenthPassingYear) || 2020,
          tenthBoard: formData.tenthBoard || 'CBSE',
          twelfthPercentage: formData.isDiplomaStudent ? undefined : Number(formData.twelfthPercentage) || 0,
          twelfthPassingYear: formData.isDiplomaStudent ? undefined : Number(formData.twelfthPassingYear) || 2022,
          isDiplomaStudent: !!formData.isDiplomaStudent,
          diplomaPercentage: formData.isDiplomaStudent ? Number(formData.diplomaPercentage) : undefined,
          diplomaPassingYear: formData.isDiplomaStudent ? Number(formData.diplomaPassingYear) : undefined,
          currentCgpa: Number(formData.currentCgpa) || 0,
          currentSemester: Number(formData.currentSemester) || 7,
          section: formData.section || 'A',
          activeBacklogs: Number(formData.activeBacklogs) || 0,
          historicalBacklogs: Number(formData.historicalBacklogs) || 0,
        },
        skills: formData.skills || ['Python', 'Problem Solving'],
        projects: [],
        experience: [],
        certifications: [],
        profileCompletion: 85,
        accountStatus: 'active',
        createdAt: new Date().toISOString(),
      };

      storage.saveStudent(newProfile);

      const stdUser: User = {
        id: newUserId,
        email: newProfile.email,
        role: 'student',
        name: newProfile.name,
        accountStatus: 'active',
        createdAt: newProfile.createdAt,
      };

      setUser(stdUser);
      setStudentProfile(newProfile);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(stdUser));
      localStorage.setItem(AUTH_STUDENT_ID_KEY, newProfile.id);

      return { success: true, message: 'Registration completed successfully in local storage.' };
    }
  };

  const logout = () => {
    setUser(null);
    setStudentProfile(null);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_STUDENT_ID_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  };

  const updateProfile = (updated: StudentProfile) => {
    storage.saveStudent(updated);
    setStudentProfile(updated);
    if (user) {
      const freshUser = { ...user, name: updated.name, avatarUrl: updated.profilePhoto };
      setUser(freshUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(freshUser));
    }
  };

  const demoStudents = storage.getStudents().slice(0, 5);

  return (
    <AuthContext.Provider
      value={{
        user,
        studentProfile,
        role: user?.role || null,
        isAuthenticated: !!user,
        dbStatus,
        refreshDbStatus,
        connectMongoWithPassword,
        loginAsAdmin,
        loginAsStudent,
        registerStudent,
        logout,
        updateProfile,
        demoStudents,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
