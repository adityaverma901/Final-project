// app/api/signup/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import prisma from '@/lib/db';
import prisma from '@/app/lib/db';
import bcrypt from 'bcrypt';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Input validation (kept the same as before)
    // ...

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {

        name,
        email,
        passwordHash: hashedPassword,
        role: 'USER',
      },
    });

    // Remove password from the response
    const { passwordHash: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { 
        message: 'User created successfully', 
        user: { 
          id: userWithoutPassword.id,
          name: userWithoutPassword.name,
          email: userWithoutPassword.email
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `An error occurred during signup: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred during signup' },
      { status: 500 }
    );
  }
}