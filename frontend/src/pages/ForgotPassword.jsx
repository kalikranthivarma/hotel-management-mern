import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { forgotPassword } from "../api/authApi";

const ForgotPassword = () => {
  const { pathname } = useLocation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const role = pathname.startsWith("/admin/") ? "admin" : "user";
  const isAdmin = role === "admin";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Enter your email to request a reset link.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await forgotPassword({
        email: email.trim(),
      }, role);
      setSuccess(data?.message || "Reset link sent to your email.");
      setEmail("");
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          submitError.message ||
          "Failed to send reset link."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-heading">
          <p className="register-eyebrow">Forgot Password</p>
          <h1>Request reset link</h1>
          <p>
            Enter your registered {isAdmin ? "staff" : "guest"} email and the
            backend will send a reset link.
          </p>
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
          {isSubmitting ? "Sending link..." : "Send reset link"}
        </button>

        {success ? <p className="form-message success">{success}</p> : null}
        {error ? <p className="form-message error">{error}</p> : null}

        <p className="auth-switch">
          Back to <Link to={isAdmin ? "/admin/login" : "/login"}>Login</Link>
        </p>
      </form>
    </section>
  );
};

export default ForgotPassword;
