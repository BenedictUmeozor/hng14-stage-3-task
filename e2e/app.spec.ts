import { test, expect } from '@playwright/test';

test.describe('Routing and Splash Screen', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('http://localhost:3000');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('"/" shows splash screen for 800-2000ms', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:3000');
    
    // Verify splash screen is visible
    const splashScreen = page.getByTestId('splash-screen');
    await expect(splashScreen).toBeVisible();
    
    // Wait for splash screen to disappear
    await expect(splashScreen).not.toBeVisible({ timeout: 3000 });
    
    const duration = Date.now() - startTime;
    
    // Verify duration is between 800ms and 2000ms
    expect(duration).toBeGreaterThanOrEqual(800);
    expect(duration).toBeLessThanOrEqual(2500); // Allow some buffer for page load
  });

  test('"/" redirects to /login when no session', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Wait for splash screen to complete and redirect
    await page.waitForURL('http://localhost:3000/login', { timeout: 5000 });
    
    // Verify we're on the login page
    await expect(page).toHaveURL('http://localhost:3000/login');
  });

  test('"/" redirects to /dashboard when session exists', async ({ page }) => {
    // Create a user and session
    await page.goto('http://localhost:3000');
    await page.evaluate(() => {
      const users = [{
        id: '1',
        email: 'testuser@example.com',
        password: 'password123',
        createdAt: new Date().toISOString()
      }];
      const session = {
        userId: '1',
        email: 'testuser@example.com'
      };
      localStorage.setItem('habit-tracker-users', JSON.stringify(users));
      localStorage.setItem('habit-tracker-session', JSON.stringify(session));
    });
    
    // Navigate to root
    await page.goto('http://localhost:3000');
    
    // Wait for splash screen to complete and redirect
    await page.waitForURL('http://localhost:3000/dashboard', { timeout: 5000 });
    
    // Verify we're on the dashboard page
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
  });

  test('"/dashboard" redirects to /login when no session', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL('http://localhost:3000/login');
  });
});

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('http://localhost:3000');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('complete signup flow creates user and redirects', async ({ page }) => {
    await page.goto('http://localhost:3000/signup');
    
    // Fill in signup form
    await page.getByTestId('auth-signup-email').fill('newuser@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    
    // Submit form
    await page.getByTestId('auth-signup-submit').click();
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    
    // Verify user was created in localStorage
    const users = await page.evaluate(() => {
      const usersData = localStorage.getItem('habit-tracker-users');
      return usersData ? JSON.parse(usersData) : [];
    });
    
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe('newuser@example.com');
    
    // Verify session was created
    const session = await page.evaluate(() => {
      const sessionData = localStorage.getItem('habit-tracker-session');
      return sessionData ? JSON.parse(sessionData) : null;
    });
    
    expect(session).not.toBeNull();
    expect(session.email).toBe('newuser@example.com');
  });

  test('signup with duplicate email shows exact error message', async ({ page }) => {
    // Create a user first
    await page.goto('http://localhost:3000/signup');
    await page.evaluate(() => {
      const users = [{
        id: '1',
        email: 'existing@example.com',
        password: 'password123',
        createdAt: new Date().toISOString()
      }];
      localStorage.setItem('habit-tracker-users', JSON.stringify(users));
    });
    
    // Try to signup with same email
    await page.getByTestId('auth-signup-email').fill('existing@example.com');
    await page.getByTestId('auth-signup-password').fill('password456');
    await page.getByTestId('auth-signup-submit').click();
    
    // Should show exact error message
    await expect(page.getByText('User already exists')).toBeVisible();
    
    // Should not redirect
    await expect(page).toHaveURL('http://localhost:3000/signup');
  });

  test('complete login flow creates session and redirects', async ({ page }) => {
    // Create a user first
    await page.goto('http://localhost:3000/login');
    await page.evaluate(() => {
      const users = [{
        id: '1',
        email: 'testuser@example.com',
        password: 'password123',
        createdAt: new Date().toISOString()
      }];
      localStorage.setItem('habit-tracker-users', JSON.stringify(users));
    });
    
    // Fill in login form
    await page.getByTestId('auth-login-email').fill('testuser@example.com');
    await page.getByTestId('auth-login-password').fill('password123');
    
    // Submit form
    await page.getByTestId('auth-login-submit').click();
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    
    // Verify session was created
    const session = await page.evaluate(() => {
      const sessionData = localStorage.getItem('habit-tracker-session');
      return sessionData ? JSON.parse(sessionData) : null;
    });
    
    expect(session).not.toBeNull();
    expect(session.email).toBe('testuser@example.com');
    expect(session.userId).toBe('1');
  });

  test('login with wrong password shows exact error message', async ({ page }) => {
    // Create a user first
    await page.goto('http://localhost:3000/login');
    await page.evaluate(() => {
      const users = [{
        id: '1',
        email: 'testuser@example.com',
        password: 'correctpassword',
        createdAt: new Date().toISOString()
      }];
      localStorage.setItem('habit-tracker-users', JSON.stringify(users));
    });
    
    // Try to login with wrong password
    await page.getByTestId('auth-login-email').fill('testuser@example.com');
    await page.getByTestId('auth-login-password').fill('wrongpassword');
    await page.getByTestId('auth-login-submit').click();
    
    // Should show exact error message
    await expect(page.getByText('Invalid email or password')).toBeVisible();
    
    // Should not redirect
    await expect(page).toHaveURL('http://localhost:3000/login');
    
    // Should not create session
    const session = await page.evaluate(() => {
      const sessionData = localStorage.getItem('habit-tracker-session');
      return sessionData ? JSON.parse(sessionData) : null;
    });
    
    expect(session).toBeNull();
  });

  test('logout clears session and redirects to login', async ({ page }) => {
    // Create a user and session
    await page.goto('http://localhost:3000/dashboard');
    await page.evaluate(() => {
      const users = [{
        id: '1',
        email: 'testuser@example.com',
        password: 'password123',
        createdAt: new Date().toISOString()
      }];
      const session = {
        userId: '1',
        email: 'testuser@example.com'
      };
      localStorage.setItem('habit-tracker-users', JSON.stringify(users));
      localStorage.setItem('habit-tracker-session', JSON.stringify(session));
    });
    
    // Reload to ensure session is recognized
    await page.reload();
    
    // Click logout button
    await page.getByTestId('auth-logout-button').click();
    
    // Should redirect to login
    await expect(page).toHaveURL('http://localhost:3000/login');
    
    // Verify session was cleared
    const session = await page.evaluate(() => {
      const sessionData = localStorage.getItem('habit-tracker-session');
      return sessionData ? JSON.parse(sessionData) : null;
    });
    
    expect(session).toBeNull();
  });
});

