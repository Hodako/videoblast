// src/lib/adminAuth.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';

interface UserJwtPayload extends jwt.JwtPayload {
  id: number;
  role: string;
}

export async function adminAuth(request: Request): Promise<NextResponse | null> {
  const token = request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as UserJwtPayload;
    
    if (decoded && decoded.role === 'admin') {
      return null; // Allowed
    } else {
      return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
  }
}

export async function checkAuth(request: Request): Promise<NextResponse | null> {
  const token = request.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET || 'secret');
    return null; // Token is valid
  } catch (error) {
    return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
  }
}

export async function getUserIdFromRequest(request: Request): Promise<number | null> {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as UserJwtPayload;
        return decoded.id;
    } catch {
        return null;
    }
}
