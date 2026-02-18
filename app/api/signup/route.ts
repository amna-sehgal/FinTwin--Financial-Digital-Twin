import { NextRequest, NextResponse } from 'next/server';
import { createUserAccount, getUserByEmail } from '@/backend/lib/database';
import { validateSignupData } from '@/backend/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, confirmPassword } = body;

    // Validate input
    const validationError = validateSignupData(name, email, password, confirmPassword);
    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email already registered. Please login instead.',
        },
        { status: 409 }
      );
    }

    // Create new account
    const user = createUserAccount(email, password, name);

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully. Please complete your profile.',
        userId: user.id,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Signup failed',
      },
      { status: 500 }
    );
  }
}
