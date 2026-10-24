import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: 'admin' | 'student';
  name: string;
  studentId?: string;
  avatarUrl?: string;
  accountStatus: 'active' | 'deactivated';
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'student'],
      default: 'student',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    studentId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    avatarUrl: {
      type: String,
    },
    accountStatus: {
      type: String,
      enum: ['active', 'deactivated'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash);
};

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
