import type { Course } from "../types";

const STORAGE_KEY = "course-scheduler:courses:v1";

/** Loads courses from localStorage. Returns an empty array on any error. */
export function loadCourses(): Course[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidCourseShape);
  } catch {
    return [];
  }
}

/** Persists courses to localStorage. Fails silently (e.g. storage full/blocked). */
export function saveCourses(courses: Course[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  } catch {
    // Ignore write failures (private mode, quota exceeded, etc.)
  }
}

function isValidCourseShape(value: unknown): value is Course {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.name === "string" &&
    Array.isArray(v.sessions)
  );
}
