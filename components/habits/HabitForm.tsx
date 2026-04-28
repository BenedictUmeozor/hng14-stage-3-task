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
      className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-8 rounded-2xl shadow-2xl border-2 border-amber-200"
      style={{
        fontFamily: '"Crimson Pro", Georgia, serif',
      }}
    >
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-400/20 to-transparent rounded-bl-full" />
      
      <h2 className="text-3xl font-bold text-amber-900 mb-6 tracking-tight">
        {habit ? 'Edit Habit' : 'New Habit'}
      </h2>

      <div className="space-y-6">
        {/* Name Input */}
        <div>
          <label
            htmlFor="habit-name"
            className="block text-sm font-semibold text-amber-800 mb-2 uppercase tracking-wider"
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
            className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-amber-400/50 focus:border-amber-500 transition-all text-lg text-gray-900"
            placeholder="e.g., Morning meditation"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
          )}
        </div>

        {/* Description Input */}
        <div>
          <label
            htmlFor="habit-description"
            className="block text-sm font-semibold text-amber-800 mb-2 uppercase tracking-wider"
          >
            Description (Optional)
          </label>
          <textarea
            id="habit-description"
            data-testid="habit-description-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-amber-400/50 focus:border-amber-500 transition-all text-lg text-gray-900 resize-none"
            placeholder="Add details about your habit..."
          />
        </div>

        {/* Frequency Select */}
        <div>
          <label
            htmlFor="habit-frequency"
            className="block text-sm font-semibold text-amber-800 mb-2 uppercase tracking-wider"
          >
            Frequency
          </label>
          <select
            id="habit-frequency"
            data-testid="habit-frequency-select"
            value="daily"
            disabled
            className="w-full px-4 py-3 bg-amber-100 border-2 border-amber-300 rounded-lg text-lg text-gray-700 cursor-not-allowed"
          >
            <option value="daily">Daily</option>
          </select>
          <p className="mt-1 text-xs text-amber-700 italic">
            Only daily habits are supported in this version
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            data-testid="habit-save-button"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-amber-400/50 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {habit ? 'Save Changes' : 'Create Habit'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-white text-amber-800 font-semibold rounded-lg border-2 border-amber-300 hover:bg-amber-50 focus:outline-none focus:ring-4 focus:ring-amber-400/50 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
