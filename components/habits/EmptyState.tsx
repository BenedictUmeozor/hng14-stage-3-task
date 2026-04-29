'use client';

interface EmptyStateProps {
  onCreateHabit: () => void;
}

export default function EmptyState({ onCreateHabit }: EmptyStateProps) {
  return (
    <div
      data-testid="empty-state"
      className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] p-6 sm:p-8 text-center"
      role="status"
      aria-label="No habits created yet"
      style={{ animation: 'fadeIn 0.4s ease-out' }}
    >
      {/* Illustration */}
      <div className="relative mb-6 sm:mb-8">
        <div
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center border"
          style={{
            background: 'var(--bg-elevated)',
            borderColor: 'var(--border-default)',
          }}
        >
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>
        {/* Decorative dots */}
        <div
          className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full"
          aria-hidden="true"
          style={{
            background: 'var(--accent)',
            animation: 'subtlePulse 2s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -bottom-1.5 -left-1.5 w-2 h-2 rounded-full"
          aria-hidden="true"
          style={{
            background: 'var(--border-strong)',
            animation: 'subtlePulse 2s ease-in-out 0.5s infinite',
          }}
        />
      </div>

      {/* Heading */}
      <h2
        className="text-xl sm:text-2xl font-bold mb-2 tracking-tight"
        style={{ color: 'var(--text-primary)' }}
      >
        No Habits Yet
      </h2>

      {/* Description */}
      <p
        className="text-sm sm:text-base mb-6 sm:mb-8 max-w-sm leading-relaxed px-4"
        style={{ color: 'var(--text-tertiary)' }}
      >
        Start building better habits today. Create your first habit and begin
        tracking your progress toward a better you.
      </p>

      {/* Call to action button */}
      <button
        onClick={onCreateHabit}
        className="w-full sm:w-auto min-h-[44px] px-6 sm:px-8 py-3 font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2"
        style={{
          background: 'var(--accent)',
          color: 'var(--bg-primary)',
        }}
        aria-label="Create your first habit"
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.9';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Create Your First Habit
      </button>
    </div>
  );
}
