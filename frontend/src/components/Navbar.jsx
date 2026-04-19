// import { useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { logoutUser } from "../redux/authSlice";

// const navLinks = [
//   { to: "/#hotels",  label: "Hotels"       },
//   { to: "/#deals",   label: "Dining"       },
//   { to: "/#deals",   label: "Offers"       },
//   { to: "/#why-knsu",label: "Memberships"  },
//   { to: "/#why-knsu",label: "More"         },
// ];

// const Navbar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [menuOpen, setMenuOpen] = useState(false);
  
//   const { user } = useSelector((state) => state.auth);
//   const isHome = location.pathname === "/";
//   const role = user?.role || "guest_visit";

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     setMenuOpen(false);
//     navigate("/login");
//   };

//   // Define links based on user role
//   const getNavLinks = () => {
//     if (role === "admin" || role === "superAdmin") {
//       return [
//         { to: "/", label: "Home" },
//         { to: "/dashboard", label: "Dashboard" },
//         { to: "/rooms", label: "Manage Rooms" },
//         { to: "/admin/bookings", label: "All Bookings" },
//       ];
//     }
    
//     // Default Guest/User links
//     const links = [
//       { to: "/#hotels", label: "Hotels" },
//       { to: "/rooms", label: "Rooms" },
//       { to: "/#deals", label: "Dining" },
//     ];

//     if (user) {
//       links.push({ to: "/bookings", label: "My Bookings" });
//     }

//     return links;
//   };

//   const navLinks = getNavLinks();

//   return (
//     <header className={`topbar ${isHome ? "topbar--home" : ""}`}>
//       {/* Brand */}
//       <div className="topbar__brand">
//         <Link to="/">KNSU stays</Link>
//       </div>

//       {/* Desktop nav */}
//       <nav className="topbar__nav" aria-label="Main navigation">
//         {navLinks.map((link) => (
//           link.to.startsWith("/#") ? (
//             <a key={link.label} href={link.to} className="topbar__link">
//               {link.label}
//             </a>
//           ) : (
//             <Link key={link.label} to={link.to} className="topbar__link">
//               {link.label}
//             </Link>
//           )
//         ))}
//       </nav>

//       {/* Right actions */}
//       <div className="topbar__actions">
//         {user ? (
//           <div className="topbar__user-actions">
//             <span className="topbar__user-name">Hi, {user.firstName}</span>
//             <button onClick={handleLogout} className="topbar__link logout-btn">
//               Logout
//             </button>
//           </div>
//         ) : (
//           <Link
//             to="/login"
//             className={`topbar__link ${location.pathname === "/login" ? "active" : ""}`}
//           >
//             Login / Join
//           </Link>
//         )}
        
//         {!user && (
//           <Link to="/register" className="topbar__book-btn">
//             Book Now
//           </Link>
//         )}

//         {/* Hamburger */}
//         <button
//           className="topbar__hamburger"
//           aria-label="Toggle menu"
//           aria-expanded={menuOpen}
//           onClick={() => setMenuOpen((v) => !v)}
//         >
//           <span />
//           <span />
//           <span />
//         </button>
//       </div>

//       {/* Mobile drawer */}
//       {menuOpen && (
//         <div className="topbar__mobile-menu">
//           {navLinks.map((link) => (
//              link.to.startsWith("/#") ? (
//               <a
//                 key={link.label}
//                 href={link.to}
//                 className="topbar__mobile-link"
//                 onClick={() => setMenuOpen(false)}
//               >
//                 {link.label}
//               </a>
//             ) : (
//               <Link
//                 key={link.label}
//                 to={link.to}
//                 className="topbar__mobile-link"
//                 onClick={() => setMenuOpen(false)}
//               >
//                 {link.label}
//               </Link>
//             )
//           ))}
          
//           {user ? (
//             <button onClick={handleLogout} className="topbar__mobile-link logout-btn">
//               Logout
//             </button>
//           ) : (
//             <>
//               <Link to="/login" className="topbar__mobile-link" onClick={() => setMenuOpen(false)}>Login / Join</Link>
//               <Link to="/register" className="topbar__mobile-cta" onClick={() => setMenuOpen(false)}>Book Now</Link>
//             </>
//           )}
//         </div>
//       )}
//     </header>
//   );
// };


// export default Navbar;



import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "guest_visit";

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    setMenuOpen(false);
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0e0c0a]/85 backdrop-blur-md shadow-lg"
            : "bg-black/60 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex h-16 lg:h-20 items-center justify-between">

            {/* BRAND */}
            <Link to="/" className="flex items-center gap-3">
              <span className="text-2xl tracking-[0.15em] font-light text-white drop-shadow-sm">
                KNSU
              </span>
              <span className="text-xs tracking-[0.3em] text-[#B8956A] uppercase">
                STAYS
              </span>
            </Link>

            {/* NAV LINKS */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) =>
                link.to.startsWith("/#") ? (
                  <a
                    key={link.label}
                    href={link.to}
                    className="text-[0.85rem] tracking-[0.15em] uppercase text-white/90 hover:text-white drop-shadow-sm relative after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-[#B8956A] after:transition-all hover:after:w-full"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="text-[0.85rem] tracking-[0.15em] uppercase text-white/90 hover:text-white drop-shadow-sm relative after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-[#B8956A] after:transition-all hover:after:w-full"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* RIGHT SIDE */}
            <div className="hidden lg:flex items-center gap-6">
              {user ? (
                <>
                  <span className="text-sm text-white/90 drop-shadow-sm">
                    Hi, {user.firstName}
                  </span>

                  <button
                    onClick={handleLogout}
                    className="text-sm text-white/70 hover:text-white transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-[0.85rem] tracking-[0.12em] text-white/90 hover:text-white drop-shadow-sm"
                  >
                    LOGIN / JOIN
                  </Link>

                  <Link
                    to="/register"
                    className="px-6 py-2 rounded-full bg-[#5B3FA6] text-white text-sm tracking-wide hover:bg-[#4a3288] transition"
                  >
                    BOOK NOW
                  </Link>
                </>
              )}

            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              className="lg:hidden flex flex-col gap-1.5"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="w-5 h-[2px] bg-white"></span>
              <span className="w-5 h-[2px] bg-white"></span>
              <span className="w-5 h-[2px] bg-white"></span>
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="lg:hidden bg-[#0e0c0a] text-white px-6 py-6 space-y-5">
            {navLinks.map((link) =>
              link.to.startsWith("/#") ? (
                <a key={link.label} href={link.to} className="block text-sm">
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} to={link.to} className="block text-sm">
                  {link.label}
                </Link>
              )
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
                <Link
                  to="/register"
                  className="block text-center bg-[#5B3FA6] py-2 rounded-full"
                >
                  BOOK NOW
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default Navbar;