import LZString from "lz-string";
import type { Course } from "../types";

const SHARE_PARAM = "s";

/** Encodes the course list into a compact URL-safe string. */
export function encodeCoursesForUrl(courses: Course[]): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(courses));
}

/** Decodes a URL-safe string back into a course list, or null if invalid. */
export function decodeCoursesFromUrl(encoded: string): Course[] | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return null;
    return parsed as Course[];
  } catch {
    return null;
  }
}

/** Builds a full shareable URL (current origin + path) with the encoded plan. */
export function buildShareUrl(courses: Course[]): string {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set(SHARE_PARAM, encodeCoursesForUrl(courses));
  return url.toString();
}

/** Reads a shared plan from the current page URL, if present. */
export function readSharedCoursesFromLocation(): Course[] | null {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(SHARE_PARAM);
  if (!value) return null;
  return decodeCoursesFromUrl(value);
}

/** Removes the share parameter from the URL bar without reloading the page. */
export function clearShareParamFromLocation(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete(SHARE_PARAM);
  window.history.replaceState({}, "", url.toString());
}
