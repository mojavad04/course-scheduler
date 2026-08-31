import { useState } from "react";
import type { Course, Weekday } from "../types";
import { Modal } from "./Modal";
import { TimeSelect } from "./TimeSelect";
import { JalaliDateSelect } from "./JalaliDateSelect";
import { WEEKDAYS } from "../utils/constants";
import { validateCourseForm, type CourseFormValues } from "../utils/validation";
import { toStandardDateString } from "../utils/jalali";
import { toLatinDigits } from "../utils/persianDigits";

interface CourseFormModalProps {
  initialCourse?: Course;
  onSubmit: (course: Course) => void;
  onClose: () => void;
}

function courseToFormValues(course?: Course): CourseFormValues {
  const s1 = course?.sessions[0];
  const s2 = course?.sessions[1];
  const examParts = course?.exam?.date.split("/") ?? ["", "", ""];
  return {
    name: course?.name ?? "",
    units: course?.units !== undefined ? String(course.units) : "",
    session1Day: s1?.day ?? 0,
    session1Start: s1?.startTime ?? "",
    session1End: s1?.endTime ?? "",
    hasSession2: !!s2,
    session2Day: s2?.day ?? 0,
    session2Start: s2?.startTime ?? "",
    session2End: s2?.endTime ?? "",
    hasExam: !!course?.exam,
    examYear: examParts[0] ?? "",
    examMonth: String(Number(examParts[1]) || "") ?? "",
    examDay: String(Number(examParts[2]) || "") ?? "",
    examTime: course?.exam?.time ?? "",
  };
}

