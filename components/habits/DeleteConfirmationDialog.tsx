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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <div
        className="relative rounded-xl max-w-md w-full p-6 sm:p-7 border"
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-subtle)',
          animation: 'scaleIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning icon */}
        <div className="flex justify-center mb-4">
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center border"
            aria-hidden="true"
            style={{
              background: 'var(--danger-surface)',
              borderColor: 'var(--danger-dim)',
            }}
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: 'var(--danger)' }}
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
        <h2
          id="dialog-title"
          className="text-lg sm:text-xl font-bold text-center mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Delete Habit?
        </h2>

        {/* Message */}
        <p
          id="dialog-description"
          className="text-sm text-center mb-6 leading-relaxed"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Are you sure you want to delete{' '}
          <span className="font-semibold" style={{ color: 'var(--danger)' }}>&quot;{habitName}&quot;</span>?
          This action cannot be undone and all progress will be lost.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCancel}
            className="w-full sm:flex-1 min-h-[44px] px-6 py-3 font-medium rounded-lg border transition-all text-sm"
            style={{
              background: 'var(--bg-elevated)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-secondary)',
            }}
            aria-label="Cancel deletion"
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
          <button
            data-testid="confirm-delete-button"
            onClick={onConfirm}
            className="w-full sm:flex-1 min-h-[44px] px-6 py-3 font-semibold rounded-lg transition-all text-sm"
            style={{
              background: 'var(--danger)',
              color: '#fff',
            }}
            aria-label="Confirm deletion"
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
