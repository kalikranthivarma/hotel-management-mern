// import { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import hero1 from "../assets/hero1.png";
// import hero2 from "../assets/hero2.png";
// import hero3 from "../assets/hero3.png";
// import hotel1 from "../assets/hotel1.png";
// import hotel2 from "../assets/hotel2.png";
// import hotel3 from "../assets/hotel3.png";
// import "../styles/Home.css";

// /* ─── Data ──────────────────────────────────────────────── */
// const heroSlides = [
//   {
//     id: 1,
//     image: hero1,
//     label: "KNSU STAYS",
//     subtitle: "Where Elegance Meets Excellence",
//   },
//   {
//     id: 2,
//     image: hero2,
//     label: "GRAND LOBBIES",
//     subtitle: "Step Into a World of Refined Luxury",
//   },
//   {
//     id: 3,
//     image: hero3,
//     label: "PREMIUM SUITES",
//     subtitle: "Breathtaking Views, Timeless Comfort",
//   },
// ];

// const hotels = [
//   {
//     id: 1,
//     image: hotel1,
//     name: "KNSU Stays — Hyderabad Gateway",
//     desc: "Step into a stylish retreat where modern vibes meet the city's buzzing spirit, perfectly positioned at the heart of Hyderabad.",
//     rooms: "163 rooms & 15 suites",
//     checkin: "Check-in: 2:00 PM  |  Check-out: 12:00 Noon",
//     dining: "Three restaurants and a rooftop bar",
//     banquet: "620 sq.m. of versatile banqueting space",
//     address: "Plot 14, Financial District, Nanakramguda, Hyderabad, 500032",
//   },
//   {
//     id: 2,
//     image: hotel2,
//     name: "KNSU Stays — Shimla Highlands",
//     desc: "Wake up to breathtaking mountain views where adventure and relaxation go hand in hand, nestled in the lap of the Himalayas.",
//     rooms: "78 rooms & 12 Suites",
//     checkin: "Check-in: 2:00 PM  |  Check-out: 11:00 AM",
//     dining: "Two mountain-view restaurants",
//     banquet: "280 sq.m. of event space",
//     address: "12 Mall Road, Shimla, Himachal Pradesh, 171001",
//   },
//   {
//     id: 3,
//     image: hotel3,
//     name: "KNSU Stays — Goa Serenity",
//     desc: "Where tropical bliss meets modern luxury — an island sanctuary featuring private pool villas and world-class spa experiences.",
//     rooms: "96 rooms & 24 pool villas",
//     checkin: "Check-in: 3:00 PM  |  Check-out: 12:00 Noon",
//     dining: "Four beachside restaurants",
//     banquet: "450 sq.m. of open-air event space",
//     address: "Candolim Beach Road, North Goa, 403515",
//   },
// ];

// const deals = [
//   {
//     id: 1,
//     image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80",
//     title: "Celebrating Our Bond — Double The Joy",
//     desc: "As we come together to celebrate four wonderful years of KNSU Stays, we invite you to rediscover luxury at unbeatable prices.",
//     validity: "20 Mar 2026 — 30 Apr 2026",
//   },
//   {
//     id: 2,
//     image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
//     title: "Suite Surprises — Member Only",
//     desc: "Indulge in an enhanced comfort stay that goes beyond the ordinary — added space, thoughtful touches and exclusive member upgrades.",
//     validity: "Round the Year",
//   },
//   {
//     id: 3,
//     image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
//     title: "Perfect Staycations — Summer Escapes",
//     desc: "Escape into brighter days without leaving your city. Exclusive summer packages crafted for our most valued members.",
//     validity: "6 Mar 2026 — 30 Apr 2026",
//   },
// ];

// /* ─── Hero Carousel ─────────────────────────────────────── */
// function HeroCarousel() {
//   const [active, setActive] = useState(0);
//   const timerRef = useRef(null);

//   const startTimer = () => {
//     clearInterval(timerRef.current);
//     timerRef.current = setInterval(() => {
//       setActive((p) => (p + 1) % heroSlides.length);
//     }, 5000);
//   };

//   useEffect(() => {
//     startTimer();
//     return () => clearInterval(timerRef.current);
//   }, []);

//   const goTo = (idx) => {
//     setActive(idx);
//     startTimer();
//   };
//   const prev = () => goTo((active - 1 + heroSlides.length) % heroSlides.length);
//   const next = () => goTo((active + 1) % heroSlides.length);

//   return (
//     <section className="hero-carousel" aria-label="Featured destinations carousel">
//       <div className="hero-carousel__track">
//         {heroSlides.map((slide, i) => (
//           <div
//             key={slide.id}
//             className={`hero-carousel__slide ${i === active ? "active" : ""}`}
//             style={{ backgroundImage: `url(${slide.image})` }}
//             aria-hidden={i !== active}
//           >
//             <div className="hero-carousel__overlay" />
//             <div className="hero-carousel__content">
//               <p className="hero-carousel__eyebrow">✦ Premium Collection</p>
//               <h1 className="hero-carousel__heading">{slide.label}</h1>
//               <p className="hero-carousel__sub">{slide.subtitle}</p>
//               <div className="hero-carousel__actions">
//                 <Link to="/rooms" className="hero-btn hero-btn--primary">
//                   Explore Hotels
//                 </Link>
//                 <Link to="/register" className="hero-btn hero-btn--ghost">
//                   Join Now
//                 </Link>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Nav arrows */}
//       <button className="hero-carousel__arrow left" onClick={prev} aria-label="Previous slide">
//         ‹
//       </button>
//       <button className="hero-carousel__arrow right" onClick={next} aria-label="Next slide">
//         ›
//       </button>

//       {/* Dots */}
//       <div className="hero-carousel__dots" role="tablist">
//         {heroSlides.map((_, i) => (
//           <button
//             key={i}
//             role="tab"
//             aria-selected={i === active}
//             className={`hero-carousel__dot ${i === active ? "active" : ""}`}
//             onClick={() => goTo(i)}
//             aria-label={`Go to slide ${i + 1}`}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }

// /* ─── Search Bar ────────────────────────────────────────── */
// function SearchBar() {
//   return (
//     <section className="search-bar-wrap">
//       <div className="search-bar">
//         <p className="search-bar__label">EXPLORE</p>
//         <span className="search-bar__arrow">➜</span>
//         <div className="search-bar__fields">
//           <select className="search-bar__select" id="country-select">
//             <option value="">Country</option>
//             <option>India</option>
//             <option>UAE</option>
//             <option>Maldives</option>
//           </select>
//           <select className="search-bar__select" id="city-select">
//             <option value="">City</option>
//             <option>Hyderabad</option>
//             <option>Shimla</option>
//             <option>Goa</option>
//           </select>
//           <div className="search-bar__input-wrap">
//             <input
//               id="hotel-search"
//               type="text"
//               className="search-bar__input"
//               placeholder="Search destinations or hotels…"
//             />
//             <button className="search-bar__btn" aria-label="Search">🔍</button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ─── Hotels Section ────────────────────────────────────── */
// function HotelsSection() {
//   const [country, setCountry] = useState("");
//   const [city, setCity] = useState("");

