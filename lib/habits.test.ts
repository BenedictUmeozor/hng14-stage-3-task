import { describe, it, expect, beforeEach } from 'vitest';
import { getHabitSlug, validateHabitName, calculateCurrentStreak, toggleHabitCompletion, getHabits, saveHabit, deleteHabit } from '@/lib/habits';
import { Habit } from '@/types/habit';

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

describe('getHabitSlug', () => {
  it('converts to lowercase', () => {
    expect(getHabitSlug('Drink Water')).toBe('drink-water');
    expect(getHabitSlug('EXERCISE')).toBe('exercise');
  });

  it('trims whitespace', () => {
    expect(getHabitSlug('  Drink Water  ')).toBe('drink-water');
    expect(getHabitSlug('\tExercise\n')).toBe('exercise');
  });

  it('replaces spaces with hyphens', () => {
    expect(getHabitSlug('Read 30 Minutes')).toBe('read-30-minutes');
    expect(getHabitSlug('Drink Water Daily')).toBe('drink-water-daily');
  });

  it('removes special characters', () => {
    expect(getHabitSlug('Exercise!!!')).toBe('exercise');
    expect(getHabitSlug('Read @Home')).toBe('read-home');
    expect(getHabitSlug('Walk & Run')).toBe('walk-run');
  });

  it('handles empty string', () => {
    expect(getHabitSlug('')).toBe('');
    expect(getHabitSlug('   ')).toBe('');
  });

  it('handles multiple consecutive spaces', () => {
    expect(getHabitSlug('Drink    Water')).toBe('drink-water');
    expect(getHabitSlug('Read  30  Minutes')).toBe('read-30-minutes');
  });
});

describe('validateHabitName', () => {
  it('accepts valid names', () => {
    const result = validateHabitName('Drink Water');
    expect(result.valid).toBe(true);
    expect(result.value).toBe('Drink Water');
    expect(result.error).toBe(null);
  });

  it('rejects empty string', () => {
    const result = validateHabitName('');
    expect(result.valid).toBe(false);
    expect(result.value).toBe('');
    expect(result.error).toBe('Habit name is required');
  });

  it('rejects whitespace-only string', () => {
    const result = validateHabitName('   ');
    expect(result.valid).toBe(false);
    expect(result.value).toBe('');
    expect(result.error).toBe('Habit name is required');
  });

  it('rejects names over 60 characters', () => {
    const longName = 'a'.repeat(61);
    const result = validateHabitName(longName);
    expect(result.valid).toBe(false);
    expect(result.value).toBe(longName);
    expect(result.error).toBe('Habit name must be 60 characters or fewer');
  });

  it('trims input before validation', () => {
    const result = validateHabitName('  Drink Water  ');
    expect(result.valid).toBe(true);
    expect(result.value).toBe('Drink Water');
    expect(result.error).toBe(null);
  });

  it('returns correct error messages', () => {
    expect(validateHabitName('').error).toBe('Habit name is required');
    expect(validateHabitName('a'.repeat(61)).error).toBe('Habit name must be 60 characters or fewer');
  });
});

describe('calculateCurrentStreak', () => {
  it('returns 0 when today not completed', () => {
    const completions = ['2024-01-01', '2024-01-02'];
    expect(calculateCurrentStreak(completions, '2024-01-03')).toBe(0);
  });

  it('returns 1 when only today completed', () => {
    const completions = ['2024-01-03'];
    expect(calculateCurrentStreak(completions, '2024-01-03')).toBe(1);
  });

  it('counts consecutive days correctly', () => {
    const completions = ['2024-01-01', '2024-01-02', '2024-01-03'];
    expect(calculateCurrentStreak(completions, '2024-01-03')).toBe(3);
  });

  it('stops at first gap', () => {
    const completions = ['2024-01-01', '2024-01-03'];
    expect(calculateCurrentStreak(completions, '2024-01-03')).toBe(1);
  });

  it('handles unsorted dates', () => {
    const completions = ['2024-01-03', '2024-01-01', '2024-01-02'];
    expect(calculateCurrentStreak(completions, '2024-01-03')).toBe(3);
  });

  it('handles duplicate dates', () => {
    const completions = ['2024-01-01', '2024-01-02', '2024-01-02', '2024-01-03'];
    expect(calculateCurrentStreak(completions, '2024-01-03')).toBe(3);
  });

  it('handles empty completions array', () => {
    expect(calculateCurrentStreak([], '2024-01-03')).toBe(0);
  });

  it('accepts custom today parameter', () => {
    const completions = ['2024-01-01', '2024-01-02'];
    expect(calculateCurrentStreak(completions, '2024-01-02')).toBe(2);
  });
});

