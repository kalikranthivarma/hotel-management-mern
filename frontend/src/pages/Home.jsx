import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import hero1 from "../assets/hero1.png";
import hero2 from "../assets/hero2.png";
import hero3 from "../assets/hero3.png";
import hotel1 from "../assets/hotel1.png";
import hotel2 from "../assets/hotel2.png";
import hotel3 from "../assets/hotel3.png";
import "../styles/Home.css";

/* ─── Data ──────────────────────────────────────────────── */
const heroSlides = [
  {
    id: 1,
    image: hero1,
    label: "KNSU STAYS",
    subtitle: "Where Elegance Meets Excellence",
  },
  {
    id: 2,
    image: hero2,
    label: "GRAND LOBBIES",
    subtitle: "Step Into a World of Refined Luxury",
  },
  {
    id: 3,
    image: hero3,
    label: "PREMIUM SUITES",
    subtitle: "Breathtaking Views, Timeless Comfort",
  },
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
    desc: "Wake up to breathtaking mountain views where adventure and relaxation go hand in hand, nestled in the lap of the Himalayas.",
    rooms: "78 rooms & 12 Suites",
    checkin: "Check-in: 2:00 PM  |  Check-out: 11:00 AM",
    dining: "Two mountain-view restaurants",
    banquet: "280 sq.m. of event space",
    address: "12 Mall Road, Shimla, Himachal Pradesh, 171001",
  },
  {
    id: 3,
    image: hotel3,
    name: "KNSU Stays — Goa Serenity",
    desc: "Where tropical bliss meets modern luxury — an island sanctuary featuring private pool villas and world-class spa experiences.",
    rooms: "96 rooms & 24 pool villas",
    checkin: "Check-in: 3:00 PM  |  Check-out: 12:00 Noon",
    dining: "Four beachside restaurants",
    banquet: "450 sq.m. of open-air event space",
    address: "Candolim Beach Road, North Goa, 403515",
  },
];

const deals = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80",
    title: "Celebrating Our Bond — Double The Joy",
    desc: "As we come together to celebrate four wonderful years of KNSU Stays, we invite you to rediscover luxury at unbeatable prices.",
    validity: "20 Mar 2026 — 30 Apr 2026",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
    title: "Suite Surprises — Member Only",
    desc: "Indulge in an enhanced comfort stay that goes beyond the ordinary — added space, thoughtful touches and exclusive member upgrades.",
    validity: "Round the Year",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    title: "Perfect Staycations — Summer Escapes",
    desc: "Escape into brighter days without leaving your city. Exclusive summer packages crafted for our most valued members.",
    validity: "6 Mar 2026 — 30 Apr 2026",
  },
];

