import { isValidTime, parseTimeToMinutes } from "./time";
import { isValidJalaliDate } from "./jalali";
import { toLatinDigits } from "./persianDigits";

export interface CourseFormValues {
  name: string;
  units: string; // raw text input, optional
  session1Day: number;
  session1Start: string;
  session1End: string;
  hasSession2: boolean;
  session2Day: number;
  session2Start: string;
  session2End: string;
  hasExam: boolean;
  examYear: string;
  examMonth: string;
  examDay: string;
  examTime: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<string, string>>;
}

export function validateCourseForm(values: CourseFormValues): ValidationResult {
  const errors: Partial<Record<string, string>> = {};

  if (!values.name.trim()) {
    errors.name = "نام درس نمی‌تواند خالی باشد.";
  }

  if (values.units.trim()) {
    const unitsNormalized = toLatinDigits(values.units.trim());
    const unitsNum = Number(unitsNormalized);
    if (!Number.isFinite(unitsNum) || unitsNum <= 0) {
      errors.units = "تعداد واحد باید عددی معتبر و بزرگ‌تر از صفر باشد.";
    }
  }

  // Session 1 (required)
  if (!isValidTime(values.session1Start) || !isValidTime(values.session1End)) {
    errors.session1 = "ساعت‌های جلسه اول معتبر نیست.";
  } else {
    const start = parseTimeToMinutes(values.session1Start)!;
    const end = parseTimeToMinutes(values.session1End)!;
    if (end <= start) {
      errors.session1 = "ساعت پایان جلسه اول باید بعد از ساعت شروع باشد.";
    }
  }

  // Session 2 (optional, but if enabled must be complete & valid)
  if (values.hasSession2) {
    if (!isValidTime(values.session2Start) || !isValidTime(values.session2End)) {
      errors.session2 = "ساعت‌های جلسه دوم معتبر نیست.";
    } else {
      const start = parseTimeToMinutes(values.session2Start)!;
      const end = parseTimeToMinutes(values.session2End)!;
      if (end <= start) {
        errors.session2 = "ساعت پایان جلسه دوم باید بعد از ساعت شروع باشد.";
      }
    }
  }

  // Exam (optional, but if any field filled, must be complete & valid)
  if (values.hasExam) {
    const yearRaw = toLatinDigits(values.examYear.trim());
    const monthRaw = toLatinDigits(values.examMonth.trim());
    const dayRaw = toLatinDigits(values.examDay.trim());
    const dateProvided = yearRaw || monthRaw || dayRaw;
    const timeProvided = values.examTime.trim().length > 0;

    if (dateProvided && !timeProvided) {
      errors.exam = "برای امتحان، تاریخ وارد شده اما ساعت امتحان مشخص نشده است.";
    } else if (timeProvided && !dateProvided) {
      errors.exam = "برای امتحان، ساعت وارد شده اما تاریخ امتحان مشخص نشده است.";
    } else if (dateProvided && timeProvided) {
      const jy = Number(yearRaw);
      const jm = Number(monthRaw);
      const jd = Number(dayRaw);
      if (!isValidJalaliDate(jy, jm, jd)) {
        errors.exam = "تاریخ امتحان معتبر نیست.";
      } else if (!isValidTime(values.examTime)) {
        errors.exam = "ساعت امتحان معتبر نیست.";
      }
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
