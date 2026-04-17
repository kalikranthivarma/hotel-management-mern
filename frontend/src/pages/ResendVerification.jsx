import { useState } from "react";
import { Link } from "react-router-dom";
import { resendVerification } from "../api/authApi";

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Enter your email to request a new verification link.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await resendVerification({
        email: email.trim(),
      });
      setSuccess(data?.message || "Verification link sent to your email.");
      setEmail("");
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          submitError.message ||
          "Failed to send verification link."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-heading">
          <p className="register-eyebrow">Verification Expired?</p>
          <h1>Resend Link</h1>
          <p>Enter your registered email to resend your verification link.</p>
        </div>

        <label className="field">
          <span>Email address</span>
          <input
            type="email"
            name="email"
            placeholder="name@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError("");
              if (success) setSuccess("");
            }}
          />
        </label>

        <button type="submit" className="register-button" disabled={isSubmitting}>
          {isSubmitting ? "Sending link..." : "Resend Link"}
        </button>

        {success ? <p className="form-message success">{success}</p> : null}
        {error ? <p className="form-message error">{error}</p> : null}

        <p className="auth-switch">
          Back to <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
};

export default ResendVerification;
