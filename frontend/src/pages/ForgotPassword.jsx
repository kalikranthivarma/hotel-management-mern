import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../api/authApi";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestOTP = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Enter your email to request an OTP.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await forgotPassword({
        email: email.trim(),
      });
      setSuccess(data?.message || "OTP sent to your email.");
      setStep(2);
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          submitError.message ||
          "Failed to send reset OTP."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!otp.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in the OTP and your new password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        password: password,
        confirmPassword: confirmPassword,
      });
      setSuccess(data?.message || "Password updated successfully. Redirecting...");
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          submitError.message ||
          "Failed to reset password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <p className="register-eyebrow">Account Recovery</p>
          <h1>Reset Password</h1>
          <p>We'll send a 6-digit OTP to your registered email to reset your password.</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestOTP}>
            <label className="field">
              <span>Email address</span>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </label>
            <button type="submit" className="register-button" disabled={isSubmitting}>
              {isSubmitting ? "Sending OTP..." : "Get OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
             <label className="field">
              <span>OTP (sent to {email})</span>
              <input
                type="text"
                maxLength="6"
                placeholder="######"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={isSubmitting}
              />
            </label>

            <label className="field">
              <span>New password</span>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </label>

            <label className="field">
              <span>Confirm new password</span>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </label>

            <button type="submit" className="register-button" disabled={isSubmitting}>
              {isSubmitting ? "Updating Password..." : "Update Password"}
            </button>

            <p className="otp-resend-hint" onClick={handleRequestOTP} style={{ marginTop: '15px' }}>
               Didn't get code? Send OTP again
            </p>
          </form>
        )}

        {success ? <p className="form-message success" style={{ marginTop: '15px' }}>{success}</p> : null}
        {error ? <p className="form-message error" style={{ marginTop: '15px' }}>{error}</p> : null}

        <p className="auth-switch" style={{ marginTop: '20px' }}>
          Back to <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;
