import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HabitCard from './HabitCard';
import { Habit } from '@/types/habit';

describe('HabitCard', () => {
  const mockOnToggleComplete = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];

  const baseHabit: Habit = {
    id: 'habit-1',
    userId: 'user-1',
    name: 'Drink Water',
    description: 'Drink 8 glasses of water daily',
    frequency: 'daily',
    createdAt: '2024-01-01T00:00:00.000Z',
    completions: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays habit name and description', () => {
    render(
      <HabitCard
        habit={baseHabit}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Drink Water')).toBeInTheDocument();
    expect(screen.getByText('Drink 8 glasses of water daily')).toBeInTheDocument();
  });

  it('displays current streak', () => {
    const habitWithStreak: Habit = {
      ...baseHabit,
      completions: [twoDaysAgo, yesterday, today],
    };

    render(
      <HabitCard
        habit={habitWithStreak}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const streakElement = screen.getByTestId('habit-streak-drink-water');
    expect(streakElement).toBeInTheDocument();
    expect(streakElement).toHaveTextContent('3');
  });

  it('toggle completion updates UI', () => {
    const { rerender } = render(
      <HabitCard
        habit={baseHabit}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const completeButton = screen.getByTestId('habit-complete-drink-water');
    
    // Initially incomplete
    expect(completeButton).toHaveTextContent('Mark Complete');
    
    // Click to complete
    fireEvent.click(completeButton);
    expect(mockOnToggleComplete).toHaveBeenCalledWith('habit-1');
    expect(mockOnToggleComplete).toHaveBeenCalledTimes(1);

    // Rerender with completed habit
    const completedHabit: Habit = {
      ...baseHabit,
      completions: [today],
    };

    rerender(
      <HabitCard
        habit={completedHabit}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Now completed
    expect(completeButton).toHaveTextContent('Completed');
  });

  it('edit button triggers callback', () => {
    render(
      <HabitCard
        habit={baseHabit}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByTestId('habit-edit-drink-water');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith('habit-1');
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('delete button shows confirmation', () => {
    render(
      <HabitCard
        habit={baseHabit}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByTestId('habit-delete-drink-water');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('habit-1');
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('all test identifiers are present with correct slug', () => {
    const habitWithStreak: Habit = {
      ...baseHabit,
      completions: [today],
    };

    render(
      <HabitCard
        habit={habitWithStreak}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Verify all test identifiers with correct slug
    expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument();
    expect(screen.getByTestId('habit-streak-drink-water')).toBeInTheDocument();
    expect(screen.getByTestId('habit-complete-drink-water')).toBeInTheDocument();
    expect(screen.getByTestId('habit-edit-drink-water')).toBeInTheDocument();
    expect(screen.getByTestId('habit-delete-drink-water')).toBeInTheDocument();
  });
});
