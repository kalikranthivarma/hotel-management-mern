import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

import hero1 from "../assets/hero1.png";
import hero2 from "../assets/hero2.png";
import hero3 from "../assets/hero3.png";
import hotel1 from "../assets/hotel1.png";
import hotel2 from "../assets/hotel2.png";
import hotel3 from "../assets/hotel3.png";

/* ─── Data ──────────────────────────────────────────────── */
const heroSlides = [
  { id: 1, image: hero1, label: "KNSU STAYS", subtitle: "Where Elegance Meets Excellence" },
  { id: 2, image: hero2, label: "GRAND LOBBIES", subtitle: "Step Into a World of Refined Luxury" },
  { id: 3, image: hero3, label: "PREMIUM SUITES", subtitle: "Breathtaking Views, Timeless Comfort" },
];

const hotels = [
  {
    id: 1,
    image: hotel1,
    name: "KNSU Stays — Hyderabad Gateway",
    desc: "Step into a stylish retreat where modern vibes meet the city's buzzing spirit, perfectly positioned at the heart of Hyderabad.",
    rooms: "163 rooms & 15 suites",
    checkin: "Check-in: 2:00 PM  |  Check-out: 12:00 Noon",
    dining: "Three restaurants and a rooftop bar",
    banquet: "620 sq.m. of versatile banqueting space",
    address: "Plot 14, Financial District, Nanakramguda, Hyderabad, 500032",
  },
  {
    id: 2,
    image: hotel2,
    name: "KNSU Stays — Shimla Highlands",
    desc: "Wake up to breathtaking mountain views where adventure and relaxation go hand in hand.",
    rooms: "78 rooms & 12 Suites",
    checkin: "Check-in: 2:00 PM  |  Check-out: 11:00 AM",
    dining: "Two mountain-view restaurants",
    banquet: "280 sq.m. of event space",
    address: "Shimla, Himachal Pradesh",
  },
  {
    id: 3,
    image: hotel3,
    name: "KNSU Stays — Goa Serenity",
    desc: "Where tropical bliss meets modern luxury.",
    rooms: "96 rooms & 24 pool villas",
    checkin: "Check-in: 3:00 PM  |  Check-out: 12:00 Noon",
    dining: "Four beachside restaurants",
    banquet: "450 sq.m. of open-air event space",
    address: "North Goa",
  },
];

const deals = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80",
    title: "Celebrating Our Bond — Double The Joy",
    desc: "Rediscover luxury at unbeatable prices.",
    validity: "20 Mar 2026 — 30 Apr 2026",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
    title: "Suite Surprises — Member Only",
    desc: "Enhanced comfort stay beyond ordinary.",
    validity: "Round the Year",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    title: "Perfect Staycations — Summer Escapes",
    desc: "Exclusive summer packages crafted for you.",
    validity: "6 Mar 2026 — 30 Apr 2026",
  },
];

