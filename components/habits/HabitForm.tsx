'use client';

import { useState, FormEvent } from 'react';
import { Habit } from '@/types/habit';
import { validateHabitName } from '@/lib/habits';

interface HabitFormProps {
  habit?: Habit;
  onSave: (habit: Habit) => void;
  onCancel: () => void;
}

export default function HabitForm({ habit, onSave, onCancel }: HabitFormProps) {
  const [name, setName] = useState(habit?.name || '');
  const [description, setDescription] = useState(habit?.description || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const validation = validateHabitName(name);
    
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    
    setError(null);
    
    const habitData: Habit = habit
      ? {
          ...habit,
          name: validation.value,
          description: description.trim(),
        }
      : {
          id: crypto.randomUUID(),
          userId: '', // Will be set by parent component
          name: validation.value,
          description: description.trim(),
          frequency: 'daily',
          createdAt: new Date().toISOString(),
          completions: [],
        };
    
    onSave(habitData);
  };

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="relative rounded-xl p-5 sm:p-7 border"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border-subtle)',
        animation: 'scaleIn 0.2s ease-out',
      }}
      aria-label={habit ? 'Edit habit form' : 'Create new habit form'}
    >
      <h2
        className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 tracking-tight"
        style={{ color: 'var(--text-primary)' }}
      >
        {habit ? 'Edit Habit' : 'New Habit'}
      </h2>

      <div className="space-y-4 sm:space-y-5">
        {/* Name Input */}
        <div>
          <label
            htmlFor="habit-name"
            className="block text-xs font-medium mb-2 uppercase tracking-wider"
            style={{ color: 'var(--text-secondary)' }}
          >
            Habit Name
          </label>
          <input
            id="habit-name"
            data-testid="habit-name-input"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            className="w-full px-4 py-3 rounded-lg border outline-none transition-all text-sm"
            style={{
              background: 'var(--bg-elevated)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-primary)',
            }}
            placeholder="e.g., Morning meditation"
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.boxShadow = '0 0 0 3px var(--focus-ring)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {error && (
            <p className="mt-2 text-sm font-medium" style={{ color: 'var(--danger)' }}>{error}</p>
          )}
        </div>

        {/* Description Input */}
        <div>
          <label
            htmlFor="habit-description"
            className="block text-xs font-medium mb-2 uppercase tracking-wider"
            style={{ color: 'var(--text-secondary)' }}
          >
            Description (Optional)
          </label>
          <textarea
            id="habit-description"
            data-testid="habit-description-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border outline-none transition-all text-sm resize-none"
            style={{
              background: 'var(--bg-elevated)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-primary)',
            }}
            placeholder="Add details about your habit..."
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.boxShadow = '0 0 0 3px var(--focus-ring)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Frequency Select */}
        <div>
          <label
            htmlFor="habit-frequency"
            className="block text-xs font-medium mb-2 uppercase tracking-wider"
            style={{ color: 'var(--text-secondary)' }}
          >
            Frequency
          </label>
          <select
            id="habit-frequency"
            data-testid="habit-frequency-select"
            value="daily"
            disabled
            className="w-full px-4 py-3 rounded-lg border text-sm cursor-not-allowed"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-tertiary)',
            }}
          >
            <option value="daily">Daily</option>
          </select>
          <p className="mt-1.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Only daily habits are supported in this version
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3">
          <button
            type="submit"
            data-testid="habit-save-button"
            className="w-full sm:flex-1 min-h-[44px] px-6 py-3 font-semibold rounded-lg transition-all text-sm"
            style={{
              background: 'var(--accent)',
              color: 'var(--bg-primary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            {habit ? 'Save Changes' : 'Create Habit'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto min-h-[44px] px-6 py-3 font-medium rounded-lg border transition-all text-sm"
            style={{
              background: 'var(--bg-elevated)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-strong)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
