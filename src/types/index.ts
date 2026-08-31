export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=شنبه ... 6=جمعه

export interface Session {
  day: Weekday;
  startTime: string; // "HH:MM" 24h
  endTime: string; // "HH:MM" 24h
}

export interface Exam {
  date: string; // Jalali date, standardized as "YYYY/MM/DD"
  time: string; // "HH:MM" 24h
}

export interface Course {
  id: string;
  name: string;
  units?: number;
  sessions: Session[]; // length 1 or 2
  exam?: Exam;
}

export interface ClassConflictPair {
  courseIdA: string;
  courseIdB: string;
}

export interface ExamConflictPair {
  courseIdA: string;
  courseIdB: string;
}
