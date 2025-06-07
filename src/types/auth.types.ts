import { Role } from '@prisma/client';
import { Request } from 'express';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: Role;
  };
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: Role;
  };
} 