//   return (
//     <section className="hotels-section" id="hotels">
//       <div className="hotels-section__header">
//         <h2 className="hotels-section__title">DOWN THE KNSU LANE</h2>
//         <p className="hotels-section__desc">
//           Vibe Up with KNSU Stays! Discover a collection of dynamic hotels that elevate travel to
//           exceptional standards. Each KNSU destination seamlessly combines style and functionality,
//           ensuring you find yourself at the very best—stationed at prime locations that put you at
//           the centre of the action.
//         </p>

//         {/* Filters */}
//         <div className="hotels-section__filters">
//           <select
//             id="hotels-country"
//             className="hotels-filter__select"
//             value={country}
//             onChange={(e) => setCountry(e.target.value)}
//           >
//             <option value="">Country</option>
//             <option>India</option>
//             <option>UAE</option>
//           </select>
//           <select
//             id="hotels-city"
//             className="hotels-filter__select"
//             value={city}
//             onChange={(e) => setCity(e.target.value)}
//           >
//             <option value="">City</option>
//             <option>Hyderabad</option>
//             <option>Shimla</option>
//             <option>Goa</option>
//           </select>
//           <div className="hotels-filter__search-wrap">
//             <input type="text" className="hotels-filter__search" placeholder="Search" />
//             <button className="hotels-filter__search-btn" aria-label="Search hotels">🔍</button>
//           </div>
//         </div>
//       </div>

//       {/* Hotel Cards */}
//       <div className="hotels-list">
//         {hotels.map((h) => (
//           <article key={h.id} className="hotel-card">
//             <div className="hotel-card__img-wrap">
//               <img src={h.image} alt={h.name} className="hotel-card__img" loading="lazy" />
//               <button className="hotel-card__gallery-btn">🖼 Gallery</button>
//             </div>
//             <div className="hotel-card__body">
//               <h3 className="hotel-card__name">{h.name}</h3>
//               <p className="hotel-card__desc">{h.desc}</p>

//               <div className="hotel-card__meta">
//                 <div className="hotel-card__meta-item">
//                   <span className="hotel-card__meta-icon">🛏</span>
//                   {h.rooms}
//                 </div>
//                 <div className="hotel-card__meta-item">
//                   <span className="hotel-card__meta-icon">🕒</span>
//                   {h.checkin}
//                 </div>
//                 <div className="hotel-card__meta-item">
//                   <span className="hotel-card__meta-icon">🍽</span>
//                   {h.dining}
//                 </div>
//                 <div className="hotel-card__meta-item">
//                   <span className="hotel-card__meta-icon">🏛</span>
//                   {h.banquet}
//                 </div>
//               </div>

//               <div className="hotel-card__address">
//                 <span className="hotel-card__meta-icon">📍</span>
//                 <a
//                   href={`https://maps.google.com/?q=${encodeURIComponent(h.address)}`}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="hotel-card__map-link"
//                 >
//                   {h.address} — View Map
//                 </a>
//               </div>

//               <div className="hotel-card__actions">
//                 <Link to={`/rooms`} className="hotel-card__link-btn">
//                   VIEW HOTEL
//                 </Link>
//                 <Link to="/login" className="hotel-card__book-btn">
//                   BOOK NOW
//                 </Link>
//               </div>
//             </div>
//           </article>
//         ))}
//       </div>
//     </section>
//   );
// }

// /* ─── Deals Section ─────────────────────────────────────── */
// function DealsSection() {
//   const [dealIdx, setDealIdx] = useState(0);

//   const prevDeal = () => setDealIdx((p) => (p - 1 + deals.length) % deals.length);
//   const nextDeal = () => setDealIdx((p) => (p + 1) % deals.length);

//   const visible = [
//     deals[dealIdx % deals.length],
//     deals[(dealIdx + 1) % deals.length],
//     deals[(dealIdx + 2) % deals.length],
//   ];

//   return (
//     <section className="deals-section" id="deals">
//       <div className="deals-section__header">
//         <h2 className="deals-section__title">MEMBER-ONLY DEALS</h2>
//         <p className="deals-section__desc">
//           Enjoy more, every time you stay. As a valued KNSU member, unlock special privileges,
//           insider deals and tailored experiences designed just for you. Sign up today to start
//           saving.
//         </p>
//       </div>

//       <div className="deals-carousel">
//         <button className="deals-arrow left" onClick={prevDeal} aria-label="Previous deal">‹</button>

//         <div className="deals-cards">
//           {visible.map((deal, i) => (
//             <article key={`${deal.id}-${i}`} className="deal-card">
//               <div className="deal-card__img-wrap">
//                 <img src={deal.image} alt={deal.title} className="deal-card__img" loading="lazy" />
//               </div>
//               <div className="deal-card__body">
//                 <h3 className="deal-card__title">{deal.title}</h3>
//                 <p className="deal-card__desc">{deal.desc}</p>
//                 <p className="deal-card__validity-label">VALIDITY</p>
//                 <p className="deal-card__validity">{deal.validity}</p>
//                 <div className="deal-card__actions">
//                   <button className="deal-card__know-btn">KNOW MORE</button>
//                   <Link to="/login" className="deal-card__join-btn">LOGIN / JOIN</Link>
//                 </div>
//               </div>
//             </article>
//           ))}
//         </div>

//         <button className="deals-arrow right" onClick={nextDeal} aria-label="Next deal">›</button>
//       </div>
//     </section>
//   );
// }

// /* ─── Why KNSU Banner ───────────────────────────────────── */
// function WhyKNSU() {
//   const perks = [
//     { icon: "🏆", title: "Award-Winning Hospitality", desc: "Recognised globally for service excellence and guest satisfaction." },
//     { icon: "🌿", title: "Sustainable Luxury", desc: "Eco-conscious stays without compromising on premium comfort." },
//     { icon: "💎", title: "Exclusive Member Rewards", desc: "Earn points on every stay and redeem for unforgettable experiences." },
//     { icon: "🍽️", title: "World-Class Dining", desc: "Curated menus by Michelin-star inspired chefs at every property." },
//   ];

//   return (
//     <section className="why-knsu" id="why-knsu">
//       <div className="why-knsu__header">
//         <p className="why-knsu__eyebrow">✦ Why Choose Us</p>
//         <h2 className="why-knsu__title">The KNSU Stays Difference</h2>
//       </div>
//       <div className="why-knsu__grid">
//         {perks.map((p) => (
//           <div key={p.title} className="why-knsu__card">
//             <span className="why-knsu__icon">{p.icon}</span>
//             <h3 className="why-knsu__perk-title">{p.title}</h3>
//             <p className="why-knsu__perk-desc">{p.desc}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

