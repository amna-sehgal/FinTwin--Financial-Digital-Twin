import {
  UserFinancialData,
  DashboardMetrics,
  MonthlyProjection,
  SimulationResult,
  SimulationRequest,
  DecisionType,
} from '../types/index';

/**
 * Calculate monthly leftover after expenses
 */
export function calculateMonthlyLeftover(
  salary: number,
  rent: number,
  expenses: number,
  debts: number
): number {
  return salary - rent - expenses - debts;
}

/**
 * Calculate savings rate as percentage
 */
export function calculateSavingsRate(
  salary: number,
  leftover: number
): number {
  if (salary === 0) return 0;
  return (leftover / salary) * 100;
}

/**
 * Calculate stress score (0-100)
 * Based on debt-to-income ratio and savings rate
 */
export function calculateStressScore(
  salary: number,
  leftover: number,
  debts: number
): number {
  // Debt to income ratio
  const debtToIncomeRatio = salary > 0 ? debts / salary : 1;
  
  // Negative or low leftover = high stress
  const leftoverRatio = leftover > 0 ? leftover / salary : 0;
  
  // Base stress from debt
  let stress = Math.min(debtToIncomeRatio * 50, 50);
  
  // Additional stress if leftover is negative or too low
  if (leftover < 0) {
    stress += 50;
  } else if (leftoverRatio < 0.1) {
    stress += 30;
  }
  
  return Math.min(Math.max(stress, 0), 100);
}

/**
 * Calculate freedom years (years until financial independence)
 * Uses 25x rule: FI when savings = 25 * annual expenses
 */
export function calculateFreedomYears(
  currentSavings: number,
  monthlyLeftover: number,
  monthlyExpenses: number
): number {
  // Annual leftover that can be invested
  const annualLeftover = monthlyLeftover * 12;
  
  // Target = 25 * annual expenses (4% rule)
  const annualExpenses = monthlyExpenses * 12;
  const targetSavings = annualExpenses * 25;
  
  // If already at target
  if (currentSavings >= targetSavings) return 0;
  
  // If negative leftover, can't reach FI
  if (monthlyLeftover <= 0) return Infinity;
  
  // Years needed = (target - current) / annual_leftover
  const yearsNeeded = (targetSavings - currentSavings) / annualLeftover;
  
  return Math.max(yearsNeeded, 0);
}

/**
 * Generate 12-month balance projection
 */
export function projectBalance(
  initialBalance: number,
  monthlyLeftover: number,
  months: number = 12
): MonthlyProjection[] {
  const projections: MonthlyProjection[] = [];
  let balance = initialBalance;
  const today = new Date();
  
  for (let i = 1; i <= months; i++) {
    balance += monthlyLeftover;
    
    const projectionDate = new Date(today);
    projectionDate.setMonth(projectionDate.getMonth() + i);
    
    projections.push({
      month: i,
      balance: Math.round(balance * 100) / 100,
      date: projectionDate.toISOString().split('T')[0],
    });
  }
  
  return projections;
}

/**
 * Calculate dashboard metrics from user data
 */
export function calculateDashboardMetrics(
  userData: UserFinancialData
): DashboardMetrics {
  const monthlyLeftover = calculateMonthlyLeftover(
    userData.monthlySalary,
    userData.rent,
    userData.monthlyExpenses,
    userData.debts
  );
  
  const savingsRate = calculateSavingsRate(
    userData.monthlySalary,
    monthlyLeftover
  );
  
  const stressScore = calculateStressScore(
    userData.monthlySalary,
    monthlyLeftover,
    userData.debts
  );
  
  const freedomYears = calculateFreedomYears(
    userData.currentSavings,
    monthlyLeftover,
    userData.monthlyExpenses
  );
  
  const projectedBalance = projectBalance(
    userData.currentSavings,
    monthlyLeftover
  );
  
  return {
    monthlyLeftover,
    savingsRate,
    stressScore,
    freedomYears: freedomYears === Infinity ? 999 : Math.round(freedomYears * 10) / 10,
    projectedBalance,
  };
}

