import { useDispatch, useSelector } from 'react-redux'
import {
  closeMobileMenu,
  toggleAuth,
  toggleMobileMenu,
} from '../redux/slices/navbarSlice'

const navItems = [
  { label: 'Destinations' },
  { label: 'Hotels' },
  { label: 'Dining' },
  { label: 'Offers' },
  { label: 'Memberships', hasDropdown: true },
  { label: 'More', hasDropdown: true },
]

const brandColor = '#4C2C92'

function SearchIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function ChevronDown({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 7.5L10 12.5L15 7.5" />
    </svg>
  )
}

function HamburgerIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

export default function Navbar() {
  const dispatch = useDispatch()
  const { mobileMenuOpen, isLoggedIn } = useSelector((state) => state.navbar)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-[#F9F7F7]">
      <div className="mx-auto flex h-20 w-full max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:h-24 lg:px-10">
        <button
          type="button"
          onClick={() => dispatch(closeMobileMenu())}
          className="text-[2rem] font-medium tracking-[0.24em] text-[#4C2C92] md:text-[2.2rem]"
          style={{ fontFamily: '"Montserrat", sans-serif' }}
          aria-label="Vivanta Home"
        >
          VIVANTA
        </button>

        <nav className="hidden items-center gap-10 xl:flex">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className="group inline-flex items-center gap-1 text-[1.78rem] font-normal uppercase tracking-[0.01em] text-[#18152D] transition-colors duration-200 hover:text-[#4C2C92]"
              style={{ fontFamily: '"Montserrat", sans-serif' }}
            >
              <span>{item.label}</span>
              {item.hasDropdown ? (
                <ChevronDown className="mt-[1px] h-4 w-4 opacity-80 transition group-hover:opacity-100" />
              ) : null}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-6 xl:flex">
          <button
            type="button"
            onClick={() => dispatch(toggleAuth())}
            className="text-[1.78rem] uppercase tracking-[0.01em] text-[#1B1732] transition-colors hover:text-[#4C2C92]"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
          >
            {isLoggedIn ? 'My Account' : 'Login / Join'}
          </button>

          <button
            type="button"
            className="grid h-14 w-14 place-items-center rounded-full border-2 border-[#4C2C92] text-[#4C2C92] transition hover:bg-[#F0EBFA]"
            aria-label="Search hotels"
          >
            <SearchIcon className="h-6 w-6" />
          </button>

          <button
            type="button"
            className="rounded-full px-8 py-3 text-[1.28rem] font-semibold uppercase tracking-wide text-white transition hover:brightness-95"
            style={{ backgroundColor: brandColor, fontFamily: '"Montserrat", sans-serif' }}
          >
            Book Now
          </button>
        </div>

        <div className="flex items-center gap-3 xl:hidden">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-[#4C2C92] text-[#4C2C92]"
            aria-label="Search hotels"
          >
            <SearchIcon className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => dispatch(toggleMobileMenu())}
            className="grid h-10 w-10 place-items-center rounded-md border border-[#D9D3E7] text-[#4C2C92]"
            aria-label="Toggle menu"
          >
            <HamburgerIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="border-t border-neutral-200 bg-white px-4 py-5 shadow-sm xl:hidden">
          <div className="mx-auto flex max-w-4xl flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className="flex items-center justify-between border-b border-neutral-100 py-2 text-left text-base uppercase tracking-wide text-[#1B1732]"
                style={{ fontFamily: '"Montserrat", sans-serif' }}
              >
                <span>{item.label}</span>
                {item.hasDropdown ? <ChevronDown className="h-4 w-4" /> : null}
              </button>
            ))}

            <button
              type="button"
              onClick={() => dispatch(toggleAuth())}
              className="pt-2 text-left text-base uppercase tracking-wide text-[#1B1732]"
              style={{ fontFamily: '"Montserrat", sans-serif' }}
            >
              {isLoggedIn ? 'My Account' : 'Login / Join'}
            </button>

            <button
              type="button"
              className="mt-1 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white"
              style={{ backgroundColor: brandColor, fontFamily: '"Montserrat", sans-serif' }}
            >
              Book Now
            </button>
          </div>
        </div>
      ) : null}
    </header>
  )
}
