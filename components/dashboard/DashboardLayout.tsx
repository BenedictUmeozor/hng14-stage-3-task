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
      className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50"
      style={{
        fontFamily: '"Crimson Pro", Georgia, serif',
      }}
    >
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Header */}
      <header className="relative border-b-2 border-amber-200/50 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* App branding */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Habit Tracker
              </h1>
            </div>

            {/* Logout button */}
            <button
              data-testid="auth-logout-button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-200 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-400/50 transition-all transform hover:scale-105 active:scale-95"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create habit button - floating action */}
        <div className="mb-8 flex justify-center sm:justify-end">
          <button
            data-testid="create-habit-button"
            onClick={onCreateHabit}
            className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-amber-400/50 transition-all transform hover:scale-105 active:scale-95 overflow-hidden"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            
            <span className="relative flex items-center gap-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Habit
            </span>
          </button>
        </div>

        {/* Children content (habit list or empty state) */}
        <div className="relative">
          {children}
        </div>
      </main>

      {/* Footer decoration */}
      <footer className="relative mt-16 py-8 text-center text-gray-500 text-sm">
        <p className="font-medium">Build better habits, one day at a time</p>
      </footer>
    </div>
  );
}
