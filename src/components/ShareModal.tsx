import { useState } from "react";
import { Modal } from "./Modal";

interface ShareModalProps {
  url: string;
  onClose: () => void;
}

export function ShareModal({ url, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable; user can copy manually from the field.
    }
  }

  return (
    <Modal title="اشتراک‌گذاری برنامه" onClose={onClose}>
      <p className="mb-3 text-xs text-ink/60">
        این لینک شامل اطلاعات دروس شماست. هر کسی که آن را باز کند، همین برنامه را می‌بیند.
      </p>
      <div className="flex gap-2">
        <input
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-xs text-ink"
          dir="ltr"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-md bg-accent px-4 py-2 text-sm text-white hover:opacity-90"
        >
          {copied ? "کپی شد" : "کپی"}
        </button>
      </div>
    </Modal>
  );
}
