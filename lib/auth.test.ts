import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getSession,
  createSession,
  clearSession,
  getUsers,
  createUser,
  findUserByEmail,
} from './auth';
import type { User, Session } from '@/types/auth';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('Session utility functions', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('getSession', () => {
    it('should return null when no session exists', () => {
      const session = getSession();
      expect(session).toBeNull();
    });

    it('should return session object when session exists', () => {
      const mockSession: Session = {
        userId: 'user-123',
        email: 'test@example.com',
      };
      localStorage.setItem('habit-tracker-session', JSON.stringify(mockSession));

      const session = getSession();
      expect(session).toEqual(mockSession);
    });

    it('should return null when localStorage contains invalid JSON', () => {
      localStorage.setItem('habit-tracker-session', 'invalid-json');
      const session = getSession();
      expect(session).toBeNull();
    });
  });

  describe('createSession', () => {
    it('should create a session in localStorage', () => {
      createSession('user-456', 'user@example.com');

      const stored = localStorage.getItem('habit-tracker-session');
      expect(stored).toBeTruthy();
      
      const session = JSON.parse(stored!);
      expect(session).toEqual({
        userId: 'user-456',
        email: 'user@example.com',
      });
    });

    it('should overwrite existing session', () => {
      createSession('user-1', 'first@example.com');
      createSession('user-2', 'second@example.com');

      const session = getSession();
      expect(session).toEqual({
        userId: 'user-2',
        email: 'second@example.com',
      });
    });
  });

  describe('clearSession', () => {
    it('should remove session from localStorage', () => {
      createSession('user-789', 'clear@example.com');
      expect(getSession()).not.toBeNull();

      clearSession();
      expect(getSession()).toBeNull();
    });

    it('should not throw error when no session exists', () => {
      expect(() => clearSession()).not.toThrow();
    });
  });
});

describe('User utility functions', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('getUsers', () => {
    it('should return empty array when no users exist', () => {
      const users = getUsers();
      expect(users).toEqual([]);
    });

    it('should return array of users when users exist', () => {
      const mockUsers: User[] = [
        {
          id: 'user-1',
          email: 'user1@example.com',
          password: 'password1',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'user-2',
          email: 'user2@example.com',
          password: 'password2',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];
      localStorage.setItem('habit-tracker-users', JSON.stringify(mockUsers));

      const users = getUsers();
      expect(users).toEqual(mockUsers);
    });

    it('should return empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem('habit-tracker-users', 'invalid-json');
      const users = getUsers();
      expect(users).toEqual([]);
    });
  });

  describe('createUser', () => {
    it('should create a new user with all required fields', () => {
      const user = createUser('newuser@example.com', 'password123');

      expect(user.id).toBeTruthy();
      expect(user.email).toBe('newuser@example.com');
      expect(user.password).toBe('password123');
      expect(user.createdAt).toBeTruthy();
      expect(new Date(user.createdAt).toString()).not.toBe('Invalid Date');
    });

    it('should add user to localStorage', () => {
      createUser('stored@example.com', 'pass456');

      const users = getUsers();
      expect(users).toHaveLength(1);
      expect(users[0].email).toBe('stored@example.com');
    });

    it('should append to existing users', () => {
      createUser('first@example.com', 'pass1');
      createUser('second@example.com', 'pass2');

      const users = getUsers();
      expect(users).toHaveLength(2);
      expect(users[0].email).toBe('first@example.com');
      expect(users[1].email).toBe('second@example.com');
    });

    it('should generate unique IDs for each user', () => {
      const user1 = createUser('user1@example.com', 'pass1');
      const user2 = createUser('user2@example.com', 'pass2');

      expect(user1.id).not.toBe(user2.id);
    });

    it('should store createdAt as ISO 8601 timestamp', () => {
      const user = createUser('time@example.com', 'pass');
      
      // Check ISO 8601 format
      expect(user.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe('findUserByEmail', () => {
    beforeEach(() => {
      createUser('alice@example.com', 'password1');
      createUser('bob@example.com', 'password2');
      createUser('charlie@example.com', 'password3');
    });

    it('should find user by email when user exists', () => {
      const user = findUserByEmail('bob@example.com');

      expect(user).toBeTruthy();
      expect(user?.email).toBe('bob@example.com');
      expect(user?.password).toBe('password2');
    });

    it('should return undefined when user does not exist', () => {
      const user = findUserByEmail('nonexistent@example.com');
      expect(user).toBeUndefined();
    });

    it('should be case-sensitive', () => {
      const user = findUserByEmail('ALICE@EXAMPLE.COM');
      expect(user).toBeUndefined();
    });

    it('should return first match when duplicate emails exist', () => {
      // Manually add duplicate for testing
      const users = getUsers();
      users.push({
        id: 'duplicate-id',
        email: 'alice@example.com',
        password: 'different-password',
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('habit-tracker-users', JSON.stringify(users));

      const user = findUserByEmail('alice@example.com');
      expect(user?.password).toBe('password1'); // First one
    });
  });
});
