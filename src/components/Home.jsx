import { useState } from "react";
import { calculateBill, validateForm } from "../utils/neaBilling";
import NepaliDate from "nepali-date-converter";
import "./Home.css";
import BillGuide from "./BillGuide";

import {
  getNepaliYears,
  getBillIssueDayFromScNo,
  calcDaysDifferenceByDate,
  getAvailableMonths,
  getAvailableDays,
  getNepaliBillIssueYears,
  getIssueMonths,
} from "../utils/nepaliDate";

// Get current Nepali date once at module level
const todayNepali = new NepaliDate();
const currentYear = todayNepali.getYear();
const currentMonth = todayNepali.getMonth() + 1; // 0-indexed
const currentDay = todayNepali.getDate();

const INITIAL_FORM = {
  prevUnit: "",
  thisUnit: "",
  prevBalance: "",
  prevBalanceType: "excess",
  capacity: "15A",
  scNo: "",
  issueYear: String(currentYear),
  issueMonth: String(currentMonth),
  payYear: String(currentYear),
  payMonth: String(currentMonth),
  payDay: String(currentDay),
};

const Home = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleCalculate = () => {
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const issueDay = getBillIssueDayFromScNo(form.scNo); // from SC No. middle number

    const days =
      calcDaysDifferenceByDate(
        Number(form.issueYear),
        Number(form.issueMonth),
        issueDay,
        Number(form.payYear),
        Number(form.payMonth),
        Number(form.payDay),
      ) + 1; // +1 to include both bill issue day and payment day

    // const billResult = calculateBill({
    //   prevUnit: Number(form.prevUnit),
    //   thisUnit: Number(form.thisUnit),
    //   prevBalance: Number(form.prevBalance) || 0,
    //   prevBalanceType: form.prevBalanceType,
    //   ampere: form.capacity,
    //   days,
    // });

    const billResult = calculateBill({
      prevUnit: Number(form.prevUnit),
      thisUnit: Number(form.thisUnit),
      prevBalance: Number(form.prevBalance) || 0,
      prevBalanceType: form.prevBalanceType,
      ampere: form.capacity,
      days,
      issueYear: Number(form.issueYear),
      issueMonth: Number(form.issueMonth),
      issueDay,
      payYear: Number(form.payYear),
      payMonth: Number(form.payMonth),
      payDay: Number(form.payDay),
    });

    setResult({ ...billResult, days });

    // {
    //   console.log(billResult);
    // }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setResult(null);
    setErrors({});
  };

  // ── Live days hint (shown below date dropdowns) ──
  const liveIssueDayHint = () => {
    if (
      !form.scNo ||
      !form.issueYear ||
      !form.issueMonth ||
      !form.payYear ||
      !form.payMonth ||
      !form.payDay
    )
      return null;

    const issueDay = getBillIssueDayFromScNo(form.scNo);
    if (!issueDay) return null;

    const days =
      calcDaysDifferenceByDate(
        Number(form.issueYear),
        Number(form.issueMonth),
        issueDay,
        Number(form.payYear),
        Number(form.payMonth),
        Number(form.payDay),
      ) + 1; // +1 to include both bill issue day and payment day

    const issueDateStr = `${form.issueYear}-${String(Number(form.issueMonth)).padStart(2, "0")}-${String(issueDay).padStart(2, "0")}`;
    const payDateStr = `${form.payYear}-${String(Number(form.payMonth)).padStart(2, "0")}-${String(Number(form.payDay)).padStart(2, "0")}`;

    return (
      <span className="form-hint">
        Issue: {issueDateStr} → Pay: {payDateStr} = {days} day
        {days !== 1 ? "s" : ""} since issue
      </span>
    );
  };
  return (
    <div className="home-container">
      <div className="home-card">
        {/* ── Header ── */}
        <div className="home-header">
          <h1 className="home-title">NEA Bill Calculator</h1>
          <p className="home-subtitle">
            Nepal Electricity Authority — Residential Billing - Single Phase 230
            Volt
          </p>
        </div>
        <BillGuide />
        {/* ── Form ── */}
        <div className="home-form">
          {/* Row 1 — Meter Readings */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Previous Unit (kWh)</label>
              <input
                className={`form-input ${errors.prevUnit ? "input-error" : ""}`}
                type="number"
                name="prevUnit"
                placeholder="e.g. 4517"
                value={form.prevUnit}
                onChange={handleChange}
                min="0"
              />
              {errors.prevUnit && (
                <span className="error-msg">{errors.prevUnit}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Current Unit (kWh)</label>
              <input
                className={`form-input ${errors.thisUnit ? "input-error" : ""}`}
                type="number"
                name="thisUnit"
                placeholder="e.g. 4728"
                value={form.thisUnit}
                onChange={handleChange}
                min="0"
              />
              {errors.thisUnit && (
                <span className="error-msg">{errors.thisUnit}</span>
              )}
            </div>
          </div>

          {/* Row 2 — Previous Balance + Capacity */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Previous Balance Amount (Rs.)
              </label>
              <div className="input-with-tag">
                <input
                  className={`form-input ${errors.prevBalance ? "input-error" : ""}`}
                  type="number"
                  name="prevBalance"
                  placeholder="e.g. 2.34"
                  value={form.prevBalance}
                  onChange={handleChange}
                  min="0"
                />
                <select
                  className="input-tag-select"
                  name="prevBalanceType"
                  value={form.prevBalanceType}
                  onChange={handleChange}
                >
                  <option value="excess">Excess</option>
                  <option value="due">Due</option>
                </select>
              </div>
              {errors.prevBalance && (
                <span className="error-msg">{errors.prevBalance}</span>
              )}
              <span className="form-hint">
                {form.prevBalanceType === "excess"
                  ? "Overpaid last month — will be deducted"
                  : "Underpaid last month — will be added"}
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Capacity</label>
              <select
                className="form-input form-select"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
              >
                <option value="5A">5 Ampere</option>
                <option value="15A">15 Ampere</option>
                <option value="30A">30 Ampere</option>
                <option value="60A">60 Ampere</option>
              </select>
            </div>
          </div>

          {/* Row 3 — SC No. */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">SC No.</label>
              <input
                className={`form-input ${errors.scNo ? "input-error" : ""}`}
                type="text"
                name="scNo"
                placeholder="e.g. 123.19.026"
                value={form.scNo}
                onChange={handleChange}
              />
              {errors.scNo && <span className="error-msg">{errors.scNo}</span>}
            </div>
          </div>

          {/* Bill Issue Date — Year + Month only, Day comes from SC No. */}
          <div className="form-group">
            <label className="form-label">Bill Issue Date (Nepali)</label>
            <div className="date-row date-row--two">
              {/* Year */}
              <select
                className={`form-input form-select ${errors.issueYear ? "input-error" : ""}`}
                name="issueYear"
                value={form.issueYear}
                onChange={(e) => {
                  setForm((f) => ({
                    ...f,
                    issueYear: e.target.value,
                    issueMonth: "",
                  }));
                  setErrors((er) => ({ ...er, issueYear: "" }));
                }}
              >
                <option value="">Year</option>
                {getNepaliBillIssueYears().map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              {/* Month */}
              <select
                className={`form-input form-select ${errors.issueMonth ? "input-error" : ""}`}
                name="issueMonth"
                value={form.issueMonth}
                onChange={(e) => {
                  setForm((f) => ({ ...f, issueMonth: e.target.value }));
                  setErrors((er) => ({ ...er, issueMonth: "" }));
                }}
                disabled={!form.issueYear}
              >
                <option value="">Month</option>
                {form.issueYear &&
                  getIssueMonths(Number(form.issueYear)).map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
              </select>
            </div>

            {/* Show resolved issue date once SC No. and year+month are filled */}
            {form.scNo &&
              form.issueYear &&
              form.issueMonth &&
              (() => {
                const issueDay = getBillIssueDayFromScNo(form.scNo);
                if (!issueDay) return null;
                return (
                  <span className="form-hint">
                    Issue day from SC No.:{" "}
                    <strong>{String(issueDay).padStart(2, "0")}</strong> — Full
                    issue date:{" "}
                    <strong>
                      {form.issueYear}-
                      {String(Number(form.issueMonth)).padStart(2, "0")}-
                      {String(issueDay).padStart(2, "0")}
                    </strong>
                  </span>
                );
              })()}

            {(errors.issueYear || errors.issueMonth) && (
              <span className="error-msg">
                {errors.issueYear || errors.issueMonth}
              </span>
            )}
          </div>

          {/* Payment Date — 3 dropdowns */}
          <div className="form-group">
            <label className="form-label">Payment Date (Nepali)</label>
            <span className="form-hint">When will you pay the bill?</span>
            <div className="date-row">
              {/* Year */}
              <select
                className={`form-input form-select ${errors.payYear ? "input-error" : ""}`}
                name="payYear"
                value={form.payYear}
                onChange={(e) => {
                  setForm((f) => ({
                    ...f,
                    payYear: e.target.value,
                    payDay: "",
                  }));
                  setErrors((er) => ({ ...er, payYear: "" }));
                }}
              >
                <option value="">Year</option>
                {getNepaliYears().map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              {/* Month */}
              <select
                className={`form-input form-select ${errors.payMonth ? "input-error" : ""}`}
                name="payMonth"
                value={form.payMonth}
                onChange={(e) => {
                  setForm((f) => ({
                    ...f,
                    payMonth: e.target.value,
                    payDay: "",
                  }));
                  setErrors((er) => ({ ...er, payMonth: "" }));
                }}
                disabled={!form.payYear}
              >
                <option value="">Month</option>
                {form.payYear &&
                  getAvailableMonths(Number(form.payYear)).map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
              </select>

              {/* Day */}
              {/* Day */}
              <select
                className={`form-input form-select ${errors.payDay ? "input-error" : ""}`}
                name="payDay"
                value={form.payDay}
                onChange={(e) => {
                  setForm((f) => ({ ...f, payDay: e.target.value }));
                  setErrors((er) => ({ ...er, payDay: "" }));
                }}
                disabled={!form.payYear || !form.payMonth}
              >
                <option value="">Day</option>
                {form.payYear &&
                  form.payMonth &&
                  getAvailableDays(
                    Number(form.payYear),
                    Number(form.payMonth),
                  ).map((d) => (
                    <option key={d} value={d}>
                      {String(d).padStart(2, "0")}
                    </option>
                  ))}
              </select>
            </div>

            {/* Date errors */}
            {(errors.payYear || errors.payMonth || errors.payDay) && (
              <span className="error-msg">
                {errors.payYear || errors.payMonth || errors.payDay}
              </span>
            )}

            {/* Live days hint */}
            {liveIssueDayHint()}
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button className="calc-btn" onClick={handleCalculate}>
              Calculate Bill
            </button>
            <button className="reset-btn" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>

        {/* ── Result ── */}
        {result && (
          <div className="result-section">
            <div className="result-divider" />

            {/* Meta row */}
            <div className="result-meta">
              <span className="result-meta-item">
                <span className="result-meta-label">SC No.</span>
                <span className="result-meta-value">{form.scNo}</span>
              </span>
              <span className="result-meta-item">
                <span className="result-meta-label">Capacity</span>
                <span className="result-meta-value">{form.capacity}</span>
              </span>
              <span className="result-meta-item">
                <span className="result-meta-label">Payment Date</span>
                <span className="result-meta-value">
                  {form.payYear}-
                  {String(Number(form.payMonth)).padStart(2, "0")}-
                  {String(Number(form.payDay)).padStart(2, "0")}
                </span>
              </span>
              <span className="result-meta-item">
                <span className="result-meta-label">Days Since Issue</span>
                <span className="result-meta-value">{result.days} days</span>
              </span>
            </div>

            {/* Tiles */}
            <div className="result-grid">
              <div className="result-tile">
                <span className="result-tile-label">Units Consumed</span>
                <span className="result-tile-value">{result.consumed}</span>
                <span className="result-tile-unit">units</span>
              </div>

              <div className="result-tile">
                <span className="result-tile-label">Base Bill</span>
                <span className="result-tile-value">
                  Rs. {result.baseBill.toLocaleString()}
                </span>
                <span className="result-tile-unit">before adjustment</span>
              </div>

              {result.prevBalance > 0 && (
                <div className="result-tile">
                  <span className="result-tile-label">
                    Previous Balance Adjustment{" "}
                  </span>
                  <span
                    className={`result-tile-value ${result.prevBalanceType === "excess" ? "value-green" : "value-red"}`}
                  >
                    {result.prevBalanceType === "excess" ? "−" : "+"} Rs.{" "}
                    {Math.abs(result.balanceAdjustment).toLocaleString()}
                  </span>
                  <span className="result-tile-unit">
                    {result.prevBalanceType === "excess"
                      ? "deducted (overpaid)"
                      : "added (underpaid)"}
                  </span>
                </div>
              )}

              {result.prevBalance > 0 && (
                <div className="result-tile">
                  <span className="result-tile-label">
                    After Balance Adjustment
                  </span>
                  <span className="result-tile-value">
                    Rs. {result.adjustedBill.toLocaleString()}
                  </span>
                  <span className="result-tile-unit">
                    before fine / discount
                  </span>
                </div>
              )}
            </div>

            {/* Discount / Fine notice */}
            <div className={`result-notice result-notice--${result.rule.type}`}>
              <span className="result-notice-label">{result.rule.label}</span>
              {result.rule.type === "discount" && (
                <span className="result-notice-amount">
                  − Rs. {result.difference.toLocaleString()}
                </span>
              )}
              {(result.rule.type === "fine" ||
                result.rule.type === "danger") && (
                <span className="result-notice-amount">
                  + Rs. {result.difference.toLocaleString()}
                </span>
              )}
            </div>

            {/* Line cut warning */}
            {result.lineCutRisk && (
              <div className="result-warning">
                ⚠ Over 60 days overdue — line may be cut at any time
              </div>
            )}

            {/* Total */}
            <div className="result-total">
              <span className="result-total-label">Total Payable</span>
              <span className="result-total-value">
                Rs. {result.finalBill.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