test.describe('Habit CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage and create a user with session
    await page.goto('http://localhost:3000');
    await page.evaluate(() => {
      localStorage.clear();
      const users = [{
        id: '1',
        email: 'testuser@example.com',
        password: 'password123',
        createdAt: new Date().toISOString()
      }];
      const session = {
        userId: '1',
        email: 'testuser@example.com'
      };
      localStorage.setItem('habit-tracker-users', JSON.stringify(users));
      localStorage.setItem('habit-tracker-session', JSON.stringify(session));
    });
    
    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard');
  });

  test('create new habit appears in list', async ({ page }) => {
    // Click create habit button
    await page.getByTestId('create-habit-button').click();
    
    // Fill in habit form
    await page.getByTestId('habit-name-input').fill('Morning Exercise');
    await page.getByTestId('habit-description-input').fill('30 minutes of exercise');
    
    // Submit form
    await page.getByTestId('habit-save-button').click();
    
    // Verify habit appears in list
    await expect(page.getByTestId('habit-card-morning-exercise')).toBeVisible();
    await expect(page.getByText('Morning Exercise')).toBeVisible();
    await expect(page.getByText('30 minutes of exercise')).toBeVisible();
    
    // Verify habit is in localStorage
    const habits = await page.evaluate(() => {
      const habitsData = localStorage.getItem('habit-tracker-habits');
      return habitsData ? JSON.parse(habitsData) : [];
    });
    
    expect(habits).toHaveLength(1);
    expect(habits[0].name).toBe('Morning Exercise');
    expect(habits[0].description).toBe('30 minutes of exercise');
  });

  test('edit habit updates name and description', async ({ page }) => {
    // Create a habit first
    await page.evaluate(() => {
      const habits = [{
        id: '1',
        userId: '1',
        name: 'Read Books',
        description: 'Read for 20 minutes',
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: []
      }];
      localStorage.setItem('habit-tracker-habits', JSON.stringify(habits));
    });
    
    // Reload to see the habit
    await page.reload();
    
    // Click edit button
    await page.getByTestId('habit-edit-read-books').click();
    
    // Update habit form
    await page.getByTestId('habit-name-input').clear();
    await page.getByTestId('habit-name-input').fill('Read Daily');
    await page.getByTestId('habit-description-input').clear();
    await page.getByTestId('habit-description-input').fill('Read for 30 minutes');
    
    // Submit form
    await page.getByTestId('habit-save-button').click();
    
    // Verify updated habit appears
    await expect(page.getByTestId('habit-card-read-daily')).toBeVisible();
    await expect(page.getByText('Read Daily')).toBeVisible();
    await expect(page.getByText('Read for 30 minutes')).toBeVisible();
    
    // Verify old habit card is gone
    await expect(page.getByTestId('habit-card-read-books')).not.toBeVisible();
    
    // Verify habit is updated in localStorage
    const habits = await page.evaluate(() => {
      const habitsData = localStorage.getItem('habit-tracker-habits');
      return habitsData ? JSON.parse(habitsData) : [];
    });
    
    expect(habits).toHaveLength(1);
    expect(habits[0].name).toBe('Read Daily');
    expect(habits[0].description).toBe('Read for 30 minutes');
    expect(habits[0].id).toBe('1'); // ID should be preserved
  });

  test('delete habit with confirmation removes from list', async ({ page }) => {
    // Create a habit first
    await page.evaluate(() => {
      const habits = [{
        id: '1',
        userId: '1',
        name: 'Drink Water',
        description: '8 glasses a day',
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: []
      }];
      localStorage.setItem('habit-tracker-habits', JSON.stringify(habits));
    });
    
    // Reload to see the habit
    await page.reload();
    
    // Verify habit is visible
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
    
    // Click delete button
    await page.getByTestId('habit-delete-drink-water').click();
    
    // Confirm deletion
    await page.getByTestId('confirm-delete-button').click();
    
    // Verify habit is removed from list
    await expect(page.getByTestId('habit-card-drink-water')).not.toBeVisible();
    
    // Verify empty state is shown
    await expect(page.getByTestId('empty-state')).toBeVisible();
    
    // Verify habit is removed from localStorage
    const habits = await page.evaluate(() => {
      const habitsData = localStorage.getItem('habit-tracker-habits');
      return habitsData ? JSON.parse(habitsData) : [];
    });
    
    expect(habits).toHaveLength(0);
  });

  test('cancel delete keeps habit in list', async ({ page }) => {
    // Create a habit first
    await page.evaluate(() => {
      const habits = [{
        id: '1',
        userId: '1',
        name: 'Meditate',
        description: '10 minutes daily',
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: []
      }];
      localStorage.setItem('habit-tracker-habits', JSON.stringify(habits));
    });
    
    // Reload to see the habit
    await page.reload();
    
    // Verify habit is visible
    await expect(page.getByTestId('habit-card-meditate')).toBeVisible();
    
    // Click delete button
    await page.getByTestId('habit-delete-meditate').click();
    
    // Cancel deletion (look for cancel button in dialog)
    await page.getByRole('button', { name: /cancel/i }).click();
    
    // Verify habit is still in list
    await expect(page.getByTestId('habit-card-meditate')).toBeVisible();
    
    // Verify habit is still in localStorage
    const habits = await page.evaluate(() => {
      const habitsData = localStorage.getItem('habit-tracker-habits');
      return habitsData ? JSON.parse(habitsData) : [];
    });
    
    expect(habits).toHaveLength(1);
    expect(habits[0].name).toBe('Meditate');
  });
});

