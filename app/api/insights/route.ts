import { NextRequest, NextResponse } from 'next/server';
import { getUserWithFinancialData } from '@/backend/lib/database';
import { calculateDashboardMetrics } from '@/backend/lib/calculations';
import { AIInsight, DashboardMetrics } from '@/backend/types';

/**
 * Generate AI insights based on user financial data
 */
function generateInsights(metrics: DashboardMetrics): AIInsight[] {
  const insights: AIInsight[] = [];
  
  // Stress score insights
  if (metrics.stressScore >= 70) {
    insights.push({
      status: 'critical',
      message: 'Your financial stress level is critically high',
      suggestion: 'Consider negotiating a salary increase, reducing expenses, or seeking financial counseling.',
    });
  } else if (metrics.stressScore >= 50) {
    insights.push({
      status: 'warning',
      message: 'Your financial stress level is elevated',
      suggestion: 'Focus on building an emergency fund or increasing your savings rate.',
    });
  } else if (metrics.stressScore < 30) {
    insights.push({
      status: 'stable',
      message: 'Your financial health is strong',
      suggestion: 'You have room to take calculated risks or invest in your future.',
    });
  }
  
  // Savings rate insights
  if (metrics.savingsRate < 10) {
    insights.push({
      status: 'warning',
      message: 'Your savings rate is below 10%',
      suggestion: 'Try to reduce discretionary spending or increase income to improve your savings rate.',
    });
  } else if (metrics.savingsRate >= 30) {
    insights.push({
      status: 'stable',
      message: 'Excellent savings rate! You are saving 30% or more',
      suggestion: 'Consider diversifying your savings into investments for long-term wealth building.',
    });
  }
  
  // Monthly leftover insights
  if (metrics.monthlyLeftover < 0) {
    insights.push({
      status: 'critical',
      message: 'You are spending more than you earn',
      suggestion: 'Create a budget immediately and identify areas to cut expenses or increase income.',
    });
  } else if (metrics.monthlyLeftover < 5000) {
    insights.push({
      status: 'warning',
      message: 'Your monthly leftover is tight',
      suggestion: 'Build an emergency fund with 3-6 months of expenses before making major decisions.',
    });
  }
  
  // Freedom years insights
  if (metrics.freedomYears < 10 && metrics.freedomYears !== 999) {
    insights.push({
      status: 'stable',
      message: `You could achieve financial independence in about ${metrics.freedomYears} years`,
      suggestion: 'Keep up your current savings rate and maintain discipline to reach this goal.',
    });
  } else if (metrics.freedomYears >= 50) {
    insights.push({
      status: 'warning',
      message: `At your current pace, financial independence is ${metrics.freedomYears} years away`,
      suggestion: 'Consider increasing income or decreasing expenses to accelerate your timeline.',
    });
  }
  
  return insights;
}

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
    
    // Get user data
    const result = getUserWithFinancialData(userId);
    
    if (!result || !result.financialData) {
      return NextResponse.json(
        {
          success: false,
          message: 'User financial data not found',
        },
        { status: 404 }
      );
    }
    
    // Calculate metrics
    const metrics = calculateDashboardMetrics(result.financialData);
    
    // Generate insights
    const insights = generateInsights(metrics);
    
    return NextResponse.json(
      {
        success: true,
        data: {
          insights: insights,
          metrics: metrics,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Insights error:', error);
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
