/**
 * Authentication helper functions
 */

interface UserCredentials {
  email: string;
  password: string;
  name: string;
}

interface AuthResponse {
  success: boolean;
  userId?: string;
  message: string;
}

/**
 * Validate user credentials
 */
export function validateCredentials(email: string, password: string): boolean {
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email) && password.length >= 6;
}

/**
 * Validate signup data
 */
export function validateSignupData(name: string, email: string, password: string, confirmPassword: string): string | null {
  if (!name || name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return 'Please enter a valid email';
  }
  if (!password || password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
}
