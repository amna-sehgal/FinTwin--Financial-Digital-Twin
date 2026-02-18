import { useState, useCallback } from 'react';
import { UserFinancialData, DashboardMetrics } from '@/backend/types';

/**
 * Hook for user login
 */
export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<{ userId: string; hasCompletedOnboarding: boolean } | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || 'Login failed');
        return null;
      }

      // Store user ID in localStorage
      localStorage.setItem('userId', result.userId);
      localStorage.setItem('userName', result.user.name);
      localStorage.setItem('userEmail', result.user.email);
      localStorage.setItem('hasOnboarding', result.user.hasCompletedOnboarding.toString());

      return { userId: result.userId, hasCompletedOnboarding: Boolean(result.user.hasCompletedOnboarding) };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}

/**
 * Hook for user signup
 */
export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (name: string, email: string, password: string, confirmPassword: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || 'Signup failed');
        return null;
      }

      // Store user ID and go to onboarding
      localStorage.setItem('userId', result.userId);
      localStorage.setItem('userName', result.user.name);
      localStorage.setItem('userEmail', result.user.email);

      return result.userId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error };
}

/**
 * Hook for onboarding - saves user financial data
 */
export function useOnboarding() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  type OnboardingPayload = Partial<Pick<UserFinancialData, 'monthlySalary' | 'rent' | 'monthlyExpenses' | 'currentSavings' | 'debts'>> & {
    city?: string;
  };

  const submitOnboarding = async (data: OnboardingPayload) => {
    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User not found. Please sign up first.');
        return null;
      }

      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...data,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || 'Failed to save data');
        return null;
      }

      // Mark onboarding as complete
      localStorage.setItem('hasOnboarding', 'true');

      return result.userId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { submitOnboarding, loading, error };
}

/**
 * Hook for fetching dashboard data
 */
export function useDashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ userData: UserFinancialData; metrics: DashboardMetrics } | null>(null);

  const fetchDashboard = useCallback(async (userId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const id = userId || localStorage.getItem('userId');
      if (!id) {
        setError('User ID not found. Please login first.');
        return null;
      }

      const response = await fetch(`/api/dashboard?userId=${id}`);
      const result = await response.json();

      if (!result.success) {
        setError(result.message || 'Failed to fetch dashboard');
        return null;
      }

      setData(result.data);
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchDashboard, loading, error, data };
}

/**
 * Hook for running simulations
 */
export function useSimulation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = async (
    decisionType: string,
    params: Record<string, unknown>
  ) => {
    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User ID not found');
        return null;
      }

      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          decisionType,
          ...params,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || 'Simulation failed');
        return null;
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { runSimulation, loading, error };
}

/**
 * Hook for getting AI insights
 */
export function useInsights() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User ID not found');
        return null;
      }

      const response = await fetch(`/api/insights?userId=${userId}`);
      const result = await response.json();

      if (!result.success) {
        setError(result.message || 'Failed to fetch insights');
        return null;
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getInsights, loading, error };
}
