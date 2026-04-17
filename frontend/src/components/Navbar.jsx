import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/#hotels",  label: "Hotels"       },
  { to: "/#deals",   label: "Dining"       },
  { to: "/#deals",   label: "Offers"       },
  { to: "/#why-knsu",label: "Memberships"  },
  { to: "/#why-knsu",label: "More"         },
];

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = location.pathname === "/";

  return (
    <header className={`topbar ${isHome ? "topbar--home" : ""}`}>
      {/* Brand */}
      <div className="topbar__brand">
        <Link to="/">KNSU stays</Link>
      </div>

      {/* Desktop nav */}
      <nav className="topbar__nav" aria-label="Main navigation">
        {navLinks.map((link) => (
          <a key={link.label} href={link.to} className="topbar__link">
            {link.label}
          </a>
        ))}
      </nav>

      {/* Right actions */}
      <div className="topbar__actions">
        <Link
          to="/login"
          className={`topbar__link ${location.pathname === "/login" ? "active" : ""}`}
        >
          Login / Join
        </Link>
        <Link to="/register" className="topbar__book-btn">
          Book Now
        </Link>
        {/* Hamburger */}
        <button
          className="topbar__hamburger"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="topbar__mobile-menu">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.to}
              className="topbar__mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link to="/login"    className="topbar__mobile-link" onClick={() => setMenuOpen(false)}>Login / Join</Link>
          <Link to="/register" className="topbar__mobile-cta"  onClick={() => setMenuOpen(false)}>Book Now</Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