// /* ─── CTA Banner ────────────────────────────────────────── */
// function CTABanner() {
//   return (
//     <section className="cta-banner">
//       <div className="cta-banner__content">
//         <p className="cta-banner__eyebrow">✦ Start Your Journey</p>
//         <h2 className="cta-banner__title">Experience the Art of Luxury Travel</h2>
//         <p className="cta-banner__desc">
//           Register today to unlock member-only rates, personalised recommendations, and priority
//           booking across all KNSU Stays properties.
//         </p>
//         <div className="cta-banner__actions">
//           <Link to="/register" className="cta-btn cta-btn--primary">Create Account</Link>
//           <Link to="/login" className="cta-btn cta-btn--ghost">Sign In</Link>
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ─── Footer ────────────────────────────────────────────── */
// function HomeFooter() {
//   return (
//     <footer className="home-footer">
//       <div className="home-footer__inner">
//         <div className="home-footer__brand">
//           <p className="home-footer__logo">KNSU stays</p>
//           <p className="home-footer__tagline">Where Elegance Meets Excellence</p>
//         </div>
//         <div className="home-footer__links">
//           <div>
//             <p className="home-footer__col-title">Explore</p>
//             <a href="#hotels">Hotels</a>
//             <a href="#deals">Deals</a>
//             <Link to="/rooms">Rooms</Link>
//           </div>
//           <div>
//             <p className="home-footer__col-title">Account</p>
//             <Link to="/register">Register</Link>
//             <Link to="/login">Login</Link>
//             <Link to="/dashboard">Dashboard</Link>
//           </div>
//           <div>
//             <p className="home-footer__col-title">Contact</p>
//             <a href="mailto:stay@knsustays.com">stay@knsustays.com</a>
//             <a href="tel:+918001234567">+91 800-123-4567</a>
//           </div>
//           <div>
//             <p className="home-footer__col-title">Staff Portal</p>
//             <Link to="/admin/login">Staff Login</Link>
//             <Link to="/admin/register">Staff Registration</Link>
//           </div>
//         </div>

//       </div>
//       <div className="home-footer__bottom">
//         <p>© 2026 KNSU Stays. All rights reserved.</p>
//       </div>
//     </footer>
//   );
// }

// /* ─── Page ──────────────────────────────────────────────── */
// export default function Home() {
//   return (
//     <div className="home-page">
//       <HeroCarousel />
//       <SearchBar />
//       <HotelsSection />
//       <DealsSection />
//       <WhyKNSU />
//       <CTABanner />
//       <HomeFooter />
//     </div>
//   );
// }


// import { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";

// /* ─── DATA ──────────────────────────────────────────────── */
// const heroSlides = [
//   {
//     id: 1,
//     image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&q=85",
//     eyebrow: "SIGNATURE COLLECTION",
//     heading: "Where Every Stay\nTells a Story",
//     sub: "Curated luxury across India's most iconic destinations",
//   },
//   {
//     id: 2,
//     image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1800&q=85",
//     eyebrow: "PREMIUM SUITES",
//     heading: "Breathtaking Views,\nTimeless Comfort",
//     sub: "Spaces designed to inspire, rooms crafted to restore",
//   },
//   {
//     id: 3,
//     image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1800&q=85",
//     eyebrow: "COASTAL RETREATS",
//     heading: "Sun, Sea &\nRefined Luxury",
//     sub: "Beachfront escapes where tranquility meets indulgence",
//   },
// ];

// const hotels = [
//   {
//     id: 1,
//     image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=700&q=80",
//     city: "HYDERABAD",
//     name: "Vivanta Hyderabad Gateway",
//     tag: "Urban Chic",
//     rating: "4.9",
//     rooms: 163,
//     desc: "A stylish urban retreat at the heart of Hyderabad's financial district, where modern design meets warm Nizami hospitality.",
//   },
//   {
//     id: 2,
//     image: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=700&q=80",
//     city: "SHIMLA",
//     name: "Vivanta Shimla Highlands",
//     tag: "Mountain Escape",
//     rating: "4.8",
//     rooms: 78,
//     desc: "Perched amid Himalayan peaks, this colonial-inspired retreat offers crisp mountain air and breathtaking panoramic views.",
//   },
//   {
//     id: 3,
//     image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=700&q=80",
//     city: "GOA",
//     name: "Vivanta Goa Serenity",
//     tag: "Beach Paradise",
//     rating: "4.9",
//     rooms: 96,
//     desc: "A sun-drenched coastal sanctuary featuring private pool villas, world-class spa, and four beachside dining destinations.",
//   },
//   {
//     id: 4,
//     image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=700&q=80",
//     city: "JAIPUR",
//     name: "Vivanta Jaipur Palace",
//     tag: "Royal Heritage",
//     rating: "4.7",
//     rooms: 110,
//     desc: "Step into Rajasthani grandeur — opulent palace-style architecture with every modern luxury woven into its royal tapestry.",
//   },
// ];

// const experiences = [
//   { icon: "🍽️", title: "Culinary Journeys", desc: "From regional heirlooms to global flavours — Michelin-inspired menus at every property." },
//   { icon: "💆", title: "Jiva Spa", desc: "Ancient Indian wellness rituals fused with contemporary therapies for deep restoration." },
//   { icon: "🎉", title: "Celebrations", desc: "Weddings, milestones and corporate events crafted with flawless attention to detail." },
//   { icon: "🏊", title: "Recreation", desc: "Rooftop pools, fitness centres and curated activities for body and mind." },
// ];

// const deals = [
//   {
//     id: 1,
//     image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
//     badge: "LIMITED OFFER",
//     title: "Celebrating 4 Years — Double the Joy",
//     desc: "Rediscover luxury at unbeatable prices during our anniversary celebration. Exclusive rates for a limited window.",
//     validity: "20 Mar 2026 — 30 Apr 2026",
//     discount: "UP TO 30% OFF",
//   },
//   {
//     id: 2,
//     image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
//     badge: "MEMBERS ONLY",
//     title: "Suite Surprises — Member Privilege",
//     desc: "Exclusive upgrades, added space, and thoughtful touches reserved for our most valued members.",
//     validity: "Round the Year",
//     discount: "COMPLIMENTARY UPGRADE",
//   },
//   {
//     id: 3,
//     image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
//     badge: "SUMMER SPECIAL",
//     title: "Perfect Staycations — Summer Escapes",
//     desc: "Exclusive summer packages crafted for city escapes — curated itineraries for the warmer months.",
//     validity: "6 Mar 2026 — 30 Apr 2026",
//     discount: "INCLUDES BREAKFAST",
//   },
// ];

// const awards = [
//   { number: "25+", label: "Properties Across India" },
//   { number: "4.8★", label: "Average Guest Rating" },
//   { number: "15K+", label: "Events Hosted" },
//   { number: "98%", label: "Guest Satisfaction" },
// ];

// const testimonials = [
//   {
//     quote: "The attention to detail at Vivanta is unmatched. Every stay feels like coming home to something better than home.",
//     name: "Priya Mehta", role: "Frequent Traveller", location: "Mumbai",
//   },
//   {
//     quote: "From the moment we arrived, the warmth and elegance were palpable. Truly the gold standard for Indian luxury hospitality.",
//     name: "Arjun Kapoor", role: "Business Traveller", location: "Delhi",
//   },
//   {
//     quote: "Our wedding at Vivanta Jaipur was nothing short of magical. Every detail was executed beyond our imagination.",
//     name: "Sneha & Rahul", role: "Wedding Guests", location: "Jaipur",
//   },
// ];

