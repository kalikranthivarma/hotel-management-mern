import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { resetPassword } from "../api/authApi";

const inputClass =
  "mt-2 w-full rounded-2xl border border-luxe-border bg-luxe-smoke px-4 py-3 outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/10";

const ResetPassword = () => {
  const { token } = useParams();
  const { pathname } = useLocation();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const role = pathname.startsWith("/admin/") ? "admin" : "user";
  const accountLabel = role === "admin" ? "staff" : "guest";

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
      const { data } = await resetPassword(
        token,
        {
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
        role,
      );
      setSuccess(data?.message || "Password updated successfully.");
      setFormData({
        password: "",
        confirmPassword: "",
      });
    } catch (submitError) {
      setError(submitError.response?.data?.message || submitError.message || "Password reset failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-3xl items-center px-4 py-10">
      <form
        className="w-full rounded-[32px] border border-luxe-border bg-white p-6 shadow-[0_24px_80px_rgba(28,28,28,0.08)] sm:p-8"
        onSubmit={handleSubmit}
      >
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-luxe-bronze">Reset Password</p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Create a new password</h1>
        <p className="mt-4 text-base leading-8 text-luxe-muted">
          This page uses the real backend {accountLabel} reset-password token API.
        </p>

        <label className="mt-6 block text-sm font-semibold text-luxe-charcoal">
          New password
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Enter new password"
            value={formData.password}
            onChange={handleChange}
            className={inputClass}
          />
        </label>

        <label className="mt-5 block text-sm font-semibold text-luxe-charcoal">
          Confirm new password
          <input
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={inputClass}
          />
        </label>

        <button
          type="submit"
          className="mt-6 w-full rounded-2xl bg-luxe-bronze px-5 py-3.5 font-semibold text-white transition hover:bg-luxe-charcoal disabled:cursor-wait disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating password..." : "Update password"}
        </button>

        {success ? (
          <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </p>
        ) : null}
        {error ? (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <p className="mt-6 border-t border-luxe-border pt-6 text-sm text-luxe-muted">
          Back to{" "}
          <Link to="/login" className="font-semibold text-luxe-bronze">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
};

export default ResetPassword;
