import { useMemo, useRef, useState } from "react";
import type { Course } from "./types";
import { useCourses } from "./hooks/useCourses";
import { findClassConflicts, findExamConflicts, conflictedCourseIds } from "./utils/conflicts";
import { buildShareUrl } from "./utils/share";
import { downloadElementAsPng } from "./utils/exportImage";

import { Toolbar } from "./components/Toolbar";
import { Summary } from "./components/Summary";
import { Timeline } from "./components/Timeline";
import { EmptyState } from "./components/EmptyState";
import { CourseFormModal } from "./components/CourseFormModal";
import { CourseDetailModal } from "./components/CourseDetailModal";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { ShareModal } from "./components/ShareModal";
import { Notice } from "./components/Notice";

type ModalState =
  | { type: "none" }
  | { type: "add" }
  | { type: "edit"; course: Course }
  | { type: "detail"; course: Course }
  | { type: "confirmDelete"; course: Course }
  | { type: "confirmClearAll" }
  | { type: "share"; url: string };

export default function App() {
  const {
    courses,
    addCourse,
    updateCourse,
    removeCourse,
    clearAll,
    importedNotice,
    dismissImportedNotice,
  } = useCourses();

  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const classConflicts = useMemo(() => findClassConflicts(courses), [courses]);
  const examConflicts = useMemo(() => findExamConflicts(courses), [courses]);
  const conflictedIds = useMemo(() => conflictedCourseIds(classConflicts), [classConflicts]);

  const totalUnits = useMemo(
    () => courses.reduce((sum, c) => (c.units ? sum + c.units : sum), 0),
    [courses]
  );

  function courseName(id: string): string {
    return courses.find((c) => c.id === id)?.name ?? "";
  }

  function handleShare() {
    setModal({ type: "share", url: buildShareUrl(courses) });
  }

  async function handleExport() {
    if (!exportRef.current) return;
    setExporting(true);
    try {
      await downloadElementAsPng(exportRef.current, "برنامه-هفتگی.png");
    } catch {
      window.alert("متأسفانه ساخت تصویر با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-5xl px-4 py-6 space-y-4">
        {importedNotice && (
          <Notice
            message="یک برنامه اشتراک‌گذاری‌شده بارگذاری شد و جایگزین برنامه قبلی شما شد."
            onDismiss={dismissImportedNotice}
          />
        )}

        <Toolbar
          onAdd={() => setModal({ type: "add" })}
          onShare={handleShare}
          onExport={handleExport}
          onClearAll={() => setModal({ type: "confirmClearAll" })}
          exporting={exporting}
          hasCourses={courses.length > 0}
        />

        <Summary
          courseCount={courses.length}
          totalUnits={totalUnits}
          classConflictCount={classConflicts.length}
          examConflictCount={examConflicts.length}
        />

        {(classConflicts.length > 0 || examConflicts.length > 0) && (
          <div className="space-y-1 rounded-md bg-warn-light border border-warn/20 px-4 py-3 text-xs text-ink/80">
            {classConflicts.map((c, i) => (
              <div key={`cc-${i}`}>
                ⚠️ «{courseName(c.courseIdA)}» با «{courseName(c.courseIdB)}» تداخل کلاسی دارد.
              </div>
            ))}
            {examConflicts.map((c, i) => (
              <div key={`ec-${i}`}>
                ⚠️ امتحان «{courseName(c.courseIdA)}» با «{courseName(c.courseIdB)}» هم‌زمان است.
              </div>
            ))}
          </div>
        )}

        {courses.length === 0 ? (
          <EmptyState onAdd={() => setModal({ type: "add" })} />
        ) : (
          <Timeline
            courses={courses}
            conflictedCourseIds={conflictedIds}
            onSelectCourse={(course) => setModal({ type: "detail", course })}
            exportRef={exportRef}
          />
        )}
      </div>

      {modal.type === "add" && (
        <CourseFormModal
          onSubmit={(course) => {
            addCourse(course);
            setModal({ type: "none" });
          }}
          onClose={() => setModal({ type: "none" })}
        />
      )}

      {modal.type === "edit" && (
        <CourseFormModal
          initialCourse={modal.course}
          onSubmit={(course) => {
            updateCourse(course);
            setModal({ type: "none" });
          }}
          onClose={() => setModal({ type: "none" })}
        />
      )}

      {modal.type === "detail" && (
        <CourseDetailModal
          course={modal.course}
          onEdit={() => setModal({ type: "edit", course: modal.course })}
          onDelete={() => setModal({ type: "confirmDelete", course: modal.course })}
          onClose={() => setModal({ type: "none" })}
        />
      )}

      {modal.type === "confirmDelete" && (
        <ConfirmDialog
          title="حذف درس"
          message={`آیا از حذف «${modal.course.name}» مطمئن هستید؟`}
          confirmLabel="حذف"
          onConfirm={() => {
            removeCourse(modal.course.id);
            setModal({ type: "none" });
          }}
          onCancel={() => setModal({ type: "none" })}
        />
      )}

      {modal.type === "confirmClearAll" && (
        <ConfirmDialog
          title="پاک کردن همه درس‌ها"
          message="این کار همه دروس ثبت‌شده را برای همیشه حذف می‌کند. آیا مطمئن هستید؟"
          confirmLabel="پاک کردن همه"
          onConfirm={() => {
            clearAll();
            setModal({ type: "none" });
          }}
          onCancel={() => setModal({ type: "none" })}
        />
      )}

      {modal.type === "share" && (
        <ShareModal url={modal.url} onClose={() => setModal({ type: "none" })} />
      )}
    </div>
  );
}