// /* ─── NAVBAR ─────────────────────────────────────────────── */
// function Navbar() {
//   const [scrolled, setScrolled] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 60);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   return (
//     <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
//       <div className="max-w-[1180px] mx-auto px-8 h-16 flex items-center justify-between">
//         <Link to="/" className={`font-['Tenor_Sans',serif] text-xl tracking-[0.18em] uppercase transition-colors ${scrolled ? "text-[#2C2A26]" : "text-white"}`}>
//           VIVANTA
//           <span className="block text-[0.52rem] tracking-[0.3em] font-normal opacity-60 -mt-1">BY TAJ HOTELS</span>
//         </Link>

//         <div className="hidden md:flex items-center gap-7">
//           {["Hotels", "Experiences", "Dining", "Wellness", "Offers"].map(item => (
//             <a key={item} href={`#${item.toLowerCase()}`}
//               className={`text-[0.75rem] font-semibold tracking-[0.12em] uppercase transition-colors ${scrolled ? "text-[#2C2A26] hover:text-[#b8956a]" : "text-white/85 hover:text-white"}`}
//             >{item}</a>
//           ))}
//         </div>

//         <div className="hidden md:flex items-center gap-4">
//           <Link to="/login" className={`text-[0.75rem] font-semibold tracking-[0.1em] transition-colors ${scrolled ? "text-[#2C2A26] hover:text-[#b8956a]" : "text-white/85 hover:text-white"}`}>Sign In</Link>
//           <Link to="/register" className="px-5 py-2 rounded-full text-[0.75rem] font-bold tracking-[0.1em] text-white transition-all hover:brightness-110"
//             style={{ background: "linear-gradient(135deg,#b8956a,#9f7a4d)" }}>
//             Join Now
//           </Link>
//         </div>

//         <button className={`md:hidden flex flex-col gap-[5px] p-1 ${scrolled ? "text-[#2C2A26]" : "text-white"}`} onClick={() => setMenuOpen(!menuOpen)}>
//           <span className={`block w-6 h-0.5 bg-current transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
//           <span className={`block w-6 h-0.5 bg-current transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
//           <span className={`block w-6 h-0.5 bg-current transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
//         </button>
//       </div>

//       <div className={`md:hidden bg-white border-t border-[#E8E4DF] overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96 py-4" : "max-h-0"}`}>
//         <div className="flex flex-col px-8 gap-4">
//           {["Hotels", "Experiences", "Dining", "Wellness", "Offers"].map(item => (
//             <a key={item} href={`#${item.toLowerCase()}`}
//               className="text-[0.85rem] font-semibold tracking-[0.12em] uppercase text-[#2C2A26] hover:text-[#b8956a]"
//               onClick={() => setMenuOpen(false)}
//             >{item}</a>
//           ))}
//           <div className="flex gap-3 pt-3 border-t border-[#E8E4DF]">
//             <Link to="/login" className="text-[0.85rem] font-semibold text-[#2C2A26]">Sign In</Link>
//             <Link to="/register" className="px-5 py-2 rounded-full text-[0.78rem] font-bold text-white"
//               style={{ background: "linear-gradient(135deg,#b8956a,#9f7a4d)" }}>Join</Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// /* ─── HERO CAROUSEL ─────────────────────────────────────── */
// function HeroCarousel() {
//   const [active, setActive] = useState(0);
//   const timerRef = useRef(null);

//   const startTimer = () => {
//     clearInterval(timerRef.current);
//     timerRef.current = setInterval(() => setActive(p => (p + 1) % heroSlides.length), 5500);
//   };

//   useEffect(() => { startTimer(); return () => clearInterval(timerRef.current); }, []);

//   const goTo = (i) => { setActive(i); startTimer(); };

//   return (
//     <>
//       <section className="relative w-full h-[92vh] min-h-[600px] sm:h-[78vh] overflow-hidden" aria-label="Hero">
//         {heroSlides.map((slide, i) => (
//           <div key={slide.id}
//             className={`absolute inset-0 bg-cover bg-center transition-all duration-[1100ms] ease-in-out ${i === active ? "opacity-100 scale-100" : "opacity-0 scale-[1.05]"}`}
//             style={{ backgroundImage: `url(${slide.image})` }}
//             aria-hidden={i !== active}
//           >
//             <div className="absolute inset-0" style={{ background: "linear-gradient(to right,rgba(10,8,6,0.75) 0%,rgba(10,8,6,0.38) 55%,transparent 100%)" }} />
//             <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(10,8,6,0.65) 0%,transparent 50%)" }} />
//           </div>
//         ))}

//         {/* Content */}
//         <div className="absolute inset-0 flex items-center z-10">
//           <div className="max-w-[1180px] mx-auto px-8 w-full">
//             <div className="max-w-2xl">
//               <p className="text-[0.7rem] font-bold tracking-[0.35em] text-[#d4a96a] uppercase mb-5">
//                 ✦ {heroSlides[active].eyebrow}
//               </p>
//               <h1 className="font-['Tenor_Sans',serif] text-[clamp(3rem,6.5vw,5.8rem)] leading-[0.92] text-white mb-6 tracking-[-0.01em]"
//                 style={{ textShadow: "0 4px 32px rgba(0,0,0,0.3)", whiteSpace: "pre-line" }}>
//                 {heroSlides[active].heading}
//               </h1>
//               <p className="text-white/72 text-[clamp(0.95rem,1.8vw,1.15rem)] mb-10 tracking-[0.02em] leading-relaxed">
//                 {heroSlides[active].sub}
//               </p>
//               <div className="flex gap-4 flex-wrap">
//                 <Link to="/rooms"
//                   className="inline-block px-9 py-[0.95rem] rounded-full text-[0.85rem] font-bold tracking-[0.12em] uppercase text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
//                   style={{ background: "linear-gradient(135deg,#b8956a 0%,#9f7a4d 100%)", boxShadow: "0 12px 32px rgba(159,122,77,0.45)" }}
//                 >Explore Hotels</Link>
//                 <Link to="/register"
//                   className="inline-block px-9 py-[0.95rem] rounded-full text-[0.85rem] font-bold tracking-[0.12em] uppercase text-white border-[1.5px] border-white/50 bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20 hover:-translate-y-0.5"
//                 >Become a Member</Link>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Slide counter */}
//         <div className="absolute bottom-12 right-10 z-10 text-white/55 text-sm tracking-widest sm:hidden">
//           <span className="text-white font-semibold text-lg">{String(active + 1).padStart(2, "0")}</span>
//           {" / "}{String(heroSlides.length).padStart(2, "0")}
//         </div>

//         {/* Arrows */}
//         <button onClick={() => goTo((active - 1 + heroSlides.length) % heroSlides.length)}
//           className="absolute top-1/2 -translate-y-1/2 left-6 z-10 w-11 h-11 rounded-full flex items-center justify-center text-white text-2xl border border-white/30 bg-white/10 backdrop-blur-sm transition-all hover:bg-[rgba(184,149,106,0.6)] hover:scale-110 sm:hidden"
//           aria-label="Previous">‹</button>
//         <button onClick={() => goTo((active + 1) % heroSlides.length)}
//           className="absolute top-1/2 -translate-y-1/2 right-6 z-10 w-11 h-11 rounded-full flex items-center justify-center text-white text-2xl border border-white/30 bg-white/10 backdrop-blur-sm transition-all hover:bg-[rgba(184,149,106,0.6)] hover:scale-110 sm:hidden"
//           aria-label="Next">›</button>

