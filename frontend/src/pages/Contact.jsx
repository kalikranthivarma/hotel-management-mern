import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createContactMessage } from "../api/contactApi";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function Contact() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitted, navigate]);

  useEffect(() => {
    if (!user) return;
    setFormData((cur) => ({
      ...cur,
      name: cur.name || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      email: cur.email || user.email || "",
      phone: cur.phone || user.phone || "",
    }));
  }, [user]);

  const isFormValid = useMemo(() => (
    formData.name.trim() &&
    formData.email.trim() &&
    formData.subject.trim() &&
    formData.message.trim() &&
    /^\S+@\S+\.\S+$/.test(formData.email)
  ), [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((cur) => ({ ...cur, [name]: value }));
    if (submitError) setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    try {
      setIsSubmitting(true);
      setSubmitError("");
      await createContactMessage(formData);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSubmitError(error.response?.data?.message || "Unable to submit your message right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      ...initialForm,
      name: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
  };

  if (submitted) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-[#FAFAF8] px-4">
        <div className="w-full max-w-md rounded-[28px] border border-luxe-border bg-white p-10 text-center shadow-[0_16px_48px_rgba(28,28,28,0.07)]">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <svg className="h-8 w-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-serif text-3xl tracking-tight text-luxe-charcoal">Message Sent</h2>
          <p className="mt-4 text-sm leading-7 text-luxe-muted">
            We'll get back to <span className="font-semibold text-luxe-charcoal">{formData.email}</span> within 2 hours.
          </p>
          <p className="mt-2 text-xs text-luxe-bronze font-medium">
            Redirecting to home in 3 seconds...
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/" className="rounded-full bg-luxe-charcoal px-7 py-3 text-sm font-semibold text-white transition hover:bg-luxe-bronze">
              Return Home
            </Link>
            <button onClick={handleReset} className="rounded-full border border-luxe-border px-7 py-3 text-sm font-semibold text-luxe-charcoal transition hover:bg-luxe-smoke">
              Send Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-[#FAFAF8] px-4 py-16">
      <div className="w-full max-w-2xl">
        <div className="mb-10">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.45em] text-luxe-bronze">Concierge &amp; Support</p>
          <h1 className="mt-3 font-serif text-4xl tracking-tight text-luxe-charcoal sm:text-5xl">Get in touch</h1>
          <p className="mt-4 text-sm leading-7 text-luxe-muted">
            Fill out the form and our team will respond within 2 hours during business hours.
          </p>
        </div>

        <div className="rounded-[32px] border border-luxe-border bg-white p-8 shadow-[0_16px_48px_rgba(28,28,28,0.05)] sm:p-10">
          {submitError && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="ml-1 text-[0.6rem] font-bold uppercase tracking-widest text-luxe-muted">Full Name</label>
              <input
                type="text" name="name" required
                value={formData.name} onChange={handleChange}
                placeholder="Julian Casablancas"
                className="w-full rounded-xl border border-luxe-border bg-luxe-smoke/40 px-4 py-3.5 text-sm outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/5"
              />
            </div>

            <div className="space-y-1.5">
              <label className="ml-1 text-[0.6rem] font-bold uppercase tracking-widest text-luxe-muted">Email Address</label>
              <input
                type="email" name="email" required
                value={formData.email} onChange={handleChange}
                placeholder="name@email.com"
                className="w-full rounded-xl border border-luxe-border bg-luxe-smoke/40 px-4 py-3.5 text-sm outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/5"
              />
            </div>

            <div className="space-y-1.5">
              <label className="ml-1 text-[0.6rem] font-bold uppercase tracking-widest text-luxe-muted">
                Phone <span className="normal-case font-normal tracking-normal text-luxe-muted/60">(optional)</span>
              </label>
              <input
                type="tel" name="phone"
                value={formData.phone} onChange={handleChange}
                placeholder="+91 90000 00000"
                className="w-full rounded-xl border border-luxe-border bg-luxe-smoke/40 px-4 py-3.5 text-sm outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/5"
              />
            </div>

            <div className="space-y-1.5">
              <label className="ml-1 text-[0.6rem] font-bold uppercase tracking-widest text-luxe-muted">Subject</label>
              <input
                type="text" name="subject" required
                value={formData.subject} onChange={handleChange}
                placeholder="How can we help?"
                className="w-full rounded-xl border border-luxe-border bg-luxe-smoke/40 px-4 py-3.5 text-sm outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/5"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="ml-1 text-[0.6rem] font-bold uppercase tracking-widest text-luxe-muted">Message</label>
              <textarea
                name="message" required
                value={formData.message} onChange={handleChange}
                rows={5}
                placeholder="Tell us about your requirements…"
                className="w-full rounded-2xl border border-luxe-border bg-luxe-smoke/40 px-4 py-4 text-sm outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/5"
              />
            </div>

            <div className="flex items-center justify-between gap-4 sm:col-span-2">
              <p className="text-xs text-luxe-muted">By submitting, you agree to our privacy policy.</p>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="group flex items-center gap-2 rounded-full bg-luxe-charcoal px-8 py-3.5 text-sm font-bold text-white transition hover:bg-luxe-bronze disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Sending…" : "Send Message"}
                <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}