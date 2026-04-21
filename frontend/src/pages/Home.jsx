import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import hero1 from "../assets/hero1.png";
import hero2 from "../assets/hero2.png";
import hero3 from "../assets/hero3.png";
import hotel1 from "../assets/hotel1.png";
import hotel2 from "../assets/hotel2.png";
import hotel3 from "../assets/hotel3.png";

const heroSlides = [
  { id: 1, image: hero1, label: "KNSU STAYS", subtitle: "Where Elegance Meets Excellence" },
  { id: 2, image: hero2, label: "GRAND LOBBIES", subtitle: "Step Into a World of Refined Luxury" },
  { id: 3, image: hero3, label: "PREMIUM SUITES", subtitle: "Breathtaking Views, Timeless Comfort" },
];

const hotels = [
  {
    id: 1,
    image: hotel1,
    name: "KNSU Stays - Hyderabad Gateway",
    desc: "Step into a stylish retreat where modern vibes meet the city's buzzing spirit, perfectly positioned at the heart of Hyderabad.",
    rooms: "163 rooms and 15 suites",
    checkin: "Check-in: 2:00 PM | Check-out: 12:00 Noon",
    dining: "Three restaurants and a rooftop bar",
    banquet: "620 sq.m. of versatile banqueting space",
    address: "Plot 14, Financial District, Nanakramguda, Hyderabad, 500032",
  },
  {
    id: 2,
    image: hotel2,
    name: "KNSU Stays - Shimla Highlands",
    desc: "Wake up to breathtaking mountain views where adventure and relaxation go hand in hand, nestled in the lap of the Himalayas.",
    rooms: "78 rooms and 12 suites",
    checkin: "Check-in: 2:00 PM | Check-out: 11:00 AM",
    dining: "Two mountain-view restaurants",
    banquet: "280 sq.m. of event space",
    address: "12 Mall Road, Shimla, Himachal Pradesh, 171001",
  },
  {
    id: 3,
    image: hotel3,
    name: "KNSU Stays - Goa Serenity",
    desc: "Where tropical bliss meets modern luxury - an island sanctuary featuring private pool villas and world-class spa experiences.",
    rooms: "96 rooms and 24 pool villas",
    checkin: "Check-in: 3:00 PM | Check-out: 12:00 Noon",
    dining: "Four beachside restaurants",
    banquet: "450 sq.m. of open-air event space",
    address: "Candolim Beach Road, North Goa, 403515",
  },
];

const deals = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80",
    title: "Celebrating Our Bond - Double The Joy",
    desc: "As we come together to celebrate four wonderful years of KNSU Stays, we invite you to rediscover luxury at unbeatable prices.",
    validity: "20 Mar 2026 - 30 Apr 2026",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
    title: "Suite Surprises - Member Only",
    desc: "Indulge in an enhanced comfort stay that goes beyond the ordinary - added space, thoughtful touches and exclusive member upgrades.",
    validity: "Round the Year",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    title: "Perfect Staycations - Summer Escapes",
    desc: "Escape into brighter days without leaving your city. Exclusive summer packages crafted for our most valued members.",
    validity: "6 Mar 2026 - 30 Apr 2026",
  },
];