//         {/* Dots */}
//         <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10">
//           {heroSlides.map((_, i) => (
//             <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
//               className={`h-[3px] rounded-full border-none cursor-pointer transition-all duration-300 ${i === active ? "w-8 bg-[#d4a96a]" : "w-4 bg-white/35"}`}
//             />
//           ))}
//         </div>
//       </section>

//       {/* ── BOOKING BAR ── */}
//       <div className="relative z-20 max-w-5xl mx-auto px-6 -mt-8">
//         <div className="bg-white rounded-2xl shadow-[0_8px_48px_rgba(0,0,0,0.14)] overflow-hidden">
//           <div className="grid grid-cols-4 md:grid-cols-2 sm:grid-cols-1 divide-x divide-[#F0EDE8] md:divide-x-0 md:divide-y divide-[#F0EDE8]">
//             {[
//               { label: "DESTINATION", type: "select", options: ["Hyderabad", "Shimla", "Goa", "Jaipur", "Mumbai"] },
//               { label: "CHECK-IN", type: "date" },
//               { label: "CHECK-OUT", type: "date" },
//               { label: "GUESTS", type: "select", options: ["1 Adult", "2 Adults", "2 Adults + 1 Child", "Group (5+)"] },
//             ].map((f, i) => (
//               <div key={i} className="px-5 py-4">
//                 <p className="text-[0.6rem] font-bold tracking-[0.22em] text-[#b8956a] uppercase mb-1">{f.label}</p>
//                 {f.type === "select" ? (
//                   <select className="w-full border-none outline-none text-[0.9rem] text-[#2C2A26] bg-transparent font-medium cursor-pointer">
//                     <option value="">{f.label === "DESTINATION" ? "Where to?" : "Select"}</option>
//                     {f.options?.map(o => <option key={o}>{o}</option>)}
//                   </select>
//                 ) : (
//                   <input type={f.type} className="w-full border-none outline-none text-[0.9rem] text-[#2C2A26] bg-transparent font-medium" />
//                 )}
//               </div>
//             ))}
//           </div>
//           <div className="px-5 py-3 border-t border-[#F0EDE8] flex items-center justify-between gap-4 flex-wrap">
//             <label className="flex items-center gap-2 text-[0.8rem] text-[#7A7570] cursor-pointer select-none">
//               <input type="checkbox" className="accent-[#b8956a]" /> I have a promo code
//             </label>
//             <button className="px-8 py-2.5 rounded-full text-white text-[0.82rem] font-bold tracking-[0.12em] uppercase transition-all hover:-translate-y-0.5 hover:brightness-110"
//               style={{ background: "linear-gradient(135deg,#b8956a 0%,#9f7a4d 100%)" }}>
//               Search Availability
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// /* ─── HOTELS GRID ───────────────────────────────────────── */
// function HotelsSection() {
//   const [activeFilter, setActiveFilter] = useState("All");
//   const filters = ["All", "Urban", "Mountain", "Beach", "Heritage"];

//   return (
//     <section className="py-24 px-8 bg-[#FAFAF8] mt-16" id="hotels">
//       <div className="max-w-[1180px] mx-auto">
//         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
//           <div>
//             <p className="text-[0.68rem] font-bold tracking-[0.3em] uppercase text-[#b8956a] mb-3">✦ Our Collection</p>
//             <h2 className="font-['Tenor_Sans',serif] text-[clamp(2rem,4vw,3rem)] text-[#2C2A26] leading-tight">
//               Discover Vivanta<br /><span className="text-[#b8956a]">Across India</span>
//             </h2>
//           </div>
//           <div className="flex gap-2 flex-wrap">
//             {filters.map(f => (
//               <button key={f} onClick={() => setActiveFilter(f)}
//                 className={`px-4 py-1.5 rounded-full text-[0.72rem] font-bold tracking-[0.1em] uppercase border transition-all ${activeFilter === f ? "bg-[#2C2A26] text-white border-[#2C2A26]" : "border-[#E8E4DF] text-[#7A7570] hover:border-[#2C2A26] hover:text-[#2C2A26]"}`}
//               >{f}</button>
//             ))}
//           </div>
//         </div>

//         <div className="grid grid-cols-2 sm:grid-cols-1 gap-6">
//           {hotels.map((h, i) => (
//             <article key={h.id} className="group relative rounded-3xl overflow-hidden cursor-pointer"
//               style={{ minHeight: i === 0 ? "480px" : "360px" }}>
//               <img src={h.image} alt={h.name} loading="lazy"
//                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
//               />
//               <div className="absolute inset-0 transition-opacity duration-300"
//                 style={{ background: "linear-gradient(to top,rgba(10,8,6,0.85) 0%,rgba(10,8,6,0.3) 50%,transparent 100%)" }}
//               />
//               <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[0.62rem] font-bold tracking-[0.15em] uppercase"
//                 style={{ background: "rgba(184,149,106,0.92)", color: "#fff" }}>
//                 {h.tag}
//               </div>
//               <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[0.72rem] font-bold bg-white/90 text-[#2C2A26]">
//                 ★ {h.rating}
//               </div>
//               <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
//                 <p className="text-[0.62rem] font-bold tracking-[0.3em] uppercase text-[#d4a96a] mb-1">{h.city}</p>
//                 <h3 className="font-['Tenor_Sans',serif] text-xl mb-2 leading-tight">{h.name}</h3>
//                 <p className="text-white/68 text-[0.82rem] leading-relaxed mb-4 opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-24 transition-all duration-500">
//                   {h.desc}
//                 </p>
//                 <div className="flex items-center justify-between">
//                   <span className="text-white/55 text-[0.75rem]">{h.rooms} rooms</span>
//                   <Link to="/rooms"
//                     className="px-5 py-2 rounded-full text-[0.72rem] font-bold tracking-[0.1em] uppercase text-white border border-white/45 transition-all group-hover:bg-[#b8956a] group-hover:border-[#b8956a]"
//                   >Explore →</Link>
//                 </div>
//               </div>
//             </article>
//           ))}
//         </div>

//         <div className="text-center mt-10">
//           <Link to="/rooms"
//             className="inline-block px-10 py-3.5 rounded-full border-[1.5px] border-[#2C2A26] text-[#2C2A26] text-[0.8rem] font-bold tracking-[0.15em] uppercase transition-all hover:bg-[#2C2A26] hover:text-white"
//           >View All Properties</Link>
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ─── AWARDS STRIP ──────────────────────────────────────── */
// function AwardsStrip() {
//   return (
//     <section className="py-14 px-8" style={{ background: "linear-gradient(135deg,#1c1814 0%,#2c2420 100%)" }}>
//       <div className="max-w-[1180px] mx-auto grid grid-cols-4 sm:grid-cols-2 gap-8">
//         {awards.map(a => (
//           <div key={a.label} className="text-center">
//             <p className="font-['Tenor_Sans',serif] text-[clamp(2rem,4vw,3rem)] text-[#d4a96a] leading-none mb-2">{a.number}</p>
//             <p className="text-white/50 text-[0.72rem] tracking-[0.14em] uppercase">{a.label}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