/* ─── Hero Carousel ─────────────────────────────────────── */
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
  const prev = () => goTo((active - 1 + heroSlides.length) % heroSlides.length);
  const next = () => goTo((active + 1) % heroSlides.length);

  return (
    <section className="hero-carousel" aria-label="Featured destinations carousel">
      <div className="hero-carousel__track">
        {heroSlides.map((slide, i) => (
          <div
            key={slide.id}
            className={`hero-carousel__slide ${i === active ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
            aria-hidden={i !== active}
          >
            <div className="hero-carousel__overlay" />
            <div className="hero-carousel__content">
              <p className="hero-carousel__eyebrow">✦ Premium Collection</p>
              <h1 className="hero-carousel__heading">{slide.label}</h1>
              <p className="hero-carousel__sub">{slide.subtitle}</p>
              <div className="hero-carousel__actions">
                <Link to="/rooms" className="hero-btn hero-btn--primary">
                  Explore Hotels
                </Link>
                <Link to="/register" className="hero-btn hero-btn--ghost">
                  Join Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nav arrows */}
      <button className="hero-carousel__arrow left" onClick={prev} aria-label="Previous slide">
        ‹
      </button>
      <button className="hero-carousel__arrow right" onClick={next} aria-label="Next slide">
        ›
      </button>

      {/* Dots */}
      <div className="hero-carousel__dots" role="tablist">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === active}
            className={`hero-carousel__dot ${i === active ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

/* ─── Search Bar ────────────────────────────────────────── */
function SearchBar() {
  return (
    <section className="search-bar-wrap">
      <div className="search-bar">
        <p className="search-bar__label">EXPLORE</p>
        <span className="search-bar__arrow">➜</span>
        <div className="search-bar__fields">
          <select className="search-bar__select" id="country-select">
            <option value="">Country</option>
            <option>India</option>
            <option>UAE</option>
            <option>Maldives</option>
          </select>
          <select className="search-bar__select" id="city-select">
            <option value="">City</option>
            <option>Hyderabad</option>
            <option>Shimla</option>
            <option>Goa</option>
          </select>
          <div className="search-bar__input-wrap">
            <input
              id="hotel-search"
              type="text"
              className="search-bar__input"
              placeholder="Search destinations or hotels…"
            />
            <button className="search-bar__btn" aria-label="Search">🔍</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Hotels Section ────────────────────────────────────── */
function HotelsSection() {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  return (
    <section className="hotels-section" id="hotels">
      <div className="hotels-section__header">
        <h2 className="hotels-section__title">DOWN THE KNSU LANE</h2>
        <p className="hotels-section__desc">
          Vibe Up with KNSU Stays! Discover a collection of dynamic hotels that elevate travel to
          exceptional standards. Each KNSU destination seamlessly combines style and functionality,
          ensuring you find yourself at the very best—stationed at prime locations that put you at
          the centre of the action.
        </p>

        {/* Filters */}
        <div className="hotels-section__filters">
          <select
            id="hotels-country"
            className="hotels-filter__select"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">Country</option>
            <option>India</option>
            <option>UAE</option>
          </select>
          <select
            id="hotels-city"
            className="hotels-filter__select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">City</option>
            <option>Hyderabad</option>
            <option>Shimla</option>
            <option>Goa</option>
          </select>
          <div className="hotels-filter__search-wrap">
            <input type="text" className="hotels-filter__search" placeholder="Search" />
            <button className="hotels-filter__search-btn" aria-label="Search hotels">🔍</button>
          </div>
        </div>
      </div>

      {/* Hotel Cards */}
      <div className="hotels-list">
        {hotels.map((h) => (
          <article key={h.id} className="hotel-card">
            <div className="hotel-card__img-wrap">
              <img src={h.image} alt={h.name} className="hotel-card__img" loading="lazy" />
              <button className="hotel-card__gallery-btn">🖼 Gallery</button>
            </div>
            <div className="hotel-card__body">
              <h3 className="hotel-card__name">{h.name}</h3>
              <p className="hotel-card__desc">{h.desc}</p>

              <div className="hotel-card__meta">
                <div className="hotel-card__meta-item">
                  <span className="hotel-card__meta-icon">🛏</span>
                  {h.rooms}
                </div>
                <div className="hotel-card__meta-item">
                  <span className="hotel-card__meta-icon">🕒</span>
                  {h.checkin}
                </div>
                <div className="hotel-card__meta-item">
                  <span className="hotel-card__meta-icon">🍽</span>
                  {h.dining}
                </div>
                <div className="hotel-card__meta-item">
                  <span className="hotel-card__meta-icon">🏛</span>
                  {h.banquet}
                </div>
              </div>

              <div className="hotel-card__address">
                <span className="hotel-card__meta-icon">📍</span>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(h.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hotel-card__map-link"
                >
                  {h.address} — View Map
                </a>
              </div>

              <div className="hotel-card__actions">
                <Link to={`/rooms`} className="hotel-card__link-btn">
                  VIEW HOTEL
                </Link>
                <Link to="/login" className="hotel-card__book-btn">
                  BOOK NOW
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ─── Deals Section ─────────────────────────────────────── */
function DealsSection() {
  const [dealIdx, setDealIdx] = useState(0);

  const prevDeal = () => setDealIdx((p) => (p - 1 + deals.length) % deals.length);
  const nextDeal = () => setDealIdx((p) => (p + 1) % deals.length);

  const visible = [
    deals[dealIdx % deals.length],
    deals[(dealIdx + 1) % deals.length],
    deals[(dealIdx + 2) % deals.length],
  ];

  return (
    <section className="deals-section" id="deals">
      <div className="deals-section__header">
        <h2 className="deals-section__title">MEMBER-ONLY DEALS</h2>
        <p className="deals-section__desc">
          Enjoy more, every time you stay. As a valued KNSU member, unlock special privileges,
          insider deals and tailored experiences designed just for you. Sign up today to start
          saving.
        </p>
      </div>

      <div className="deals-carousel">
        <button className="deals-arrow left" onClick={prevDeal} aria-label="Previous deal">‹</button>

        <div className="deals-cards">
          {visible.map((deal, i) => (
            <article key={`${deal.id}-${i}`} className="deal-card">
              <div className="deal-card__img-wrap">
                <img src={deal.image} alt={deal.title} className="deal-card__img" loading="lazy" />
              </div>
              <div className="deal-card__body">
                <h3 className="deal-card__title">{deal.title}</h3>
                <p className="deal-card__desc">{deal.desc}</p>
                <p className="deal-card__validity-label">VALIDITY</p>
                <p className="deal-card__validity">{deal.validity}</p>
                <div className="deal-card__actions">
                  <button className="deal-card__know-btn">KNOW MORE</button>
                  <Link to="/login" className="deal-card__join-btn">LOGIN / JOIN</Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <button className="deals-arrow right" onClick={nextDeal} aria-label="Next deal">›</button>
      </div>
    </section>
  );
}

/* ─── Why KNSU Banner ───────────────────────────────────── */
function WhyKNSU() {
  const perks = [
    { icon: "🏆", title: "Award-Winning Hospitality", desc: "Recognised globally for service excellence and guest satisfaction." },
    { icon: "🌿", title: "Sustainable Luxury", desc: "Eco-conscious stays without compromising on premium comfort." },
    { icon: "💎", title: "Exclusive Member Rewards", desc: "Earn points on every stay and redeem for unforgettable experiences." },
    { icon: "🍽️", title: "World-Class Dining", desc: "Curated menus by Michelin-star inspired chefs at every property." },
  ];

  return (
    <section className="why-knsu" id="why-knsu">
      <div className="why-knsu__header">
        <p className="why-knsu__eyebrow">✦ Why Choose Us</p>
        <h2 className="why-knsu__title">The KNSU Stays Difference</h2>
      </div>
      <div className="why-knsu__grid">
        {perks.map((p) => (
          <div key={p.title} className="why-knsu__card">
            <span className="why-knsu__icon">{p.icon}</span>
            <h3 className="why-knsu__perk-title">{p.title}</h3>
            <p className="why-knsu__perk-desc">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── CTA Banner ────────────────────────────────────────── */
function CTABanner() {
  return (
    <section className="cta-banner">
      <div className="cta-banner__content">
        <p className="cta-banner__eyebrow">✦ Start Your Journey</p>
        <h2 className="cta-banner__title">Experience the Art of Luxury Travel</h2>
        <p className="cta-banner__desc">
          Register today to unlock member-only rates, personalised recommendations, and priority
          booking across all KNSU Stays properties.
        </p>
        <div className="cta-banner__actions">
          <Link to="/register" className="cta-btn cta-btn--primary">Create Account</Link>
          <Link to="/login" className="cta-btn cta-btn--ghost">Sign In</Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ────────────────────────────────────────────── */
function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="home-footer__inner">
        <div className="home-footer__brand">
          <p className="home-footer__logo">KNSU stays</p>
          <p className="home-footer__tagline">Where Elegance Meets Excellence</p>
        </div>
        <div className="home-footer__links">
          <div>
            <p className="home-footer__col-title">Explore</p>
            <a href="#hotels">Hotels</a>
            <a href="#deals">Deals</a>
            <Link to="/rooms">Rooms</Link>
          </div>
          <div>
            <p className="home-footer__col-title">Account</p>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <div>
            <p className="home-footer__col-title">Contact</p>
            <a href="mailto:stay@knsustays.com">stay@knsustays.com</a>
            <a href="tel:+918001234567">+91 800-123-4567</a>
          </div>
          <div>
            <p className="home-footer__col-title">Staff Portal</p>
            <Link to="/admin/login">Staff Login</Link>
            <Link to="/admin/register">Staff Registration</Link>
          </div>
        </div>

      </div>
      <div className="home-footer__bottom">
        <p>© 2026 KNSU Stays. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* ─── Page ──────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="home-page">
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