// import { useEffect, useRef, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { logoutUser } from "../redux/authSlice";

// const Navbar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const profileRef = useRef(null);

//   const { user } = useSelector((state) => state.auth);
//   const role = user?.role || "guest_visit";

//   useEffect(() => {
//     setMenuOpen(false);
//     setProfileOpen(false);
//   }, [location.pathname]);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setProfileOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     setMenuOpen(false);
//     setProfileOpen(false);
//     navigate("/login");
//   };

//   const getNavLinks = () => {
//     if (role === "admin" || role === "superAdmin") {
//       return [
//         { to: "/", label: "Home" },
//         { to: "/dashboard", label: "Dashboard" },
//         { to: "/admin/manage-rooms", label: "Manage Rooms" },
//         { to: "/admin/bookings", label: "All Bookings" },
//         { to: "/admin/dining-orders", label: "Dining Orders" },
//         { to: "/admin/menu", label: "Manage Menu" },
//       ];
//     }

//     const links = [
//       { to: "/#hotels", label: "Hotels" },
//       { to: "/rooms", label: "Rooms" },
//       { to: "/dining", label: "Dining" },
//     ];

//     if (user) {
//       links.push({ to: "/bookings", label: "My Bookings" });
//     }

//     return links;
//   };

//   const navLinks = getNavLinks();

//   return (
//     <>
//       <header
//         className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
//           scrolled ? "bg-[#0e0c0a]/85 shadow-lg backdrop-blur-md" : "bg-black/60 backdrop-blur-md"
//         }`}
//       >
//         <div className="mx-auto max-w-7xl px-6 lg:px-10">
//           <div className="flex h-16 items-center justify-between lg:h-20">
//             <Link to="/" className="flex items-center gap-3">
//               <span className="text-2xl font-light tracking-[0.15em] text-white drop-shadow-sm">KNSU</span>
//               <span className="text-xs uppercase tracking-[0.3em] text-[#B8956A]">STAYS</span>
//             </Link>

//             <nav className="hidden items-center gap-10 lg:flex">
//               {navLinks.map((link) =>
//                 link.to.startsWith("/#") ? (
//                   <a
//                     key={link.label}
//                     href={link.to}
//                     className="relative text-[0.85rem] uppercase tracking-[0.15em] text-white/90 drop-shadow-sm after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-0 after:bg-[#B8956A] after:transition-all hover:text-white hover:after:w-full"
//                   >
//                     {link.label}
//                   </a>
//                 ) : (
//                   <Link
//                     key={link.label}
//                     to={link.to}
//                     className="relative text-[0.85rem] uppercase tracking-[0.15em] text-white/90 drop-shadow-sm after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-0 after:bg-[#B8956A] after:transition-all hover:text-white hover:after:w-full"
//                   >
//                     {link.label}
//                   </Link>
//                 ),
//               )}
//             </nav>

//             <div className="hidden items-center gap-6 lg:flex">
//               {user ? (
//                 <div className="relative" ref={profileRef}>
//                   <button
//                     onClick={() => setProfileOpen((value) => !value)}
//                     className="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
//                   >
//                     <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B8956A] text-xs font-semibold uppercase text-white">
//                       {user.firstName?.[0] || "U"}
//                     </span>
//                     <span>Hi, {user.firstName}</span>
//                     <span className={`text-xs transition ${profileOpen ? "rotate-180" : ""}`}>▼</span>
//                   </button>

//                   {profileOpen && (
//                     <div className="absolute right-0 mt-3 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#171411] shadow-2xl backdrop-blur-md">
//                       <Link
//                         to="/dashboard"
//                         className="block px-4 py-3 text-sm text-white/90 transition hover:bg-white/8"
//                         onClick={() => setProfileOpen(false)}
//                       >
//                         Profile
//                       </Link>
//                       <button
//                         onClick={handleLogout}
//                         className="block w-full px-4 py-3 text-left text-sm text-red-300 transition hover:bg-white/8"
//                       >
//                         Logout
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <>
//                   <Link
//                     to="/login"
//                     className="text-[0.85rem] tracking-[0.12em] text-white/90 drop-shadow-sm hover:text-white"
//                   >
//                     LOGIN / JOIN
//                   </Link>

//                   <Link
//                     to="/register"
//                     className="rounded-full bg-[#5B3FA6] px-6 py-2 text-sm tracking-wide text-white transition hover:bg-[#4a3288]"
//                   >
//                     BOOK NOW
//                   </Link>
//                 </>
//               )}
//             </div>

