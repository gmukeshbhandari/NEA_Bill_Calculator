import "./OfficialLinks.css";

const LINK_GROUPS = [
  {
    category: "NEA Official Portals",
    icon: "🏛️",
    links: [
      {
        title: "NEA Official Website",
        url: "https://www.nea.org.np",
        description: "Main official website of Nepal Electricity Authority",
        tag: "Official",
      },
      // {
      //   title: "Consumer Information Platform (CIP)",
      //   url: "https://cip.nea.org.np",
      //   description:
      //     "NEA consumer information — energy saving tips and appliance guidance",
      //   tag: "Portal",
      // },
      {
        title: "NEA Bill Statement Check",
        url: "https://www.neabilling.com/viewonline/",
        description:
          "Check your NEA electricity bill statement online by SC No.",
        tag: "Bill",
      },
      // {
      //   title: "NEA Annual Reports",
      //   url: "https://www.nea.org.np/annual_report",
      //   description: "NEA annual reports and financial statements",
      //   tag: "Report",
      // },
    ],
  },
  {
    category: "Online Bill Payment",
    icon: "💳",
    links: [
      {
        title: "eSewa — NEA Bill Payment",
        url: "https://esewa.com.np",
        description:
          "Pay NEA electricity bill via eSewa digital wallet. Enter SC No. and Customer ID.",
        tag: "eSewa",
      },
      {
        title: "Khalti — NEA Bill Payment",
        url: "https://khalti.com/payments/nea-bill-payment/",
        description:
          "Pay NEA electricity bill via Khalti. Rs. 5 charge on payments above Rs. 500.",
        tag: "Khalti",
      },
      {
        title: "IME Pay — NEA Bill Payment",
        url: "https://imepay.com.np",
        description: "Pay NEA electricity bill via IME Pay digital wallet",
        tag: "IME Pay",
      },
    ],
  },
  {
    category: "Related Government Sites",
    icon: "🏢",
    links: [
      {
        title: "Ministry of Energy, Water Resources & Irrigation",
        url: "https://moewri.gov.np",
        description: "Parent ministry overseeing Nepal Electricity Authority",
        tag: "Govt",
      },
      {
        title: "Electricity Regulatory Commission (ERC)",
        url: "https://www.erc.gov.np",
        description:
          "Nepal's electricity regulator — sets approved tariff rates",
        tag: "Regulator",
      },
    ],
  },
  {
    category: "NEA Social Media",
    icon: "🌐",
    links: [
      {
        title: "NEA Facebook Page",
        url: "https://www.facebook.com/nepalelectricityauthority",
        description: "Official Facebook page of Nepal Electricity Authority",
        tag: "Facebook",
      },
    ],
  },
];

const TAG_COLORS = {
  Official: { bg: "#e1f5ee", color: "#0f6e56" },
  Portal: { bg: "#eff6ff", color: "#1d4ed8" },
  Bill: { bg: "#faf5ff", color: "#7e22ce" },
  Report: { bg: "#f9fafb", color: "#374151" },
  eSewa: { bg: "#ecfdf5", color: "#065f46" },
  Khalti: { bg: "#fdf4ff", color: "#7e22ce" },
  "IME Pay": { bg: "#fff7ed", color: "#c2410c" },
  Govt: { bg: "#f0f9ff", color: "#0369a1" },
  Regulator: { bg: "#fef2f2", color: "#b91c1c" },
  Facebook: { bg: "#eff6ff", color: "#1d4ed8" },
};

const OfficialLinks = () => {
  return (
    <div className="links-container">
      <div className="links-header">
        <h1 className="links-title">NEA Official Links</h1>
        <p className="links-subtitle">
          Verified links to Nepal Electricity Authority portals, bill payment
          services, and related government sites
        </p>
      </div>

      <div className="links-content">
        {LINK_GROUPS.map((group) => (
          <div key={group.category} className="link-group">
            <div className="link-group-header">
              <span className="link-group-icon">{group.icon}</span>
              <h2 className="link-group-title">{group.category}</h2>
            </div>

            <div className="link-cards">
              {group.links.map((link) => {
                const tagStyle = TAG_COLORS[link.tag] || TAG_COLORS["Official"];
                return (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-card"
                  >
                    <div className="link-card-top">
                      <span className="link-card-title">{link.title}</span>
                      <span
                        className="link-card-tag"
                        style={{
                          background: tagStyle.bg,
                          color: tagStyle.color,
                        }}
                      >
                        {link.tag}
                      </span>
                    </div>
                    <p className="link-card-desc">{link.description}</p>
                    <span className="link-card-url">
                      {link.url.replace("https://", "").replace("http://", "")}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="links-footnote">
        * All links open in a new tab. URLs are verified but may change over
        time — always confirm you are on the correct official domain before
        entering personal information.
      </p>
    </div>
  );
};

export default OfficialLinks;