// /* ─── EXPERIENCES ───────────────────────────────────────── */
// function ExperiencesSection() {
//   return (
//     <section className="py-24 px-8 bg-white" id="experiences">
//       <div className="max-w-[1180px] mx-auto">
//         <div className="text-center mb-16">
//           <p className="text-[0.68rem] font-bold tracking-[0.3em] uppercase text-[#b8956a] mb-3">✦ Curated for You</p>
//           <h2 className="font-['Tenor_Sans',serif] text-[clamp(2rem,4vw,2.8rem)] text-[#2C2A26]">Signature Experiences</h2>
//           <p className="max-w-md mx-auto text-[#7A7570] mt-4 leading-relaxed text-[0.95rem]">
//             Every stay is a canvas. We paint it with flavours, rituals, and moments that you carry home.
//           </p>
//         </div>
//         <div className="grid grid-cols-4 lg:grid-cols-2 sm:grid-cols-1 gap-6">
//           {experiences.map((e, i) => (
//             <div key={e.title}
//               className={`p-8 rounded-3xl border border-[#E8E4DF] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(184,149,106,0.15)] cursor-pointer group ${i % 2 === 0 ? "bg-[#FAFAF8]" : "bg-white"}`}
//             >
//               <span className="text-4xl block mb-5">{e.icon}</span>
//               <h3 className="font-['Tenor_Sans',serif] text-[1.1rem] text-[#2C2A26] mb-3 group-hover:text-[#b8956a] transition-colors">{e.title}</h3>
//               <p className="text-[#7A7570] text-[0.88rem] leading-relaxed">{e.desc}</p>
//               <p className="mt-5 text-[#b8956a] text-[0.75rem] font-bold tracking-[0.12em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
//                 Discover More →
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ─── DEALS ─────────────────────────────────────────────── */
// function DealsSection() {
//   return (
//     <section className="py-24 px-8 overflow-hidden" id="offers"
//       style={{ background: "linear-gradient(135deg,#2d1557 0%,#4a2080 40%,#5b2c99 100%)" }}>
//       <div className="max-w-[1180px] mx-auto">
//         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
//           <div>
//             <p className="text-[0.68rem] font-bold tracking-[0.3em] uppercase text-[#d4a96a] mb-3">✦ Exclusive Privileges</p>
//             <h2 className="font-['Tenor_Sans',serif] text-[clamp(2rem,4vw,2.8rem)] text-white leading-tight">
//               Member-Only<br />Deals & Offers
//             </h2>
//           </div>
//           <Link to="/register"
//             className="inline-block px-7 py-3 rounded-full text-[0.78rem] font-bold tracking-[0.12em] uppercase text-white border border-white/40 bg-white/10 transition-all hover:bg-white/20 whitespace-nowrap"
//           >Join for Free →</Link>
//         </div>

//         <div className="grid grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-6">
//           {deals.map((deal, i) => (
//             <article key={deal.id}
//               className={`rounded-2xl overflow-hidden bg-white/[0.07] border border-white/[0.12] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] ${i === 2 ? "lg:hidden sm:block" : ""}`}
//             >
//               <div className="relative h-52 overflow-hidden">
//                 <img src={deal.image} alt={deal.title} loading="lazy"
//                   className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.06]"
//                 />
//                 <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[0.6rem] font-bold tracking-[0.15em] uppercase"
//                   style={{ background: "rgba(184,149,106,0.92)", color: "#fff" }}>
//                   {deal.badge}
//                 </div>
//                 <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-white text-[0.68rem] font-bold text-[#b8956a]">
//                   {deal.discount}
//                 </div>
//               </div>
//               <div className="p-5 flex flex-col gap-2.5">
//                 <h3 className="font-['Tenor_Sans',serif] text-[1.05rem] text-white leading-snug">{deal.title}</h3>
//                 <p className="text-white/62 text-[0.82rem] leading-relaxed">{deal.desc}</p>
//                 <div className="mt-1">
//                   <p className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[#d4a96a] mb-0.5">VALIDITY</p>
//                   <p className="text-white/80 text-[0.82rem] font-semibold">{deal.validity}</p>
//                 </div>
//                 <div className="flex gap-3 mt-2 items-center">
//                   <button className="text-white/72 text-[0.72rem] font-bold tracking-[0.1em] underline underline-offset-2 hover:text-white transition-colors">
//                     KNOW MORE
//                   </button>
//                   <Link to="/login"
//                     className="px-4 py-1.5 rounded-full text-[0.7rem] font-bold text-white border border-white/40 transition-colors hover:bg-white/15"
//                   >LOGIN / JOIN</Link>
//                 </div>
//               </div>
//             </article>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ─── EDITORIAL SPLIT ───────────────────────────────────── */
// function EditorialStrip() {
//   return (
//     <section className="grid grid-cols-2 sm:grid-cols-1" style={{ minHeight: "500px" }}>
//       <div className="relative overflow-hidden" style={{ minHeight: "400px" }}>
//         <img src="https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=900&q=80"
//           alt="Jiva Spa" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-[1.04]"
//         />
//         <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(184,149,106,0.3) 0%,transparent 60%)" }} />
//         <div className="absolute bottom-8 left-8">
//           <span className="px-3 py-1 rounded-full text-[0.62rem] font-bold tracking-widest uppercase text-white bg-[rgba(184,149,106,0.82)]">
//             JIVA SPA
//           </span>
//         </div>
//       </div>
//       <div className="bg-[#1c1814] flex items-center px-12 py-16 sm:px-8">
//         <div>
//           <p className="text-[0.68rem] font-bold tracking-[0.3em] uppercase text-[#d4a96a] mb-4">✦ Wellness & Wellbeing</p>
//           <h2 className="font-['Tenor_Sans',serif] text-[clamp(1.8rem,3vw,2.8rem)] text-white leading-tight mb-5">
//             The Ancient Art of<br />Indian Wellness
//           </h2>
//           <p className="text-white/58 leading-relaxed text-[0.95rem] mb-8 max-w-sm">
//             Jiva Spa at Vivanta draws from centuries-old Ayurvedic traditions — blending ancient wisdom with modern techniques for complete mind-body restoration.
//           </p>
//           <Link to="/rooms"
//             className="inline-block px-8 py-3 rounded-full text-[0.82rem] font-bold tracking-[0.12em] uppercase text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
//             style={{ background: "linear-gradient(135deg,#b8956a,#9f7a4d)" }}
//           >Explore Wellness</Link>
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ─── TESTIMONIALS ──────────────────────────────────────── */
// function Testimonials() {
//   const [active, setActive] = useState(0);

//   useEffect(() => {
//     const t = setInterval(() => setActive(p => (p + 1) % testimonials.length), 5000);
//     return () => clearInterval(t);
//   }, []);

