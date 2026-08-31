import { toPersianDigits } from "../utils/persianDigits";
import { PERSIAN_MONTHS, jalaliMonthLength, todayJalali } from "../utils/jalali";

interface JalaliDateSelectProps {
  year: string;
  month: string;
  day: string;
  onChange: (year: string, month: string, day: string) => void;
  idPrefix: string;
}

export function JalaliDateSelect({
  year,
  month,
  day,
  onChange,
  idPrefix,
}: JalaliDateSelectProps) {
  const today = todayJalali();
  const yearOptions = Array.from({ length: 5 }, (_, i) => today.jy - 1 + i);
  const monthNum = Number(month) || 0;
  const yearNum = Number(year) || today.jy;
  const dayCount = monthNum >= 1 && monthNum <= 12 ? jalaliMonthLength(yearNum, monthNum) : 31;
  const dayOptions = Array.from({ length: dayCount }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-3 gap-1">
      <div>
        <label className="block text-xs text-ink/70 mb-1" htmlFor={`${idPrefix}-year`}>
          سال
        </label>
        <select
          id={`${idPrefix}-year`}
          value={year}
          onChange={(e) => onChange(e.target.value, month, day)}
          className="w-full rounded-md border border-line bg-white px-2 py-2 text-sm text-ink"
        >
          <option value="">سال</option>
          {yearOptions.map((y) => (
            <option key={y} value={String(y)}>
              {toPersianDigits(y)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs text-ink/70 mb-1" htmlFor={`${idPrefix}-month`}>
          ماه
        </label>
        <select
          id={`${idPrefix}-month`}
          value={month}
          onChange={(e) => onChange(year, e.target.value, day)}
          className="w-full rounded-md border border-line bg-white px-2 py-2 text-sm text-ink"
        >
          <option value="">ماه</option>
          {PERSIAN_MONTHS.map((name, idx) => (
            <option key={name} value={String(idx + 1)}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs text-ink/70 mb-1" htmlFor={`${idPrefix}-day`}>
          روز
        </label>
        <select
          id={`${idPrefix}-day`}
          value={day}
          onChange={(e) => onChange(year, month, e.target.value)}
          className="w-full rounded-md border border-line bg-white px-2 py-2 text-sm text-ink"
        >
          <option value="">روز</option>
          {dayOptions.map((d) => (
            <option key={d} value={String(d)}>
              {toPersianDigits(d)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
