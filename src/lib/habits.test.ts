import { describe, it, expect } from 'vitest';
import { getHabitSlug, validateHabitName, calculateCurrentStreak, toggleHabitCompletion } from './habits';
import { Habit } from '../types/habit';

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
