import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  registerAdminStep1,
  verifyAdminOTP,
  registerAdminStep3,
} from "../api/authApi";

const initStep1 = { firstName: "", lastName: "", email: "" };
const initStep3 = {
  phone: "",
  employeeId: "",
  department: "",
  password: "",
  confirmPassword: "",
};

const AdminRegister = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [step1Data, setStep1Data] = useState(initStep1);
  const [otp, setOtp] = useState("");
  const [step3Data, setStep3Data] = useState(initStep3);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStep1Change = (e) => {
    setStep1Data((p) => ({ ...p, [e.target.name]: e.target.value }));
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
      const { data } = await verifyAdminOTP({
        email: step1Data.email.trim(),
        otp: otp.trim(),
      });
      setSuccess(data?.message || "Email verified! Please complete your staff profile.");
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
      setTimeout(() => navigate("/admin/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Registration failed."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabel = ["Send OTP", "Verify OTP", "Complete Registration"];

  return (
    <section className="register-page register-page-admin">

      {/* ── LEFT: Hero ── */}
      <div className="register-hero">
        <p className="register-eyebrow">Staff Onboarding</p>
        <h1>KNSU Internal Operations</h1>
        <p className="register-copy">
          Welcome to the KNSU stays team. This secure portal is reserved for verified hotel staff and management personnel only.
        </p>
        <div className="register-panel">
          <span>Step {step} of 3</span>
          <strong>{stepLabel[step - 1]}</strong>
          <p>
            {step === 1 && "Enter your name and corporate email to receive a 6-digit OTP."}
            {step === 2 && `Enter the OTP sent to ${step1Data.email}.`}
            {step === 3 && "Fill in your staff credentials to complete registration."}
          </p>
        </div>
      </div>

      {/* ── STEP 1: Name + Email ── */}
      {step === 1 && (
        <form className="register-card" onSubmit={handleStep1Submit}>
          <div className="register-card-heading">
            <h2>Staff Registration</h2>
            <p>Enter your name and corporate email — we'll send a verification OTP.</p>
          </div>

          <div className="field-grid">
            <label className="field">
              <span>First Name *</span>
              <input type="text" name="firstName" placeholder="e.g. Priya" value={step1Data.firstName} onChange={handleStep1Change} required />
            </label>
            <label className="field">
              <span>Last Name *</span>
              <input type="text" name="lastName" placeholder="e.g. Menon" value={step1Data.lastName} onChange={handleStep1Change} required />
            </label>
            <label className="field field-full">
              <span>Corporate Email *</span>
              <input type="email" name="email" placeholder="priya.menon@knsu.com" value={step1Data.email} onChange={handleStep1Change} required />
            </label>
          </div>

          <button type="submit" className="register-button" disabled={isSubmitting}>
            {isSubmitting ? "Sending OTP..." : "Send OTP"}
          </button>

          {success && <p className="form-message success">{success}</p>}
          {error && <p className="form-message error">{error}</p>}

          <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #E8E4DF", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <p className="auth-switch" style={{ margin: 0 }}>
              Already registered? <Link to="/admin/login">Staff Login</Link>
            </p>
            <p className="auth-switch" style={{ margin: 0 }}>
              Guest registration? <Link to="/register">Member Enrollment</Link>
            </p>
          </div>
        </form>
      )}

      {/* ── STEP 2: OTP Verification ── */}
      {step === 2 && (
        <form className="register-card" onSubmit={handleStep2Submit}>
          <div className="register-card-heading">
            <h2>Verify your email</h2>
            <p>
              A 6-digit OTP was sent to <strong>{step1Data.email}</strong>. Enter
              it below to verify your corporate email.
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
      )}

      {/* ── STEP 3: Complete Registration ── */}
      {step === 3 && (
        <form className="register-card" onSubmit={handleStep3Submit}>
          <div className="register-card-heading">
            <h2>Complete Staff Profile</h2>
            <p>Email verified! Register your professional profile using your official employee details.</p>
          </div>

          <div className="field-grid">
            <label className="field">
              <span>Official Phone *</span>
              <input type="tel" name="phone" placeholder="+91 98000 00000" value={step3Data.phone} onChange={handleStep3Change} required />
            </label>
            <label className="field">
              <span>Employee ID *</span>
              <input type="text" name="employeeId" placeholder="KNSU-0042" value={step3Data.employeeId} onChange={handleStep3Change} required />
            </label>
            <label className="field field-full">
              <span>Department *</span>
              <select name="department" value={step3Data.department} onChange={handleStep3Change} required>
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
            </label>
            <label className="field">
              <span>Password *</span>
              <input type="password" name="password" placeholder="••••••••" value={step3Data.password} onChange={handleStep3Change} required />
            </label>
            <label className="field">
              <span>Confirm Password *</span>
              <input type="password" name="confirmPassword" placeholder="••••••••" value={step3Data.confirmPassword} onChange={handleStep3Change} required />
            </label>
          </div>

          <button type="submit" className="register-button" disabled={isSubmitting}>
            {isSubmitting ? "Registering Staff Profile..." : "Register Staff Profile"}
          </button>

          {success && <p className="form-message success">{success}</p>}
          {error && <p className="form-message error">{error}</p>}
        </form>
      )}

    </section>
  );
};

export default AdminRegister;