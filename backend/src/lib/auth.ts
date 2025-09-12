
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserJwtPayload extends jwt.JwtPayload {
  id: number;
  role: string;
}

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as UserJwtPayload;
    if (decoded && decoded.role === 'admin') {
      (req as any).user = decoded;
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as UserJwtPayload;
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export const getUserIdFromRequest = (req: Request): number | null => {
    const user = (req as any).user;
    return user ? user.id : null;
};
