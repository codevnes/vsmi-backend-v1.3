import { Role } from '@prisma/client';

export interface IUser {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  password: string;
  role: Role;
  thumbnailId: number | null;
  verified: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreate {
  email: string;
  fullName: string;
  password: string;
  phone?: string | null;
  role?: Role;
}

export interface IUserUpdate {
  fullName?: string;
  phone?: string | null;
  password?: string;
  verified?: boolean;
  thumbnailId?: number | null;
  role?: Role;
}

export interface IUserPublic {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: Role;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
} 