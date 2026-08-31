interface ToolbarProps {
  onAdd: () => void;
  onShare: () => void;
  onExport: () => void;
  onClearAll: () => void;
  exporting: boolean;
  hasCourses: boolean;
}

export function Toolbar({ onAdd, onShare, onExport, onClearAll, exporting, hasCourses }: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onAdd}
        className="rounded-md bg-accent px-4 py-2 text-sm text-white hover:opacity-90"
      >
        + افزودن درس
      </button>
      <button
        type="button"
        onClick={onShare}
        disabled={!hasCourses}
        className="rounded-md border border-line px-4 py-2 text-sm text-ink hover:bg-black/5 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        اشتراک‌گذاری برنامه
      </button>
      <button
        type="button"
        onClick={onExport}
        disabled={!hasCourses || exporting}
        className="rounded-md border border-line px-4 py-2 text-sm text-ink hover:bg-black/5 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {exporting ? "در حال آماده‌سازی…" : "دانلود تصویر برنامه"}
      </button>
      {hasCourses && (
        <button
          type="button"
          onClick={onClearAll}
          className="rounded-md px-4 py-2 text-sm text-warn hover:bg-warn-light"
        >
          پاک کردن همه درس‌ها
        </button>
      )}
    </div>
  );
}
