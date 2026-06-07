import NepaliDate from "nepali-date-converter";

// ─── Slab Definitions ────────────────────────────────────────────────────────
// flat: fixed charge for the entire slab (no per-unit rate)
// base: starting charge, rate: per-unit charge above prevBase

const SLABS = {
  "5A": [
    { min: 0, max: 20, flat: 30, base: null, rate: null, prevBase: null },
    { min: 21, max: 30, flat: null, base: 110, rate: 6.5, prevBase: 20 },
    { min: 31, max: 50, flat: null, base: 175, rate: 8.0, prevBase: 30 },
    { min: 51, max: 100, flat: null, base: 360, rate: 9.5, prevBase: 50 },
    { min: 101, max: 250, flat: null, base: 860, rate: 9.5, prevBase: 100 },
    {
      min: 251,
      max: Infinity,
      flat: null,
      base: 2335,
      rate: 11.0,
      prevBase: 250,
    },
  ],
  "15A": [
    { min: 0, max: 20, flat: null, base: 50, rate: 4.0, prevBase: 0 },
    { min: 21, max: 30, flat: null, base: 155, rate: 6.5, prevBase: 20 },
    { min: 31, max: 50, flat: null, base: 220, rate: 8.0, prevBase: 30 },
    { min: 51, max: 100, flat: null, base: 405, rate: 9.5, prevBase: 50 },
    { min: 101, max: 250, flat: null, base: 905, rate: 9.5, prevBase: 100 },
    {
      min: 251,
      max: Infinity,
      flat: null,
      base: 2380,
      rate: 11.0,
      prevBase: 250,
    },
  ],
  "30A": [
    { min: 0, max: 20, flat: null, base: 75, rate: 5.0, prevBase: 0 },
    { min: 21, max: 30, flat: null, base: 200, rate: 6.5, prevBase: 20 },
    { min: 31, max: 50, flat: null, base: 265, rate: 8.0, prevBase: 30 },
    { min: 51, max: 100, flat: null, base: 450, rate: 9.5, prevBase: 50 },
    { min: 101, max: 250, flat: null, base: 950, rate: 9.5, prevBase: 100 },
    {
      min: 251,
      max: Infinity,
      flat: null,
      base: 2425,
      rate: 11.0,
      prevBase: 250,
    },
  ],
  "60A": [
    { min: 0, max: 20, flat: null, base: 125, rate: 6.0, prevBase: 0 },
    { min: 21, max: 30, flat: null, base: 245, rate: 6.5, prevBase: 20 },
    { min: 31, max: 50, flat: null, base: 310, rate: 8.0, prevBase: 30 },
    { min: 51, max: 100, flat: null, base: 495, rate: 9.5, prevBase: 50 },
    { min: 101, max: 250, flat: null, base: 1020, rate: 9.5, prevBase: 100 },
    {
      min: 251,
      max: Infinity,
      flat: null,
      base: 2495,
      rate: 11.0,
      prevBase: 250,
    },
  ],
};

// Internal date diff helper
function daysDiff(y1, m1, d1, y2, m2, d2) {
  const date1 = new NepaliDate(y1, m1 - 1, d1).toJsDate();
  const date2 = new NepaliDate(y2, m2 - 1, d2).toJsDate();
  const diff = Math.round((date2 - date1) / (1000 * 60 * 60 * 24));
  return diff < 0 ? 0 : diff;
}

// ─── Payment Rules ────────────────────────────────────────────────────────────

const PAYMENT_RULES = [
  {
    minDay: 1,
    maxDay: 7,
    type: "discount",
    percent: 2,
    factor: 0.98,
    label: "2% Early Payment Discount (within 7 days)",
  },
  {
    minDay: 8,
    maxDay: 22,
    type: "neutral",
    percent: 0,
    factor: 1.0,
    label: "No discount and no fine (8–22 days)",
  },
  {
    minDay: 23,
    maxDay: 30,
    type: "fine",
    percent: 5,
    factor: 1.05,
    label: "5% Late Fine (23–30 days)",
  },
  {
    minDay: 31,
    maxDay: 40,
    type: "fine",
    percent: 10,
    factor: 1.1,
    label: "10% Late Fine (31–40 days)",
  },
  {
    minDay: 41,
    maxDay: 60,
    type: "fine",
    percent: 25,
    factor: 1.25,
    label: "25% Late Fine (41–60 days)",
  },
  {
    minDay: 61,
    maxDay: Infinity,
    type: "danger",
    percent: 25,
    factor: 1.25,
    label: "25% Late Fine — Line may be cut at any time (60+ days)",
  },
];

