import { NextRequest, NextResponse } from 'next/server';
import { saveUserFinancialData, getUserById } from '@/backend/lib/database';
import { validateOnboardingData } from '@/backend/lib/validation';
import { UserFinancialData } from '@/backend/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, monthlySalary, rent, monthlyExpenses, currentSavings, debts, city } = body;

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found. Please sign up first.' },
        { status: 404 }
      );
    }

    // Validate financial data
    const errors = validateOnboardingData({
      monthlySalary,
      rent,
      monthlyExpenses,
      currentSavings,
      debts,
    });

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors, message: 'Validation failed' },
        { status: 400 }
      );
    }

    // Create financial data
    const financialData: UserFinancialData = {
      id: userId,
      monthlySalary: parseFloat(monthlySalary),
      rent: rent ? parseFloat(rent) : 0,
      monthlyExpenses: parseFloat(monthlyExpenses),
      currentSavings: parseFloat(currentSavings),
      debts: parseFloat(debts),
      city: city || 'Not specified',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save financial data
    const updatedUser = saveUserFinancialData(userId, financialData);

    return NextResponse.json(
      {
        success: true,
        message: 'Financial profile created successfully',
        userId: updatedUser.id,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          hasCompletedOnboarding: updatedUser.hasCompletedOnboarding,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          hasCompletedOnboarding: user.hasCompletedOnboarding,
          financialData: user.financialData,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Onboarding GET error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
