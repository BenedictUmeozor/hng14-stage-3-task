'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getHabits, saveHabit, deleteHabit, toggleHabitCompletion } from '@/lib/habits';
import { Habit } from '@/types/habit';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import EmptyState from '@/components/habits/EmptyState';
import HabitCard from '@/components/habits/HabitCard';
import HabitForm from '@/components/habits/HabitForm';
import DeleteConfirmationDialog from '@/components/habits/DeleteConfirmationDialog';

export default function DashboardPage() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
  const [deletingHabit, setDeletingHabit] = useState<Habit | undefined>(undefined);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // Check for session
    const session = getSession();
    
    if (!session) {
      router.push('/login');
      return;
    }

    setUserId(session.userId);
    
    // Load habits for current user
    const userHabits = getHabits(session.userId);
    setHabits(userHabits);
    setLoading(false);
  }, [router]);

  const handleCreateHabit = () => {
    setEditingHabit(undefined);
    setShowForm(true);
  };

  const handleEditHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
      setEditingHabit(habit);
      setShowForm(true);
    }
  };

  const handleSaveHabit = (habit: Habit) => {
    // Set userId if creating new habit
    const habitToSave = habit.userId ? habit : { ...habit, userId };
    
    // Save to localStorage
    saveHabit(habitToSave);
    
    // Update local state
    const updatedHabits = getHabits(userId);
    setHabits(updatedHabits);
    
    // Close form
    setShowForm(false);
    setEditingHabit(undefined);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingHabit(undefined);
  };

  const handleDeleteHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
      setDeletingHabit(habit);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingHabit) {
      // Delete from localStorage
      deleteHabit(deletingHabit.id);
      
      // Update local state
      const updatedHabits = getHabits(userId);
      setHabits(updatedHabits);
      
      // Close dialog
      setDeletingHabit(undefined);
    }
  };

  const handleCancelDelete = () => {
    setDeletingHabit(undefined);
  };

  const handleToggleComplete = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const today = new Date().toISOString().split('T')[0];
    const updatedHabit = toggleHabitCompletion(habit, today);
    
    // Save to localStorage
    saveHabit(updatedHabit);
    
    // Update local state
    const updatedHabits = getHabits(userId);
    setHabits(updatedHabits);
  };

  if (loading) {
    return (
      <DashboardLayout onCreateHabit={handleCreateHabit}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div
              className="w-12 h-12 border-2 border-t-transparent rounded-full mx-auto mb-4"
              style={{
                borderColor: 'var(--border-default)',
                borderTopColor: 'transparent',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>Loading your habits...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout onCreateHabit={handleCreateHabit}>
      {/* Habit Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleCancelForm}
        >
          <div
            className="max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <HabitForm
              habit={editingHabit}
              onSave={handleSaveHabit}
              onCancel={handleCancelForm}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingHabit && (
        <DeleteConfirmationDialog
          habitName={deletingHabit.name}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {/* Habit List or Empty State */}
      {habits.length === 0 ? (
        <EmptyState onCreateHabit={handleCreateHabit} />
      ) : (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditHabit}
              onDelete={handleDeleteHabit}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
