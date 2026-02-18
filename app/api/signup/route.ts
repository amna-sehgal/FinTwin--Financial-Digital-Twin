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

    const res = NextResponse.json(
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
    // Set auth cookie so user remains logged in
    res.cookies.set("auth", user.id, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });
    // Mark onboarding not completed yet
    res.cookies.set("onb", "0", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });
    return res;
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