//   return (
//     <section className="py-24 px-8 bg-[#FAFAF8]">
//       <div className="max-w-[760px] mx-auto text-center">
//         <p className="text-[0.68rem] font-bold tracking-[0.3em] uppercase text-[#b8956a] mb-10">✦ Guest Stories</p>
//         <div className="relative min-h-[200px] flex items-center justify-center">
//           {testimonials.map((t, i) => (
//             <div key={i}
//               className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${i === active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
//             >
//               <p className="font-['Tenor_Sans',serif] text-[clamp(1.1rem,2.5vw,1.45rem)] text-[#2C2A26] leading-relaxed mb-6 italic">
//                 "{t.quote}"
//               </p>
//               <p className="font-semibold text-[#2C2A26] text-[0.9rem]">{t.name}</p>
//               <p className="text-[#b8956a] text-[0.75rem] tracking-wide">{t.role} · {t.location}</p>
//             </div>
//           ))}
//         </div>
//         <div className="flex gap-2 justify-center mt-10">
//           {testimonials.map((_, i) => (
//             <button key={i} onClick={() => setActive(i)}
//               className={`h-[3px] rounded-full border-none cursor-pointer transition-all duration-300 ${i === active ? "w-8 bg-[#b8956a]" : "w-4 bg-[#E8E4DF]"}`}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ─── CTA BANNER ────────────────────────────────────────── */
// function CTABanner() {
//   return (
//     <section className="relative py-28 px-8 overflow-hidden text-center">
//       <img src="https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=1800&q=80"
//         alt="Resort pool" className="absolute inset-0 w-full h-full object-cover"
//       />
//       <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(28,24,20,0.88) 0%,rgba(28,24,20,0.65) 60%,rgba(28,24,20,0.5) 100%)" }} />
//       <div className="relative z-10 max-w-[640px] mx-auto">
//         <p className="text-[0.68rem] font-bold tracking-[0.35em] uppercase text-[#d4a96a] mb-4">✦ Start Your Journey</p>
//         <h2 className="font-['Tenor_Sans',serif] text-[clamp(2rem,4.5vw,3.5rem)] text-white leading-[1.05] mb-5">
//           Experience the Art of<br />Luxury Travel
//         </h2>
//         <p className="text-white/62 leading-relaxed text-[1rem] mb-10 max-w-md mx-auto">
//           Register today to unlock member-only rates, personalised recommendations, and priority booking across all Vivanta properties.
//         </p>
//         <div className="flex gap-4 justify-center flex-wrap">
//           <Link to="/register"
//             className="px-10 py-4 rounded-full text-[0.88rem] font-bold tracking-[0.1em] uppercase text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
//             style={{ background: "linear-gradient(135deg,#b8956a,#9f7a4d)", boxShadow: "0 12px 36px rgba(159,122,77,0.45)" }}
//           >Create Account — It's Free</Link>
//           <Link to="/login"
//             className="px-10 py-4 rounded-full text-[0.88rem] font-bold tracking-[0.1em] uppercase text-white border-[1.5px] border-white/45 bg-white/10 transition-all hover:bg-white/20 hover:-translate-y-0.5"
//           >Sign In</Link>
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ─── FOOTER ────────────────────────────────────────────── */
// function Footer() {
//   const cols = [
//     { title: "Explore", links: [["Hotels", "#hotels"], ["Experiences", "#experiences"], ["Dining", "#"], ["Wellness", "#"], ["Offers", "#offers"]] },
//     { title: "Account", links: [["Register", "/register"], ["Login", "/login"], ["Dashboard", "/dashboard"], ["My Bookings", "/dashboard"], ["Membership", "/register"]] },
//     { title: "Contact", links: [["stay@vivanta.com", "mailto:stay@vivanta.com"], ["+91 800-123-4567", "tel:+918001234567"], ["Careers", "#"], ["Press", "#"]] },
//     { title: "Staff", links: [["Staff Login", "/admin/login"], ["Staff Register", "/admin/register"], ["Back Office", "#"], ["Support", "#"]] },
//   ];

//   return (
//     <footer className="bg-[#0e0c0a] px-8 pt-16 pb-6">
//       <div className="max-w-[1180px] mx-auto">
//         <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] lg:grid-cols-[1fr_1fr_1fr] md:grid-cols-2 sm:grid-cols-1 gap-10 pb-12 border-b border-white/[0.07]">
//           <div>
//             <p className="font-['Tenor_Sans',serif] text-2xl text-white tracking-[0.12em] mb-1">VIVANTA</p>
//             <p className="text-[0.65rem] tracking-[0.28em] text-white/38 uppercase mb-5">By Taj Hotels</p>
//             <p className="text-[0.88rem] leading-relaxed text-white/45 max-w-xs mb-6">
//               A world of curated luxury experiences across India's most iconic destinations.
//             </p>
//             <div className="flex gap-3">
//               {["𝕏", "f", "in", "▶"].map(s => (
//                 <button key={s} className="w-8 h-8 rounded-full border border-white/18 flex items-center justify-center text-[0.72rem] text-white/45 hover:border-[#b8956a] hover:text-[#b8956a] transition-all">
//                   {s}
//                 </button>
//               ))}
//             </div>
//           </div>
//           {cols.map(col => (
//             <div key={col.title} className="flex flex-col gap-3">
//               <p className="text-[0.65rem] font-bold tracking-[0.25em] uppercase text-[#d4a96a] mb-1">{col.title}</p>
//               {col.links.map(([label, href]) => (
//                 href.startsWith("/") ? (
//                   <Link key={label} to={href} className="text-[0.88rem] text-white/45 hover:text-white transition-colors">{label}</Link>
//                 ) : (
//                   <a key={label} href={href} className="text-[0.88rem] text-white/45 hover:text-white transition-colors">{label}</a>
//                 )
//               ))}
//             </div>
//           ))}
//         </div>
//         <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[0.76rem] text-white/28">
//           <p>© 2026 Vivanta Hotels. All rights reserved.</p>
//           <div className="flex gap-6">
//             {["Privacy Policy", "Terms of Use", "Cookie Policy"].map(l => (
//               <a key={l} href="#" className="hover:text-white/55 transition-colors">{l}</a>
//             ))}
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

// /* ─── PAGE ──────────────────────────────────────────────── */
// export default function Home() {
//   return (
//     <div className="w-full overflow-x-hidden">
//       <style>{`@import url('https://fonts.googleapis.com/css2?family=Tenor+Sans&display=swap');`}</style>
//       <Navbar />
//       <HeroCarousel />
//       <HotelsSection />
//       <AwardsStrip />
//       <ExperiencesSection />
//       <DealsSection />
//       <EditorialStrip />
//       <Testimonials />
//       <CTABanner />
//       <Footer />
//     </div>
//   );
// }