describe('toggleHabitCompletion', () => {
  const baseHabit: Habit = {
    id: '1',
    userId: 'user1',
    name: 'Drink Water',
    description: 'Stay hydrated',
    frequency: 'daily',
    createdAt: '2024-01-01T00:00:00.000Z',
    completions: ['2024-01-01']
  };

  it('adds date when not present', () => {
    const result = toggleHabitCompletion(baseHabit, '2024-01-02');
    expect(result.completions).toContain('2024-01-02');
    expect(result.completions).toHaveLength(2);
  });

  it('removes date when present', () => {
    const result = toggleHabitCompletion(baseHabit, '2024-01-01');
    expect(result.completions).not.toContain('2024-01-01');
    expect(result.completions).toHaveLength(0);
  });

  it('returns new object (immutability)', () => {
    const result = toggleHabitCompletion(baseHabit, '2024-01-02');
    expect(result).not.toBe(baseHabit);
    expect(result.completions).not.toBe(baseHabit.completions);
  });

  it('preserves other habit properties', () => {
    const result = toggleHabitCompletion(baseHabit, '2024-01-02');
    expect(result.id).toBe(baseHabit.id);
    expect(result.userId).toBe(baseHabit.userId);
    expect(result.name).toBe(baseHabit.name);
    expect(result.description).toBe(baseHabit.description);
    expect(result.frequency).toBe(baseHabit.frequency);
    expect(result.createdAt).toBe(baseHabit.createdAt);
  });

  it('prevents duplicate dates', () => {
    const habit = { ...baseHabit, completions: ['2024-01-01'] };
    const result1 = toggleHabitCompletion(habit, '2024-01-02');
    const result2 = toggleHabitCompletion(result1, '2024-01-02');
    expect(result2.completions).not.toContain('2024-01-02');
  });
});

describe('getHabits', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('returns empty array when no habits exist', () => {
    const habits = getHabits();
    expect(habits).toEqual([]);
  });

  it('returns all habits when no userId provided', () => {
    const mockHabits: Habit[] = [
      {
        id: '1',
        userId: 'user1',
        name: 'Habit 1',
        description: '',
        frequency: 'daily',
        createdAt: '2024-01-01T00:00:00.000Z',
        completions: []
      },
      {
        id: '2',
        userId: 'user2',
        name: 'Habit 2',
        description: '',
        frequency: 'daily',
        createdAt: '2024-01-02T00:00:00.000Z',
        completions: []
      }
    ];
    localStorage.setItem('habit-tracker-habits', JSON.stringify(mockHabits));

    const habits = getHabits();
    expect(habits).toEqual(mockHabits);
  });

  it('filters habits by userId when provided', () => {
    const mockHabits: Habit[] = [
      {
        id: '1',
        userId: 'user1',
        name: 'Habit 1',
        description: '',
        frequency: 'daily',
        createdAt: '2024-01-01T00:00:00.000Z',
        completions: []
      },
      {
        id: '2',
        userId: 'user2',
        name: 'Habit 2',
        description: '',
        frequency: 'daily',
        createdAt: '2024-01-02T00:00:00.000Z',
        completions: []
      },
      {
        id: '3',
        userId: 'user1',
        name: 'Habit 3',
        description: '',
        frequency: 'daily',
        createdAt: '2024-01-03T00:00:00.000Z',
        completions: []
      }
    ];
    localStorage.setItem('habit-tracker-habits', JSON.stringify(mockHabits));

    const habits = getHabits('user1');
    expect(habits).toHaveLength(2);
    expect(habits[0].id).toBe('1');
    expect(habits[1].id).toBe('3');
  });
});

