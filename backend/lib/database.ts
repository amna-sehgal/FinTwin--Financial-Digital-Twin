import { UserFinancialData } from '../types/index';

/**
 * Enhanced in-memory database with user accounts and authentication
 * Stores both account info (email/password) and financial data
 */

interface UserAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  financialData?: UserFinancialData;
  hasCompletedOnboarding: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserStore {
  [userId: string]: UserAccount;
}

interface UserByEmailStore {
  [email: string]: string; // maps email to userId for quick lookup
}

let users: UserStore = {};
let usersByEmail: UserByEmailStore = {};

/**
 * Create a new user account (for signup)
 */
export function createUserAccount(email: string, password: string, name: string): UserAccount {
  const normalizedEmail = email.toLowerCase();
  
  // Check if email already registered
  if (usersByEmail[normalizedEmail]) {
    throw new Error('Email already registered');
  }

  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const account: UserAccount = {
    id: userId,
    email: normalizedEmail,
    password, // In production, use bcrypt!
    name,
    hasCompletedOnboarding: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  users[userId] = account;
  usersByEmail[normalizedEmail] = userId;
  
  console.log(`✓ New account created: ${email} (ID: ${userId})`);
  return account;
}

/**
 * Login user (verify email and password)
 * Returns user if credentials are valid, null otherwise
 */
export function loginUser(email: string, password: string): UserAccount | null {
  const normalizedEmail = email.toLowerCase();
  const userId = usersByEmail[normalizedEmail];
  
  if (!userId) {
    console.log(`✗ Login failed: Email not found: ${email}`);
    return null;
  }

  const user = users[userId];
  
  if (!user || user.password !== password) {
    console.log(`✗ Login failed: Invalid password for ${email}`);
    return null;
  }

  console.log(`✓ Login successful: ${email} (ID: ${userId})`);
  return user;
}

/**
 * Get user by ID
 */
export function getUserById(userId: string): UserAccount | null {
  return users[userId] || null;
}

/**
 * Get user by email
 */
export function getUserByEmail(email: string): UserAccount | null {
  const userId = usersByEmail[email.toLowerCase()];
  if (!userId) return null;
  return users[userId] || null;
}

/**
 * Save/update financial data for a user
 */
export function saveUserFinancialData(userId: string, financialData: UserFinancialData): UserAccount {
  const user = users[userId];
  if (!user) {
    throw new Error('User not found');
  }

  user.financialData = {
    ...financialData,
    id: userId,
    updatedAt: new Date(),
  };
  user.hasCompletedOnboarding = true;
  user.updatedAt = new Date();

  console.log(`✓ Financial data saved for user: ${userId}`);
  return user;
}

/**
 * Check if user has completed onboarding
 */
export function hasCompletedOnboarding(userId: string): boolean {
  const user = users[userId];
  return user?.hasCompletedOnboarding ?? false;
}

/**
 * Get user with financial data
 */
export function getUserWithFinancialData(userId: string): { account: UserAccount; financialData: UserFinancialData } | null {
  const user = users[userId];
  if (!user || !user.financialData) {
    return null;
  }
  return {
    account: user,
    financialData: user.financialData,
  };
}

/**
 * Get all users (for admin)
 */
export function getAllUsers(): UserAccount[] {
  return Object.values(users);
}

/**
 * Delete user
 */
export function deleteUser(userId: string): boolean {
  const user = users[userId];
  if (!user) return false;

  delete usersByEmail[user.email];
  delete users[userId];
  console.log(`✓ User deleted: ${userId}`);
  return true;
}

/**
 * Clear all data (for testing)
 */
export function clearAllData(): void {
  users = {};
  usersByEmail = {};
  console.log('✓ Database cleared');
}

/**
 * Get database stats
 */
export function getDbStats() {
  return {
    totalUsers: Object.keys(users).length,
    users: Object.entries(users).map(([id, user]) => ({
      id,
      email: user.email,
      name: user.name,
      hasOnboarding: user.hasCompletedOnboarding,
      createdAt: user.createdAt,
    })),
  };
}
