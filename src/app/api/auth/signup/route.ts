// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const { firstName, lastName, email, password } = await request.json();

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email,
        password_hash,
      }
    });

    const user = newUser;

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h'
    });

    return NextResponse.json({ token, user: { id: user.id, firstName: user.first_name, email: user.email, role: user.role } }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    if(error.code === 'P2002') { // unique_violation
        return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
