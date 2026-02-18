import { UserFinancialData, SimulationRequest } from '../types/index';

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate onboarding form data
 */
export function validateOnboardingData(data: any): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Monthly salary validation
  if (!data.monthlySalary || typeof data.monthlySalary !== 'number') {
    errors.push({
      field: 'monthlySalary',
      message: 'Monthly salary is required and must be a number',
    });
  } else if (data.monthlySalary < 0) {
    errors.push({
      field: 'monthlySalary',
      message: 'Monthly salary cannot be negative',
    });
  }
  
  // Rent validation (optional - can be 0 if they have their own house)
  if (data.rent !== undefined && data.rent !== null && typeof data.rent !== 'number') {
    errors.push({
      field: 'rent',
      message: 'Rent must be a number',
    });
  } else if (data.rent && data.rent < 0) {
    errors.push({
      field: 'rent',
      message: 'Rent cannot be negative',
    });
  }
  
  // Monthly expenses validation
  if (!data.monthlyExpenses || typeof data.monthlyExpenses !== 'number') {
    errors.push({
      field: 'monthlyExpenses',
      message: 'Monthly expenses is required and must be a number',
    });
  } else if (data.monthlyExpenses < 0) {
    errors.push({
      field: 'monthlyExpenses',
      message: 'Monthly expenses cannot be negative',
    });
  }
  
  // Current savings validation
  if (data.currentSavings === undefined || typeof data.currentSavings !== 'number') {
    errors.push({
      field: 'currentSavings',
      message: 'Current savings is required and must be a number',
    });
  } else if (data.currentSavings < 0) {
    errors.push({
      field: 'currentSavings',
      message: 'Current savings cannot be negative',
    });
  }
  
  // Debts validation
  if (data.debts === undefined || typeof data.debts !== 'number') {
    errors.push({
      field: 'debts',
      message: 'Debts is required and must be a number',
    });
  } else if (data.debts < 0) {
    errors.push({
      field: 'debts',
      message: 'Debts cannot be negative',
    });
  }
  
  // Check if expenses exceed income
  const monthlyLeftover = 
    data.monthlySalary - data.rent - data.monthlyExpenses - data.debts;
  if (monthlyLeftover < -data.monthlySalary * 0.5) {
    errors.push({
      field: 'overall',
      message: 'Your expenses exceed income by more than 50%. Please review your figures.',
    });
  }
  
  return errors;
}

/**
 * Validate simulation request
 */
export function validateSimulationRequest(request: any): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Decision type validation
  const validDecisions = [
    'BUY_CAR',
    'MOVE_CITY',
    'CHANGE_JOB',
    'BUY_GADGET',
    'INCREASE_RENT',
  ];
  
  if (!request.decisionType || !validDecisions.includes(request.decisionType)) {
    errors.push({
      field: 'decisionType',
      message: 'Invalid decision type',
    });
  }
  
  // Validate required fields based on decision type
  switch (request.decisionType) {
    case 'BUY_CAR':
      if (request.cost === undefined || typeof request.cost !== 'number' || request.cost < 0) {
        errors.push({
          field: 'cost',
          message: 'Cost must be a positive number',
        });
      }
      if (request.emi !== undefined && (typeof request.emi !== 'number' || request.emi < 0)) {
        errors.push({
          field: 'emi',
          message: 'EMI must be a positive number',
        });
      }
      break;
      
    case 'BUY_GADGET':
      if (request.cost === undefined || typeof request.cost !== 'number' || request.cost < 0) {
        errors.push({
          field: 'cost',
          message: 'Cost must be a positive number',
        });
      }
      break;
      
    case 'MOVE_CITY':
      if (request.rentChange === undefined || typeof request.rentChange !== 'number') {
        errors.push({
          field: 'rentChange',
          message: 'Rent change must be a number',
        });
      }
      break;
      
    case 'CHANGE_JOB':
      if (request.salaryChange === undefined || typeof request.salaryChange !== 'number') {
        errors.push({
          field: 'salaryChange',
          message: 'Salary change must be a number',
        });
      }
      break;
      
    case 'INCREASE_RENT':
      if (request.rentChange === undefined || typeof request.rentChange !== 'number') {
        errors.push({
          field: 'rentChange',
          message: 'Rent change must be a number',
        });
      }
      break;
  }
  
  return errors;
}
