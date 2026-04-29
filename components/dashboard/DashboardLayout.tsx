'use client';

import { clearSession } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onCreateHabit?: () => void;
}

export default function DashboardLayout({ children, onCreateHabit }: DashboardLayoutProps) {
  const router = useRouter();

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  return (
    <div
      data-testid="dashboard-page"
      className="min-h-screen"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Header */}
      <header
        className="border-b sticky top-0 z-40"
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-3">
            {/* App branding */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center border"
                style={{
                  background: 'var(--bg-elevated)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <svg
                  className="w-5 h-5 sm:w-5.5 sm:h-5.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  style={{ color: 'var(--accent)' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h1
                className="text-lg sm:text-xl font-bold tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                Habit Tracker
              </h1>
            </div>

            {/* Logout button */}
            <button
              data-testid="auth-logout-button"
              onClick={handleLogout}
              className="flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-lg border transition-all text-sm font-medium"
              style={{
                background: 'var(--bg-elevated)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-secondary)',
              }}
              aria-label="Logout from account"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-strong)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Create habit button */}
        <div className="mb-6 sm:mb-8">
          <button
            data-testid="create-habit-button"
            onClick={onCreateHabit}
            className="w-full sm:w-auto sm:float-right min-h-[44px] px-5 sm:px-6 py-3 font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2"
            style={{
              background: 'var(--accent)',
              color: 'var(--bg-primary)',
            }}
            aria-label="Create a new habit"
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
            Create New Habit
          </button>
        </div>

        {/* Children content (habit list or empty state) */}
        <div className="relative clear-both">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative mt-16 py-8 text-center text-sm" style={{ color: 'var(--text-tertiary)' }}>
        <p className="font-medium">Build better habits, one day at a time</p>
      </footer>
    </div>
  );
}
