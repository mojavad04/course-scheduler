interface NoticeProps {
  message: string;
  onDismiss: () => void;
}

export function Notice({ message, onDismiss }: NoticeProps) {
  return (
    <div className="flex items-center justify-between rounded-md bg-accent-light border border-accent/20 px-4 py-2 text-sm text-ink">
      <span>{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="بستن پیام"
        className="text-ink/50 hover:text-ink px-2"
      >
        ×
      </button>
    </div>
  );
}
