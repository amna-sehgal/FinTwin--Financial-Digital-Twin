import { NextRequest, NextResponse } from 'next/server';
import { getUserWithFinancialData } from '@/backend/lib/database';
import { calculateDashboardMetrics } from '@/backend/lib/calculations';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'userId parameter is required',
        },
        { status: 400 }
      );
    }
    
    // Get user with financial data
    const userWithData = getUserWithFinancialData(userId);
    
    if (!userWithData) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found or onboarding not completed',
        },
        { status: 404 }
      );
    }

    const { account, financialData } = userWithData;

    // Calculate metrics
    const metrics = calculateDashboardMetrics(financialData);
    
    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: account.id,
            email: account.email,
            name: account.name,
            city: financialData.city,
          },
          userData: financialData,
          metrics: metrics,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
