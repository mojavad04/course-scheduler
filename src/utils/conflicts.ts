import type { Course, ClassConflictPair, ExamConflictPair } from "../types";
import { parseTimeToMinutes, rangesOverlap } from "./time";

/** Finds all pairs of courses whose class sessions overlap. */
export function findClassConflicts(courses: Course[]): ClassConflictPair[] {
  const conflicts: ClassConflictPair[] = [];

  for (let i = 0; i < courses.length; i++) {
    for (let j = i + 1; j < courses.length; j++) {
      const courseA = courses[i];
      const courseB = courses[j];
      let hasOverlap = false;

      for (const sessionA of courseA.sessions) {
        for (const sessionB of courseB.sessions) {
          if (sessionA.day !== sessionB.day) continue;
          const startA = parseTimeToMinutes(sessionA.startTime);
          const endA = parseTimeToMinutes(sessionA.endTime);
          const startB = parseTimeToMinutes(sessionB.startTime);
          const endB = parseTimeToMinutes(sessionB.endTime);
          if (startA === null || endA === null || startB === null || endB === null) continue;
          if (rangesOverlap(startA, endA, startB, endB)) {
            hasOverlap = true;
          }
        }
      }

      if (hasOverlap) {
        conflicts.push({ courseIdA: courseA.id, courseIdB: courseB.id });
      }
    }
  }

  return conflicts;
}

/** Finds all pairs of courses with an exam on the same date and time. */
export function findExamConflicts(courses: Course[]): ExamConflictPair[] {
  const conflicts: ExamConflictPair[] = [];
  const withExams = courses.filter((c) => c.exam && c.exam.date && c.exam.time);

  for (let i = 0; i < withExams.length; i++) {
    for (let j = i + 1; j < withExams.length; j++) {
      const a = withExams[i];
      const b = withExams[j];
      if (a.exam!.date === b.exam!.date && a.exam!.time === b.exam!.time) {
        conflicts.push({ courseIdA: a.id, courseIdB: b.id });
      }
    }
  }

  return conflicts;
}

/** Returns the set of course IDs involved in at least one class conflict. */
export function conflictedCourseIds(conflicts: ClassConflictPair[]): Set<string> {
  const ids = new Set<string>();
  for (const c of conflicts) {
    ids.add(c.courseIdA);
    ids.add(c.courseIdB);
  }
  return ids;
}
