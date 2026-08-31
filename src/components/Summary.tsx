import { toPersianDigits } from "../utils/persianDigits";

interface SummaryProps {
  courseCount: number;
  totalUnits: number;
  classConflictCount: number;
  examConflictCount: number;
}

export function Summary({
  courseCount,
  totalUnits,
  classConflictCount,
  examConflictCount,
}: SummaryProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink/80">
      <span>{toPersianDigits(courseCount)} درس</span>
      <span className="text-ink/30">|</span>
      <span>{toPersianDigits(totalUnits)} واحد</span>
      <span className="text-ink/30">|</span>
      <span className={classConflictCount > 0 ? "text-warn font-medium" : ""}>
        {toPersianDigits(classConflictCount)} تداخل کلاس
      </span>
      <span className="text-ink/30">|</span>
      <span className={examConflictCount > 0 ? "text-warn font-medium" : ""}>
        {toPersianDigits(examConflictCount)} تداخل امتحان
      </span>
    </div>
  );
}
