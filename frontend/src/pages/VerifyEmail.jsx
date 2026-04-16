import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { verifyEmail } from "../api/authApi";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await verifyEmail(token);
        setStatus("success");
        setMessage(data?.message || "Email verified! You can now log in.");
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
  }, [token]);

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
