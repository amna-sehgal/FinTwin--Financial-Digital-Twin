// User financial data
export interface UserFinancialData {
  id: string;
  monthlySalary: number;
  rent: number;
  monthlyExpenses: number;
  currentSavings: number;
  debts: number; // EMI or lump sum debt
  city?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard metrics
export interface DashboardMetrics {
  monthlyLeftover: number;
  savingsRate: number; // percentage
  stressScore: number; // 0-100
  freedomYears: number; // years until financial independence
  projectedBalance: MonthlyProjection[];
}

// Monthly projection for graph
export interface MonthlyProjection {
  month: number;
  balance: number;
  date: string;
}

// Simulation decision types
export type DecisionType = 
  | 'BUY_CAR' 
  | 'MOVE_CITY' 
  | 'CHANGE_JOB' 
  | 'BUY_GADGET' 
  | 'INCREASE_RENT';

// Simulation request
export interface SimulationRequest {
  userId: string;
  decisionType: DecisionType;
  cost?: number; // upfront cost
  emi?: number; // monthly EMI
  duration?: number; // duration in months for EMI
  salaryChange?: number; // change in monthly salary
  rentChange?: number; // change in monthly rent
}

// Simulation result
export interface SimulationResult {
  originalMetrics: DashboardMetrics;
  newMetrics: DashboardMetrics;
  decision: DecisionType;
  impact: {
    monthlyLeftoverChange: number;
    savingsRateChange: number;
    stressScoreChange: number;
    freedomYearsChange: number;
  };
  recommendation: string;
}

// AI Insights
export interface AIInsight {
  status: string; // 'stable', 'warning', 'critical'
  message: string;
  suggestion: string;
}