//             <button
//               className="flex flex-col gap-1.5 lg:hidden"
//               onClick={() => setMenuOpen((v) => !v)}
//               aria-label="Toggle menu"
//             >
//               <span className="h-[2px] w-5 bg-white" />
//               <span className="h-[2px] w-5 bg-white" />
//               <span className="h-[2px] w-5 bg-white" />
//             </button>
//           </div>
//         </div>

//         {menuOpen && (
//           <div className="space-y-5 bg-[#0e0c0a] px-6 py-6 text-white lg:hidden">
//             {user && (
//               <Link
//                 to="/dashboard"
//                 className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
//               >
//                 Profile
//               </Link>
//             )}

//             {navLinks.map((link) =>
//               link.to.startsWith("/#") ? (
//                 <a key={link.label} href={link.to} className="block text-sm">
//                   {link.label}
//                 </a>
//               ) : (
//                 <Link key={link.label} to={link.to} className="block text-sm">
//                   {link.label}
//                 </Link>
//               ),
//             )}

//             {user ? (
//               <button onClick={handleLogout} className="text-red-400">
//                 Logout
//               </button>
//             ) : (
//               <>
//                 <Link to="/login" className="block text-sm">
//                   LOGIN / JOIN
//                 </Link>
//                 <Link to="/register" className="block rounded-full bg-[#5B3FA6] py-2 text-center">
//                   BOOK NOW
//                 </Link>
//               </>
//             )}
//           </div>
//         )}
//       </header>

//       <div className="h-16 lg:h-20" />
//     </>
//   );
// };