describe('saveHabit', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('adds new habit to localStorage', () => {
    const newHabit: Habit = {
      id: '1',
      userId: 'user1',
      name: 'New Habit',
      description: 'Test',
      frequency: 'daily',
      createdAt: '2024-01-01T00:00:00.000Z',
      completions: []
    };

    saveHabit(newHabit);

    const habits = getHabits();
    expect(habits).toHaveLength(1);
    expect(habits[0]).toEqual(newHabit);
  });

  it('updates existing habit', () => {
    const habit: Habit = {
      id: '1',
      userId: 'user1',
      name: 'Original',
      description: '',
      frequency: 'daily',
      createdAt: '2024-01-01T00:00:00.000Z',
      completions: []
    };
    saveHabit(habit);

    const updated: Habit = {
      ...habit,
      name: 'Updated',
      description: 'New description'
    };
    saveHabit(updated);

    const habits = getHabits();
    expect(habits).toHaveLength(1);
    expect(habits[0].name).toBe('Updated');
    expect(habits[0].description).toBe('New description');
  });

  it('preserves other habits when updating', () => {
    const habit1: Habit = {
      id: '1',
      userId: 'user1',
      name: 'Habit 1',
      description: '',
      frequency: 'daily',
      createdAt: '2024-01-01T00:00:00.000Z',
      completions: []
    };
    const habit2: Habit = {
      id: '2',
      userId: 'user1',
      name: 'Habit 2',
      description: '',
      frequency: 'daily',
      createdAt: '2024-01-02T00:00:00.000Z',
      completions: []
    };
    saveHabit(habit1);
    saveHabit(habit2);

    const updated = { ...habit1, name: 'Updated Habit 1' };
    saveHabit(updated);

    const habits = getHabits();
    expect(habits).toHaveLength(2);
    expect(habits[0].name).toBe('Updated Habit 1');
    expect(habits[1].name).toBe('Habit 2');
  });
});

describe('deleteHabit', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('removes habit from localStorage', () => {
    const habit: Habit = {
      id: '1',
      userId: 'user1',
      name: 'To Delete',
      description: '',
      frequency: 'daily',
      createdAt: '2024-01-01T00:00:00.000Z',
      completions: []
    };
    saveHabit(habit);

    deleteHabit('1');

    const habits = getHabits();
    expect(habits).toHaveLength(0);
  });

  it('preserves other habits when deleting', () => {
    const habit1: Habit = {
      id: '1',
      userId: 'user1',
      name: 'Habit 1',
      description: '',
      frequency: 'daily',
      createdAt: '2024-01-01T00:00:00.000Z',
      completions: []
    };
    const habit2: Habit = {
      id: '2',
      userId: 'user1',
      name: 'Habit 2',
      description: '',
      frequency: 'daily',
      createdAt: '2024-01-02T00:00:00.000Z',
      completions: []
    };
    saveHabit(habit1);
    saveHabit(habit2);

    deleteHabit('1');

    const habits = getHabits();
    expect(habits).toHaveLength(1);
    expect(habits[0].id).toBe('2');
  });

  it('does nothing when habit does not exist', () => {
    const habit: Habit = {
      id: '1',
      userId: 'user1',
      name: 'Habit',
      description: '',
      frequency: 'daily',
      createdAt: '2024-01-01T00:00:00.000Z',
      completions: []
    };
    saveHabit(habit);

    deleteHabit('nonexistent');

    const habits = getHabits();
    expect(habits).toHaveLength(1);
  });
});
