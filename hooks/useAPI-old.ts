import { useState } from 'react';
import { UserFinancialData, DashboardMetrics, SimulationResult, AIInsight } from '@/backend/types';

/**
 * Hook for onboarding - saves user financial data
 */
export function useOnboarding() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitOnboarding = async (data: Omit<UserFinancialData, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || 'Failed to save data');
        return null;
      }

      // Store user ID in localStorage
      localStorage.setItem('userId', result.userId);

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
  const [data, setData] = useState<{
    userData: UserFinancialData;
    metrics: DashboardMetrics;
  } | null>(null);

  const fetchDashboard = async (userId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const id = userId || localStorage.getItem('userId');
      if (!id) {
        setError('User ID not found. Please complete onboarding first.');
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
  };

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
    params: Record<string, any>
  ) => {
    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User ID not found. Please complete onboarding first.');
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

      return result.data as SimulationResult;
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
 * Hook for fetching AI insights
 */
export function useInsights() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);

  const fetchInsights = async (userId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const id = userId || localStorage.getItem('userId');
      if (!id) {
        setError('User ID not found. Please complete onboarding first.');
        return null;
      }

      const response = await fetch(`/api/insights?userId=${id}`);
      const result = await response.json();

      if (!result.success) {
        setError(result.message || 'Failed to fetch insights');
        return null;
      }

      setInsights(result.data.insights);
      return result.data.insights;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchInsights, loading, error, insights };
}

/**
 * Utility to clear user session
 */
export function clearUserSession() {
  localStorage.removeItem('userId');
}

/**
 * Utility to get current user ID
 */
export function getUserId(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userId');
  }
  return null;
}
