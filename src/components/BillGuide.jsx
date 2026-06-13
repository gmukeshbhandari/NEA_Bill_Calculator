import { useState } from "react";
import "./BillGuide.css";
import billImage from "../assets/bill_image.jpg";

const ANNOTATIONS = [
  {
    id: "scno",
    label: "SC No.",
    field: "Enter in SC No.",
    top: "25%",
    left: "72%",
    color: "#1d9e75",
  },
  {
    id: "capacity",
    label: "Capacity",
    field: "Select in Capacity",
    top: "31%",
    left: "82%",
    color: "#1d9e75",
  },
  {
    id: "prevrdg",
    label: "Previous RDG",
    field: "Enter in Previous Unit (kWh)",
    top: "56%",
    left: "98%",
    color: "#2563eb",
  },
  {
    id: "presentrdg",
    label: "Present RDG",
    field: "Enter in Current Unit (kWh)",
    top: "54%",
    left: "98%",
    color: "#7c3aed",
  },
  {
    id: "arrears",
    label: "Arrears Amount",
    field: "Enter in Previous Balance Amount (Rs.)",
    top: "81%",
    left: "98%",
    color: "#dc2626",
  },
];

const BillGuide = () => {
  const [active, setActive] = useState(null);

  return (
    <div className="guide-wrapper">
      <button
        className="guide-toggle-btn"
        onClick={() => setActive(active ? null : "open")}
      >
        📄 How to read bill?
      </button>

      {active && (
        <div className="guide-modal-overlay" onClick={() => setActive(null)}>
          <div className="guide-modal" onClick={(e) => e.stopPropagation()}>
            <div className="guide-modal-header">
              <span className="guide-modal-title">Reading Your NEA Bill</span>
              <button
                className="guide-close-btn"
                onClick={() => setActive(null)}
              >
                ✕
              </button>
            </div>

            <div className="guide-body">
              {/* Annotated image */}
              <div className="guide-image-wrap">
                <img
                  src={billImage}
                  alt="NEA Bill"
                  className="guide-bill-image"
                />
                {ANNOTATIONS.map((ann) => (
                  <div
                    key={ann.id}
                    className="guide-pin"
                    style={{
                      top: ann.top,
                      left: ann.left,
                      borderColor: ann.color,
                    }}
                    onMouseEnter={() => setActive(ann.id)}
                    onMouseLeave={() => setActive("open")}
                  >
                    <span
                      className="guide-pin-dot"
                      style={{ background: ann.color }}
                    />
                    <div
                      className="guide-pin-line"
                      style={{ background: ann.color }}
                    />
                    <div
                      className="guide-pin-label"
                      style={{ borderColor: ann.color, color: ann.color }}
                    >
                      {ann.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="guide-legend">
                <p className="guide-legend-title">Field Mapping</p>
                {ANNOTATIONS.map((ann) => (
                  <div
                    key={ann.id}
                    className={`guide-legend-item ${active === ann.id ? "guide-legend-item--active" : ""}`}
                    style={{ borderLeftColor: ann.color }}
                  >
                    <span
                      className="guide-legend-dot"
                      style={{ background: ann.color }}
                    />
                    <div>
                      <span className="guide-legend-bill-label">
                        {ann.label}
                      </span>
                      <span className="guide-legend-arrow"> → </span>
                      <span className="guide-legend-field">{ann.field}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillGuide;
