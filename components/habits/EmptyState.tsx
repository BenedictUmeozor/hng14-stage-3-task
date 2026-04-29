'use client';

interface EmptyStateProps {
  onCreateHabit: () => void;
}

export default function EmptyState({ onCreateHabit }: EmptyStateProps) {
  return (
    <div
      data-testid="empty-state"
      className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] p-6 sm:p-8 text-center"
      style={{
        fontFamily: '"Crimson Pro", Georgia, serif',
      }}
      role="status"
      aria-label="No habits created yet"
    >
      {/* Illustration */}
      <div className="relative mb-6 sm:mb-8">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-amber-200 via-orange-200 to-rose-200 rounded-full flex items-center justify-center shadow-xl">
          <svg
            className="w-12 h-12 sm:w-16 sm:h-16 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>
        {/* Decorative dots */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-400 rounded-full animate-pulse" aria-hidden="true" />
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-orange-400 rounded-full animate-pulse delay-150" aria-hidden="true" />
      </div>

      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
        No Habits Yet
      </h2>

      {/* Description */}
      <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-md leading-relaxed px-4">
        Start building better habits today. Create your first habit and begin
        tracking your progress toward a better you.
      </p>

      {/* Call to action button - full width on mobile, touch-friendly */}
      <button
        onClick={onCreateHabit}
        className="group relative w-full sm:w-auto min-h-[44px] px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-amber-400/50 focus:ring-offset-2 transition-all transform hover:scale-105 active:scale-95 overflow-hidden"
        aria-label="Create your first habit"
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        
        <span className="relative flex items-center justify-center gap-2">
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
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
        </span>
      </button>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </div>
  );
}
