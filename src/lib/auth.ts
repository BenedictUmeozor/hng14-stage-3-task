import { User, Session } from '@/types/auth';

// Storage keys
const USERS_KEY = 'habit-tracker-users';
const SESSION_KEY = 'habit-tracker-session';

// Session utility functions (Sub-task 6.1)

/**
 * Get the current session from localStorage
 * @returns Session object or null if no session exists
 */
export function getSession(): Session | null {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (error) {
    return null;
  }
}

/**
 * Create a new session in localStorage
 * @param userId - The user's unique identifier
 * @param email - The user's email address
 */
export function createSession(userId: string, email: string): void {
  const session: Session = { userId, email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Clear the current session from localStorage
 */
export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// User utility functions (Sub-task 6.2)

/**
 * Get all users from localStorage
 * @returns Array of User objects
 */
export function getUsers(): User[] {
  try {
    const usersData = localStorage.getItem(USERS_KEY);
    return usersData ? JSON.parse(usersData) : [];
  } catch (error) {
    return [];
  }
}

/**
 * Create a new user and add to localStorage
 * @param email - The user's email address
 * @param password - The user's password
 * @returns The newly created User object
 */
export function createUser(email: string, password: string): User {
  const users = getUsers();
  
  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    password,
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  return newUser;
}

/**
 * Find a user by email address
 * @param email - The email address to search for
 * @returns User object if found, undefined otherwise
 */
export function findUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find(user => user.email === email);
}
