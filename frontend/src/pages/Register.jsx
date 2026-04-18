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

  // ── Generic change handlers ──
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
          </p>
        </div>
      </div>

      {/* ── STEP 1: Name + Email ── */}
      {step === 1 && (
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
      )}

      {/* ── STEP 2: OTP Verification ── */}
      {step === 2 && (
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
      )}

      {/* ── STEP 3: Complete Registration ── */}
      {step === 3 && (
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
      )}
    </section>
  );
};

export default Register;