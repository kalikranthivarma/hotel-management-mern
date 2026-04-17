import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { resetPassword } from "../api/authApi";

const ResetPassword = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.password.trim() || !formData.confirmPassword.trim()) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await resetPassword(token, {
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      setSuccess(data?.message || "Password updated successfully.");
      setFormData({
        password: "",
        confirmPassword: "",
      });
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          submitError.message ||
          "Password reset failed."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-heading">
          <p className="register-eyebrow">Reset Password</p>
          <h1>Create a new password</h1>
          <p>This page uses the real backend reset-password token API.</p>
        </div>

        <label className="field">
          <span>New password</span>
          <input
            type="password"
            name="password"
            placeholder="Enter new password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>Confirm new password</span>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="register-button" disabled={isSubmitting}>
          {isSubmitting ? "Updating password..." : "Update password"}
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

export default ResetPassword;
