import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUserStep1, verifyUserOTP, registerUserStep3 } from "../api/authApi";

const initStep1 = { firstName: "", lastName: "", email: "" };
const initStep3 = {
  phone: "",
  address: "",
  idProof: "",
  password: "",
  confirmPassword: "",
};

const inputCls =
  "w-full rounded-xl border border-luxe-border bg-white px-4 py-3 text-sm text-luxe-charcoal placeholder:text-gray-300 outline-none transition-all duration-200 focus:border-luxe-bronze focus:ring-2 focus:ring-luxe-bronze/10 hover:border-luxe-bronze/40";
const labelCls =
  "mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-luxe-charcoal/60";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState(initStep1);
  const [otp, setOtp] = useState("");
  const [step3Data, setStep3Data] = useState(initStep3);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const stepLabel = ["Send OTP", "Verify OTP", "Complete Registration"];

  const handleStep1Change = (e) => {
    setStep1Data((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleStep3Change = (e) => {
    setStep3Data((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!step1Data.firstName.trim() || !step1Data.lastName.trim() || !step1Data.email.trim()) {
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
      setError(err.response?.data?.message || err.message || "Failed to send OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      setError(err.response?.data?.message || err.message || "OTP verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep3Submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!step3Data.phone.trim() || !step3Data.password.trim() || !step3Data.confirmPassword.trim()) {
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
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAF8] lg:flex">
      <div className="relative hidden flex-shrink-0 overflow-hidden lg:flex lg:w-[42%] xl:w-[38%]">
        <img
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=85"
          alt="Luxury hotel"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1C1C1C]/92 via-luxe-bronze/40 to-[#1C1C1C]/85" />
        <div className="absolute left-10 top-10 h-14 w-14 border-l-2 border-t-2 border-white/10" />
        <div className="absolute right-10 top-10 h-14 w-14 border-r-2 border-t-2 border-white/10" />
        <div className="absolute bottom-10 left-10 h-14 w-14 border-b-2 border-l-2 border-white/10" />
        <div className="absolute bottom-10 right-10 h-14 w-14 border-b-2 border-r-2 border-white/10" />

        <div className="relative z-10 flex min-h-screen flex-col p-10 text-white">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-2xl font-light tracking-[0.15em]">KNSU</span>
            <span className="text-xs uppercase tracking-[0.3em] text-luxe-bronze-light font-bold">STAYS</span>
          </Link>

          <div className="my-auto max-w-sm">
            <div className="mb-8 h-px w-12 bg-luxe-bronze/60" />
            <p className="mb-5 text-[0.68rem] uppercase tracking-[0.35em] text-white/60 font-bold">
              Guest Registration
            </p>
            <h2 className="mb-6 font-serif text-4xl leading-[1.1] xl:text-[2.6rem]">
              Begin Your
              <br />
              Journey With
              <br />
              <span className="text-luxe-bronze">KNSU Stays</span>
            </h2>
            <p className="text-sm leading-relaxed text-white/40">
              Register in three guided steps: request OTP, verify email, then complete your guest
              profile.
            </p>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-luxe-bronze-light">
                Step {step} of 3
              </p>
              <p className="mt-2 text-lg font-semibold">{stepLabel[step - 1]}</p>
              <p className="mt-2 text-sm text-white/40">
                {step === 1 && "Enter your name and email to receive a 6-digit OTP."}
                {step === 2 && `Enter the OTP sent to ${step1Data.email}.`}
                {step === 3 && "Finish your account with phone, address, and password."}
              </p>
            </div>
          </div>

          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-white/25">
            Curated Luxury · Iconic Destinations
          </p>
        </div>
      </div>

      <div className="flex min-h-screen flex-1 flex-col overflow-y-auto">
        <div className="flex items-center justify-between border-b border-luxe-border bg-white px-6 py-5 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-lg font-light tracking-[0.15em] text-luxe-charcoal">KNSU</span>
            <span className="text-[0.6rem] uppercase tracking-[0.3em] text-luxe-bronze font-bold">STAYS</span>
          </Link>
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-luxe-bronze">
            Step {step} of 3
          </span>
        </div>

        <div className="flex-1 px-6 py-10 sm:px-10 lg:px-12 xl:px-16">
          <div className="mx-auto w-full max-w-2xl lg:mx-0">
            <div className="mb-8">
              <p className="mb-3 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-luxe-bronze">
                New Account
              </p>
              <h1 className="mb-2 font-serif text-3xl leading-tight text-luxe-charcoal sm:text-4xl">
                {step === 1 && "Get started"}
                {step === 2 && "Verify your email"}
                {step === 3 && "Complete registration"}
              </h1>
              <p className="text-sm leading-relaxed text-luxe-muted">
                {step === 1 && "Enter your basic details and we will send a verification OTP."}
                {step === 2 && "Check your inbox and enter the 6-digit code to continue."}
                {step === 3 &&
                  "Finish the remaining account details to create your guest profile."}
              </p>
            </div>

            {success && (
              <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>First name</label>
                    <input
                      type="text"
                      name="firstName"
                      autoComplete="given-name"
                      value={step1Data.firstName}
                      onChange={handleStep1Change}
                      placeholder="Enter first name"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Last name</label>
                    <input
                      type="text"
                      name="lastName"
                      autoComplete="family-name"
                      value={step1Data.lastName}
                      onChange={handleStep1Change}
                      placeholder="Enter last name"
                      className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Email address</label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={step1Data.email}
                    onChange={handleStep1Change}
                    placeholder="name@example.com"
                    className={inputCls}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-luxe-bronze px-8 py-4 text-[0.85rem] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-luxe-charcoal hover:shadow-xl disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                       <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                       Processing...
                    </span>
                  ) : (
                    step === 3 ? "Create account" : step === 2 ? "Verify OTP" : "Send OTP"
                  )}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleStep2Submit} className="space-y-5">
                <div className="rounded-2xl border border-luxe-bronze/15 bg-luxe-bronze/5 px-5 py-4 text-sm text-luxe-charcoal/65">
                  A 6-digit OTP was sent to{" "}
                  <strong className="text-luxe-bronze">{step1Data.email}</strong>.
                </div>
                <div>
                  <label className={labelCls}>Enter OTP</label>
                  <input
                    type="text"
                    name="otp"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Enter 6-digit OTP"
                    className={`${inputCls} text-center text-lg tracking-[0.45em]`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-luxe-bronze px-8 py-4 text-[0.85rem] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-luxe-charcoal hover:shadow-xl disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                       <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                       Verifying...
                    </span>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setError("");
                    setSuccess("");
                  }}
                  className="w-full text-sm font-bold text-luxe-bronze hover:text-luxe-charcoal transition-colors"
                >
                  Go back
                </button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleStep3Submit} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Phone number</label>
                    <input
                      type="text"
                      name="phone"
                      autoComplete="tel"
                      value={step3Data.phone}
                      onChange={handleStep3Change}
                      placeholder="Enter phone number"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>ID proof</label>
                    <input
                      type="text"
                      name="idProof"
                      autoComplete="off"
                      value={step3Data.idProof}
                      onChange={handleStep3Change}
                      placeholder="Aadhaar, passport..."
                      className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Address</label>
                  <input
                    type="text"
                    name="address"
                    autoComplete="street-address"
                    value={step3Data.address}
                    onChange={handleStep3Change}
                    placeholder="Enter address"
                    className={inputCls}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        autoComplete="new-password"
                        value={step3Data.password}
                        onChange={handleStep3Change}
                        placeholder="Create password"
                        className={`${inputCls} pr-14`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.62rem] tracking-wider text-gray-300 hover:text-luxe-bronze"
                      >
                        {showPassword ? "HIDE" : "SHOW"}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Confirm password</label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        name="confirmPassword"
                        autoComplete="new-password"
                        value={step3Data.confirmPassword}
                        onChange={handleStep3Change}
                        placeholder="Confirm password"
                        className={`${inputCls} pr-14`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.62rem] tracking-wider text-gray-300 hover:text-luxe-bronze"
                      >
                        {showConfirm ? "HIDE" : "SHOW"}
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-luxe-bronze px-8 py-4 text-[0.85rem] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-luxe-charcoal hover:shadow-xl disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                       <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                       Creating account...
                    </span>
                  ) : (
                    "Create account"
                  )}
                </button>
              </form>
            )}

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#E8E0D8]" />
              <span className="text-[0.65rem] uppercase tracking-[0.2em] text-gray-300">or</span>
              <div className="h-px flex-1 bg-[#E8E0D8]" />
            </div>

            <div className="space-y-3 text-center text-sm text-luxe-muted">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-luxe-bronze hover:text-luxe-charcoal underline underline-offset-4 decoration-luxe-bronze/30">
                  Login
                </Link>
              </p>
              <p>
                Are you hotel staff?{" "}
                <Link
                  to="/admin/register"
                  className="font-bold text-luxe-bronze hover:text-luxe-charcoal underline underline-offset-4 decoration-luxe-bronze/30"
                >
                  Staff Registration →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