test.describe('Habit Completion and Streaks', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage and create a user with session
    await page.goto('http://localhost:3000');
    await page.evaluate(() => {
      localStorage.clear();
      const users = [{
        id: '1',
        email: 'testuser@example.com',
        password: 'password123',
        createdAt: new Date().toISOString()
      }];
      const session = {
        userId: '1',
        email: 'testuser@example.com'
      };
      localStorage.setItem('habit-tracker-users', JSON.stringify(users));
      localStorage.setItem('habit-tracker-session', JSON.stringify(session));
    });
    
    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard');
  });

  test('mark habit complete adds to completions', async ({ page }) => {
    // Create a habit
    await page.evaluate(() => {
      const habits = [{
        id: '1',
        userId: '1',
        name: 'Exercise',
        description: 'Daily workout',
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: []
      }];
      localStorage.setItem('habit-tracker-habits', JSON.stringify(habits));
    });
    
    // Reload to see the habit
    await page.reload();
    
    // Click complete button
    await page.getByTestId('habit-complete-exercise').click();
    
    // Verify completion is added to localStorage
    const habits = await page.evaluate(() => {
      const habitsData = localStorage.getItem('habit-tracker-habits');
      return habitsData ? JSON.parse(habitsData) : [];
    });
    
    const today = new Date().toISOString().split('T')[0];
    expect(habits[0].completions).toContain(today);
  });

  test('unmark habit removes from completions', async ({ page }) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Create a habit with today's completion
    await page.evaluate((todayDate) => {
      const habits = [{
        id: '1',
        userId: '1',
        name: 'Exercise',
        description: 'Daily workout',
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: [todayDate]
      }];
      localStorage.setItem('habit-tracker-habits', JSON.stringify(habits));
    }, today);
    
    // Reload to see the habit
    await page.reload();
    
    // Click complete button to unmark
    await page.getByTestId('habit-complete-exercise').click();
    
    // Verify completion is removed from localStorage
    const habits = await page.evaluate(() => {
      const habitsData = localStorage.getItem('habit-tracker-habits');
      return habitsData ? JSON.parse(habitsData) : [];
    });
    
    expect(habits[0].completions).not.toContain(today);
    expect(habits[0].completions).toHaveLength(0);
  });

  test('streak updates immediately after completion', async ({ page }) => {
    // Create a habit
    await page.evaluate(() => {
      const habits = [{
        id: '1',
        userId: '1',
        name: 'Exercise',
        description: 'Daily workout',
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: []
      }];
      localStorage.setItem('habit-tracker-habits', JSON.stringify(habits));
    });
    
    // Reload to see the habit
    await page.reload();
    
    // Verify initial streak badge is not visible (streak is 0)
    const streakElement = page.getByTestId('habit-streak-exercise');
    await expect(streakElement).not.toBeVisible();
    
    // Click complete button
    await page.getByTestId('habit-complete-exercise').click();
    
    // Verify streak badge appears and shows 1
    await expect(streakElement).toBeVisible();
    await expect(streakElement).toContainText('1');
  });

  test('streak resets to 0 when today not completed', async ({ page }) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // Create a habit with yesterday's completion
    await page.evaluate((yesterdayDate) => {
      const habits = [{
        id: '1',
        userId: '1',
        name: 'Exercise',
        description: 'Daily workout',
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: [yesterdayDate]
      }];
      localStorage.setItem('habit-tracker-habits', JSON.stringify(habits));
    }, yesterdayStr);
    
    // Reload to see the habit
    await page.reload();
    
    // Verify streak badge is not visible (streak is 0 because today not completed)
    const streakElement = page.getByTestId('habit-streak-exercise');
    await expect(streakElement).not.toBeVisible();
  });
});

