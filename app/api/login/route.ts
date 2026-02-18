import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/backend/lib/database';
import { validateCredentials } from '@/backend/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!validateCredentials(email, password)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password format' },
        { status: 400 }
      );
    }

    // Attempt login
    const user = loginUser(email, password);

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email or password. Please check and try again, or create an account.',
        },
        { status: 401 }
      );
    }

    // Login successful - return user info
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        userId: user.id,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          hasCompletedOnboarding: user.hasCompletedOnboarding,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
