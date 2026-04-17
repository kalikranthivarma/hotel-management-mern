import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";

const navLinks = [
  { to: "/#hotels",  label: "Hotels"       },
  { to: "/#deals",   label: "Dining"       },
  { to: "/#deals",   label: "Offers"       },
  { to: "/#why-knsu",label: "Memberships"  },
  { to: "/#why-knsu",label: "More"         },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const { user } = useSelector((state) => state.auth);
  const isHome = location.pathname === "/";
  const role = user?.role || "guest_visit";

  const handleLogout = () => {
    dispatch(logoutUser());
    setMenuOpen(false);
    navigate("/login");
  };

  // Define links based on user role
  const getNavLinks = () => {
    if (role === "admin" || role === "superAdmin") {
      return [
        { to: "/", label: "Home" },
        { to: "/dashboard", label: "Dashboard" },
        { to: "/rooms", label: "Manage Rooms" },
        { to: "/admin/bookings", label: "All Bookings" },
      ];
    }
    
    // Default Guest/User links
    const links = [
      { to: "/#hotels", label: "Hotels" },
      { to: "/rooms", label: "Rooms" },
      { to: "/#deals", label: "Dining" },
    ];

    if (user) {
      links.push({ to: "/bookings", label: "My Bookings" });
    }

    return links;
  };

  const navLinks = getNavLinks();

  return (
    <header className={`topbar ${isHome ? "topbar--home" : ""}`}>
      {/* Brand */}
      <div className="topbar__brand">
        <Link to="/">KNSU stays</Link>
      </div>

      {/* Desktop nav */}
      <nav className="topbar__nav" aria-label="Main navigation">
        {navLinks.map((link) => (
          link.to.startsWith("/#") ? (
            <a key={link.label} href={link.to} className="topbar__link">
              {link.label}
            </a>
          ) : (
            <Link key={link.label} to={link.to} className="topbar__link">
              {link.label}
            </Link>
          )
        ))}
      </nav>

      {/* Right actions */}
      <div className="topbar__actions">
        {user ? (
          <div className="topbar__user-actions">
            <span className="topbar__user-name">Hi, {user.firstName}</span>
            <button onClick={handleLogout} className="topbar__link logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className={`topbar__link ${location.pathname === "/login" ? "active" : ""}`}
          >
            Login / Join
          </Link>
        )}
        
        {!user && (
          <Link to="/register" className="topbar__book-btn">
            Book Now
          </Link>
        )}

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
             link.to.startsWith("/#") ? (
              <a
                key={link.label}
                href={link.to}
                className="topbar__mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                className="topbar__mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            )
          ))}
          
          {user ? (
            <button onClick={handleLogout} className="topbar__mobile-link logout-btn">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="topbar__mobile-link" onClick={() => setMenuOpen(false)}>Login / Join</Link>
              <Link to="/register" className="topbar__mobile-cta" onClick={() => setMenuOpen(false)}>Book Now</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};


export default Navbar;