test.describe('Persistence', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage
    await page.goto('http://localhost:3000');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('reload page preserves session', async ({ page }) => {
    // Create a user and session
    await page.evaluate(() => {
      const users = [{
        id: '1',
        email: 'testuser@example.com',
        password: 'password123',
        createdAt: new Date().toISOString()
      }];
      const session = {
        userId: '1',
        email: 'testuser@example.com'
      };
      localStorage.setItem('habit-tracker-users', JSON.stringify(users));
      localStorage.setItem('habit-tracker-session', JSON.stringify(session));
    });
    
    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard');
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    
    // Reload page
    await page.reload();
    
    // Verify still on dashboard (session preserved)
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    
    // Verify session still exists in localStorage
    const session = await page.evaluate(() => {
      const sessionData = localStorage.getItem('habit-tracker-session');
      return sessionData ? JSON.parse(sessionData) : null;
    });
    
    expect(session).not.toBeNull();
    expect(session.email).toBe('testuser@example.com');
  });

  test('reload page preserves habits', async ({ page }) => {
    // Create a user, session, and habits
    await page.evaluate(() => {
      const users = [{
        id: '1',
        email: 'testuser@example.com',
        password: 'password123',
        createdAt: new Date().toISOString()
      }];
      const session = {
        userId: '1',
        email: 'testuser@example.com'
      };
      const habits = [
        {
          id: '1',
          userId: '1',
          name: 'Exercise',
          description: 'Daily workout',
          frequency: 'daily',
          createdAt: new Date().toISOString(),
          completions: []
        },
        {
          id: '2',
          userId: '1',
          name: 'Read',
          description: 'Read for 30 minutes',
          frequency: 'daily',
          createdAt: new Date().toISOString(),
          completions: []
        }
      ];
      localStorage.setItem('habit-tracker-users', JSON.stringify(users));
      localStorage.setItem('habit-tracker-session', JSON.stringify(session));
      localStorage.setItem('habit-tracker-habits', JSON.stringify(habits));
    });
    
    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard');
    
    // Verify habits are visible
    await expect(page.getByTestId('habit-card-exercise')).toBeVisible();
    await expect(page.getByTestId('habit-card-read')).toBeVisible();
    
    // Reload page
    await page.reload();
    
    // Verify habits are still visible
    await expect(page.getByTestId('habit-card-exercise')).toBeVisible();
    await expect(page.getByTestId('habit-card-read')).toBeVisible();
    
    // Verify habits still exist in localStorage
    const habits = await page.evaluate(() => {
      const habitsData = localStorage.getItem('habit-tracker-habits');
      return habitsData ? JSON.parse(habitsData) : [];
    });
    
    expect(habits).toHaveLength(2);
  });

  test('logout and login shows correct user\'s habits', async ({ page }) => {
    // Create two users with different habits
    await page.evaluate(() => {
      const users = [
        {
          id: '1',
          email: 'user1@example.com',
          password: 'password123',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          email: 'user2@example.com',
          password: 'password456',
          createdAt: new Date().toISOString()
        }
      ];
      const session = {
        userId: '1',
        email: 'user1@example.com'
      };
      const habits = [
        {
          id: '1',
          userId: '1',
          name: 'User1 Habit',
          description: 'Habit for user 1',
          frequency: 'daily',
          createdAt: new Date().toISOString(),
          completions: []
        },
        {
          id: '2',
          userId: '2',
          name: 'User2 Habit',
          description: 'Habit for user 2',
          frequency: 'daily',
          createdAt: new Date().toISOString(),
          completions: []
        }
      ];
      localStorage.setItem('habit-tracker-users', JSON.stringify(users));
      localStorage.setItem('habit-tracker-session', JSON.stringify(session));
      localStorage.setItem('habit-tracker-habits', JSON.stringify(habits));
    });
    
    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard');
    
    // Verify only user1's habit is visible
    await expect(page.getByText('User1 Habit')).toBeVisible();
    await expect(page.getByText('User2 Habit')).not.toBeVisible();
    
    // Logout
    await page.getByTestId('auth-logout-button').click();
    await expect(page).toHaveURL('http://localhost:3000/login');
    
    // Login as user2
    await page.getByTestId('auth-login-email').fill('user2@example.com');
    await page.getByTestId('auth-login-password').fill('password456');
    await page.getByTestId('auth-login-submit').click();
    
    // Wait for redirect to dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    
    // Verify only user2's habit is visible
    await expect(page.getByText('User2 Habit')).toBeVisible();
    await expect(page.getByText('User1 Habit')).not.toBeVisible();
  });

  test('habits from different users don\'t mix', async ({ page }) => {
    // Create two users with different habits
    await page.evaluate(() => {
      const users = [
        {
          id: '1',
          email: 'user1@example.com',
          password: 'password123',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          email: 'user2@example.com',
          password: 'password456',
          createdAt: new Date().toISOString()
        }
      ];
      const habits = [
        {
          id: '1',
          userId: '1',
          name: 'Exercise',
          description: 'User 1 exercise',
          frequency: 'daily',
          createdAt: new Date().toISOString(),
          completions: []
        },
        {
          id: '2',
          userId: '2',
          name: 'Meditate',
          description: 'User 2 meditation',
          frequency: 'daily',
          createdAt: new Date().toISOString(),
          completions: []
        }
      ];
      localStorage.setItem('habit-tracker-users', JSON.stringify(users));
      localStorage.setItem('habit-tracker-habits', JSON.stringify(habits));
    });
    
    // Login as user1
    await page.goto('http://localhost:3000/login');
    await page.getByTestId('auth-login-email').fill('user1@example.com');
    await page.getByTestId('auth-login-password').fill('password123');
    await page.getByTestId('auth-login-submit').click();
    
    // Wait for redirect to dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    
    // Verify only user1's habits are visible
    await expect(page.getByRole('heading', { name: 'Exercise' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Meditate' })).not.toBeVisible();
    
    // Count habit cards
    const habitCards = page.locator('[data-testid^="habit-card-"]');
    await expect(habitCards).toHaveCount(1);
  });
});
