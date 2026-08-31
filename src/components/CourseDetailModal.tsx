import { Modal } from "./Modal";
import type { Course } from "../types";
import { weekdayLabel } from "../utils/constants";
import { formatTimePersian } from "../utils/time";
import { formatJalaliPersian } from "../utils/jalali";
import { toPersianDigits } from "../utils/persianDigits";

interface CourseDetailModalProps {
  course: Course;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function CourseDetailModal({ course, onEdit, onDelete, onClose }: CourseDetailModalProps) {
  return (
    <Modal title={course.name} onClose={onClose}>
      <dl className="space-y-3 text-sm">
        {course.units !== undefined && (
          <div className="flex justify-between">
            <dt className="text-ink/60">تعداد واحد</dt>
            <dd>{toPersianDigits(course.units)}</dd>
          </div>
        )}
        {course.sessions.map((s, idx) => (
          <div key={idx} className="flex justify-between">
            <dt className="text-ink/60">{idx === 0 ? "جلسه اول" : "جلسه دوم"}</dt>
            <dd>
              {weekdayLabel(s.day)} {formatTimePersian(s.startTime)} تا{" "}
              {formatTimePersian(s.endTime)}
            </dd>
          </div>
        ))}
        {course.exam && (
          <div className="flex justify-between">
            <dt className="text-ink/60">امتحان</dt>
            <dd>
              {formatJalaliPersian(course.exam.date)} ساعت {formatTimePersian(course.exam.time)}
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onDelete}
          className="rounded-md border border-warn/40 px-4 py-2 text-sm text-warn hover:bg-warn-light"
        >
          حذف
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-md bg-accent px-4 py-2 text-sm text-white hover:opacity-90"
        >
          ویرایش
        </button>
      </div>
    </Modal>
  );
}
