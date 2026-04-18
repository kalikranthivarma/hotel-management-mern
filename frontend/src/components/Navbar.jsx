import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "guest_visit";

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    setMenuOpen(false);
    setProfileOpen(false);
    navigate("/login");
  };

  const getNavLinks = () => {
    if (role === "admin" || role === "superAdmin") {
      return [
        { to: "/", label: "Home" },
        { to: "/dashboard", label: "Dashboard" },
        { to: "/rooms", label: "Manage Rooms" },
        { to: "/admin/bookings", label: "All Bookings" },
      ];
    }

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
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-[#0e0c0a]/85 shadow-lg backdrop-blur-md" : "bg-black/60 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex h-16 items-center justify-between lg:h-20">
            <Link to="/" className="flex items-center gap-3">
              <span className="text-2xl font-light tracking-[0.15em] text-white drop-shadow-sm">KNSU</span>
              <span className="text-xs uppercase tracking-[0.3em] text-[#B8956A]">STAYS</span>
            </Link>

            <nav className="hidden items-center gap-10 lg:flex">
              {navLinks.map((link) =>
                link.to.startsWith("/#") ? (
                  <a
                    key={link.label}
                    href={link.to}
                    className="relative text-[0.85rem] uppercase tracking-[0.15em] text-white/90 drop-shadow-sm after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-0 after:bg-[#B8956A] after:transition-all hover:text-white hover:after:w-full"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="relative text-[0.85rem] uppercase tracking-[0.15em] text-white/90 drop-shadow-sm after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-0 after:bg-[#B8956A] after:transition-all hover:text-white hover:after:w-full"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </nav>

            <div className="hidden items-center gap-6 lg:flex">
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((value) => !value)}
                    className="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B8956A] text-xs font-semibold uppercase text-white">
                      {user.firstName?.[0] || "U"}
                    </span>
                    <span>Hi, {user.firstName}</span>
                    <span className={`text-xs transition ${profileOpen ? "rotate-180" : ""}`}>▼</span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#171411] shadow-2xl backdrop-blur-md">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-3 text-sm text-white/90 transition hover:bg-white/8"
                        onClick={() => setProfileOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-3 text-left text-sm text-red-300 transition hover:bg-white/8"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-[0.85rem] tracking-[0.12em] text-white/90 drop-shadow-sm hover:text-white"
                  >
                    LOGIN / JOIN
                  </Link>

                  <Link
                    to="/register"
                    className="rounded-full bg-[#5B3FA6] px-6 py-2 text-sm tracking-wide text-white transition hover:bg-[#4a3288]"
                  >
                    BOOK NOW
                  </Link>
                </>
              )}
            </div>

            <button
              className="flex flex-col gap-1.5 lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <span className="h-[2px] w-5 bg-white" />
              <span className="h-[2px] w-5 bg-white" />
              <span className="h-[2px] w-5 bg-white" />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="space-y-5 bg-[#0e0c0a] px-6 py-6 text-white lg:hidden">
            {user && (
              <Link
                to="/dashboard"
                className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
              >
                Profile
              </Link>
            )}

            {navLinks.map((link) =>
              link.to.startsWith("/#") ? (
                <a key={link.label} href={link.to} className="block text-sm">
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} to={link.to} className="block text-sm">
                  {link.label}
                </Link>
              ),
            )}

            {user ? (
              <button onClick={handleLogout} className="text-red-400">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="block text-sm">
                  LOGIN / JOIN
                </Link>
                <Link to="/register" className="block rounded-full bg-[#5B3FA6] py-2 text-center">
                  BOOK NOW
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      <div className="h-16 lg:h-20" />
    </>
  );
};

export default Navbar;
