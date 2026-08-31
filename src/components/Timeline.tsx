import { useEffect, useMemo, useRef, useState } from "react";
import type { Course, Session, Weekday } from "../types";
import { WEEKDAYS, TIMELINE_START_HOUR, TIMELINE_END_HOUR, courseColor } from "../utils/constants";
import { parseTimeToMinutes, formatTimePersian } from "../utils/time";
import { formatJalaliPersian } from "../utils/jalali";
import { toPersianDigits } from "../utils/persianDigits";

const DAY_LABEL_WIDTH = 60; // px, fixed column for weekday names
const MIN_HOUR_WIDTH = 32; // px floor; below this we fall back to horizontal scroll
const LANE_HEIGHT = 72; // px per stacking lane (for overlapping classes)
const LANE_GAP = 4;
const HEADER_HEIGHT = 32;

interface PositionedBlock {
  course: Course;
  session: Session;
  sessionIndex: number;
  colorIndex: number;
  lane: number;
  startMin: number;
  endMin: number;
}

interface TimelineProps {
  courses: Course[];
  conflictedCourseIds: Set<string>;
  onSelectCourse: (course: Course) => void;
  exportRef: React.RefObject<HTMLDivElement | null>;
}

export function Timeline({ courses, conflictedCourseIds, onSelectCourse, exportRef }: TimelineProps) {
  const hours = useMemo(
    () => Array.from({ length: TIMELINE_END_HOUR - TIMELINE_START_HOUR }, (_, i) => TIMELINE_START_HOUR + i),
    []
  );
  // Tick marks for the header axis, including the closing boundary (e.g. 22:00)
  // so the last visible hour column has an end line too.
  const hourTicks = useMemo(
    () => Array.from({ length: TIMELINE_END_HOUR - TIMELINE_START_HOUR + 1 }, (_, i) => TIMELINE_START_HOUR + i),
    []
  );
  const hoursCount = hours.length;
  const rangeStartMin = TIMELINE_START_HOUR * 60;

  // Measured on a non-scrolling wrapper so the presence/absence of a horizontal
  // scrollbar on the inner content never feeds back into this measurement.
  const measureRef = useRef<HTMLDivElement | null>(null);
  const [hourWidth, setHourWidth] = useState(56);

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    const compute = () => {
      const available = el.clientWidth - DAY_LABEL_WIDTH;
      // Floor to whole pixels and leave a hair of margin so rounding can
      // never push the content a pixel past the container (which would
      // trigger an unwanted scrollbar).
      const next = Math.max(MIN_HOUR_WIDTH, Math.floor((available - 1) / hoursCount));
      setHourWidth(next);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [hoursCount]);

  const totalWidth = hourWidth * hoursCount;

  // Physical (LTR-style) x position, in px from the left edge of the hours
  // area, for a given clock time. 07:00 sits at the right edge (x = totalWidth)
  // and 22:00 sits at the left edge (x = 0) to match RTL reading order.
  function xForMinute(min: number): number {
    const offsetFromStart = ((min - rangeStartMin) / 60) * hourWidth;
    return totalWidth - offsetFromStart;
  }

  const dayLanes = useMemo(() => {
    const result: Record<Weekday, { blocks: PositionedBlock[]; laneCount: number }> = {
      0: { blocks: [], laneCount: 1 },
      1: { blocks: [], laneCount: 1 },
      2: { blocks: [], laneCount: 1 },
      3: { blocks: [], laneCount: 1 },
      4: { blocks: [], laneCount: 1 },
      5: { blocks: [], laneCount: 1 },
      6: { blocks: [], laneCount: 1 },
    };

    courses.forEach((course, colorIndex) => {
      course.sessions.forEach((session, sessionIndex) => {
        const startMin = parseTimeToMinutes(session.startTime);
        const endMin = parseTimeToMinutes(session.endTime);
        if (startMin === null || endMin === null) return;
        result[session.day].blocks.push({
          course,
          session,
          sessionIndex,
          colorIndex,
          lane: 0,
          startMin,
          endMin,
        });
      });
    });

    (Object.keys(result) as unknown as Weekday[]).forEach((day) => {
      const dayEntry = result[day];
      const sorted = [...dayEntry.blocks].sort((a, b) => a.startMin - b.startMin);
      const laneEnds: number[] = [];
      for (const block of sorted) {
        let placedLane = -1;
        for (let i = 0; i < laneEnds.length; i++) {
          if (laneEnds[i] <= block.startMin) {
            placedLane = i;
            break;
          }
        }
        if (placedLane === -1) {
          placedLane = laneEnds.length;
          laneEnds.push(block.endMin);
        } else {
          laneEnds[placedLane] = block.endMin;
        }
        block.lane = placedLane;
      }
      dayEntry.laneCount = Math.max(1, laneEnds.length);
    });

    return result;
  }, [courses]);

  return (
    <div ref={measureRef} className="rounded-lg border border-line bg-white">
      <div className="overflow-x-auto">
        {/* This inner div is also the export target: html-to-image renders it
            at its own natural size, so the PNG never includes the scrollbar
            chrome from the wrapper above. */}
        <div ref={exportRef} style={{ width: DAY_LABEL_WIDTH + totalWidth }} className="bg-white">
          {/* Hour header, drawn as axis ticks aligned with the grid lines below */}
          <div className="flex border-b border-line">
            <div
              className="flex shrink-0 items-center justify-center bg-white"
              style={{ width: DAY_LABEL_WIDTH, height: HEADER_HEIGHT }}
            />
            <div className="relative" style={{ width: totalWidth, height: HEADER_HEIGHT }}>
              {hourTicks.map((hour) => {
                const x = xForMinute(hour * 60);
                return (
                  <span
                    key={hour}
                    style={{ left: x, top: "50%" }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] text-ink/60"
                  >
                    {toPersianDigits(String(hour).padStart(2, "0") + ":۰۰")}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Day rows */}
          {WEEKDAYS.map(({ value: day, label }) => {
            const dayEntry = dayLanes[day];
            const rowHeight = dayEntry.laneCount * LANE_HEIGHT + (dayEntry.laneCount - 1) * LANE_GAP + 12;
            return (
              <div key={day} className="flex border-b border-line last:border-b-0">
                <div
                  className="flex shrink-0 items-center justify-center bg-white text-sm text-ink/80 border-l border-line"
                  style={{ width: DAY_LABEL_WIDTH, minHeight: rowHeight }}
                >
                  {label}
                </div>
                <div className="relative" style={{ width: totalWidth, minHeight: rowHeight }}>
                  {/* vertical grid lines at every hour boundary, including both ends */}
                  {hourTicks.map((hour) => (
                    <div
                      key={hour}
                      className="absolute top-0 bottom-0 border-l border-line/70"
                      style={{ left: xForMinute(hour * 60) }}
                    />
                  ))}
                  {dayEntry.blocks.map((block) => {
                    const left = xForMinute(block.endMin);
                    const width = Math.max(xForMinute(block.startMin) - left, 40);
                    const top = 6 + block.lane * (LANE_HEIGHT + LANE_GAP);
                    const color = courseColor(block.colorIndex);
                    const isConflicted = conflictedCourseIds.has(block.course.id);
                    const compact = width < 130;

                    return (
                      <button
                        key={`${block.course.id}-${block.sessionIndex}`}
                        type="button"
                        onClick={() => onSelectCourse(block.course)}
                        style={{
                          left,
                          width,
                          top,
                          height: LANE_HEIGHT,
                          backgroundColor: color.bg,
                          borderColor: isConflicted ? "#b3541e" : color.border,
                        }}
                        className={`absolute overflow-hidden rounded-md border px-2 py-1 text-right text-ink transition hover:brightness-95 ${
                          isConflicted ? "border-2 ring-1 ring-warn/40" : "border"
                        }`}
                        title={block.course.name}
                      >
                        <div className={`font-medium leading-tight ${compact ? "text-[11px]" : "text-xs"} truncate`}>
                          {block.course.name}
                        </div>
                        {!compact && block.course.units !== undefined && (
                          <div className="text-[10px] leading-tight text-ink/70">
                            {toPersianDigits(block.course.units)} واحد
                          </div>
                        )}
                        <div className="text-[10px] leading-tight text-ink/70 truncate">
                          {formatTimePersian(block.session.startTime)} تا {formatTimePersian(block.session.endTime)}
                        </div>
                        {!compact && block.course.exam && (
                          <div className="text-[9px] leading-tight text-ink/60 truncate">
                            امتحان: {formatJalaliPersian(block.course.exam.date)} ساعت{" "}
                            {formatTimePersian(block.course.exam.time)}
                          </div>
                        )}
                        {isConflicted && (
                          <div className="text-[10px] leading-tight text-warn">⚠ تداخل</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
