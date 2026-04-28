import { Habit } from '@/types/habit';

/**
 * Converts a habit name to a URL-safe slug
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6
 */
export function getHabitSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');  // Collapse multiple hyphens
}

/**
 * Validates a habit name
 * Requirements: 6.4, 6.5, 6.6
 */
export function validateHabitName(name: string): {
  valid: boolean;
  value: string;
  error: string | null;
} {
  const trimmed = name.trim();
  
  if (trimmed === '') {
    return {
      valid: false,
      value: trimmed,
      error: 'Habit name is required'
    };
  }
  
  if (trimmed.length > 60) {
    return {
      valid: false,
      value: trimmed,
      error: 'Habit name must be 60 characters or fewer'
    };
  }
  
  return {
    valid: true,
    value: trimmed,
    error: null
  };
}

/**
 * Calculates the current streak for a habit
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6
 */
export function calculateCurrentStreak(completions: string[], today?: string): number {
  const todayDate = today || new Date().toISOString().split('T')[0];
  
  // Remove duplicates and sort
  const uniqueDates = Array.from(new Set(completions)).sort();
  
  // Check if today is completed
  if (!uniqueDates.includes(todayDate)) {
    return 0;
  }
  
  // Count backwards from today
  let streak = 0;
  const todayTime = new Date(todayDate).getTime();
  
  for (let i = 0; ; i++) {
    const checkDate = new Date(todayTime - i * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    
    if (uniqueDates.includes(checkDate)) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * Toggles a date in the habit's completions array
 * Requirements: 10.2, 10.3
 */
export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const completions = [...habit.completions];
  const index = completions.indexOf(date);
  
  if (index !== -1) {
    // Remove date if present
    completions.splice(index, 1);
  } else {
    // Add date if not present
    completions.push(date);
  }
  
  // Return new Habit object (immutable)
  return {
    ...habit,
    completions
  };
}

/**
 * Retrieves all habits from localStorage, optionally filtered by userId
 * Requirements: 6.3, 7.4, 13.3, 13.4
 */
export function getHabits(userId?: string): Habit[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem('habit-tracker-habits');
  const habits: Habit[] = stored ? JSON.parse(stored) : [];
  
  if (userId) {
    return habits.filter(habit => habit.userId === userId);
  }
  
  return habits;
}

/**
 * Saves a habit to localStorage (creates new or updates existing)
 * Requirements: 6.3, 8.4, 10.4, 13.4, 13.7
 */
export function saveHabit(habit: Habit): void {
  if (typeof window === 'undefined') return;
  
  const habits = getHabits();
  const existingIndex = habits.findIndex(h => h.id === habit.id);
  
  if (existingIndex !== -1) {
    // Update existing habit
    habits[existingIndex] = habit;
  } else {
    // Add new habit
    habits.push(habit);
  }
  
  localStorage.setItem('habit-tracker-habits', JSON.stringify(habits));
}

/**
 * Deletes a habit from localStorage
 * Requirements: 9.2, 13.4, 13.7
 */
export function deleteHabit(habitId: string): void {
  if (typeof window === 'undefined') return;
  
  const habits = getHabits();
  const filtered = habits.filter(h => h.id !== habitId);
  
  localStorage.setItem('habit-tracker-habits', JSON.stringify(filtered));
}