/**
 * Apply decision impact to user data
 */
export function applyDecisionImpact(
  userData: UserFinancialData,
  request: SimulationRequest
): UserFinancialData {
  const newData = { ...userData };
  
  switch (request.decisionType) {
    case 'BUY_CAR':
      // Deduct upfront cost, add monthly EMI
      if (request.cost) {
        newData.currentSavings -= request.cost;
      }
      if (request.emi) {
        newData.debts += request.emi;
      }
      break;
      
    case 'BUY_GADGET':
      // One-time cost
      if (request.cost) {
        newData.currentSavings -= request.cost;
      }
      break;
      
    case 'MOVE_CITY':
      // Adjust rent
      if (request.rentChange) {
        newData.rent += request.rentChange;
      }
      // Moving cost (reduce savings)
      if (request.cost) {
        newData.currentSavings -= request.cost;
      }
      break;
      
    case 'CHANGE_JOB':
      // Change salary
      if (request.salaryChange !== undefined) {
        newData.monthlySalary += request.salaryChange;
      }
      break;
      
    case 'INCREASE_RENT':
      // Increase rent
      if (request.rentChange) {
        newData.rent += request.rentChange;
      }
      break;
  }
  
  // Ensure no negative savings (cap at 0)
  newData.currentSavings = Math.max(newData.currentSavings, 0);
  
  return newData;
}

/**
 * Generate simulation result comparing before and after
 */
export function simulateDecision(
  userData: UserFinancialData,
  request: SimulationRequest
): SimulationResult {
  // Calculate original metrics
  const originalMetrics = calculateDashboardMetrics(userData);
  
  // Apply decision
  const newUserData = applyDecisionImpact(userData, request);
  
  // Calculate new metrics
  const newMetrics = calculateDashboardMetrics(newUserData);
  
  // Calculate impact
  const impact = {
    monthlyLeftoverChange: newMetrics.monthlyLeftover - originalMetrics.monthlyLeftover,
    savingsRateChange: newMetrics.savingsRate - originalMetrics.savingsRate,
    stressScoreChange: newMetrics.stressScore - originalMetrics.stressScore,
    freedomYearsChange: newMetrics.freedomYears - originalMetrics.freedomYears,
  };
  
  // Generate recommendation
  const recommendation = generateRecommendation(
    request.decisionType,
    impact,
    newMetrics.stressScore
  );
  
  return {
    originalMetrics,
    newMetrics,
    decision: request.decisionType,
    impact,
    recommendation,
  };
}

/**
 * Generate AI recommendation based on impact
 */
function generateRecommendation(
  decision: DecisionType,
  impact: SimulationResult['impact'],
  newStressScore: number
): string {
  const decisionNames: Record<DecisionType, string> = {
    BUY_CAR: 'Buying a car',
    BUY_GADGET: 'Buying a gadget',
    MOVE_CITY: 'Moving to a new city',
    CHANGE_JOB: 'Changing your job',
    INCREASE_RENT: 'Increasing rent',
  };
  
  const name = decisionNames[decision];
  
  // Check stress impact
  if (impact.stressScoreChange > 20) {
    return `${name} will significantly increase your financial stress (${newStressScore.toFixed(0)}/100). Consider waiting or finding alternatives.`;
  }
  
  if (impact.stressScoreChange > 10) {
    return `${name} will moderately impact your stress level. Make sure you have an emergency fund.`;
  }
  
  // Check savings impact
  if (impact.monthlyLeftoverChange < -5000) {
    return `${name} will severely reduce your monthly savings. This could delay financial independence by years.`;
  }
  
  if (impact.monthlyLeftoverChange < 0) {
    return `${name} will reduce your monthly savings, but your financial situation remains stable.`;
  }
  
  // Positive impact
  if (impact.monthlyLeftoverChange > 0) {
    return `${name} will actually improve your financial position! Your monthly leftover will increase.`;
  }
  
  return `${name} is financially neutral. You can proceed if it aligns with your goals.`;
}
