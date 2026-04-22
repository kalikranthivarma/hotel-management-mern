// import { useEffect, useMemo, useState, useCallback } from "react";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { createContactMessage } from "../api/contactApi";

// const initialForm = {
//   name: "",
//   email: "",
//   phone: "",
//   subject: "",
//   message: "",
// };

// const contactCards = [
//   {
//     title: "Guest Services",
//     value: "+91 800-123-4567",
//     href: "tel:+918001234567",
//     detail: "Available 24/7 for reservations, stay support, and travel help.",
//     type: "phone",
//   },
//   {
//     title: "Email Concierge",
//     value: "stay@knsu.com",
//     href: "mailto:stay@knsu.com",
//     detail: "Reach us for booking guidance, group stays, and special requests.",
//     type: "email",
//   },
//   {
//     title: "Corporate Desk",
//     value: "Hyderabad, Shimla, Goa",
//     href: "https://maps.google.com/?q=KNSU+Stays",
//     detail: "Serving leisure, corporate, and event guests across destinations.",
//     type: "location",
//   },
// ];

// const faqs = [
//   {
//     question: "Can I request early check-in or late check-out?",
//     answer:
//       "Yes. Availability-based requests can be shared with the front desk or concierge before arrival.",
//   },
//   {
//     question: "Do you support event and group bookings?",
//     answer:
//       "Yes. Our team can help coordinate room blocks, dining, and venue requirements for groups.",
//   },
//   {
//     question: "Can I contact the hotel without creating an account?",
//     answer:
//       "Yes. This page is available directly from the frontend and does not require login.",
//   },
// ];

// const CopyButton = ({ text }) => {
//   const [copied, setCopied] = useState(false);

//   const handleCopy = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     navigator.clipboard.writeText(text);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <button
//       onClick={handleCopy}
//       className="ml-2 rounded-md bg-white/10 p-1.5 text-white/50 transition hover:bg-white/20 hover:text-white"
//       title="Copy to clipboard"
//     >
//       {copied ? (
//         <svg className="h-3 w-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//         </svg>
//       ) : (
//         <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
//         </svg>
//       )}
//     </button>
//   );
// };

// export default function Contact() {
//   const user = useSelector((state) => state.auth.user);
//   const [formData, setFormData] = useState(initialForm);
//   const [submitted, setSubmitted] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState("");
//   const [isOpen, setIsOpen] = useState(true);

//   useEffect(() => {
//     // Determine if support is "Live" (e.g., 8 AM to 10 PM)
//     const hour = new Date().getHours();
//     setIsOpen(hour >= 8 && hour < 22);

//     if (!user) return;

//     setFormData((current) => ({
//       ...current,
//       name: current.name || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
//       email: current.email || user.email || "",
//       phone: current.phone || user.phone || "",
//     }));
//   }, [user]);

