import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { verifyEmail } from "../api/authApi";

const VerifyEmail = () => {
  const { token } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const effectRan = useRef(false);
  const role = pathname.startsWith("/admin/") ? "admin" : "user";
  const accountLabel = role === "admin" ? "staff" : "guest";

  useEffect(() => {
    if (effectRan.current) return;

    const verify = async () => {
      try {
        const { data } = await verifyEmail(token, role);
        setStatus("success");
        setMessage(data?.message || "Email verified! Redirecting to login...");

        setTimeout(() => {
          navigate("/login", {
            state: { message: "Email verified successfully! You can now log in." },
          });
        }, 3000);
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            error.message ||
            "Verification failed."
        );
      }
    };

    if (token) {
      verify();
    } else {
      setStatus("error");
      setMessage("Verification token is missing.");
    }

    return () => {
      effectRan.current = true;
    };
  }, [navigate, role, token]);

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <p className="register-eyebrow">Email Verification</p>
          <h1>Verify account</h1>
          <p>This page is connected to the real backend {accountLabel} verify-email API.</p>
        </div>

        <p className={`form-message ${status === "error" ? "error" : "success"}`}>
          {message}
        </p>

        <p className="auth-switch">
          Continue to <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
};

export default VerifyEmail;