function HeroCarousel() {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((p) => (p + 1) % heroSlides.length);
    }, 5000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (idx) => {
    setActive(idx);
    startTimer();
  };

  return (
    <section className="relative h-[78vh] min-h-[560px] overflow-hidden" aria-label="Featured destinations carousel">
      {heroSlides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === active ? "opacity-100" : "pointer-events-none opacity-0"}`}
          style={{
            backgroundImage: `linear-gradient(to right, rgba(12,10,8,0.82), rgba(12,10,8,0.35)), url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="mx-auto flex h-full max-w-7xl items-end px-4 pb-20 pt-28 lg:px-8">
            <div className="max-w-3xl text-white">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-luxe-bronze-light">Premium Collection</p>
              <h1 className="mt-5 font-serif text-6xl leading-none sm:text-7xl">{slide.label}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">{slide.subtitle}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/rooms" className="rounded-full bg-luxe-bronze px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-luxe-charcoal">
                  Explore Hotels
                </Link>
                <Link to="/register" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  Join Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl text-white backdrop-blur"
        onClick={() => goTo((active - 1 + heroSlides.length) % heroSlides.length)}
        aria-label="Previous slide"
      >
        {"<"}
      </button>
      <button
        className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl text-white backdrop-blur"
        onClick={() => goTo((active + 1) % heroSlides.length)}
        aria-label="Next slide"
      >
        {">"}
      </button>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-3">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            className={`h-3 rounded-full transition-all ${i === active ? "w-10 bg-luxe-bronze" : "w-3 bg-white/60"}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

function SearchBar() {
  return (
    <section className="mx-auto -mt-10 max-w-6xl px-4 relative z-20">
      <div className="rounded-[30px] border border-luxe-border bg-white p-5 shadow-[0_18px_60px_rgba(28,28,28,0.08)]">
        <div className="grid gap-4 lg:grid-cols-[140px_1fr_1fr_1.4fr]">
          <div className="flex items-center rounded-[24px] bg-luxe-charcoal px-5 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white">
            Explore
          </div>
          <select className="rounded-[24px] border border-luxe-border bg-luxe-smoke px-4 py-4 outline-none">
            <option value="">Country</option>
            <option>India</option>
            <option>UAE</option>
            <option>Maldives</option>
          </select>
          <select className="rounded-[24px] border border-luxe-border bg-luxe-smoke px-4 py-4 outline-none">
            <option value="">City</option>
            <option>Hyderabad</option>
            <option>Shimla</option>
            <option>Goa</option>
          </select>
          <div className="flex rounded-[24px] border border-luxe-border bg-luxe-smoke p-2">
            <input
              type="text"
              className="min-w-0 flex-1 bg-transparent px-3 outline-none"
              placeholder="Search destinations or hotels..."
            />
            <button className="rounded-[18px] bg-luxe-bronze px-5 py-3 text-sm font-semibold text-white">
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function HotelsSection() {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

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
                <Link to="/dining" className="rounded-2xl bg-luxe-smoke px-4 py-3 text-sm transition hover:bg-luxe-charcoal hover:text-white">{h.dining}</Link>
                <div className="rounded-2xl bg-luxe-smoke px-4 py-3 text-sm">{h.banquet}</div>
              </div>
              <div className="mt-6 rounded-2xl border border-luxe-border px-4 py-4 text-sm leading-7 text-luxe-muted">
                <a href={`https://maps.google.com/?q=${encodeURIComponent(h.address)}`} target="_blank" rel="noreferrer" className="font-medium hover:text-luxe-bronze">
                  {h.address} - View Map
                </a>
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link to="/rooms" className="rounded-full border border-luxe-charcoal px-5 py-3 text-sm font-semibold text-luxe-charcoal transition hover:bg-luxe-charcoal hover:text-white">
                  View Hotel
                </Link>
                <Link to="/login" className="rounded-full bg-luxe-bronze px-5 py-3 text-sm font-semibold text-white transition hover:bg-luxe-charcoal">
                  Book Now
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function DealsSection() {
  const [dealIdx, setDealIdx] = useState(0);

  const visible = [
    { slot: 0, deal: deals[dealIdx % deals.length] },
    { slot: 1, deal: deals[(dealIdx + 1) % deals.length] },
    { slot: 2, deal: deals[(dealIdx + 2) % deals.length] },
  ];

  return (
    <section className="bg-luxe-charcoal py-16 text-white" id="deals">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-luxe-bronze-light">Member-only deals</p>
            <h2 className="mt-4 font-serif text-5xl leading-none">Stay more, unlock more</h2>
            <p className="mt-5 text-lg leading-8 text-white/70">
              As a valued KNSU member, unlock special privileges, insider deals and tailored
              experiences designed just for you.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="h-12 w-12 rounded-full border border-white/20 bg-white/10 text-2xl" onClick={() => setDealIdx((p) => (p - 1 + deals.length) % deals.length)}>
              {"<"}
            </button>
            <button className="h-12 w-12 rounded-full border border-white/20 bg-white/10 text-2xl" onClick={() => setDealIdx((p) => (p + 1) % deals.length)}>
              {">"}
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {visible.map(({ slot, deal }) => (
            <article key={`deal-card-${slot}-${deal.id}`} className="overflow-hidden rounded-[30px] bg-white text-luxe-charcoal shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
              <img src={deal.image} alt={deal.title} className="h-56 w-full object-cover" loading="lazy" />
              <div className="p-6">
                <h3 className="font-serif text-3xl">{deal.title}</h3>
                <p className="mt-4 leading-8 text-luxe-muted">{deal.desc}</p>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-luxe-bronze">Validity</p>
                <p className="mt-2 font-semibold">{deal.validity}</p>
                <div className="mt-6 flex gap-3">
                  <Link to="/dining" className="rounded-full border border-luxe-border px-4 py-3 text-sm font-semibold">
                    Know More
                  </Link>
                  <Link to="/login" className="rounded-full bg-luxe-bronze px-4 py-3 text-sm font-semibold text-white">
                    Login / Join
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyKNSU() {
  const perks = [
    { title: "Award-Winning Hospitality", desc: "Recognised globally for service excellence and guest satisfaction." },
    { title: "Sustainable Luxury", desc: "Eco-conscious stays without compromising on premium comfort." },
    { title: "Exclusive Member Rewards", desc: "Earn points on every stay and redeem for unforgettable experiences." },
    { title: "World-Class Dining", desc: "Curated menus by Michelin-inspired chefs at every property." },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8" id="why-knsu">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-luxe-bronze">Why Choose Us</p>
        <h2 className="mt-4 font-serif text-5xl leading-none">The KNSU Stays difference</h2>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {perks.map((p) => (
          <div key={p.title} className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
            <div className="h-12 w-12 rounded-2xl bg-luxe-smoke" />
            <h3 className="mt-5 text-2xl font-semibold">{p.title}</h3>
            <p className="mt-3 leading-8 text-luxe-muted">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTABanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
      <div className="overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#1c1c1c_0%,#3d2b1f_100%)] px-6 py-12 text-white shadow-[0_24px_80px_rgba(28,28,28,0.18)] sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-luxe-bronze-light">Start Your Journey</p>
        <h2 className="mt-4 max-w-3xl font-serif text-5xl leading-none">Experience the art of luxury travel</h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
          Register today to unlock member-only rates, personalised recommendations and priority
          booking across all KNSU Stays properties.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/register" className="rounded-full bg-luxe-bronze px-6 py-3 text-sm font-semibold text-white">
            Create Account
          </Link>
          <Link to="/login" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white">
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}

function HomeFooter() {
  return (
    <footer className="border-t border-luxe-border bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1.2fr_2fr] lg:px-8">
        <div>
          <p className="font-serif text-3xl">KNSU stays</p>
          <p className="mt-3 text-luxe-muted">Where Elegance Meets Excellence</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3 text-sm text-luxe-muted">
            <p className="font-semibold uppercase tracking-[0.2em] text-luxe-charcoal">Explore</p>
            <a href="#hotels">Hotels</a>
            <a href="#deals">Deals</a>
            <Link to="/rooms">Rooms</Link>
          </div>
          <div className="space-y-3 text-sm text-luxe-muted">
            <p className="font-semibold uppercase tracking-[0.2em] text-luxe-charcoal">Account</p>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <div className="space-y-3 text-sm text-luxe-muted">
            <p className="font-semibold uppercase tracking-[0.2em] text-luxe-charcoal">Contact</p>
            <a href="mailto:stay@knsustays.com">stay@knsustays.com</a>
            <a href="tel:+918001234567">+91 800-123-4567</a>
          </div>
          <div className="space-y-3 text-sm text-luxe-muted">
            <p className="font-semibold uppercase tracking-[0.2em] text-luxe-charcoal">Staff Portal</p>
            <Link to="/admin/login">Staff Login</Link>
            <Link to="/admin/register">Staff Registration</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-luxe-border px-4 py-5 text-center text-sm text-luxe-muted">
        <p>(c) 2026 KNSU Stays. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="overflow-hidden">
      <HeroCarousel />
      <SearchBar />
      <HotelsSection />
      <DealsSection />
      <WhyKNSU />
      <CTABanner />
      <HomeFooter />
    </div>
  );
}