//   const isFormValid = useMemo(() => {
//     return (
//       formData.name.trim() &&
//       formData.email.trim() &&
//       formData.subject.trim() &&
//       formData.message.trim() &&
//       /^\S+@\S+\.\S+$/.test(formData.email)
//     );
//   }, [formData]);

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((current) => ({
//       ...current,
//       [name]: value,
//     }));
//     if (submitError) setSubmitError("");
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!isFormValid) return;

//     try {
//       setIsSubmitting(true);
//       setSubmitError("");
//       await createContactMessage(formData);
//       setSubmitted(true);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     } catch (error) {
//       setSubmitError(
//         error.response?.data?.message || "Unable to submit your message right now."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleReset = () => {
//     setSubmitted(false);
//     setFormData({
//       ...initialForm,
//       name: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "",
//       email: user?.email || "",
//       phone: user?.phone || "",
//     });
//   };

//   if (submitted) {
//     return (
//       <div className="flex min-h-[80vh] items-center justify-center bg-[#FAFAF8] px-4 py-20">
//         <div className="w-full max-w-2xl rounded-[40px] border border-luxe-border bg-white p-10 text-center shadow-[0_24px_80px_rgba(28,28,28,0.08)] sm:p-16">
//           <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50">
//             <svg className="h-12 w-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//           <h1 className="font-serif text-4xl tracking-tight text-luxe-charcoal sm:text-5xl">
//             Message Received
//           </h1>
//           <p className="mt-6 text-lg leading-8 text-luxe-muted">
//             Thank you for reaching out to KNSU Stays. Our concierge team has been notified and we&apos;ve sent a confirmation to <span className="font-semibold text-luxe-charcoal">{formData.email}</span>.
//           </p>
//           <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
//             <Link
//               to="/"
//               className="w-full rounded-full bg-luxe-charcoal px-8 py-4 text-sm font-semibold text-white transition hover:bg-luxe-bronze sm:w-auto"
//             >
//               Return Home
//             </Link>
//             <button
//               onClick={handleReset}
//               className="w-full rounded-full border border-luxe-border bg-white px-8 py-4 text-sm font-semibold text-luxe-charcoal transition hover:bg-luxe-smoke sm:w-auto"
//             >
//               Send Another Message
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-[#FAFAF8] text-luxe-charcoal">
//       {/* Hero Section */}
//       <section className="relative overflow-hidden border-b border-luxe-border bg-[linear-gradient(135deg,#171412_0%,#2c241f_55%,#c39562_140%)] px-4 py-16 text-white lg:px-8 lg:py-24">
//         <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-luxe-bronze/10 blur-[100px]" />
//         <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
//           <div className="relative z-10">
//             <div className="flex items-center gap-3">
//               <span className="h-px w-8 bg-luxe-bronze-light" />
//               <p className="text-xs font-bold uppercase tracking-[0.4em] text-luxe-bronze-light">
//                 Concierge & Support
//               </p>
//             </div>
//             <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
//               Always within <br />
//               <span className="italic text-luxe-bronze-light">your reach.</span>
//             </h1>
//             <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/70 sm:text-xl">
//               Whether you&apos;re planning a boutique getaway or need support during your stay, our dedicated team is available across our properties.
//             </p>
//           </div>

//           <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
//             {contactCards.map((card) => (
//               <a
//                 key={card.title}
//                 href={card.href}
//                 target={card.type === "location" ? "_blank" : undefined}
//                 rel={card.type === "location" ? "noreferrer" : undefined}
//                 className="group relative rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-500 hover:bg-white/15 hover:shadow-2xl"
//               >
//                 <div className="flex items-start justify-between">
//                   <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-luxe-bronze-light">
//                     {card.title}
//                   </p>
//                   {card.type !== "location" && <CopyButton text={card.value} />}
//                 </div>
//                 <p className="mt-4 font-serif text-2xl tracking-tight text-white group-hover:text-luxe-bronze-light transition-colors">
//                   {card.value}
//                 </p>
//                 <p className="mt-3 text-sm leading-relaxed text-white/50 group-hover:text-white/70 transition-colors">
//                   {card.detail}
//                 </p>
//                 <div className="absolute bottom-4 right-6 translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
//                   <svg className="h-5 w-5 text-luxe-bronze-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//                   </svg>
//                 </div>
//               </a>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Main Content */}
//       <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
//         {/* Form Container */}
//         <div className="relative rounded-[40px] border border-luxe-border bg-white p-8 shadow-[0_20px_60px_rgba(28,28,28,0.04)] sm:p-12">
//           <div className="flex flex-wrap items-start justify-between gap-6">
//             <div>
//               <p className="text-[0.65rem] font-bold uppercase tracking-[0.35em] text-luxe-bronze">
//                 Digital Concierge
//               </p>
//               <h2 className="mt-4 font-serif text-4xl tracking-tight">How can we assist?</h2>
//             </div>
//             <div className="flex items-center gap-2 rounded-full bg-luxe-smoke px-5 py-2.5">
//               <span className={`h-2 w-2 rounded-full ${isOpen ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
//               <span className="text-[0.65rem] font-bold uppercase tracking-widest text-luxe-muted">
//                 {isOpen ? "Team is Online" : "Available for Messages"}
//               </span>
//             </div>
//           </div>

//           <p className="mt-6 text-base leading-relaxed text-luxe-muted">
//             Fill out the form below for stay inquiries, table reservations, or general help. Our team typically responds within 2 hours during business hours.
//           </p>

//           {submitError && (
//             <div className="mt-8 flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm text-rose-600">
//               <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               {submitError}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="mt-10 grid gap-6 sm:grid-cols-2">
//             <div className="space-y-2">
//               <label className="text-[0.65rem] font-bold uppercase tracking-widest text-luxe-muted ml-1">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 required
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Ex. Julian Casablancas"
//                 className="w-full rounded-2xl border border-luxe-border bg-luxe-smoke/50 px-5 py-4 text-sm outline-none transition-all focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/5"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-[0.65rem] font-bold uppercase tracking-widest text-luxe-muted ml-1">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 required
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="name@luxury.com"
//                 className="w-full rounded-2xl border border-luxe-border bg-luxe-smoke/50 px-5 py-4 text-sm outline-none transition-all focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/5"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-[0.65rem] font-bold uppercase tracking-widest text-luxe-muted ml-1">
//                 Contact Phone
//               </label>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 placeholder="+91 90000 00000"
//                 className="w-full rounded-2xl border border-luxe-border bg-luxe-smoke/50 px-5 py-4 text-sm outline-none transition-all focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/5"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-[0.65rem] font-bold uppercase tracking-widest text-luxe-muted ml-1">
//                 Reason for Contact
//               </label>
//               <input
//                 type="text"
//                 name="subject"
//                 required
//                 value={formData.subject}
//                 onChange={handleChange}
//                 placeholder="How can we help?"
//                 className="w-full rounded-2xl border border-luxe-border bg-luxe-smoke/50 px-5 py-4 text-sm outline-none transition-all focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/5"
//               />
//             </div>

//             <div className="space-y-2 sm:col-span-2">
//               <label className="text-[0.65rem] font-bold uppercase tracking-widest text-luxe-muted ml-1">
//                 Your Message
//               </label>
//               <textarea
//                 name="message"
//                 required
//                 value={formData.message}
//                 onChange={handleChange}
//                 rows={5}
//                 placeholder="Tell us about your requirements or questions..."
//                 className="w-full rounded-[28px] border border-luxe-border bg-luxe-smoke/50 px-6 py-5 text-sm outline-none transition-all focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/5"
//               />
//             </div>

//             <div className="mt-4 flex items-center justify-between gap-6 sm:col-span-2">
//               <p className="max-w-xs text-xs leading-relaxed text-luxe-muted">
//                 By submitting, you agree to our privacy policy and stay terms.
//               </p>
//               <button
//                 type="submit"
//                 disabled={!isFormValid || isSubmitting}
//                 className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-luxe-charcoal px-10 py-4 text-sm font-bold text-white transition-all hover:bg-luxe-bronze hover:pl-8 disabled:cursor-not-allowed disabled:bg-luxe-muted"
//               >
//                 <span>{isSubmitting ? "Processing..." : "Send Request"}</span>
//                 <svg className="h-4 w-4 transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                 </svg>
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Sidebar */}
//         <div className="flex flex-col gap-10">
//           {/* Destination Showcase (Replaced Map) */}
//           <div className="overflow-hidden rounded-[40px] border border-luxe-border bg-white shadow-[0_20px_60px_rgba(28,28,28,0.04)]">
//             <div className="relative h-[300px] w-full overflow-hidden">
//               <img 
//                 src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" 
//                 alt="KNSU Property" 
//                 className="h-full w-full object-cover transition-transform duration-700 hover:scale-110 grayscale hover:grayscale-0"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-luxe-charcoal/60 to-transparent" />
//               <div className="absolute bottom-6 left-6 text-white">
//                 <p className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-luxe-bronze-light">
//                   Flagship Destination
//                 </p>
//                 <h3 className="mt-2 font-serif text-2xl">Hyderabad Gateway</h3>
//               </div>
//             </div>
//             <div className="p-8">
//               <p className="text-sm leading-relaxed text-luxe-muted">
//                 Experience the pinnacle of boutique hospitality in our flagship Hyderabad property. Our team is ready to welcome you with personalized care and elite services.
//               </p>
//               <div className="mt-6 flex flex-wrap gap-2">
//                 {["5-Star Dining", "Rooftop Pool", "Elite Concierge"].map(tag => (
//                   <span key={tag} className="rounded-full bg-luxe-smoke px-3 py-1 text-[0.6rem] font-bold uppercase tracking-widest text-luxe-muted">
//                     {tag}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Social Proof / FAQ */}
//           <div className="rounded-[40px] bg-luxe-charcoal p-10 text-white shadow-2xl">
//             <p className="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-luxe-bronze-light">
//               Guest Support
//             </p>
//             <h3 className="mt-4 font-serif text-3xl">Frequent Queries</h3>
//             <div className="mt-10 space-y-8">
//               {faqs.map((faq) => (
//                 <div key={faq.question} className="group">
//                   <h4 className="flex items-center gap-3 text-base font-semibold transition group-hover:text-luxe-bronze-light">
//                     <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-luxe-bronze-light" />
//                     {faq.question}
//                   </h4>
//                   <p className="mt-3 pl-4.5 text-sm leading-relaxed text-white/50">
//                     {faq.answer}
//                   </p>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-12 flex items-center gap-6 border-t border-white/10 pt-10">
//               <div className="flex -space-x-3">
//                 {[1, 2, 3, 4].map((i) => (
//                   <div key={i} className="h-10 w-10 overflow-hidden rounded-full border-2 border-luxe-charcoal bg-luxe-smoke">
//                     <img src={`https://i.pravatar.cc/100?u=knsu${i}`} alt="Team" className="h-full w-full object-cover grayscale" />
//                   </div>
//                 ))}
//               </div>
//               <p className="text-[0.65rem] font-bold uppercase tracking-widest text-white/40">
//                 Join <span className="text-white">5,000+</span> satisfied guests <br />who stay with KNSU.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
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