import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

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
              <Link to="/rooms" className="px-6 py-3 bg-[#5B3FA6] hover:bg-[#4a3288] transition rounded-full">
                Explore Hotels
              </Link>
              <Link to="/register" className="px-6 py-3 border rounded-full">
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
  return (
    <section className="bg-[#FAFAF8] pt-28 md:pt-32 pb-20 md:pb-24 px-4">
      <div className="max-w-7xl mx-auto space-y-14">
        
        {/* Title */}
        <h2 className="text-3xl md:text-5xl text-center font-serif tracking-wide">
          DOWN THE KNSU LANE
        </h2>

        {/* Hotels List */}
        <div className="space-y-10 md:space-y-14">
          {hotels.map((h, index) => (
            
            <div
              key={index}
              className="flex flex-col lg:flex-row bg-white rounded-2xl shadow hover:shadow-xl transition duration-300 overflow-hidden"
            >
              
              {/* Image Section */}
              <div className="w-full lg:w-1/2 aspect-[4/3] overflow-hidden">
                <img
                  src={h.image}
                  alt={h.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>

              {/* Content Section */}
              <div className="p-6 md:p-10 flex flex-col justify-between">
                
                <div>
                  <h3 className="text-xl md:text-2xl font-serif">
                    {h.name}
                  </h3>

                  <p className="text-gray-500 mt-3 leading-relaxed">
                    {h.desc}
                  </p>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex gap-3 flex-wrap">
                  <Link
                    to={`/hotel/${h.id}`}
                    className="px-5 py-2 border border-gray-300 hover:border-black transition rounded-full text-sm md:text-base"
                  >
                    VIEW HOTEL
                  </Link>

                  <Link
                    to={`/booking/${h.id}`}
                    className="px-5 py-2 bg-[#5B3FA6] hover:bg-[#4a3288] transition text-white rounded-full text-sm md:text-base"
                  >
                    BOOK NOW
                  </Link>
                </div>

              </div>
            </div>

          ))}
        </div>
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
                <h3>{d.title}</h3>
                <p>{d.desc}</p>
                <p className="text-[#a88fd4] mt-2">{d.validity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── WHY ───────────────────────────────────── */
function WhyKNSU() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto text-center space-y-10">
        <h2 className="text-3xl md:text-5xl font-serif">Why Choose Us</h2>
        <p className="text-gray-500">Best luxury stays experience</p>
      </div>
    </section>
  );
}

/* ─── CTA BANNER ────────────────────────────────────────── */
function CTABanner() {
  return (
    <section className="relative overflow-hidden py-24 px-6 sm:py-32 sm:px-10 lg:py-40 text-center">

      {/* ── Background Image ── */}
      <img
        src="https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=1800&q=80"
        alt="Resort pool"
        className="absolute inset-0 h-full w-full object-cover object-center scale-105"
      />

      {/* ── Gradient Overlay ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-950/90 via-stone-900/70 to-stone-900/55" />

      {/* ── Decorative top border line ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

      {/* ── Decorative corner accents ── */}
      <div className="pointer-events-none absolute top-8 left-8 h-12 w-12 border-t border-l border-amber-400/25 hidden sm:block" />
      <div className="pointer-events-none absolute top-8 right-8 h-12 w-12 border-t border-r border-amber-400/25 hidden sm:block" />
      <div className="pointer-events-none absolute bottom-8 left-8 h-12 w-12 border-b border-l border-amber-400/25 hidden sm:block" />
      <div className="pointer-events-none absolute bottom-8 right-8 h-12 w-12 border-b border-r border-amber-400/25 hidden sm:block" />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-2xl">

        {/* Eyebrow */}
        <p className="mb-5 inline-flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.35em] uppercase text-amber-400">
          <span className="h-px w-6 bg-amber-400/60 hidden sm:block" />
          Start Your Journey
          <span className="h-px w-6 bg-amber-400/60 hidden sm:block" />
        </p>

        {/* Heading */}
        <h2
          className="
            font-['Tenor_Sans',serif]
            text-[clamp(2rem,5vw,3.6rem)]
            font-normal leading-[1.08] tracking-tight
            text-white
            mb-6
          "
        >
          Experience the Art of
          <br />
          <span className="text-amber-200/90">Luxury Travel</span>
        </h2>

        {/* Divider */}
        <div className="mx-auto mb-7 h-px w-16 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

        {/* Body text */}
        <p className="mx-auto mb-10 max-w-md text-base leading-relaxed text-white/60 sm:text-[1.05rem]">
          Register today to unlock member-only rates, personalised recommendations,
          and priority booking across all Vivanta properties.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-5">

          {/* Primary */}
          <Link
            to="/register"
            className="
              group relative w-full sm:w-auto
              overflow-hidden rounded-full
              bg-[#5B3FA6]
              px-10 py-4
              text-[0.85rem] font-bold tracking-[0.12em] uppercase text-white
              shadow-[0_12px_40px_rgba(91,63,166,0.40)]
              transition-all duration-300
              hover:-translate-y-1 hover:bg-[#4a3288] hover:shadow-[0_18px_48px_rgba(91,63,166,0.55)]
              active:translate-y-0
            "
          >
            {/* shimmer sweep */}
            <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/10 transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Create Account — It's Free</span>
          </Link>

          {/* Secondary */}
          <Link
            to="/login"
            className="
              w-full sm:w-auto
              rounded-full border border-white/30 bg-white/10
              px-10 py-4
              text-[0.85rem] font-bold tracking-[0.12em] uppercase text-white
              backdrop-blur-sm
              transition-all duration-300
              hover:-translate-y-1 hover:border-white/50 hover:bg-white/20
              active:translate-y-0
            "
          >
            Sign In
          </Link>
        </div>

        {/* Trust note */}
        <p className="mt-8 text-[0.72rem] tracking-widest uppercase text-white/30">
          No credit card required &nbsp;·&nbsp; Free forever
        </p>
      </div>
    </section>
  );
}


/* ─── FOOTER ────────────────────────────────────────────── */

function Footer() {
  const cols = [
    { title: "Explore",  links: [["Hotels", "#hotels"], ["Experiences", "#experiences"], ["Dining", "#"], ["Wellness", "#"], ["Offers", "#offers"]] },
    { title: "Account",  links: [["Register", "/register"], ["Login", "/login"], ["Dashboard", "/dashboard"], ["My Bookings", "/dashboard"], ["Membership", "/register"]] },
    { title: "Contact",  links: [["stay@vivanta.com", "mailto:stay@vivanta.com"], ["+91 800-123-4567", "tel:+918001234567"], ["Careers", "#"], ["Press", "#"]] },
    { title: "Staff",    links: [["Staff Login", "/admin/login"], ["Staff Register", "/admin/register"], ["Back Office", "#"], ["Support", "#"]] },
  ];

  const socials = [
    { label: "𝕏",  title: "Twitter"   },
    { label: "f",  title: "Facebook"  },
    { label: "in", title: "LinkedIn"  },
    { label: "▶",  title: "YouTube"   },
  ];

  return (
    <footer className="bg-[#160842] text-white">

      {/* ── Top accent line ── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 py-16
                        sm:grid-cols-2
                        md:grid-cols-3
                        lg:grid-cols-[1.8fr_1fr_1fr_1fr_1fr]
                        border-b border-purple-300/[0.12]">

          {/* Brand column — full width on mobile */}
          <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-1">

            {/* Logo */}
            <div className="mb-6">
              <p className="font-['Tenor_Sans',serif] text-2xl tracking-[0.14em] text-white">
                KNSU STAYS
              </p>
              <p className="mt-0.5 text-[0.62rem] tracking-[0.3em] uppercase text-white/35">
                By Taj Hotels
              </p>
            </div>

            {/* Divider */}
            <div className="mb-5 h-px w-10 bg-purple-400/40" />

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
                    hover:border-purple-400/70 hover:text-purple-300
                    hover:bg-purple-500/15 hover:scale-110
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
              <p className="mb-1 text-[0.62rem] font-bold tracking-[0.28em] uppercase text-purple-300/80">
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
                      after:h-px after:w-0 after:bg-purple-400/60
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
                      after:h-px after:w-0 after:bg-purple-400/60
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
      <WhyKNSU />
      <CTABanner />
      <Footer />
    </div>
  );
}