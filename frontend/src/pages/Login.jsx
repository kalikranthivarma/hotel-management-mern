// import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { loginUser, loginAdmin } from "../api/authApi";
// import { setCredentials } from "../redux/authSlice";

// const Login = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();

//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState(location.state?.message || "");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const isAdminPath = location.pathname.startsWith("/admin");
//   const loginAction = isAdminPath ? loginAdmin : loginUser;
//   const label = isAdminPath ? "Staff" : "Guest";

//   useEffect(() => {
//     if (location.state?.message) {
//       setSuccessMessage(location.state.message);
//       window.history.replaceState({}, document.title);
//     }
//   }, [location.state]);

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((current) => ({ ...current, [name]: value }));
//     if (error) setError("");
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setError("");

//     if (!formData.email.trim() || !formData.password.trim()) {
//       setError("Please enter your email and password.");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const { data } = await loginAction({
//         email: formData.email.trim(),
//         password: formData.password,
//       });

//       const account = data.user || data.admin;
//       const normalizedUser = account
//         ? {
//             ...account,
//             role:
//               account.role ||
//               (isAdminPath || account.employeeId || account.department ? "admin" : "guest"),
//           }
//         : null;

//       dispatch(setCredentials({ token: data.token, user: normalizedUser }));
//       const nextRoute =
//         normalizedUser?.role === "admin" || normalizedUser?.role === "superAdmin"
//           ? "/admin/manage-rooms"
//           : "/rooms";

//       navigate(nextRoute, { replace: true });
//     } catch (submitError) {
//       setError(
//         submitError.response?.data?.message ||
//           submitError.message ||
//           "Login failed."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex bg-[#FAFAF8]">

//       {/* ── Left Panel — Brand Visual ── */}
//       <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col">

//         {/* Background image */}
//         <img
//           src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=85"
//           alt="Luxury hotel"
//           className="absolute inset-0 w-full h-full object-cover"
//         />

//         {/* Dark gradient overlay */}
//         <div className="absolute inset-0 bg-gradient-to-br from-[#160842]/90 via-[#5B3FA6]/60 to-[#160842]/80" />

//         {/* Decorative corner brackets */}
//         <div className="absolute top-10 left-10 h-14 w-14 border-t-2 border-l-2 border-white/20" />
//         <div className="absolute top-10 right-10 h-14 w-14 border-t-2 border-r-2 border-white/20" />
//         <div className="absolute bottom-10 left-10 h-14 w-14 border-b-2 border-l-2 border-white/20" />
//         <div className="absolute bottom-10 right-10 h-14 w-14 border-b-2 border-r-2 border-white/20" />

//         {/* Top brand mark */}
//         <div className="relative z-10 p-10">
//           <Link to="/" className="flex items-center gap-3">
//             <span className="text-2xl tracking-[0.15em] font-light text-white">KNSU</span>
//             <span className="text-xs tracking-[0.3em] text-purple-300 uppercase">STAYS</span>
//           </Link>
//         </div>

//         {/* Center quote */}
//         <div className="relative z-10 flex-1 flex flex-col justify-center px-14">
//           <div className="h-px w-12 bg-purple-400/60 mb-8" />
//           <p className="text-[0.68rem] tracking-[0.35em] uppercase text-purple-300 mb-5">
//             {label} Portal
//           </p>
//           <h2 className="font-serif text-4xl xl:text-5xl text-white leading-[1.1] mb-6">
//             Where Every<br />Stay Becomes<br />
//             <span className="text-purple-300">a Memory</span>
//           </h2>
//           <p className="text-white/50 text-sm leading-relaxed max-w-xs">
//             Access your account to manage bookings, explore member-only rates, and enjoy priority service across all KNSU properties.
//           </p>
//           <div className="h-px w-12 bg-purple-400/60 mt-8" />
//         </div>

//         {/* Bottom tagline */}
//         <div className="relative z-10 p-10">
//           <p className="text-[0.65rem] tracking-[0.25em] uppercase text-white/25">
//             Curated Luxury · Iconic Destinations
//           </p>
//         </div>
//       </div>

//       {/* ── Right Panel — Form ── */}
//       <div className="w-full lg:w-1/2 flex flex-col min-h-screen">

//         {/* Mobile brand header */}
//         <div className="lg:hidden flex items-center justify-between px-6 py-5 border-b border-[#E8E0D8]">
//           <Link to="/" className="flex items-center gap-2">
//             <span className="text-lg tracking-[0.15em] font-light text-[#160842]">KNSU</span>
//             <span className="text-[0.6rem] tracking-[0.3em] text-[#5B3FA6] uppercase">STAYS</span>
//           </Link>
//           <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[#5B3FA6]/70 font-medium">
//             {label} Portal
//           </span>
//         </div>

