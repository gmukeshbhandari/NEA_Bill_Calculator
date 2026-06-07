import NepaliDate from "nepali-date-converter";

// ─── Month Definitions ────────────────────────────────────────────────────────

export const NEPALI_MONTHS = [
  { value: 1, label: "01 - Baisakh" },
  { value: 2, label: "02 - Jestha" },
  { value: 3, label: "03 - Ashadh" },
  { value: 4, label: "04 - Shrawan" },
  { value: 5, label: "05 - Bhadra" },
  { value: 6, label: "06 - Ashwin" },
  { value: 7, label: "07 - Kartik" },
  { value: 8, label: "08 - Mangsir" },
  { value: 9, label: "09 - Poush" },
  { value: 10, label: "10 - Magh" },
  { value: 11, label: "11 - Falgun" },
  { value: 12, label: "12 - Chaitra" },
];

// ─── Year Helpers ─────────────────────────────────────────────────────────────

/**
 * Returns Nepali years for payment date dropdown (current and next year)
 */
export function getNepaliYears() {
  const current = new NepaliDate().getYear();
  const years = [];
  for (let y = current; y <= current + 1; y++) {
    years.push(y);
  }
  return years;
}

/**
 * Returns Nepali years for bill issue date (current year and 1 year back)
 */
export function getNepaliBillIssueYears() {
  const current = new NepaliDate().getYear();
  return [current - 1, current];
}

// ─── Month Helpers ────────────────────────────────────────────────────────────

/**
 * Returns Nepali months from current month onwards for payment date.
 * Current year → current month and beyond only.
 * Future year  → all months.
 * @param {number} selectedYear
 * @returns {array} filtered NEPALI_MONTHS
 */
export function getAvailableMonths(selectedYear) {
  const today = new NepaliDate();
  const currentYear = today.getYear();
  const currentMonth = today.getMonth() + 1; // library is 0-indexed

  if (Number(selectedYear) === currentYear) {
    return NEPALI_MONTHS.filter((m) => m.value >= currentMonth);
  }
  return NEPALI_MONTHS;
}

/**
 * Returns months up to and including current month for bill issue date.
 * Current year → only past and current months (bill can't be issued in future).
 * Past year    → all months.
 * @param {number} selectedYear
 * @returns {array} filtered NEPALI_MONTHS
 */
export function getIssueMonths(selectedYear) {
  const today = new NepaliDate();
  const currentYear = today.getYear();
  const currentMonth = today.getMonth() + 1;

  if (Number(selectedYear) === currentYear) {
    return NEPALI_MONTHS.filter((m) => m.value <= currentMonth);
  }
  return NEPALI_MONTHS;
}

// ─── Day Helpers ──────────────────────────────────────────────────────────────

/**
 * Returns number of days in a given Nepali year/month.
 * @param {number} year
 * @param {number} month - 1-indexed
 * @returns {number} total days in that month
 */
export function getDaysInNepaliMonth(year, month) {
  try {
    return NepaliDate.daysInMonth(year, month - 1); // library is 0-indexed
  } catch {
    return 30; // fallback
  }
}

/**
 * Returns available days for payment date.
 * Current year + current month → only today and future days.
 * All other cases → all days in the month.
 * @param {number} selectedYear
 * @param {number} selectedMonth
 * @returns {number[]} array of valid day numbers
 */
export function getAvailableDays(selectedYear, selectedMonth) {
  const today = new NepaliDate();
  const currentYear = today.getYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const totalDays = getDaysInNepaliMonth(selectedYear, selectedMonth);
  const allDays = Array.from({ length: totalDays }, (_, i) => i + 1);

  if (
    Number(selectedYear) === currentYear &&
    Number(selectedMonth) === currentMonth
  ) {
    return allDays.filter((d) => d >= currentDay);
  }
  return allDays;
}

// ─── SC No. Helpers ───────────────────────────────────────────────────────────

/**
 * Extracts the bill issue day from SC No. middle segment.
 * SC No. format: X.YY.Z — YY is the issue day of the month.
 * @param {string} scNo - e.g. "123.18.022"
 * @returns {number|null} day number (1–32) or null if invalid
 */
export function getBillIssueDayFromScNo(scNo) {
  const parts = scNo.split(".");
  if (parts.length < 2) return null;
  const day = parseInt(parts[1], 10);
  if (isNaN(day) || day < 1 || day > 32) return null;
  return day;
}

// ─── Date Difference ──────────────────────────────────────────────────────────

/**
 * Calculates difference in days between bill issue date and payment date.
 * Both dates are in Nepali calendar.
 * Issue day is extracted from SC No.; year and month are user selected.
 *
 * @param {number} issueYear   - user selected Nepali year  (e.g. 2083)
 * @param {number} issueMonth  - user selected Nepali month (e.g. 2)
 * @param {number} issueDay    - extracted from SC No.      (e.g. 18)
 * @param {number} payYear     - user selected Nepali year  (e.g. 2083)
 * @param {number} payMonth    - user selected Nepali month (e.g. 2)
 * @param {number} payDay      - user selected Nepali day   (e.g. 23)
 * @returns {number} difference in days (0 if payment is before issue date)
 */
export function calcDaysDifferenceByDate(
  issueYear,
  issueMonth,
  issueDay,
  payYear,
  payMonth,
  payDay,
) {
  const issueNepali = new NepaliDate(issueYear, issueMonth - 1, issueDay);
  const payNepali = new NepaliDate(payYear, payMonth - 1, payDay);

  const issueAD = issueNepali.toJsDate();
  const payAD = payNepali.toJsDate();

  const diffDays = Math.round((payAD - issueAD) / (1000 * 60 * 60 * 24));
  return diffDays < 0 ? 0 : diffDays;
}
