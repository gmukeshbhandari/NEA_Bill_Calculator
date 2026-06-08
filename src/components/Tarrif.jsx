import "./Tarrif.css";

const TARIFFS = [
  {
    ampere: "5A",
    slabs: [
      { sn: 1, units: "0 – 20", minPrice: 30, ratePerUnit: 0 },
      { sn: 2, units: "21 – 30", minPrice: 50, ratePerUnit: 6.5 },
      { sn: 3, units: "31 – 50", minPrice: 50, ratePerUnit: 8.0 },
      { sn: 4, units: "51 – 100", minPrice: 75, ratePerUnit: 9.5 },
      { sn: 5, units: "101 – 250", minPrice: 100, ratePerUnit: 9.5 },
      { sn: 6, units: "251 & above", minPrice: 150, ratePerUnit: 11.0 },
    ],
  },
  {
    ampere: "15A",
    slabs: [
      { sn: 1, units: "0 – 20", minPrice: 50, ratePerUnit: 4.0 },
      { sn: 2, units: "21 – 30", minPrice: 75, ratePerUnit: 6.5 },
      { sn: 3, units: "31 – 50", minPrice: 75, ratePerUnit: 8.0 },
      { sn: 4, units: "51 – 100", minPrice: 100, ratePerUnit: 9.5 },
      { sn: 5, units: "101 – 250", minPrice: 125, ratePerUnit: 9.5 },
      { sn: 6, units: "251 & above", minPrice: 175, ratePerUnit: 11.0 },
    ],
  },
  {
    ampere: "30A",
    slabs: [
      { sn: 1, units: "0 – 20", minPrice: 75, ratePerUnit: 5.0 },
      { sn: 2, units: "21 – 30", minPrice: 100, ratePerUnit: 6.5 },
      { sn: 3, units: "31 – 50", minPrice: 100, ratePerUnit: 8.0 },
      { sn: 4, units: "51 – 100", minPrice: 125, ratePerUnit: 9.5 },
      { sn: 5, units: "101 – 250", minPrice: 150, ratePerUnit: 9.5 },
      { sn: 6, units: "251 & above", minPrice: 200, ratePerUnit: 11.0 },
    ],
  },
  {
    ampere: "60A",
    slabs: [
      { sn: 1, units: "0 – 20", minPrice: 125, ratePerUnit: 6.0 },
      { sn: 2, units: "21 – 30", minPrice: 125, ratePerUnit: 6.5 },
      { sn: 3, units: "31 – 50", minPrice: 125, ratePerUnit: 8.0 },
      { sn: 4, units: "51 – 100", minPrice: 150, ratePerUnit: 9.5 },
      { sn: 5, units: "101 – 250", minPrice: 200, ratePerUnit: 9.5 },
      { sn: 6, units: "251 & above", minPrice: 250, ratePerUnit: 11.0 },
    ],
  },
];

const PAYMENT_RULES = [
  {
    days: "1 – 7 days",
    type: "discount",
    label: "2% Discount",
    note: "Early payment reward",
  },
  {
    days: "8 – 22 days",
    type: "neutral",
    label: "No change",
    note: "Pay exact bill amount",
  },
  {
    days: "23 – 30 days",
    type: "fine",
    label: "5% Fine",
    note: "Late payment surcharge",
  },
  {
    days: "31 – 40 days",
    type: "fine",
    label: "10% Fine",
    note: "Late payment surcharge",
  },
  {
    days: "41 – 60 days",
    type: "fine",
    label: "25% Fine",
    note: "Late payment surcharge",
  },
  {
    days: "60+ days",
    type: "danger",
    label: "25% Fine and Line Cut Risk",
    note: "Line may be disconnected",
  },
];

const TariffTable = ({ ampere, slabs }) => (
  <div className="tariff-card">
    <div className="tariff-card-header">
      <span className="tariff-ampere">{ampere}</span>
      <span className="tariff-ampere-label">Single Phase 230V</span>
    </div>
    <table className="tariff-table">
      <thead>
        <tr>
          <th>S.N.</th>
          <th>Units / Month (kWh)</th>
          <th>Min. Price (Rs.)</th>
          <th>Rate per Unit (Rs.)</th>
        </tr>
      </thead>
      <tbody>
        {slabs.map((slab) => (
          <tr key={slab.sn}>
            <td className="td-center">{slab.sn}</td>
            <td>{slab.units}</td>
            <td className="td-right">
              {slab.minPrice > 0 ? `Rs. ${slab.minPrice}` : "—"}
            </td>
            <td className="td-right">
              {slab.ratePerUnit > 0
                ? `Rs. ${slab.ratePerUnit.toFixed(2)}`
                : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Tarrif = () => {
  return (
    <div className="tariffs-container">
      <div className="tariffs-header">
        <h1 className="tariffs-title">NEA Electricity Tariffs</h1>
        <p className="tariffs-subtitle">
          Nepal Electricity Authority — Residential Single Phase 230V Tariff
          Rates
        </p>
      </div>

      {/* Tariff Tables */}
      <div className="tariffs-grid">
        {TARIFFS.map((t) => (
          <TariffTable key={t.ampere} ampere={t.ampere} slabs={t.slabs} />
        ))}
      </div>

      {/* Payment Rules */}
      <div className="tariffs-rules-section">
        <h2 className="tariffs-rules-title">Discount & Fine Schedule</h2>
        <p className="tariffs-rules-subtitle">
          Applied based on number of days since bill issue date
        </p>
        <div className="rules-grid">
          {PAYMENT_RULES.map((rule) => (
            <div
              key={rule.days}
              className={`rule-card rule-card--${rule.type}`}
            >
              <span className="rule-days">{rule.days}</span>
              <span className="rule-label">{rule.label}</span>
              <span className="rule-note">{rule.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <p className="tariffs-footnote">
        * Tariff rates are as per NEA guidelines for residential consumers.
        Rates are subject to change. Always verify with your local NEA office.
      </p>
    </div>
  );
};

export default Tarrif;