// ─── SC No. Validation Regex ──────────────────────────────────────────────────
// Format: X.Y.Z
// X = 3 or 4 characters — digits or alphabets or mix (e.g. 123, A123, 1234)
// Y = exactly 2 digit number (e.g. 04, 18)
// Z = 3 to 5 characters — digits or alphabets or mix (e.g. 022, A452, 12B4A)

const SC_REGEX = /^[A-Za-z0-9]{3,4}\.\d{2}\.[A-Za-z0-9]{3,5}$/;

// ─── Core Functions ─────────const SC_REGEX = /^[A-Za-z0-9]{3,4}\.\d{2}\.[A-Za-z0-9]{3,5}$/;──────────────────────────────────────────────────

/**
 * Returns the applicable payment rule for a given number of days.
 * @param {number} days - number of days since bill was issued
 * @returns {object} matching payment rule from PAYMENT_RULES
 */
export function getPaymentRule(days) {
  return PAYMENT_RULES.find((r) => days >= r.minDay && days <= r.maxDay);
}

/**
 * Calculates the base electricity bill before any discount, fine, or balance adjustment.
 * @param {number} units  - total units consumed this billing cycle
 * @param {string} ampere - connection capacity: "5A" | "15A" | "30A" | "60A"
 * @returns {number} base bill amount in Rs.
 */
export function calculateBaseBill(units, ampere) {
  if (units <= 0) return 0;

  const slabs = SLABS[ampere];
  const slab = slabs.find((s) => units <= s.max);

  if (!slab) return 0;

  // Flat rate slab (e.g. 5A 0–20 units = Rs. 30 fixed)
  if (slab.flat !== null) return slab.flat;

  // Tiered slab: base charge + (units above slab floor × per-unit rate)
  return slab.base + (units - slab.prevBase) * slab.rate;
}

/**
 * Returns the full billing breakdown including consumed units,
 * base bill, balance adjustment, fine/discount, and final payable amount.
 *
 * @param {object} params
 * @param {number} params.prevUnit          - meter reading last month
 * @param {number} params.thisUnit          - meter reading this month
 * @param {number} [params.prevBalance=0]   - previous balance amount in Rs.
 * @param {string} [params.prevBalanceType] - "excess" (overpaid) | "due" (underpaid)
 * @param {string} params.ampere            - connection capacity
 * @param {number} params.days              - days since bill was issued
 *
 * @returns {object} full billing result
 */
