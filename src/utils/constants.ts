import type { Weekday } from "../types";

export const WEEKDAYS: { value: Weekday; label: string }[] = [
  { value: 0, label: "شنبه" },
  { value: 1, label: "یکشنبه" },
  { value: 2, label: "دوشنبه" },
  { value: 3, label: "سه‌شنبه" },
  { value: 4, label: "چهارشنبه" },
  { value: 5, label: "پنجشنبه" },
  { value: 6, label: "جمعه" },
];

export function weekdayLabel(day: Weekday): string {
  return WEEKDAYS[day]?.label ?? "";
}

// Timeline visible hour range [START_HOUR, END_HOUR)
export const TIMELINE_START_HOUR = 7;
export const TIMELINE_END_HOUR = 22;

// Muted pastel palette cycled per course for its class-block background.
export const COURSE_COLORS = [
  { bg: "#e7edf3", border: "#a9bdd1" }, // dusty blue
  { bg: "#eef0e6", border: "#b7c4a1" }, // sage
  { bg: "#f2e9e4", border: "#cbb2a3" }, // clay
  { bg: "#ece5f0", border: "#bda9c9" }, // muted lavender
  { bg: "#eef1e0", border: "#c1c99a" }, // olive
  { bg: "#e6eef0", border: "#a6c1c7" }, // teal-gray
];

export function courseColor(index: number) {
  return COURSE_COLORS[index % COURSE_COLORS.length];
}
