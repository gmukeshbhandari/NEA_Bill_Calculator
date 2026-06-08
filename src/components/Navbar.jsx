import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const links = [
  { label: "Home", path: "/" },
  { label: "NEA Consumer Tariff Rates", path: "/nea-consumer-rariff-rates" },
  { label: "Official Links", path: "/officiallinks" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <nav className="nav">
      <div className="logo">NEA Bill Calculator</div>
      <div className="links">
        {links.map((link) => (
          <button
            key={link.path}
            onClick={() => handleNav(link.path)}
            className={`link ${location.pathname === link.path ? "linkActive" : ""}`}
          >
            {link.label}
          </button>
        ))}
      </div>
      <div /> {/* empty right column to balance the grid */}
      <button
        className="hamburger"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        ☰
      </button>
      {menuOpen && (
        <div className="mobileMenu">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNav(link.path)}
              className={`mobileLink ${location.pathname === link.path ? "mobileLinkActive" : ""}`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
