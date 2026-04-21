import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerAdminStep1, verifyAdminOTP, registerAdminStep3 } from "../api/authApi";

const initStep1 = { firstName: "", lastName: "", email: "" };
const initStep3 = {
  phone: "",
  employeeId: "",
  department: "",
  password: "",
  confirmPassword: "",
};

const inputCls =
  "w-full rounded-xl border border-luxe-border bg-white px-4 py-3 text-sm text-luxe-charcoal placeholder:text-gray-300 outline-none transition-all duration-200 focus:border-luxe-bronze focus:ring-2 focus:ring-luxe-bronze/10 hover:border-luxe-bronze/40";
const labelCls =
  "mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-luxe-charcoal/60";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState(initStep1);
  const [otp, setOtp] = useState("");
  const [step3Data, setStep3Data] = useState(initStep3);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setError("Please fill in first name, last name, and corporate email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await registerAdminStep1({
        firstName: step1Data.firstName.trim(),
        lastName: step1Data.lastName.trim(),
        email: step1Data.email.trim(),
      });
      setSuccess(data?.message || "OTP sent to your corporate email.");
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
      const { data } = await verifyAdminOTP({
        email: step1Data.email.trim(),
        otp: otp.trim(),
      });
      setSuccess(data?.message || "Email verified! Please complete your staff profile.");
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

    if (
      !step3Data.phone.trim() ||
      !step3Data.employeeId.trim() ||
      !step3Data.department.trim() ||
      !step3Data.password.trim() ||
      !step3Data.confirmPassword.trim()
    ) {
      setError("Please fill in all required staff credentials.");
      return;
    }

    if (step3Data.password !== step3Data.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await registerAdminStep3({
        email: step1Data.email.trim(),
        phone: step3Data.phone.trim(),
        employeeId: step3Data.employeeId.trim(),
        department: step3Data.department.trim(),
        password: step3Data.password,
        confirmPassword: step3Data.confirmPassword,
      });
      setSuccess(data?.message || "Staff registration completed successfully!");
      setTimeout(() => navigate("/admin/login"), 1500);
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
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=85"
          alt="Luxury hotel lobby"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1C1C1C]/94 via-luxe-bronze/40 to-[#1C1C1C]/88" />
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
              Staff Onboarding
            </p>
            <h2 className="mb-6 font-serif text-4xl leading-[1.1] xl:text-[2.6rem]">
              Secure Access
              <br />
              For The
              <br />
              <span className="text-luxe-bronze">KNSU Team</span>
            </h2>
            <p className="text-sm leading-relaxed text-white/40">
              Complete corporate onboarding in three guided steps with email OTP verification.
            </p>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-luxe-bronze-light">
                Step {step} of 3
              </p>
              <p className="mt-2 text-lg font-semibold">{stepLabel[step - 1]}</p>
              <p className="mt-2 text-sm text-white/40">
                {step === 1 && "Enter your name and corporate email to receive a 6-digit OTP."}
                {step === 2 && `Enter the OTP sent to ${step1Data.email}.`}
                {step === 3 && "Finish your staff profile with employee credentials."}
              </p>
            </div>
          </div>

          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-white/25">
            Internal Access · Verified Staff Only
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
                Staff Registration
              </p>
              <h1 className="mb-2 font-serif text-3xl leading-tight text-luxe-charcoal sm:text-4xl">
                {step === 1 && "Start onboarding"}
                {step === 2 && "Verify corporate email"}
                {step === 3 && "Complete staff profile"}
              </h1>
              <p className="text-sm leading-relaxed text-luxe-muted">
                Use your official employee details. Each step maps directly to the incoming backend
                flow.
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
                      placeholder="e.g. Priya"
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
                      placeholder="e.g. Menon"
                      className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Corporate email</label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={step1Data.email}
                    onChange={handleStep1Change}
                    placeholder="priya.menon@knsu.com"
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
                    step === 3 ? "Register Staff Profile" : step === 2 ? "Verify OTP" : "Send OTP"
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
                    <label className={labelCls}>Official phone</label>
                    <input
                      type="text"
                      name="phone"
                      autoComplete="tel"
                      value={step3Data.phone}
                      onChange={handleStep3Change}
                      placeholder="+91 98000 00000"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Employee ID</label>
                    <input
                      type="text"
                      name="employeeId"
                      autoComplete="off"
                      value={step3Data.employeeId}
                      onChange={handleStep3Change}
                      placeholder="KNSU-0042"
                      className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Department</label>
                  <select
                    name="department"
                    value={step3Data.department}
                    onChange={handleStep3Change}
                    className={inputCls}
                  >
                    <option value="">Select Department</option>
                    <option value="Front Desk">Front Desk</option>
                    <option value="Reception">Reception</option>
                    <option value="Management">Management</option>
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Security">Security</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="IT">IT</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Password</label>
                    <input
                      type="password"
                      name="password"
                      autoComplete="new-password"
                      value={step3Data.password}
                      onChange={handleStep3Change}
                      placeholder="Create password"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Confirm password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      autoComplete="new-password"
                      value={step3Data.confirmPassword}
                      onChange={handleStep3Change}
                      placeholder="Confirm password"
                      className={inputCls}
                    />
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
                       Registering Staff Profile...
                    </span>
                  ) : (
                    "Register Staff Profile"
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
                Already registered?{" "}
                <Link to="/admin/login" className="font-bold text-luxe-bronze hover:text-luxe-charcoal underline underline-offset-4 decoration-luxe-bronze/30">
                  Staff Login
                </Link>
              </p>
              <p>
                Guest registration?{" "}
                <Link to="/register" className="font-bold text-luxe-bronze hover:text-luxe-charcoal underline underline-offset-4 decoration-luxe-bronze/30">
                  Member Enrollment →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