//         {/* Form area */}
//         <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-20">
//           <div className="w-full max-w-md">

//             {/* Heading */}
//             <div className="mb-10">
//               <p className="text-[0.65rem] tracking-[0.3em] uppercase text-[#5B3FA6] font-bold mb-3">
//                 {label} Login
//               </p>
//               <h1 className="font-serif text-3xl sm:text-4xl text-[#160842] leading-tight mb-3">
//                 Welcome back
//               </h1>
//               <p className="text-sm text-gray-400 leading-relaxed">
//                 Only verified {label.toLowerCase()} accounts should continue to login.
//               </p>
//             </div>

//             {/* Success message */}
//             {successMessage && (
//               <div className="mb-6 flex items-start gap-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3">
//                 <span className="text-green-500 mt-0.5 text-base">✓</span>
//                 <p className="text-sm text-green-700">{successMessage}</p>
//               </div>
//             )}

//             {/* Error message */}
//             {error && (
//               <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
//                 <span className="text-red-400 mt-0.5 text-base">!</span>
//                 <p className="text-sm text-red-600">{error}</p>
//               </div>
//             )}

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="space-y-5">

//               {/* Email */}
//               <div className="flex flex-col gap-1.5">
//                 <label className="text-[0.72rem] tracking-[0.12em] uppercase font-semibold text-[#160842]/60">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   autoComplete={isAdminPath ? "username" : "email"}
//                   placeholder="name@example.com"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="
//                     w-full rounded-xl border border-[#E8E0D8] bg-white
//                     px-4 py-3.5 text-sm text-[#160842]
//                     placeholder:text-gray-300
//                     outline-none
//                     transition-all duration-200
//                     focus:border-[#5B3FA6] focus:ring-2 focus:ring-[#5B3FA6]/10
//                     hover:border-[#5B3FA6]/40
//                   "
//                 />
//               </div>

//               {/* Password */}
//               <div className="flex flex-col gap-1.5">
//                 <div className="flex items-center justify-between">
//                   <label className="text-[0.72rem] tracking-[0.12em] uppercase font-semibold text-[#160842]/60">
//                     Password
//                   </label>
//                   <Link
//                     to={isAdminPath ? "/admin/forgot-password" : "/forgot-password"}
//                     className="text-[0.72rem] text-[#5B3FA6] hover:text-[#4a3288] transition-colors"
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     autoComplete="current-password"
//                     placeholder="Enter password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="
//                       w-full rounded-xl border border-[#E8E0D8] bg-white
//                       px-4 py-3.5 pr-12 text-sm text-[#160842]
//                       placeholder:text-gray-300
//                       outline-none
//                       transition-all duration-200
//                       focus:border-[#5B3FA6] focus:ring-2 focus:ring-[#5B3FA6]/10
//                       hover:border-[#5B3FA6]/40
//                     "
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((v) => !v)}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#5B3FA6] transition-colors text-xs"
//                   >
//                     {showPassword ? "HIDE" : "SHOW"}
//                   </button>
//                 </div>
//               </div>

//               {/* Submit */}
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="
//                   relative w-full overflow-hidden rounded-full
//                   bg-[#5B3FA6] hover:bg-[#4a3288]
//                   px-8 py-4 mt-2
//                   text-[0.85rem] font-bold tracking-[0.12em] uppercase text-white
//                   shadow-[0_8px_30px_rgba(91,63,166,0.35)]
//                   transition-all duration-300
//                   hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(91,63,166,0.45)]
//                   active:translate-y-0
//                   disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
//                   group
//                 "
//               >
//                 <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/10 transition-transform duration-700 group-hover:translate-x-full" />
//                 <span className="relative">
//                   {isSubmitting ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
//                       Signing in…
//                     </span>
//                   ) : (
//                     "Login"
//                   )}
//                 </span>
//               </button>
//             </form>

//             {/* Divider */}
//             <div className="my-8 flex items-center gap-4">
//               <div className="flex-1 h-px bg-[#E8E0D8]" />
//               <span className="text-[0.65rem] tracking-[0.2em] uppercase text-gray-300">or</span>
//               <div className="flex-1 h-px bg-[#E8E0D8]" />
//             </div>

//             {/* Footer links */}
//             <div className="space-y-3 text-center">
//               <p className="text-sm text-gray-400">
//                 Don't have an account?{" "}
//                 <Link
//                   to={isAdminPath ? "/admin/register" : "/register"}
//                   className="text-[#5B3FA6] font-medium hover:text-[#4a3288] transition-colors"
//                 >
//                   Create one
//                 </Link>
//               </p>
//               <p className="text-sm text-gray-400">
//                 Link expired?{" "}
//                 <Link to="/resend-verification" className="text-[#5B3FA6] font-medium hover:text-[#4a3288] transition-colors">
//                   Resend verification link
//                 </Link>
//               </p>
//             </div>

