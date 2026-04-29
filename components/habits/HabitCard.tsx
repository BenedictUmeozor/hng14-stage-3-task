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
      className={`relative overflow-hidden rounded-xl p-4 sm:p-5 border transition-all duration-200`}
      style={{
        background: isCompletedToday ? 'var(--accent-surface)' : 'var(--bg-secondary)',
        borderColor: isCompletedToday ? 'var(--accent-dim)' : 'var(--border-subtle)',
        animation: 'slideUp 0.3s ease-out',
      }}
      aria-label={`${habit.name} habit card`}
    >
      {/* Completed indicator bar */}
      {isCompletedToday && (
        <div
          className="absolute top-0 left-0 w-full h-0.5"
          style={{ background: 'var(--accent)' }}
        />
      )}

      {/* Streak badge */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
        <div
          data-testid={`habit-streak-${slug}`}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold"
          style={{
            background: 'var(--bg-elevated)',
            borderColor: currentStreak > 0 ? 'var(--warning-dim)' : 'var(--border-subtle)',
            color: currentStreak > 0 ? 'var(--warning)' : 'var(--text-tertiary)',
          }}
          aria-label={`Current streak: ${currentStreak} ${currentStreak === 1 ? 'day' : 'days'}`}
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" />
          </svg>
          <span>{currentStreak}</span>
          <span className="font-normal" style={{ color: 'var(--text-tertiary)' }}>
            {currentStreak === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="pr-24 sm:pr-28">
        <h3
          className="text-base sm:text-lg font-semibold mb-1 tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {habit.name}
        </h3>
        {habit.description && (
          <p
            className="text-sm leading-relaxed mb-3"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {habit.description}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4">
        {/* Complete button */}
        <button
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggleComplete(habit.id)}
          className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg font-medium transition-all text-sm border"
          style={{
            background: isCompletedToday ? 'var(--accent)' : 'var(--bg-elevated)',
            color: isCompletedToday ? 'var(--bg-primary)' : 'var(--text-secondary)',
            borderColor: isCompletedToday ? 'var(--accent)' : 'var(--border-default)',
          }}
          aria-pressed={isCompletedToday}
          aria-label={isCompletedToday ? `Mark ${habit.name} as incomplete` : `Mark ${habit.name} as complete`}
          onMouseEnter={(e) => {
            if (isCompletedToday) {
              e.currentTarget.style.opacity = '0.9';
            } else {
              e.currentTarget.style.borderColor = 'var(--border-strong)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
            if (!isCompletedToday) {
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }
          }}
        >
          {isCompletedToday ? (
            <>
              <svg
                className="w-4 h-4"
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
                className="w-4 h-4"
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

        {/* Edit and Delete buttons */}
        <div className="flex gap-2">
          <button
            data-testid={`habit-edit-${slug}`}
            onClick={() => onEdit(habit.id)}
            className="flex-1 sm:flex-none min-w-[44px] min-h-[44px] p-2.5 rounded-lg border transition-all"
            style={{
              background: 'var(--bg-elevated)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-tertiary)',
            }}
            aria-label={`Edit ${habit.name} habit`}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-strong)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.color = 'var(--text-tertiary)';
            }}
          >
            <svg
              className="w-4 h-4 mx-auto"
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

          <button
            data-testid={`habit-delete-${slug}`}
            onClick={() => onDelete(habit.id)}
            className="flex-1 sm:flex-none min-w-[44px] min-h-[44px] p-2.5 rounded-lg border transition-all"
            style={{
              background: 'var(--bg-elevated)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-tertiary)',
            }}
            aria-label={`Delete ${habit.name} habit`}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--danger-dim)';
              e.currentTarget.style.color = 'var(--danger)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.color = 'var(--text-tertiary)';
            }}
          >
            <svg
              className="w-4 h-4 mx-auto"
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
