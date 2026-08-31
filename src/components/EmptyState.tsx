interface EmptyStateProps {
  onAdd: () => void;
}

export function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-line py-20 text-center">
      <p className="text-sm text-ink/60">هنوز درسی اضافه نکرده‌اید.</p>
      <button
        type="button"
        onClick={onAdd}
        className="rounded-md bg-accent px-5 py-2.5 text-sm text-white hover:opacity-90"
      >
        + افزودن درس
      </button>
    </div>
  );
}
