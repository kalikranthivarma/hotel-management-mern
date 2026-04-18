import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  registerUserStep1,
  verifyUserOTP,
  registerUserStep3,
} from "../api/authApi";

// ── Step 1 state
const initStep1 = { firstName: "", lastName: "", email: "" };
// ── Step 3 state
const initStep3 = {
  phone: "",
  address: "",
  idProof: "",
  password: "",
  confirmPassword: "",
};

const Register = () => {
  const navigate = useNavigate();

  // Which step are we on? 1, 2, or 3
  const [step, setStep] = useState(1);

  const [step1Data, setStep1Data] = useState(initStep1);
  const [otp, setOtp] = useState("");
  const [step3Data, setStep3Data] = useState(initStep3);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

<<<<<<< HEAD
  // ── Generic change handlers ──
  const handleStep1Change = (e) => {
    setStep1Data((p) => ({ ...p, [e.target.name]: e.target.value }));
=======
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
>>>>>>> 6a63a04cddcdb6656e1efdcbc78a276fc324a812
    if (error) setError("");
  };

  const handleStep3Change = (e) => {
    setStep3Data((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  // ── Step 1: request OTP ──
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !step1Data.firstName.trim() ||
      !step1Data.lastName.trim() ||
      !step1Data.email.trim()
    ) {
      setError("Please fill in first name, last name, and email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await registerUserStep1({
        firstName: step1Data.firstName.trim(),
        lastName: step1Data.lastName.trim(),
        email: step1Data.email.trim(),
      });
      setSuccess(data?.message || "OTP sent to your email.");
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to send OTP."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Step 2: verify OTP ──
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp.trim()) {
      setError("Please enter the OTP sent to your email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await verifyUserOTP({
        email: step1Data.email.trim(),
        otp: otp.trim(),
      });
      setSuccess(data?.message || "Email verified! Please complete your registration.");
      setStep(3);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "OTP verification failed."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Step 3: complete registration ──
  const handleStep3Submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !step3Data.phone.trim() ||
      !step3Data.password.trim() ||
      !step3Data.confirmPassword.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (step3Data.password !== step3Data.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await registerUserStep3({
        email: step1Data.email.trim(),
        phone: step3Data.phone.trim(),
        address: step3Data.address.trim(),
        idProof: step3Data.idProof.trim(),
        password: step3Data.password,
        confirmPassword: step3Data.confirmPassword,
      });
      setSuccess(data?.message || "Registration completed successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Registration failed."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

<<<<<<< HEAD
  // ── Step indicator ──
  const stepLabel = ["Send OTP", "Verify OTP", "Complete Registration"];

  return (
    <section className="register-page">
      <div className="register-hero">
        <p className="register-eyebrow">Guest Registration</p>
        <h1>Create your hotel account</h1>
        <p className="register-copy">
          Register in 3 simple steps: enter your email, verify via OTP, then
          complete your profile.
        </p>

        <div className="register-panel">
          <span>Step {step} of 3</span>
          <strong>{stepLabel[step - 1]}</strong>
          <p>
            {step === 1 && "Enter your name and email to receive a 6-digit OTP."}
            {step === 2 && `Enter the OTP sent to ${step1Data.email}.`}
            {step === 3 && "Fill in your remaining details to complete registration."}
=======
  /* ── Shared input class ── */
  const inputCls = `
    w-full rounded-xl border border-[#E8E0D8] bg-white
    px-4 py-3 text-sm text-[#160842]
    placeholder:text-gray-300
    outline-none transition-all duration-200
    focus:border-[#5B3FA6] focus:ring-2 focus:ring-[#5B3FA6]/10
    hover:border-[#5B3FA6]/40
  `;

  const labelCls =
    "text-[0.72rem] tracking-[0.12em] uppercase font-semibold text-[#160842]/60 mb-1.5 block";

  return (
    <div className="min-h-screen w-full flex bg-[#FAFAF8]">

              {/* ── Left Panel — Brand Visual (desktop only) ── */}
              <div className="hidden lg:flex lg:w-[42%] xl:w-[38%] relative overflow-hidden flex-col flex-shrink-0">

                {/* Background image */}
                <img
                  src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=85"
                  alt="Luxury hotel"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#160842]/92 via-[#5B3FA6]/65 to-[#160842]/85" />

                {/* Corner brackets */}
                <div className="absolute top-10 left-10 h-14 w-14 border-t-2 border-l-2 border-white/20" />
                <div className="absolute top-10 right-10 h-14 w-14 border-t-2 border-r-2 border-white/20" />
                <div className="absolute bottom-10 left-10 h-14 w-14 border-b-2 border-l-2 border-white/20" />
                <div className="absolute bottom-10 right-10 h-14 w-14 border-b-2 border-r-2 border-white/20" />

                {/* Brand */}
                <div className="relative z-10 p-10">
                  <Link to="/" className="flex items-center gap-3">
                    <span className="text-2xl tracking-[0.15em] font-light text-white">KNSU</span>
                    <span className="text-xs tracking-[0.3em] text-purple-300 uppercase">STAYS</span>
                  </Link>
                </div>

                {/* Quote */}
                <div className="relative z-10 flex-1 flex flex-col justify-center px-12 xl:px-14">
                  <div className="h-px w-12 bg-purple-400/60 mb-8" />
                  <p className="text-[0.68rem] tracking-[0.35em] uppercase text-purple-300 mb-5">
                    Guest Registration
                  </p>
                  <h2 className="font-serif text-4xl xl:text-[2.6rem] text-white leading-[1.1] mb-6">
                    Begin Your<br />Journey With<br />
                    <span className="text-purple-300">KNSU Stays</span>
                  </h2>
                  <p className="text-white/50 text-sm leading-relaxed max-w-[260px]">
                    Create your account today and unlock exclusive member rates, priority
                    booking, and personalised service at every property.
                  </p>
                  <div className="h-px w-12 bg-purple-400/60 mt-8" />

                  {/* Mini perks */}
                  <div className="mt-8 space-y-3">
                    {[
                      "Member-only room rates",
                      "Priority check-in & checkout",
                      "Curated travel recommendations",
                    ].map((perk) => (
                      <div key={perk} className="flex items-center gap-3">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-400/20 text-purple-300 text-[0.6rem]">✓</span>
                        <span className="text-white/50 text-xs tracking-wide">{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom */}
                <div className="relative z-10 p-10">
                  <p className="text-[0.65rem] tracking-[0.25em] uppercase text-white/25">
                    Curated Luxury · Iconic Destinations
>>>>>>> 6a63a04cddcdb6656e1efdcbc78a276fc324a812
                  </p>
                </div>
              </div>

<<<<<<< HEAD
  {/* ── STEP 1: Name + Email ── */ }
  {
    step === 1 && (
      <form className="register-card" onSubmit={handleStep1Submit}>
        <div className="register-card-heading">
          <h2>Sign up</h2>
          <p>Enter your name and email — we'll send a verification OTP.</p>
        </div>

        <div className="field-grid">
          <label className="field">
            <span>First name</span>
            <input
              type="text"
              name="firstName"
              placeholder="Enter first name"
              value={step1Data.firstName}
              onChange={handleStep1Change}
            />
          </label>

          <label className="field">
            <span>Last name</span>
            <input
              type="text"
              name="lastName"
              placeholder="Enter last name"
              value={step1Data.lastName}
              onChange={handleStep1Change}
            />
          </label>

          <label className="field field-full">
            <span>Email address</span>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={step1Data.email}
              onChange={handleStep1Change}
            />
          </label>
        </div>

        <button type="submit" className="register-button" disabled={isSubmitting}>
          {isSubmitting ? "Sending OTP..." : "Send OTP"}
        </button>

        {success && <p className="form-message success">{success}</p>}
        {error && <p className="form-message error">{error}</p>}

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
        <p className="auth-switch" style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #E8E4DF" }}>
          Are you hotel staff? <Link to="/admin/register">Staff Registration</Link>
        </p>
      </form>
    )
  }

  {/* ── STEP 2: OTP Verification ── */ }
  {
    step === 2 && (
      <form className="register-card" onSubmit={handleStep2Submit}>
        <div className="register-card-heading">
          <h2>Verify your email</h2>
          <p>
            A 6-digit OTP was sent to <strong>{step1Data.email}</strong>. Enter
            it below to verify your email.
          </p>
        </div>

        <div className="field-grid">
          <label className="field field-full">
            <span>Enter OTP</span>
            <input
              type="text"
              name="otp"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                if (error) setError("");
              }}
            />
          </label>
        </div>

        <button type="submit" className="register-button" disabled={isSubmitting}>
          {isSubmitting ? "Verifying..." : "Verify OTP"}
        </button>

        {success && <p className="form-message success">{success}</p>}
        {error && <p className="form-message error">{error}</p>}

        <p className="auth-switch">
          Wrong email?{" "}
          <button
            type="button"
            className="link-btn"
            onClick={() => { setStep(1); setOtp(""); setError(""); setSuccess(""); }}
          >
            Go back
          </button>
        </p>
      </form>
    )
  }

  {/* ── STEP 3: Complete Registration ── */ }
  {
    step === 3 && (
      <form className="register-card" onSubmit={handleStep3Submit}>
        <div className="register-card-heading">
          <h2>Complete registration</h2>
          <p>Email verified! Fill in the remaining details to finish.</p>
        </div>

        <div className="field-grid">
          <label className="field">
            <span>Phone number</span>
            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={step3Data.phone}
              onChange={handleStep3Change}
            />
          </label>

          <label className="field">
            <span>ID proof</span>
            <input
              type="text"
              name="idProof"
              placeholder="Aadhaar, passport, driving licence"
              value={step3Data.idProof}
              onChange={handleStep3Change}
            />
          </label>

          <label className="field field-full">
            <span>Address</span>
            <input
              type="text"
              name="address"
              placeholder="Enter address"
              value={step3Data.address}
              onChange={handleStep3Change}
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Create password"
              value={step3Data.password}
              onChange={handleStep3Change}
            />
          </label>

          <label className="field">
            <span>Confirm password</span>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={step3Data.confirmPassword}
              onChange={handleStep3Change}
            />
          </label>
        </div>

        <button type="submit" className="register-button" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>

        {success && <p className="form-message success">{success}</p>}
        {error && <p className="form-message error">{error}</p>}
      </form>
    )
  }
    </section >
=======
      {/* ── Right Panel — Form ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">

        {/* Mobile brand header */}
        <div className="lg:hidden flex items-center justify-between px-6 py-5 border-b border-[#E8E0D8] bg-white">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-lg tracking-[0.15em] font-light text-[#160842]">KNSU</span>
            <span className="text-[0.6rem] tracking-[0.3em] text-[#5B3FA6] uppercase">STAYS</span>
          </Link>
          <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[#5B3FA6]/70 font-medium">
            Guest Registration
          </span>
        </div>

        {/* Form body */}
        <div className="flex-1 px-6 py-10 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-2xl mx-auto lg:mx-0">

            {/* Heading */}
            <div className="mb-8">
              <p className="text-[0.65rem] tracking-[0.3em] uppercase text-[#5B3FA6] font-bold mb-3">
                New Account
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#160842] leading-tight mb-2">
                Sign up
              </h1>
              <p className="text-sm text-gray-400 leading-relaxed">
                After submit, the backend sends a verification link to your email.
              </p>
            </div>

            {/* Info panel */}
            <div className="mb-8 rounded-2xl border border-[#5B3FA6]/15 bg-[#5B3FA6]/5 px-5 py-4">
              <p className="text-[0.62rem] tracking-[0.2em] uppercase font-bold text-[#5B3FA6] mb-1">
                Real API Flow
              </p>
              <p className="text-xs text-[#160842]/60 leading-relaxed">
                Register → open email verification link → then login. Required: first name, last name, email, phone, password. Optional: address and ID proof.
              </p>
            </div>

            {/* Success message */}
            {success && (
              <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4">
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-base mt-0.5">✓</span>
                  <div>
                    <p className="text-sm font-semibold text-green-700 mb-1">Account created!</p>
                    <p className="text-sm text-green-600">{success}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Verification next-step card */}
            {success && (
              <div className="mb-6 rounded-2xl border border-[#5B3FA6]/20 bg-[#5B3FA6]/5 px-5 py-4">
                <p className="text-[0.62rem] tracking-[0.2em] uppercase font-bold text-[#5B3FA6] mb-1.5">
                  Next Step
                </p>
                <p className="text-xs font-semibold text-[#160842] mb-1">Verify your email</p>
                <p className="text-xs text-[#160842]/55 leading-relaxed">
                  The account for <strong className="text-[#5B3FA6]">{submittedEmail}</strong> has been registered.
                  Open the verification link sent by the backend before logging in.
                </p>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 px-5 py-4">
                <span className="text-red-400 mt-0.5 text-base">!</span>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>First name <span className="text-[#5B3FA6]">*</span></label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Last name <span className="text-[#5B3FA6]">*</span></label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={labelCls}>Email address <span className="text-[#5B3FA6]">*</span></label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>

              {/* Phone + ID Proof row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Phone number <span className="text-[#5B3FA6]">*</span></label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>ID proof <span className="text-gray-300 normal-case tracking-normal font-normal">(optional)</span></label>
                  <input
                    type="text"
                    name="idProof"
                    placeholder="Aadhaar, passport…"
                    value={formData.idProof}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className={labelCls}>Address <span className="text-gray-300 normal-case tracking-normal font-normal">(optional)</span></label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>

              {/* Password row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Password <span className="text-[#5B3FA6]">*</span></label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`${inputCls} pr-14`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.62rem] tracking-wider text-gray-300 hover:text-[#5B3FA6] transition-colors"
                    >
                      {showPassword ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Confirm password <span className="text-[#5B3FA6]">*</span></label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`${inputCls} pr-14`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.62rem] tracking-wider text-gray-300 hover:text-[#5B3FA6] transition-colors"
                    >
                      {showConfirm ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  group relative w-full overflow-hidden rounded-full
                  bg-[#5B3FA6] hover:bg-[#4a3288]
                  px-8 py-4 mt-2
                  text-[0.85rem] font-bold tracking-[0.12em] uppercase text-white
                  shadow-[0_8px_30px_rgba(91,63,166,0.35)]
                  transition-all duration-300
                  hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(91,63,166,0.45)]
                  active:translate-y-0
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
                "
              >
                <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/10 transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Creating account…
                    </span>
                  ) : (
                    "Create account"
                  )}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="flex-1 h-px bg-[#E8E0D8]" />
              <span className="text-[0.65rem] tracking-[0.2em] uppercase text-gray-300">or</span>
              <div className="flex-1 h-px bg-[#E8E0D8]" />
            </div>

            {/* Footer links */}
            <div className="space-y-3 text-center text-sm text-gray-400">
              <p>
                Link expired?{" "}
                <Link to="/resend-verification" className="text-[#5B3FA6] font-medium hover:text-[#4a3288] transition-colors">
                  Resend verification link
                </Link>
              </p>
              <p>
                Already have an account?{" "}
                <Link to="/login" className="text-[#5B3FA6] font-medium hover:text-[#4a3288] transition-colors">
                  Login
                </Link>
              </p>
            </div>

            {/* Staff switcher */}
            <div className="mt-8 pt-6 border-t border-[#E8E0D8] text-center">
              <p className="text-sm text-gray-400">
                Are you hotel staff?{" "}
                <Link to="/admin/register" className="text-[#5B3FA6] font-medium hover:text-[#4a3288] transition-colors">
                  Staff Registration →
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Mobile bottom bar */}
        <div className="lg:hidden px-6 py-4 border-t border-[#E8E0D8] bg-white">
          <p className="text-center text-[0.68rem] tracking-wide text-gray-300">
            © 2026 KNSU STAYS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
>>>>>>> 6a63a04cddcdb6656e1efdcbc78a276fc324a812
  );
};

export default Register;