import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { forgotPassword } from "../api/authApi";

const inputClass =
  "mt-2 w-full rounded-2xl border border-luxe-border bg-luxe-smoke px-4 py-3 outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/10";

const ForgotPassword = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
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
      const { data } = await forgotPassword(
        {
          email: email.trim(),
        },
        role,
      );
      setSuccess(data?.message || "OTP sent to your email.");
      setEmail("");
      
      // Navigate to reset password page after 2 seconds
      setTimeout(() => {
        navigate(isAdmin ? "/admin/reset-password" : "/user/reset-password");
      }, 2000);
    } catch (submitError) {
      setError(submitError.response?.data?.message || submitError.message || "Failed to send reset link.");
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
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-luxe-bronze">Forgot Password</p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Request reset OTP</h1>
        <p className="mt-4 text-base leading-8 text-luxe-muted">
          Enter your registered {isAdmin ? "staff" : "guest"} email and we will send you a 6-digit
          OTP to reset your password.
        </p>

        <label className="mt-6 block text-sm font-semibold text-luxe-charcoal">
          Email address
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError("");
              if (success) setSuccess("");
            }}
            className={inputClass}
          />
        </label>

        <button
          type="submit"
          className="mt-6 w-full rounded-2xl bg-luxe-bronze px-5 py-3.5 font-semibold text-white transition hover:bg-luxe-charcoal disabled:cursor-wait disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending OTP..." : "Send reset OTP"}
        </button>

        {success ? (
          <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success} Redirecting to reset page...
          </p>
        ) : null}
        {error ? (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <p className="mt-6 border-t border-luxe-border pt-6 text-sm text-luxe-muted">
          Back to{" "}
          <Link to={isAdmin ? "/admin/login" : "/login"} className="font-semibold text-luxe-bronze">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
};

export default ForgotPassword;