//             {/* Staff / Guest switcher */}
//             <div className="mt-8 pt-6 border-t border-[#E8E0D8] text-center">
//               <p className="text-sm text-gray-400">
//                 {isAdminPath ? "Are you a guest?" : "Are you hotel staff?"}{" "}
//                 <Link
//                   to={isAdminPath ? "/login" : "/admin/login"}
//                   className="text-[#5B3FA6] font-medium hover:text-[#4a3288] transition-colors"
//                 >
//                   {isAdminPath ? "Guest Login" : "Staff Portal →"}
//                 </Link>
//               </p>
//             </div>

//           </div>
//         </div>

//         {/* Bottom copyright */}
//         <div className="px-6 py-4 border-t border-[#E8E0D8] lg:hidden">
//           <p className="text-center text-[0.68rem] tracking-wide text-gray-300">
//             © 2026 KNSU STAYS. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser, loginAdmin } from "../api/authApi";
import { setCredentials } from "../redux/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(location.state?.message || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ── NEW: derive role from URL, but allow manual toggle ──
  const [isAdmin, setIsAdmin] = useState(location.pathname.startsWith("/admin"));

  const loginAction = isAdmin ? loginAdmin : loginUser;
  const label = isAdmin ? "Staff" : "Guest";

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Clear errors when toggling role
  const handleToggle = (adminMode) => {
    setIsAdmin(adminMode);
    setError("");
    setFormData({ email: "", password: "" });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await loginAction({
        email: formData.email.trim(),
        password: formData.password,
      });

      const account = data.user || data.admin;
      const normalizedUser = account
        ? {
            ...account,
            // NEVER use isAdminPath to determine role — always trust the backend.
            // If backend sends no role, only staff fields (employeeId/department) indicate admin.
            role: account.role || (account.employeeId || account.department ? "admin" : "guest"),
          }
        : null;

      dispatch(setCredentials({ token: data.token, user: normalizedUser }));
      const nextRoute =
        normalizedUser?.role === "admin" || normalizedUser?.role === "superAdmin"
          ? "/admin/manage-rooms"
          : "/rooms";

      navigate(nextRoute, { replace: true });
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          submitError.message ||
          "Login failed."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FAFAF8]">

      {/* ── Left Panel — Brand Visual ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col">
        <img
          src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=85"
          alt="Luxury hotel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#160842]/90 via-[#5B3FA6]/60 to-[#160842]/80" />
        <div className="absolute top-10 left-10 h-14 w-14 border-t-2 border-l-2 border-white/20" />
        <div className="absolute top-10 right-10 h-14 w-14 border-t-2 border-r-2 border-white/20" />
        <div className="absolute bottom-10 left-10 h-14 w-14 border-b-2 border-l-2 border-white/20" />
        <div className="absolute bottom-10 right-10 h-14 w-14 border-b-2 border-r-2 border-white/20" />

        <div className="relative z-10 p-10">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-2xl tracking-[0.15em] font-light text-white">KNSU</span>
            <span className="text-xs tracking-[0.3em] text-purple-300 uppercase">STAYS</span>
          </Link>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center px-14">
          <div className="h-px w-12 bg-purple-400/60 mb-8" />
          <p className="text-[0.68rem] tracking-[0.35em] uppercase text-purple-300 mb-5">
            {label} Portal
          </p>
          <h2 className="font-serif text-4xl xl:text-5xl text-white leading-[1.1] mb-6">
            Where Every<br />Stay Becomes<br />
            <span className="text-purple-300">a Memory</span>
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            Access your account to manage bookings, explore member-only rates, and enjoy priority service across all KNSU properties.
          </p>
          <div className="h-px w-12 bg-purple-400/60 mt-8" />
        </div>

        <div className="relative z-10 p-10">
          <p className="text-[0.65rem] tracking-[0.25em] uppercase text-white/25">
            Curated Luxury · Iconic Destinations
          </p>
        </div>
      </div>

      {/* ── Right Panel — Form ── */}
      <div className="w-full lg:w-1/2 flex flex-col min-h-screen">

        {/* Mobile brand header */}
        <div className="lg:hidden flex items-center justify-between px-6 py-5 border-b border-[#E8E0D8]">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-lg tracking-[0.15em] font-light text-[#160842]">KNSU</span>
            <span className="text-[0.6rem] tracking-[0.3em] text-[#5B3FA6] uppercase">STAYS</span>
          </Link>
          <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[#5B3FA6]/70 font-medium">
            {label} Portal
          </span>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-20">
          <div className="w-full max-w-md">

            {/* Heading */}
            <div className="mb-8">
              <p className="text-[0.65rem] tracking-[0.3em] uppercase text-[#5B3FA6] font-bold mb-3">
                {label} Login
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#160842] leading-tight mb-3">
                Welcome back
              </h1>
              <p className="text-sm text-gray-400 leading-relaxed">
                Only verified {label.toLowerCase()} accounts should continue to login.
              </p>
            </div>

            {/* ── Guest / Staff Toggle ── */}
            <div className="flex rounded-xl border border-[#E8E0D8] overflow-hidden mb-8 bg-[#F5F2EF]">
              <button
                type="button"
                onClick={() => handleToggle(false)}
                className={`
                  flex-1 py-3 text-[0.8rem] font-semibold tracking-[0.1em] uppercase
                  transition-all duration-200
                  ${!isAdmin
                    ? "bg-[#5B3FA6] text-white shadow-md"
                    : "text-[#5B3FA6]/60 hover:text-[#5B3FA6] hover:bg-[#EDE9F8]"
                  }
                `}
              >
                Login as Guest
              </button>
              <div className="w-px bg-[#E8E0D8]" />
              <button
                type="button"
                onClick={() => handleToggle(true)}
                className={`
                  flex-1 py-3 text-[0.8rem] font-semibold tracking-[0.1em] uppercase
                  transition-all duration-200
                  ${isAdmin
                    ? "bg-[#5B3FA6] text-white shadow-md"
                    : "text-[#5B3FA6]/60 hover:text-[#5B3FA6] hover:bg-[#EDE9F8]"
                  }
                `}
              >
                Login as Staff
              </button>
            </div>

            {/* Success message */}
            {successMessage && (
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3">
                <span className="text-green-500 mt-0.5 text-base">✓</span>
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                <span className="text-red-400 mt-0.5 text-base">!</span>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.72rem] tracking-[0.12em] uppercase font-semibold text-[#160842]/60">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  autoComplete={isAdmin ? "username" : "email"}
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="
                    w-full rounded-xl border border-[#E8E0D8] bg-white
                    px-4 py-3.5 text-sm text-[#160842]
                    placeholder:text-gray-300
                    outline-none
                    transition-all duration-200
                    focus:border-[#5B3FA6] focus:ring-2 focus:ring-[#5B3FA6]/10
                    hover:border-[#5B3FA6]/40
                  "
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[0.72rem] tracking-[0.12em] uppercase font-semibold text-[#160842]/60">
                    Password
                  </label>
                  <Link
                    to={isAdmin ? "/admin/forgot-password" : "/forgot-password"}
                    className="text-[0.72rem] text-[#5B3FA6] hover:text-[#4a3288] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    className="
                      w-full rounded-xl border border-[#E8E0D8] bg-white
                      px-4 py-3.5 pr-12 text-sm text-[#160842]
                      placeholder:text-gray-300
                      outline-none
                      transition-all duration-200
                      focus:border-[#5B3FA6] focus:ring-2 focus:ring-[#5B3FA6]/10
                      hover:border-[#5B3FA6]/40
                    "
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#5B3FA6] transition-colors text-xs"
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  relative w-full overflow-hidden rounded-full
                  bg-[#5B3FA6] hover:bg-[#4a3288]
                  px-8 py-4 mt-2
                  text-[0.85rem] font-bold tracking-[0.12em] uppercase text-white
                  shadow-[0_8px_30px_rgba(91,63,166,0.35)]
                  transition-all duration-300
                  hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(91,63,166,0.45)]
                  active:translate-y-0
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
                  group
                "
              >
                <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/10 transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Signing in…
                    </span>
                  ) : (
                    `Login as ${label}`
                  )}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-[#E8E0D8]" />
              <span className="text-[0.65rem] tracking-[0.2em] uppercase text-gray-300">or</span>
              <div className="flex-1 h-px bg-[#E8E0D8]" />
            </div>

            {/* Footer links */}
            <div className="space-y-3 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <Link
                  to={isAdmin ? "/admin/register" : "/register"}
                  className="text-[#5B3FA6] font-medium hover:text-[#4a3288] transition-colors"
                >
                  Create one
                </Link>
              </p>
              <p className="text-sm text-gray-400">
                Link expired?{" "}
                <Link to="/resend-verification" className="text-[#5B3FA6] font-medium hover:text-[#4a3288] transition-colors">
                  Resend verification link
                </Link>
              </p>
            </div>

          </div>
        </div>

        {/* Bottom copyright */}
        <div className="px-6 py-4 border-t border-[#E8E0D8] lg:hidden">
          <p className="text-center text-[0.68rem] tracking-wide text-gray-300">
            © 2026 KNSU STAYS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;