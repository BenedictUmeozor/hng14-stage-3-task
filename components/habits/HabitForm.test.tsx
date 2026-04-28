import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HabitForm from '@/components/habits/HabitForm';
import { Habit } from '@/types/habit';

describe('HabitForm', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    mockOnSave.mockClear();
    mockOnCancel.mockClear();
  });

  it('should create habit with valid name', async () => {
    render(<HabitForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    const nameInput = screen.getByTestId('habit-name-input');
    const saveButton = screen.getByTestId('habit-save-button');

    fireEvent.change(nameInput, { target: { value: 'Drink Water' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    const savedHabit = mockOnSave.mock.calls[0][0] as Habit;
    expect(savedHabit.name).toBe('Drink Water');
    expect(savedHabit.description).toBe('');
    expect(savedHabit.frequency).toBe('daily');
    expect(savedHabit.completions).toEqual([]);
    expect(savedHabit.id).toBeDefined();
    expect(savedHabit.createdAt).toBeDefined();
  });

  it('should create habit with name and description', async () => {
    render(<HabitForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    const nameInput = screen.getByTestId('habit-name-input');
    const descriptionInput = screen.getByTestId('habit-description-input');
    const saveButton = screen.getByTestId('habit-save-button');

    fireEvent.change(nameInput, { target: { value: 'Morning Exercise' } });
    fireEvent.change(descriptionInput, { target: { value: '30 minutes of cardio' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    const savedHabit = mockOnSave.mock.calls[0][0] as Habit;
    expect(savedHabit.name).toBe('Morning Exercise');
    expect(savedHabit.description).toBe('30 minutes of cardio');
  });

  it('should show exact error message for empty name', async () => {
    render(<HabitForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    const saveButton = screen.getByTestId('habit-save-button');

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Habit name is required')).toBeInTheDocument();
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should show exact error message for name over 60 chars', async () => {
    render(<HabitForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    const nameInput = screen.getByTestId('habit-name-input');
    const saveButton = screen.getByTestId('habit-save-button');

    const longName = 'a'.repeat(61);
    fireEvent.change(nameInput, { target: { value: longName } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Habit name must be 60 characters or fewer')).toBeInTheDocument();
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should edit habit and preserve id and createdAt', async () => {
    const existingHabit: Habit = {
      id: 'habit-123',
      userId: 'user-456',
      name: 'Old Name',
      description: 'Old description',
      frequency: 'daily',
      createdAt: '2024-01-01T00:00:00.000Z',
      completions: ['2024-01-01', '2024-01-02'],
    };

    render(<HabitForm habit={existingHabit} onSave={mockOnSave} onCancel={mockOnCancel} />);

    const nameInput = screen.getByTestId('habit-name-input');
    const descriptionInput = screen.getByTestId('habit-description-input');
    const saveButton = screen.getByTestId('habit-save-button');

    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    fireEvent.change(descriptionInput, { target: { value: 'New description' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    const savedHabit = mockOnSave.mock.calls[0][0] as Habit;
    expect(savedHabit.id).toBe('habit-123');
    expect(savedHabit.createdAt).toBe('2024-01-01T00:00:00.000Z');
    expect(savedHabit.userId).toBe('user-456');
    expect(savedHabit.completions).toEqual(['2024-01-01', '2024-01-02']);
    expect(savedHabit.name).toBe('New Name');
    expect(savedHabit.description).toBe('New description');
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(<HabitForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should have all required test identifiers present', () => {
    render(<HabitForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    expect(screen.getByTestId('habit-form')).toBeInTheDocument();
    expect(screen.getByTestId('habit-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('habit-description-input')).toBeInTheDocument();
    expect(screen.getByTestId('habit-frequency-select')).toBeInTheDocument();
    expect(screen.getByTestId('habit-save-button')).toBeInTheDocument();
  });
});
