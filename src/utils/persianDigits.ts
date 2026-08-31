const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Converts any Latin digits found in the input to Persian digits. */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

/** Converts Persian (and Arabic-Indic) digits back to Latin digits. */
export function toLatinDigits(value: string): string {
  const arabic = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return value
    .split("")
    .map((ch) => {
      const pIndex = PERSIAN_DIGITS.indexOf(ch);
      if (pIndex !== -1) return String(pIndex);
      const aIndex = arabic.indexOf(ch);
      if (aIndex !== -1) return String(aIndex);
      return ch;
    })
    .join("");
}
