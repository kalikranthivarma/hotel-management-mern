import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { setCredentials } from "../redux/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(location.state?.message || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear success message when user starts typing or if component remounts differently
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear location state so refresh doesn't show message again
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      dispatch(setCredentials({
        token: data.token,
        user: data.user,
      }));

      navigate("/dashboard", { replace: true });
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          submitError.message ||
          "Login failed."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-heading">
          <p className="register-eyebrow">Guest Login</p>
          <h1>Welcome back</h1>
          <p>Only verified guest accounts should continue to login.</p>
        </div>

        <label className="field">
          <span>Email address</span>
          <input
            type="email"
            name="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="register-button" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Login"}
        </button>

        {successMessage ? <p className="form-message success">{successMessage}</p> : null}
        {error ? <p className="form-message error">{error}</p> : null}

        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>

        <p className="auth-switch">
          Link expired? <Link to="/resend-verification">Resend verification link</Link>
        </p>

        <p className="auth-switch">
          Forgot password? <Link to="/forgot-password">Reset with email link</Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
