'use client';

import { Habit } from '@/types/habit';
import { getHabitSlug, calculateCurrentStreak } from '@/lib/habits';

interface HabitCardProps {
  habit: Habit;
  onToggleComplete: (habitId: string) => void;
  onEdit: (habitId: string) => void;
  onDelete: (habitId: string) => void;
}

export default function HabitCard({
  habit,
  onToggleComplete,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const slug = getHabitSlug(habit.name);
  const currentStreak = calculateCurrentStreak(habit.completions);
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completions.includes(today);

  return (
    <article
      data-testid={`habit-card-${slug}`}
      className={`relative overflow-hidden rounded-2xl p-4 sm:p-6 transition-all duration-300 ${
        isCompletedToday
          ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-400 shadow-lg shadow-emerald-200/50'
          : 'bg-white border-2 border-gray-300 shadow-md hover:shadow-lg'
      }`}
      style={{
        fontFamily: '"Crimson Pro", Georgia, serif',
      }}
      aria-label={`${habit.name} habit card`}
    >
      {/* Decorative streak badge */}
      {currentStreak > 0 && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
          <div
            data-testid={`habit-streak-${slug}`}
            className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg transform rotate-12"
            aria-label={`Current streak: ${currentStreak} ${currentStreak === 1 ? 'day' : 'days'}`}
          >
            <div className="absolute inset-1 bg-white rounded-full flex flex-col items-center justify-center">
              <span className="text-xl sm:text-2xl font-bold text-amber-600 leading-none">
                {currentStreak}
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-amber-700 uppercase tracking-tight">
                {currentStreak === 1 ? 'day' : 'days'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="pr-16 sm:pr-20">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 tracking-tight">
          {habit.name}
        </h3>
        {habit.description && (
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
            {habit.description}
          </p>
        )}
      </div>

      {/* Action buttons - mobile-first, touch-friendly (min 44x44px) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4">
        {/* Complete button - full width on mobile */}
        <button
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggleComplete(habit.id)}
          className={`w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-lg font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-offset-2 ${
            isCompletedToday
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md hover:shadow-lg focus:ring-emerald-400/50'
              : 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200 focus:ring-gray-400/50'
          }`}
          aria-pressed={isCompletedToday}
          aria-label={isCompletedToday ? `Mark ${habit.name} as incomplete` : `Mark ${habit.name} as complete`}
        >
          {isCompletedToday ? (
            <>
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Completed</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
              </svg>
              <span>Mark Complete</span>
            </>
          )}
        </button>

        {/* Edit and Delete buttons - side by side on mobile */}
        <div className="flex gap-2">
          {/* Edit button - touch-friendly size */}
          <button
            data-testid={`habit-edit-${slug}`}
            onClick={() => onEdit(habit.id)}
            className="flex-1 sm:flex-none min-w-[44px] min-h-[44px] p-3 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 focus:outline-none focus:ring-4 focus:ring-amber-400/50 focus:ring-offset-2 transition-all"
            aria-label={`Edit ${habit.name} habit`}
          >
            <svg
              className="w-5 h-5 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          {/* Delete button - touch-friendly size */}
          <button
            data-testid={`habit-delete-${slug}`}
            onClick={() => onDelete(habit.id)}
            className="flex-1 sm:flex-none min-w-[44px] min-h-[44px] p-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-4 focus:ring-red-400/50 focus:ring-offset-2 transition-all"
            aria-label={`Delete ${habit.name} habit`}
          >
            <svg
              className="w-5 h-5 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