// export default Navbar;
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
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "guest_visit";
  const isAdmin = role === "admin" || role === "superAdmin";

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        menuOpen
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setMenuOpen(false);
    setProfileOpen(false);
    navigate("/login");
  };

  const guestLinks = [
    { to: "/#hotels", label: "Hotels", hash: true },
    { to: "/rooms", label: "Rooms" },
    { to: "/dining", label: "Dining" },
    ...(user ? [{ to: "/bookings", label: "My Bookings" }] : []),
  ];

  const adminLinks = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/admin/manage-rooms", label: "Rooms" },
    { to: "/admin/bookings", label: "Bookings" },
    { to: "/admin/dining-orders", label: "Orders" },
    { to: "/admin/menu", label: "Menu" },
  ];

  const navLinks = isAdmin ? adminLinks : guestLinks;

  const isActive = (to) => location.pathname === to;

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U"
    : "U";

  const NavLink = ({ link, mobile = false }) => {
    const active = isActive(link.to);
    const baseClass = mobile
      ? `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
          active
            ? "bg-[#5B3FA6]/15 text-[#8B6FD4]"
            : "text-white/70 hover:bg-white/5 hover:text-white"
        }`
      : `relative text-[0.8rem] font-medium uppercase tracking-[0.12em] transition-all duration-200 ${
          active ? "text-[#B8956A]" : "text-white/80 hover:text-white"
        }`;

    const underline = !mobile && (
      <span
        className={`absolute -bottom-1 left-0 h-[1.5px] bg-[#B8956A] transition-all duration-300 ${
          active ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    );

    if (link.hash) {
      return (
        <a href={link.to} className={`group ${baseClass}`}>
          {mobile && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />}
          {link.label}
          {underline}
        </a>
      );
    }

    return (
      <Link to={link.to} className={`group ${baseClass}`}>
        {mobile && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />}
        {link.label}
        {underline}
      </Link>
    );
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/8 bg-[#0B0908]/92 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="flex h-16 items-center justify-between lg:h-[68px]">

            {/* ── Brand ── */}
            <Link
              to={isAdmin ? "/admin/manage-rooms" : "/"}
              className="group flex shrink-0 items-center gap-2.5"
            >
              <div className="flex flex-col leading-none">
                <span className="text-[1rem] font-light tracking-[0.18em] text-white">
                  KNSU
                </span>
                <span className="text-[0.5rem] tracking-[0.35em] text-[#B8956A]">
                  {isAdmin ? "ADMIN" : "STAYS"}
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className={`hidden items-center lg:flex ${isAdmin ? "gap-1" : "gap-8"}`}>
              {isAdmin ? (
                <div className="flex items-center rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-sm">
                  {navLinks.map((link) => {
                    const active = isActive(link.to);
                    return (
                      <Link
                        key={link.label}
                        to={link.to}
                        className={`rounded-lg px-3.5 py-1.5 text-[0.78rem] font-medium tracking-wide transition-all duration-200 ${
                          active
                            ? "bg-[#5B3FA6] text-white shadow-[0_2px_8px_rgba(91,63,166,0.5)]"
                            : "text-white/60 hover:bg-white/8 hover:text-white"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                navLinks.map((link) => (
                  <NavLink key={link.label} link={link} />
                ))
              )}
            </nav>

            {/* ── Desktop Right ── */}
            <div className="hidden items-center gap-3 lg:flex">
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((v) => !v)}
                    className="flex items-center gap-2.5 rounded-full border border-white/12 bg-white/5 py-1.5 pl-1.5 pr-4 text-sm text-white/90 transition-all duration-200 hover:border-white/20 hover:bg-white/10"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#7B5FC4] to-[#5B3FA6] text-[0.65rem] font-bold text-white">
                      {initials}
                    </span>
                    <span className="text-[0.82rem] font-medium">{user.firstName}</span>
                    {isAdmin && (
                      <span className="rounded-md bg-[#5B3FA6]/30 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-[#A88ED4]">
                        {role === "superAdmin" ? "Super" : "Admin"}
                      </span>
                    )}
                    <svg
                      className={`h-3 w-3 text-white/40 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#141210]/95 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                      <div className="border-b border-white/8 px-4 py-3">
                        <p className="text-[0.82rem] font-semibold text-white">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-[0.72rem] text-white/40">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-[0.82rem] text-white/75 transition hover:bg-white/6 hover:text-white"
                          onClick={() => setProfileOpen(false)}
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          My Profile
                        </Link>
                        {!isAdmin && (
                          <Link
                            to="/bookings"
                            className="flex items-center gap-3 px-4 py-2.5 text-[0.82rem] text-white/75 transition hover:bg-white/6 hover:text-white"
                            onClick={() => setProfileOpen(false)}
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            My Bookings
                          </Link>
                        )}
                        <div className="my-1 mx-3 border-t border-white/8" />
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[0.82rem] text-red-400/80 transition hover:bg-red-500/8 hover:text-red-400"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="rounded-full px-4 py-2 text-[0.8rem] font-medium tracking-wide text-white/80 transition hover:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-full bg-[#5B3FA6] px-5 py-2 text-[0.8rem] font-semibold tracking-wide text-white shadow-[0_4px_16px_rgba(91,63,166,0.4)] transition hover:bg-[#4a3288] hover:shadow-[0_6px_20px_rgba(91,63,166,0.5)]"
                  >
                    Book Now
                  </Link>
                </div>
              )}
            </div>

            {/* ── Mobile Hamburger ── */}
            <button
              className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-xl border border-white/10 bg-white/5 lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <span className={`h-[1.5px] w-5 bg-white transition-all duration-300 ${menuOpen ? "translate-y-[6.5px] rotate-45" : ""}`} />
              <span className={`h-[1.5px] w-5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`h-[1.5px] w-5 bg-white transition-all duration-300 ${menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Overlay ── */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* ── Mobile Drawer ── */}
      <div
        ref={mobileMenuRef}
        className={`fixed right-0 top-0 z-50 flex h-full w-[280px] flex-col bg-[#0D0B0A] shadow-[0_0_60px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-out lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div className="flex flex-col leading-none">
            <span className="text-sm font-light tracking-[0.2em] text-white">KNSU STAYS</span>
            <span className="text-[0.5rem] tracking-[0.3em] text-[#B8956A]">
              {isAdmin ? "ADMIN" : "STAYS"}
            </span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User info in drawer */}
        {user && (
          <div className="border-b border-white/8 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7B5FC4] to-[#5B3FA6] text-sm font-bold text-white">
                {initials}
              </span>
              <div>
                <p className="text-sm font-medium text-white">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[0.7rem] text-white/40">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-2 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-white/25">
            {isAdmin ? "Admin Panel" : "Navigation"}
          </p>
          <div className="space-y-0.5">
            {navLinks.map((link) => (
              <NavLink key={link.label} link={link} mobile />
            ))}
          </div>

          {user && (
            <>
              <p className="mb-2 mt-5 px-2 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-white/25">
                Account
              </p>
              <div className="space-y-0.5">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition-all hover:bg-white/5 hover:text-white"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
                  Profile
                </Link>
              </div>
            </>
          )}
        </nav>

        {/* Drawer footer */}
        <div className="border-t border-white/8 px-3 py-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/8 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/15"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                className="rounded-xl border border-white/10 py-3 text-center text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-[#5B3FA6] py-3 text-center text-sm font-semibold text-white shadow-[0_4px_16px_rgba(91,63,166,0.35)] transition hover:bg-[#4a3288]"
              >
                Book Now
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Spacer */}
      <div className="h-16 lg:h-[68px]" />
    </>
  );
};

export default Navbar;