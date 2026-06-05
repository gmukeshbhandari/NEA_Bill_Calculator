import { useState } from "react";
import "./Navbar.css";

const links = ["Home", "NEA Tarrifs", "Official Links", "About"];

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="logo">NEA Bill Calculator</div>
      <div className="links">
        {links.map((link) => (
          <button
            key={link}
            onClick={() => setActive(link)}
            className={`link ${active === link ? "linkActive" : ""}`}
          >
            {link}
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
              key={link}
              onClick={() => {
                setActive(link);
                setMenuOpen(false);
              }}
              className={`mobileLink ${active === link ? "mobileLinkActive" : ""}`}
            >
              {link}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
