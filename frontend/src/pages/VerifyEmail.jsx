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
        setMessage(error.response?.data?.message || error.message || "Verification failed.");
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
    <section className="mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-3xl items-center px-4 py-10">
      <div className="w-full rounded-[32px] border border-luxe-border bg-white p-6 shadow-[0_24px_80px_rgba(28,28,28,0.08)] sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-luxe-bronze">Email Verification</p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Verify account</h1>
        <p className="mt-4 text-base leading-8 text-luxe-muted">
          This page is connected to the real backend {accountLabel} verify-email API.
        </p>

        <p
          className={`mt-6 rounded-2xl px-4 py-3 text-sm ${
            status === "error"
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {message}
        </p>

        <p className="mt-6 border-t border-luxe-border pt-6 text-sm text-luxe-muted">
          Continue to{" "}
          <Link to="/login" className="font-semibold text-luxe-bronze">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default VerifyEmail;
