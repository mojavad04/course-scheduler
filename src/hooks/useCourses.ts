import { useEffect, useRef, useState } from "react";
import type { Course } from "../types";
import { loadCourses, saveCourses } from "../utils/storage";
import { readSharedCoursesFromLocation, clearShareParamFromLocation } from "../utils/share";

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>(() => loadCourses());
  const [importedNotice, setImportedNotice] = useState(false);
  const didImport = useRef(false);

  // On first mount, check whether the URL carries a shared plan and import it.
  useEffect(() => {
    if (didImport.current) return;
    didImport.current = true;
    const shared = readSharedCoursesFromLocation();
    if (shared) {
      setCourses(shared);
      clearShareParamFromLocation();
      setImportedNotice(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    saveCourses(courses);
  }, [courses]);

  function addCourse(course: Course) {
    setCourses((prev) => [...prev, course]);
  }

  function updateCourse(course: Course) {
    setCourses((prev) => prev.map((c) => (c.id === course.id ? course : c)));
  }

  function removeCourse(id: string) {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  }

  function clearAll() {
    setCourses([]);
  }

  return {
    courses,
    addCourse,
    updateCourse,
    removeCourse,
    clearAll,
    importedNotice,
    dismissImportedNotice: () => setImportedNotice(false),
  };
}