/* ─── HERO ───────────────────────────────────── */
function HeroCarousel() {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((p) => (p + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <section className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden bg-black">
      {heroSlides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
            i === active ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="absolute inset-0 bg-black/60" />

          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center text-white w-[90%] max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-serif">{slide.label}</h1>
            <p className="mt-4 text-lg">{slide.subtitle}</p>

            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Link to="/rooms" className="px-6 py-3 bg-luxe-bronze hover:bg-luxe-charcoal transition rounded-full text-white font-semibold">
                Explore Hotels
              </Link>
              <Link to="/register" className="px-6 py-3 border border-white/40 rounded-full hover:bg-white/10 transition">
                Join Now
              </Link>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

/* ─── HOTELS ───────────────────────────────────── */


function HotelsSection() {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const { user } = useSelector((state) => state.auth);

  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin' || user?.role === 'superAdmin';
  const bookLink = isLoggedIn && !isAdmin ? "/rooms" : "/login";

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8" id="hotels">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-luxe-bronze">Down the KNSU lane</p>
          <h2 className="mt-4 font-serif text-5xl leading-none">A destination for every mood</h2>
          <p className="mt-5 text-lg leading-8 text-luxe-muted">
            Discover a collection of dynamic hotels that elevate travel to exceptional standards.
            Each KNSU destination combines style, comfort and prime city access.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="rounded-2xl border border-luxe-border bg-white px-4 py-3 outline-none">
            <option value="">Country</option>
            <option>India</option>
            <option>UAE</option>
          </select>
          <select value={city} onChange={(e) => setCity(e.target.value)} className="rounded-2xl border border-luxe-border bg-white px-4 py-3 outline-none">
            <option value="">City</option>
            <option>Hyderabad</option>
            <option>Shimla</option>
            <option>Goa</option>
          </select>
          <input type="text" className="rounded-2xl border border-luxe-border bg-white px-4 py-3 outline-none" placeholder="Search" />
        </div>
      </div>

      <div className="mt-10 space-y-6">
        {hotels.map((h) => (
          <article key={h.id} className="overflow-hidden rounded-[34px] border border-luxe-border bg-white shadow-[0_18px_50px_rgba(28,28,28,0.06)] lg:grid lg:grid-cols-[360px_1fr]">
            <div className="relative h-80 lg:h-full">
              <img src={h.image} alt={h.name} className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute left-4 top-4 rounded-full bg-luxe-charcoal/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-white">
                Signature Stay
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <h3 className="font-serif text-3xl">{h.name}</h3>
              <p className="mt-4 leading-8 text-luxe-muted">{h.desc}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-luxe-smoke px-4 py-3 text-sm">{h.rooms}</div>
                <div className="rounded-2xl bg-luxe-smoke px-4 py-3 text-sm">{h.checkin}</div>
                <Link to="/dining" className="rounded-2xl bg-luxe-smoke px-4 py-3 text-sm transition hover:bg-luxe-bronze hover:text-white">{h.dining}</Link>
                <div className="rounded-2xl bg-luxe-smoke px-4 py-3 text-sm">{h.banquet}</div>
              </div>
              <div className="mt-6 rounded-2xl border border-luxe-border px-4 py-4 text-sm leading-7 text-luxe-muted">
                <a href={`https://maps.google.com/?q=${encodeURIComponent(h.address)}`} target="_blank" rel="noreferrer" className="font-medium hover:text-luxe-bronze">
                  {h.address} - View Map
                </a>
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link to="/rooms" className="rounded-full border border-luxe-bronze px-5 py-3 text-sm font-semibold text-luxe-bronze transition hover:bg-luxe-bronze hover:text-white">
                  View Hotel
                </Link>
                {!isAdmin && (
                  <Link to={bookLink} className="rounded-full bg-luxe-bronze px-5 py-3 text-sm font-semibold text-white transition hover:bg-luxe-charcoal">
                    Book Now
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}


/* ─── DEALS ───────────────────────────────────── */
function DealsSection() {
  return (
    <section className="bg-black py-20 md:py-24 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        <h2 className="text-3xl md:text-5xl text-white text-center font-serif">
          MEMBER DEALS
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {deals.map((d) => (
            <div className="bg-white/10 rounded-xl overflow-hidden">
              <img src={d.image} className="h-52 w-full object-cover" />
              <div className="p-4 text-white">
                <h3 className="text-xl font-semibold">{d.title}</h3>
                <p className="mt-2 text-white/70">{d.desc}</p>
                <p className="text-luxe-bronze-light mt-2">{d.validity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ─── CTA BANNER ────────────────────────────────────────── */
function CTABanner() {
  return (
    <section className="bg-[#F5F5F5] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#1c1c1c_0%,#3d2b1f_100%)] px-6 py-12 text-white shadow-[0_24px_80px_rgba(28,28,28,0.18)] sm:px-10">
          
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#c6a77d]">
            Start Your Journey
          </p>

          <h2 className="mt-4 max-w-3xl font-serif text-3xl sm:text-5xl leading-tight">
            Experience the art of luxury travel
          </h2>

          <p className="mt-5 max-w-2xl text-base sm:text-lg leading-7 text-white/75">
            Register today to unlock member-only rates, personalised recommendations and priority
            booking across all KNSU Stays properties.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="rounded-full bg-luxe-bronze px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-luxe-charcoal"
            >
              Create Account
            </Link>

            <Link
              to="/login"
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-luxe-charcoal"
            >
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}


/* ─── FOOTER ────────────────────────────────────────────── */

function Footer() {
  const cols = [
    { title: "Explore",  links: [["Hotels", "#hotels"], ["Experiences", "#experiences"], ["Dining", "#"], ["Wellness", "#"], ["Offers", "#offers"]] },
    { title: "Account",  links: [["Register", "/register"], ["Login", "/login"], ["Dashboard", "/dashboard"], ["My Bookings", "/dashboard"], ["Membership", "/register"]] },
    { title: "Contact",  links: [["stay@knsu.com", "mailto:stay@knsu.com"], ["+91 800-123-4567", "tel:+918001234567"], ["Careers", "#"], ["Press", "#"]] },
    { title: "Staff",    links: [["Staff Login", "/admin/login"], ["Staff Register", "/admin/register"], ["Back Office", "#"], ["Support", "#"]] },
  ];

  const socials = [
    { label: "𝕏",  title: "Twitter"   },
    { label: "f",  title: "Facebook"  },
    { label: "in", title: "LinkedIn"  },
    { label: "▶",  title: "YouTube"   },
  ];

  return (
    <footer className="bg-luxe-charcoal text-white">

      {/* ── Top accent line ── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-luxe-bronze/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 py-16
                        sm:grid-cols-2
                        md:grid-cols-3
                        lg:grid-cols-[1.8fr_1fr_1fr_1fr_1fr]
                        border-b border-luxe-bronze/[0.12]">

          {/* Brand column — full width on mobile */}
          <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-1">

            {/* Logo */}
            <div className="mb-6">
              <p className="font-serif text-2xl tracking-[0.14em] text-white">
                KNSU STAYS
              </p>
              <p className="mt-0.5 text-[0.62rem] tracking-[0.3em] uppercase text-white/35">
                Modern Boutique Collection
              </p>
            </div>

            {/* Divider */}
            <div className="mb-5 h-px w-10 bg-luxe-bronze/40" />

            {/* Tagline */}
            <p className="mb-7 max-w-xs text-[0.88rem] leading-relaxed text-white/40">
              A world of curated luxury experiences across India's most iconic destinations.
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5">
              {socials.map(({ label, title }) => (
                <button
                  key={title}
                  aria-label={title}
                  title={title}
                  className="
                    flex h-9 w-9 items-center justify-center
                    rounded-full border border-white/15
                    text-[0.72rem] text-white/40
                    transition-all duration-200
                    hover:border-luxe-bronze/70 hover:text-luxe-bronze-light
                    hover:bg-white/5 hover:scale-110
                  "
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.title} className="flex flex-col gap-3.5">
              {/* Column heading */}
              <p className="mb-1 text-[0.62rem] font-bold tracking-[0.28em] uppercase text-luxe-bronze-light/80">
                {col.title}
              </p>

              {col.links.map(([label, href]) =>
                href.startsWith("/") ? (
                  <Link
                    key={label}
                    to={href}
                    className="
                      w-fit text-[0.85rem] text-white/40
                      transition-colors duration-200
                      hover:text-white
                      relative after:absolute after:-bottom-0.5 after:left-0
                      after:h-px after:w-0 after:bg-luxe-bronze/60
                      after:transition-all after:duration-300
                      hover:after:w-full
                    "
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    key={label}
                    href={href}
                    className="
                      w-fit text-[0.85rem] text-white/40
                      transition-colors duration-200
                      hover:text-white
                      relative after:absolute after:-bottom-0.5 after:left-0
                      after:h-px after:w-0 after:bg-luxe-bronze/60
                      after:transition-all after:duration-300
                      hover:after:w-full
                    "
                  >
                    {label}
                  </a>
                )
              )}
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col items-center justify-between gap-4 py-7
                        sm:flex-row">
          <p className="text-[0.73rem] text-white/25 tracking-wide">
            © 2026 KNSU STAYS. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {["Privacy Policy", "Terms of Use", "Cookie Policy"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-[0.73rem] text-white/25 transition-colors duration-200 hover:text-white/55"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}


/* ─── PAGE ───────────────────────────────────── */
export default function Home() {
  return (
    <div className="w-full overflow-x-hidden bg-[#FAFAF8] text-[#1C1C1C] leading-relaxed">
      <HeroCarousel />
      <HotelsSection />
      <DealsSection />
      <CTABanner />
      <Footer />    </div>
  );
}
