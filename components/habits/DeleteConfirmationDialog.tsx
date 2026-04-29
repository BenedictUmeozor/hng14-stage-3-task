'use client';

interface DeleteConfirmationDialogProps {
  habitName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmationDialog({
  habitName,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <div
        className="relative bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 border-2 border-red-200 animate-scaleIn"
        style={{
          fontFamily: '"Crimson Pro", Georgia, serif',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg" aria-hidden="true">
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 id="dialog-title" className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-3">
          Delete Habit?
        </h2>

        {/* Message */}
        <p id="dialog-description" className="text-sm sm:text-base text-gray-700 text-center mb-6 leading-relaxed">
          Are you sure you want to delete{' '}
          <span className="font-bold text-red-700">&quot;{habitName}&quot;</span>?
          This action cannot be undone and all progress will be lost.
        </p>

        {/* Action buttons - full width on mobile, touch-friendly */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCancel}
            className="w-full sm:flex-1 min-h-[44px] px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-400/50 focus:ring-offset-2 transition-all"
            aria-label="Cancel deletion"
          >
            Cancel
          </button>
          <button
            data-testid="confirm-delete-button"
            onClick={onConfirm}
            className="w-full sm:flex-1 min-h-[44px] px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:from-red-600 hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-red-400/50 focus:ring-offset-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            aria-label="Confirm deletion"
          >
            Delete
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
