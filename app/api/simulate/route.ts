import { NextRequest, NextResponse } from 'next/server';
import { getUserWithFinancialData } from '@/backend/lib/database';
import { validateSimulationRequest } from '@/backend/lib/validation';
import { simulateDecision } from '@/backend/lib/calculations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { userId, ...decisionData } = body;
    
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'userId is required',
        },
        { status: 400 }
      );
    }
    
    // Validate simulation request
    const errors = validateSimulationRequest(decisionData);
    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          errors,
          message: 'Validation failed',
        },
        { status: 400 }
      );
    }
    
    // Get user data
    const result = getUserWithFinancialData(userId);
    
    if (!result || !result.account) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    const userData = result.financialData;

    // Run simulation
    const simulationResult = simulateDecision(userData, decisionData);
    
    return NextResponse.json(
      {
        success: true,
        data: simulationResult,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Simulation error:', error);
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