export function calculateBill({
  prevUnit,
  thisUnit,
  prevBalance = 0,
  prevBalanceType = "excess",
  ampere,
  days,
  issueYear,
  issueMonth,
  issueDay,
  payYear,
  payMonth,
  payDay,
}) {
  // Step 1 — Units consumed this cycle
  // If thisUnit < prevUnit, meter has rolled over (e.g. 9999 → 0000)
  // Max value depends on meter digit count (4-digit: 9999, 5-digit: 99999, 6-digit: 999999)
  let consumed;
  if (thisUnit < prevUnit) {
    const digitCount = String(prevUnit).length;
    const maxMeterValue = Math.pow(10, digitCount) - 1;
    consumed = maxMeterValue - prevUnit + thisUnit + 1;
  } else {
    consumed = thisUnit - prevUnit;
  }

  // Step 2 — Base bill from slab rates
  const baseBill = Math.round(calculateBaseBill(consumed, ampere));

  // Step 3 — Get payment rule first (needed for balance adjustment logic)
  const rule = getPaymentRule(days);

  // Step 4 — Previous balance adjustment
  //
  // excess (overpaid last month):
  //   - discount period (≤7 days): refund prevBalance + 2% bonus
  //   - all other periods: refund prevBalance as-is
  //
  // due (underpaid last month):
  //   - fine period (23–30d: 5%, 31–40d: 10%, 41d+: 25%): add prevBalance + fine%
  //   - neutral / discount period (≤22 days): add prevBalance as-is, no fine

  let balanceAdjustment = 0;

  if (prevBalance > 0) {
    if (prevBalanceType === "excess") {
      if (rule.type === "discount") {
        // Refund prevBalance plus the 2% bonus back to customer
        balanceAdjustment = -(prevBalance + prevBalance * (rule.percent / 100));
        // console.log("prevbalance = ", prevBalance);
        // console.log("Discount Prcentage = ", rule.percent);
        // console.log("Balance Adjustment after discount = ", balanceAdjustment);
      } else {
        // Neutral or fine period — refund prevBalance as-is
        balanceAdjustment = -prevBalance;
        // console.log(balanceAdjustment);
      }
    } else {
      // // due
      // if (rule.type === "fine" || rule.type === "danger") {
      //   // Add prevBalance plus the applicable fine percentage
      //   balanceAdjustment = prevBalance + prevBalance * (rule.percent / 100);
      // } else {
      //   // Neutral or discount period — add due balance with no extra fine
      //   balanceAdjustment = prevBalance;
      // }

      // due — fine % based on days since previous bill issue date
      if (rule.type === "fine" || rule.type === "danger") {
        const prevIssueMonth = issueMonth === 1 ? 12 : issueMonth - 1;
        const prevIssueYear = issueMonth === 1 ? issueYear - 1 : issueYear;

        const dueDays =
          daysDiff(
            prevIssueYear,
            prevIssueMonth,
            issueDay,
            payYear,
            payMonth,
            payDay,
          ) + 1;

        const dueRule = getPaymentRule(dueDays);
        const duePercent = dueRule ? dueRule.percent : rule.percent;

        balanceAdjustment = prevBalance + prevBalance * (duePercent / 100);
      } else {
        // Neutral or discount period — add due balance with no extra fine
        balanceAdjustment = prevBalance;
      }
    }
  }

  // Step 5 — Adjusted bill after previous balance
  // const adjustedBill = baseBill + balanceAdjustment;
  const adjustedBill = Math.round((baseBill + balanceAdjustment) * 100) / 100;

  // Step 6 — Apply payment rule (discount or fine) on the adjusted bill
  // const finalBill = Math.round(adjustedBill * rule.factor);
  const finalBill = Math.round(adjustedBill * rule.factor * 100) / 100;

  // Step 7 — Difference caused by the rule (for display only)
  // const difference = Math.abs(
  //   Math.round(adjustedBill * rule.factor) - adjustedBill,
  // );
  const difference = Math.round(Math.abs(finalBill - adjustedBill) * 100) / 100;

  return {
    consumed,
    baseBill,
    prevBalance,
    prevBalanceType,
    balanceAdjustment: Math.round(balanceAdjustment * 100) / 100,
    adjustedBill,
    finalBill,
    difference,
    rule,
    lineCutRisk: days > 60,
  };
}

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * Validates all billing form fields.
 * @param {object} form - the form state object from Home.jsx
 * @returns {object} errors - key/value map of field name → error message.
 *                            Empty object means form is valid.
 */
export function validateForm(form) {
  const errors = {};
  // ─── Meter Unit Validation ────────────────────────────────────────────────

  const VALID_DIGIT_COUNTS = [4, 5, 6];
  const prevUnitStr = String(form.prevUnit).trim();
  const thisUnitStr = String(form.thisUnit).trim();

  // prevUnit — must be present and 4, 5, or 6 digits
  if (
    form.prevUnit === "" ||
    isNaN(form.prevUnit) ||
    Number(form.prevUnit) < 0
  ) {
    errors.prevUnit = "Enter a valid previous month unit";
  } else if (!VALID_DIGIT_COUNTS.includes(prevUnitStr.length)) {
    errors.prevUnit = "Previous unit must be a 4, 5, or 6 digit number";
  }

  // thisUnit — must be present and same digit count as prevUnit
  if (
    form.thisUnit === "" ||
    isNaN(form.thisUnit) ||
    Number(form.thisUnit) < 0
  ) {
    errors.thisUnit = "Enter a valid this month unit";
  } else if (!errors.prevUnit && thisUnitStr.length !== prevUnitStr.length) {
    errors.thisUnit = `This month unit must also be a ${prevUnitStr.length}-digit number (e.g. ${
      prevUnitStr.length === 4
        ? "5123"
        : prevUnitStr.length === 5
          ? "50123"
          : "500123"
    })`;
  }

  // Previous balance amount (optional — blank is fine, but if filled must be valid)
  if (
    form.prevBalance !== "" &&
    (isNaN(form.prevBalance) || Number(form.prevBalance) < 0)
  )
    errors.prevBalance = "Enter a valid amount (or leave blank if none)";

  // SC No.
  if (!SC_REGEX.test(form.scNo)) errors.scNo = "Wrong SC No.?";

  // Payment date (Nepali) — all three dropdowns must be selected
  if (!form.payYear) errors.payYear = "Select payment year";
  if (!form.payMonth) errors.payMonth = "Select payment month";
  if (!form.payDay) errors.payDay = "Select payment day";
  // Bill issue date (day is auto-derived from SC No.)
  if (!form.issueYear) errors.issueYear = "Select issue year";
  if (!form.issueMonth) errors.issueMonth = "Select issue month";

  return errors;
}