export function CourseFormModal({ initialCourse, onSubmit, onClose }: CourseFormModalProps) {
  const [values, setValues] = useState<CourseFormValues>(() => courseToFormValues(initialCourse));
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  function set<K extends keyof CourseFormValues>(key: K, value: CourseFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = validateCourseForm(values);
    setErrors(result.errors);
    if (!result.valid) return;

    const course: Course = {
      id: initialCourse?.id ?? crypto.randomUUID(),
      name: values.name.trim(),
      units: values.units.trim() ? Number(toLatinDigits(values.units.trim())) : undefined,
      sessions: [
        {
          day: values.session1Day as Weekday,
          startTime: values.session1Start,
          endTime: values.session1End,
        },
        ...(values.hasSession2
          ? [
              {
                day: values.session2Day as Weekday,
                startTime: values.session2Start,
                endTime: values.session2End,
              },
            ]
          : []),
      ],
      exam:
        values.hasExam && values.examYear && values.examMonth && values.examDay && values.examTime
          ? {
              date: toStandardDateString(
                Number(toLatinDigits(values.examYear)),
                Number(toLatinDigits(values.examMonth)),
                Number(toLatinDigits(values.examDay))
              ),
              time: values.examTime,
            }
          : undefined,
    };

    onSubmit(course);
  }

  return (
    <Modal title={initialCourse ? "ویرایش درس" : "افزودن درس"} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-xs text-ink/70 mb-1" htmlFor="course-name">
            نام درس
          </label>
          <input
            id="course-name"
            type="text"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink"
            placeholder="مثلاً ریاضی عمومی ۱"
          />
          {errors.name && <p className="mt-1 text-xs text-warn">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-xs text-ink/70 mb-1" htmlFor="course-units">
            تعداد واحد (اختیاری)
          </label>
          <input
            id="course-units"
            type="text"
            inputMode="numeric"
            value={values.units}
            onChange={(e) => set("units", e.target.value)}
            className="w-full max-w-[8rem] rounded-md border border-line bg-white px-3 py-2 text-sm text-ink"
            placeholder="مثلاً ۳"
          />
          {errors.units && <p className="mt-1 text-xs text-warn">{errors.units}</p>}
        </div>

        <fieldset className="rounded-md border border-line p-3">
          <legend className="px-1 text-xs font-medium text-ink/80">جلسه اول</legend>
          <div className="space-y-2">
            <div>
              <label className="block text-xs text-ink/70 mb-1" htmlFor="s1-day">
                روز
              </label>
              <select
                id="s1-day"
                value={values.session1Day}
                onChange={(e) => set("session1Day", Number(e.target.value) as Weekday)}
                className="w-full rounded-md border border-line bg-white px-2 py-2 text-sm text-ink"
              >
                {WEEKDAYS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <TimeSelect
                id="s1-start"
                label="شروع"
                value={values.session1Start}
                onChange={(v) => set("session1Start", v)}
              />
              <TimeSelect
                id="s1-end"
                label="پایان"
                value={values.session1End}
                onChange={(v) => set("session1End", v)}
              />
            </div>
          </div>
          {errors.session1 && <p className="mt-2 text-xs text-warn">{errors.session1}</p>}
        </fieldset>

        {!values.hasSession2 ? (
          <div>
            <button
              type="button"
              onClick={() => set("hasSession2", true)}
              className="text-sm text-accent hover:underline"
            >
              + افزودن جلسه دوم
            </button>
          </div>
        ) : (
          <fieldset className="rounded-md border border-line p-3">
            <div className="mb-2 flex items-center justify-between">
              <legend className="px-1 text-xs font-medium text-ink/80">جلسه دوم</legend>
              <button
                type="button"
                onClick={() => set("hasSession2", false)}
                className="text-xs text-warn hover:underline"
              >
                حذف جلسه دوم
              </button>
            </div>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-ink/70 mb-1" htmlFor="s2-day">
                  روز
                </label>
                <select
                  id="s2-day"
                  value={values.session2Day}
                  onChange={(e) => set("session2Day", Number(e.target.value) as Weekday)}
                  className="w-full rounded-md border border-line bg-white px-2 py-2 text-sm text-ink"
                >
                  {WEEKDAYS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <TimeSelect
                  id="s2-start"
                  label="شروع"
                  value={values.session2Start}
                  onChange={(v) => set("session2Start", v)}
                />
                <TimeSelect
                  id="s2-end"
                  label="پایان"
                  value={values.session2End}
                  onChange={(v) => set("session2End", v)}
                />
              </div>
            </div>
            {errors.session2 && <p className="mt-2 text-xs text-warn">{errors.session2}</p>}
          </fieldset>
        )}

        {!values.hasExam ? (
          <div>
            <button
              type="button"
              onClick={() => set("hasExam", true)}
              className="text-sm text-accent hover:underline"
            >
              + افزودن اطلاعات امتحان
            </button>
          </div>
        ) : (
          <fieldset className="rounded-md border border-line p-3">
            <div className="mb-2 flex items-center justify-between">
              <legend className="px-1 text-xs font-medium text-ink/80">امتحان (اختیاری)</legend>
              <button
                type="button"
                onClick={() => {
                  set("hasExam", false);
                  set("examYear", "");
                  set("examMonth", "");
                  set("examDay", "");
                  set("examTime", "");
                }}
                className="text-xs text-warn hover:underline"
              >
                حذف امتحان
              </button>
            </div>
            <div className="space-y-2">
              <JalaliDateSelect
                idPrefix="exam-date"
                year={values.examYear}
                month={values.examMonth}
                day={values.examDay}
                onChange={(y, m, d) => {
                  set("examYear", y);
                  set("examMonth", m);
                  set("examDay", d);
                }}
              />
              <div className="max-w-[12rem]">
                <TimeSelect
                  id="exam-time"
                  label="ساعت امتحان"
                  value={values.examTime}
                  onChange={(v) => set("examTime", v)}
                />
              </div>
            </div>
            {errors.exam && <p className="mt-2 text-xs text-warn">{errors.exam}</p>}
          </fieldset>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-line px-4 py-2 text-sm text-ink hover:bg-black/5"
          >
            انصراف
          </button>
          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-2 text-sm text-white hover:opacity-90"
          >
            {initialCourse ? "ذخیره تغییرات" : "افزودن درس"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
