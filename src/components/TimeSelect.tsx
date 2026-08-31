import { toPersianDigits } from "../utils/persianDigits";

interface TimeSelectProps {
  label: string;
  value: string; // "HH:MM" or ""
  onChange: (value: string) => void;
  id: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5); // 0,5,...,55

export function TimeSelect({ label, value, onChange, id }: TimeSelectProps) {
  const [h, m] = value.includes(":") ? value.split(":") : ["", ""];

  function update(nextH: string, nextM: string) {
    if (nextH === "" || nextM === "") {
      onChange("");
      return;
    }
    onChange(`${nextH.padStart(2, "0")}:${nextM.padStart(2, "0")}`);
  }

  return (
    <div>
      <label className="block text-xs text-ink/70 mb-1" htmlFor={`${id}-hour`}>
        {label}
      </label>
      <div className="flex gap-1.5">
        <select
          id={`${id}-hour`}
          value={h}
          onChange={(e) => update(e.target.value, m || "00")}
          className="w-full min-w-0 rounded-md border border-line bg-white px-1.5 py-2 text-xs sm:text-sm text-ink"
          aria-label={`${label} - ساعت`}
        >
          <option value="">ساعت</option>
          {HOURS.map((hour) => (
            <option key={hour} value={String(hour).padStart(2, "0")}>
              {toPersianDigits(String(hour).padStart(2, "0"))}
            </option>
          ))}
        </select>
        <select
          value={m}
          onChange={(e) => update(h || "00", e.target.value)}
          className="w-full min-w-0 rounded-md border border-line bg-white px-1.5 py-2 text-xs sm:text-sm text-ink"
          aria-label={`${label} - دقیقه`}
        >
          <option value="">دقیقه</option>
          {MINUTES.map((min) => (
            <option key={min} value={String(min).padStart(2, "0")}>
              {toPersianDigits(String(min).padStart(2, "0"))}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
