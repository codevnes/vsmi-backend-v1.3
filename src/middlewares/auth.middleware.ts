import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config';
import { prisma } from '../app';
import { AUTH_MESSAGES } from '../utils';
import { Role } from '@prisma/client';
import { AuthRequest } from '../types';

interface JwtPayload {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  iat: number;
  exp: number;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
    }
  }
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: AUTH_MESSAGES.TOKEN_REQUIRED });
      return;
    }

    try {
      const decoded = jwt.verify(token, authConfig.jwtSecret) as JwtPayload;
      
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        res.status(401).json({ message: AUTH_MESSAGES.TOKEN_INVALID });
        return;
      }

      // Set user in request object
      req.user = {
        id: decoded.id,
        email: decoded.email,
        fullName: decoded.fullName,
        role: decoded.role
      };
      
      // Legacy support
      req.userId = decoded.id;
      req.userRole = decoded.role;
      
      next();
    } catch (jwtError) {
      res.status(401).json({ message: AUTH_MESSAGES.TOKEN_EXPIRED });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: AUTH_MESSAGES.AUTH_ERROR });
    return;
  }
};

export const checkRole = (roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: AUTH_MESSAGES.FORBIDDEN });
      return;
    }
    next();
  };
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: AUTH_MESSAGES.TOKEN_REQUIRED });
      return;
    }

    try {
      const decoded = jwt.verify(token, authConfig.jwtSecret) as JwtPayload;
      
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        res.status(401).json({ message: AUTH_MESSAGES.TOKEN_INVALID });
        return;
      }

      // Set user ID and role in request object
      req.userId = decoded.id;
      req.userRole = decoded.role;
      
      next();
    } catch (jwtError) {
      res.status(401).json({ message: AUTH_MESSAGES.TOKEN_EXPIRED });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: AUTH_MESSAGES.AUTH_ERROR });
    return;
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.userRole !== 'ADMIN') {
    res.status(403).json({ message: AUTH_MESSAGES.FORBIDDEN });
    return;
  }
  next();
};

export const isAuthorOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.userRole !== 'ADMIN' && req.userRole !== 'AUTHOR') {
    res.status(403).json({ message: AUTH_MESSAGES.FORBIDDEN });
    return;
  }
  next();
}; 