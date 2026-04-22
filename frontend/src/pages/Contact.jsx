import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { createContactMessage } from "../api/contactApi";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const contactCards = [
  {
    title: "Guest Services",
    value: "+91 800-123-4567",
    href: "tel:+918001234567",
    detail: "Available 24/7 for reservations, stay support, and travel help.",
  },
  {
    title: "Email Concierge",
    value: "stay@knsu.com",
    href: "mailto:stay@knsu.com",
    detail: "Reach us for booking guidance, group stays, and special requests.",
  },
  {
    title: "Corporate Desk",
    value: "Hyderabad, Shimla, Goa",
    href: "https://maps.google.com/?q=KNSU+Stays",
    detail: "Serving leisure, corporate, and event guests across destinations.",
  },
];

const faqs = [
  {
    question: "Can I request early check-in or late check-out?",
    answer:
      "Yes. Availability-based requests can be shared with the front desk or concierge before arrival.",
  },
  {
    question: "Do you support event and group bookings?",
    answer:
      "Yes. Our team can help coordinate room blocks, dining, and venue requirements for groups.",
  },
  {
    question: "Can I contact the hotel without creating an account?",
    answer:
      "Yes. This page is available directly from the frontend and does not require login.",
  },
];

export default function Contact() {
  const user = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormData((current) => ({
      ...current,
      name:
        current.name ||
        `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      email: current.email || user.email || "",
      phone: current.phone || user.phone || "",
    }));
  }, [user]);

  const isFormValid = useMemo(() => {
    return (
      formData.name.trim() &&
      formData.email.trim() &&
      formData.subject.trim() &&
      formData.message.trim()
    );
  }, [formData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
    if (submitted) {
      setSubmitted(false);
    }
    if (submitError) {
      setSubmitError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      await createContactMessage(formData);

      setSubmitted(true);
      setFormData({
        ...initialForm,
        name: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "",
        email: user?.email || "",
        phone: user?.phone || "",
      });
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
          "Unable to submit your message right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAFAF8] text-luxe-charcoal">
      <section className="overflow-hidden border-b border-luxe-border bg-[linear-gradient(135deg,#171412_0%,#2c241f_55%,#c39562_140%)] px-4 py-14 text-white lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#e7c8a0]">
              Contact KNSU
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
              Let&apos;s plan your next stay with care
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
              Reach our hospitality team for reservations, dining help, group
              bookings, or anything you need before check-in.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {contactCards.map((card) => (
              <a
                key={card.title}
                href={card.href}
                target={card.href.startsWith("http") ? "_blank" : undefined}
                rel={card.href.startsWith("http") ? "noreferrer" : undefined}
                className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur-sm transition hover:bg-white/15"
              >
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#e7c8a0]">
                  {card.title}
                </p>
                <p className="mt-3 font-serif text-2xl leading-tight text-white">
                  {card.value}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  {card.detail}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
        <div className="rounded-[32px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)] sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxe-bronze">
                Send a Message
              </p>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                We&apos;ll help you from here
              </h2>
            </div>
            <div className="rounded-full bg-luxe-smoke px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-luxe-muted">
              Live Form
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-luxe-muted sm:text-base">
            Send your stay, reservation, or dining questions here and the
            message will be stored through the backend for follow-up.
          </p>

          {submitted ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Your message has been sent successfully. Our team can now review it
              from the backend.
            </div>
          ) : null}

          {submitError ? (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {submitError}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-luxe-charcoal/60">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="mt-2 w-full rounded-2xl border border-luxe-border bg-luxe-smoke px-4 py-3 outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/10"
              />
            </div>

            <div>
              <label className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-luxe-charcoal/60">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="mt-2 w-full rounded-2xl border border-luxe-border bg-luxe-smoke px-4 py-3 outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/10"
              />
            </div>

            <div>
              <label className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-luxe-charcoal/60">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="mt-2 w-full rounded-2xl border border-luxe-border bg-luxe-smoke px-4 py-3 outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/10"
              />
            </div>

            <div>
              <label className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-luxe-charcoal/60">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                className="mt-2 w-full rounded-2xl border border-luxe-border bg-luxe-smoke px-4 py-3 outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/10"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-luxe-charcoal/60">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                placeholder="Tell us about your stay, dining, or reservation request."
                className="mt-2 w-full rounded-[24px] border border-luxe-border bg-luxe-smoke px-4 py-3 outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/10"
              />
            </div>

            <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm leading-6 text-luxe-muted">
                Prefer direct help? Call us or email the concierge team anytime.
              </p>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="rounded-full bg-luxe-bronze px-6 py-3 text-sm font-semibold text-white transition hover:bg-luxe-charcoal disabled:cursor-not-allowed disabled:bg-luxe-muted"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-8">
          <div className="overflow-hidden rounded-[32px] border border-luxe-border bg-white shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
            <div className="border-b border-luxe-border bg-luxe-smoke px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxe-bronze">
                Visit Us
              </p>
              <h2 className="mt-3 font-serif text-3xl">Our featured destinations</h2>
            </div>
            <div className="grid gap-px bg-luxe-border sm:grid-cols-3">
              {[
                "Hyderabad Gateway",
                "Shimla Highlands",
                "Goa Serenity",
              ].map((location) => (
                <div key={location} className="bg-white px-6 py-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-luxe-charcoal/45">
                    KNSU Stays
                  </p>
                  <p className="mt-3 font-serif text-2xl">{location}</p>
                  <p className="mt-3 text-sm leading-6 text-luxe-muted">
                    Concierge support, dining reservations, and booking help are
                    available for each property.
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-luxe-border bg-[linear-gradient(145deg,#1d1a18_0%,#2b241f_100%)] p-6 text-white shadow-[0_24px_70px_rgba(28,28,28,0.18)] sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#e7c8a0]">
              Common Questions
            </p>
            <div className="mt-6 space-y-5">
              {faqs.map((item) => (
                <div key={item.question} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <h3 className="font-semibold text-white">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
