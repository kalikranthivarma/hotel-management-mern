import { useEffect, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../api/authApi";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === true) return;

    const verify = async () => {
      try {
        const { data } = await verifyEmail(token);
        setStatus("success");
        setMessage(data?.message || "Email verified! Redirecting to login...");
        
        // Redirect to Login page after showing success message
        setTimeout(() => {
          navigate("/login", { state: { message: "Email verified successfully! You can now log in." } });
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
  }, [token, navigate]);

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <p className="register-eyebrow">Email Verification</p>
          <h1>Verify account</h1>
          <p>This page is connected to the real backend verify-email API.</p>
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
