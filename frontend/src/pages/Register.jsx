import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUserStep1, verifyUserOTP, registerUserStep3 } from "../api/authApi";

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  idProof: "",
  password: "",
  confirmPassword: "",
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [otp, setOtp] = useState("");
  const [registrationState, setRegistrationState] = useState("initial"); // 'initial', 'otp-sent', 'verified', 'completed'
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) setError("");
    if (success) setSuccess("");
  };

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      setError("Please enter your name and email to receive an OTP.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await registerUserStep1({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
      });
      setSuccess(data?.message || "OTP sent to your email!");
      setRegistrationState("otp-sent");
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          submitError.message ||
          "Failed to send OTP."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp.trim()) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await verifyUserOTP({
        email: formData.email.trim(),
        otp: otp.trim(),
      });
      setSuccess(data?.message || "Email verified! Please complete the rest of your details.");
      setRegistrationState("verified");
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          submitError.message ||
          "Verification failed."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Complete registration
  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.phone.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim()
    ) {
      setError("Please fill in all required fields (Phone and Password).");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await registerUserStep3({
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        idProof: formData.idProof.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      setSuccess(data?.message || "Registration successful! Redirecting to login...");
      setRegistrationState("completed");
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          submitError.message ||
          "Failed to complete registration."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Disabled = registrationState === "otp-sent" || registrationState === "verified" || registrationState === "completed";
  const isOTPDisabled = registrationState === "verified" || registrationState === "completed" || registrationState === "initial";
  const isFinalStepDisabled = registrationState !== "verified";

  return (
    <section className="register-page">
      <div className="register-hero">
        <p className="register-eyebrow">Secure Registration</p>
        <h1>Join KNSU Stays</h1>
        <p className="register-copy">
          Experience our new OTP-based secure verification. Verify your email first, then complete your profile.
        </p>

        <div className="register-panel">
          <span>OTP Flow</span>
          <strong>1. Verify Email &rarr; 2. Complete Details</strong>
          <p>
            This ensures your account is protected from the start.
          </p>
        </div>
      </div>

      <div className="register-card">
        <div className="register-card-heading">
          <h2>Create Account</h2>
          <p>Verify your identity with a 6-digit OTP.</p>
        </div>

        {/* STEP 1: NAME & EMAIL */}
        <div className="field-grid">
          <label className="field">
            <span>First name</span>
            <input
              type="text"
              name="firstName"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleChange}
              disabled={isStep1Disabled}
            />
          </label>

          <label className="field">
            <span>Last name</span>
            <input
              type="text"
              name="lastName"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={handleChange}
              disabled={isStep1Disabled}
            />
          </label>

          <label className="field field-full">
            <span>Email address</span>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isStep1Disabled}
            />
          </label>
        </div>

        {registrationState === "initial" && (
          <button onClick={handleSendOTP} className="register-button" disabled={isSubmitting}>
            {isSubmitting ? "Sending OTP..." : "Get OTP"}
          </button>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {registrationState === "otp-sent" && (
          <div className="otp-verification-section">
            <label className="field field-full">
              <span>Enter 6-digit OTP</span>
              <input
                type="text"
                placeholder="######"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="otp-input"
              />
            </label>
            <button onClick={handleVerifyOTP} className="register-button" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </button>
            <p className="otp-resend-hint" onClick={handleSendOTP}>
               Didn't get code? Resend OTP
            </p>
          </div>
        )}

        {/* STEP 3: FINAL DETAILS */}
        {(registrationState === "verified" || registrationState === "completed") && (
          <div className="field-grid" style={{ marginTop: '20px' }}>
             <label className="field">
              <span>Phone number</span>
              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                disabled={registrationState === "completed"}
              />
            </label>

            <label className="field">
              <span>ID proof</span>
              <input
                type="text"
                name="idProof"
                placeholder="ID Type & Number"
                value={formData.idProof}
                onChange={handleChange}
                disabled={registrationState === "completed"}
              />
            </label>

            <label className="field field-full">
              <span>Address</span>
              <input
                type="text"
                name="address"
                placeholder="Enter full address"
                value={formData.address}
                onChange={handleChange}
                disabled={registrationState === "completed"}
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                disabled={registrationState === "completed"}
              />
            </label>

            <label className="field">
              <span>Confirm password</span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={registrationState === "completed"}
              />
            </label>

            {registrationState === "verified" && (
              <button 
                onClick={handleCompleteRegistration} 
                className="register-button register-button-full" 
                disabled={isSubmitting}
                style={{ gridColumn: 'span 2', marginTop: '10px' }}
              >
                {isSubmitting ? "Completing..." : "Complete Registration"}
              </button>
            )}
          </div>
        )}

        {success ? <p className="form-message success" style={{ marginTop: '15px' }}>{success}</p> : null}
        {error ? <p className="form-message error" style={{ marginTop: '15px' }}>{error}</p> : null}

        <p className="auth-switch" style={{ marginTop: '20px' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
