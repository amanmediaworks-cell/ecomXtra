import { useState, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { marketplaceServiceDefaults } from '../data/marketplaceServiceContent'
import { defaultNavigationLinks, normalizeNavigationLinks } from '../data/navigationLinks'

const marketplaceLogoDomains = {
  'amazon-account-management': 'amazon.in',
  'flipkart-account-management': 'flipkart.com',
  'meesho-account-management': 'meesho.com',
  'blinkit-account-management': 'blinkit.com',
  'jiomart-account-management': 'jiomart.com',
  'swiggy-instamart-account-management': 'swiggy.com',
  'zepto-account-management': 'zeptonow.com',
}

function MarketplaceLogo({ service }) {
  const [imageFailed, setImageFailed] = useState(false)
  const platformName = service.title.replace(' Account Management Services', '')
  const domain = marketplaceLogoDomains[service.slug]

  if (imageFailed || !domain) {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#eadbc9] bg-white text-xs font-black text-[#bd6530]">
        {platformName.charAt(0)}
      </span>
    )
  }

  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#eadbc9] bg-white p-1">
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
        alt={`${platformName} logo`}
        className="h-full w-full object-contain"
        loading="lazy"
        onError={() => setImageFailed(true)}
      />
    </span>
  )
}

// Logo with brand mark
function Logo() {
  return (
    <Link to="/" className="font-outfit font-extrabold tracking-tight hover:opacity-90 transition-opacity text-slate-900 flex items-center gap-2 select-none group">
      <img src="/logo.png" alt="EcomXtra Logo" className="w-8 h-8 rounded-full object-contain shrink-0 drop-shadow-sm transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105" />
      <div className="flex items-center gap-0.5">
        <span className="text-xl font-bold tracking-tight text-slate-900">ecom</span>
        <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 leading-none px-0.5">X</span>
        <span className="text-xl font-bold tracking-tight text-slate-900">tra</span>
      </div>
    </Link>
  )
}

function Navbar({ content, servicesMenuOpen, onServicesMenuOpenChange }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const servicesMenuRef = useRef(null)
  const servicesMenuCloseTimeoutRef = useRef(null)

  const openServicesMenu = () => {
    window.clearTimeout(servicesMenuCloseTimeoutRef.current)
    onServicesMenuOpenChange(true)
  }

  const scheduleServicesMenuClose = () => {
    window.clearTimeout(servicesMenuCloseTimeoutRef.current)
    servicesMenuCloseTimeoutRef.current = window.setTimeout(() => {
      onServicesMenuOpenChange(false)
    }, 250)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => () => {
    window.clearTimeout(servicesMenuCloseTimeoutRef.current)
  }, [])

  useEffect(() => {
    if (!servicesMenuOpen) return undefined

    const closeOnOutsideClick = event => {
      if (!servicesMenuRef.current?.contains(event.target)) onServicesMenuOpenChange(false)
    }
    const closeOnEscape = event => {
      if (event.key === 'Escape') onServicesMenuOpenChange(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [servicesMenuOpen, onServicesMenuOpenChange])

  const navLinks = normalizeNavigationLinks(content?.navigationLinks || defaultNavigationLinks)
  const marketplaceManagement = marketplaceServiceDefaults
  const marketplaceOnboarding = marketplaceServiceDefaults

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-3 px-3 sm:px-6 pointer-events-none transition-all duration-300">
      <div ref={servicesMenuRef} className="max-w-7xl mx-auto pointer-events-auto">
        <div className={`w-full rounded-full bg-white transition-all duration-300 border ${
          isScrolled
            ? 'border-slate-300/90 shadow-xl'
            : 'border-slate-200/90 shadow-md'
        }`}>
          <div className="px-5 sm:px-7 py-3 flex items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Desktop links */}
            <nav className="relative hidden md:flex items-center space-x-7 text-sm font-semibold">
              {navLinks.map(link => link.path === '/services' ? (
                <div
                  key={link.label}
                  onMouseEnter={openServicesMenu}
                  onMouseLeave={scheduleServicesMenuClose}
                  className="relative flex items-center gap-1"
                >
                  <NavLink
                    to={link.path}
                    onClick={() => onServicesMenuOpenChange(false)}
                    className={({ isActive }) =>
                      `inline-flex items-center gap-1 transition-colors ${isActive ? 'text-violet-600 font-extrabold' : 'text-slate-700 hover:text-violet-600'}`
                    }
                  >
                    {link.label}
                  </NavLink>
                  <button
                    type="button"
                    aria-label="Open marketplace services menu"
                    aria-expanded={servicesMenuOpen}
                    aria-controls="marketplace-services-menu"
                    onClick={openServicesMenu}
                    className="rounded p-1 text-slate-700 transition hover:bg-violet-50 hover:text-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"
                  >
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${servicesMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              ) : (
                <NavLink
                  key={link.label}
                  to={link.path}
                  className={({ isActive }) =>
                    `transition-colors ${isActive ? 'text-violet-600 font-extrabold' : 'text-slate-700 hover:text-violet-600'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-2">
              <Link
                to="/contact"
                className="hidden sm:inline-block bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 hover:opacity-95 text-white text-xs font-extrabold px-6 py-2.5 rounded-full transition-all duration-300 shadow-md shadow-violet-500/20 transform hover:scale-105"
              >
                Consultation
              </Link>

              {/* Mobile hamburger */}
              <button
                className="md:hidden flex flex-col gap-1 p-1.5 focus:outline-none"
                onClick={() => setMobileOpen(v => !v)}
                aria-label="Toggle menu"
              >
                <span className={`w-5 h-0.5 bg-slate-800 rounded-full transition-all ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`w-5 h-0.5 bg-slate-800 rounded-full transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
                <span className={`w-5 h-0.5 bg-slate-800 rounded-full transition-all ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {servicesMenuOpen && (
          <section
            id="marketplace-services-menu"
            aria-label="Marketplace services"
            onMouseEnter={openServicesMenu}
            onMouseLeave={scheduleServicesMenuClose}
            className="fixed left-1/2 top-20 z-50 max-h-[calc(100dvh-6rem)] w-[min(calc(100vw-24px),1320px)] -translate-x-1/2 overflow-y-auto rounded-2xl border border-[#eadbc9] bg-white p-4 shadow-[0_24px_70px_rgba(25,39,51,0.18)] sm:p-5 lg:p-7"
          >
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-[#eadbc9] pb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#bd6530]">One operations partner. Seven platforms.</p>
                <h2 className="mt-1 font-clash text-xl font-bold text-[#243141] sm:text-2xl">Marketplace growth, managed.</h2>
              </div>
              <Link onClick={() => onServicesMenuOpenChange(false)} to="/services" className="inline-flex items-center gap-1 text-xs font-bold text-[#a54f21] hover:underline">
                Explore all services <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              <div className="border-[#eadbc9] sm:border-r sm:pr-4">
                <h3 className="mb-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#bd6530]">Marketplace management</h3>
                <p className="mb-3 text-xs leading-5 text-slate-500">Ongoing account support, listings, catalogue and seller operations.</p>
                <div className="grid gap-1.5">
                  {marketplaceManagement.map(service => (
                    <Link key={service.slug} onClick={() => onServicesMenuOpenChange(false)} to={`/services/${service.slug}`} className="group flex min-h-11 items-center gap-2 rounded-lg border border-transparent bg-[#fffdfa] px-2 py-1.5 text-xs font-semibold leading-4 text-[#243141] transition hover:border-[#f0d5bb] hover:bg-[#fff6e8] hover:text-[#a54f21] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#bd6530]">
                      <MarketplaceLogo service={service} />
                      <span>{service.title.replace(' Account Management Services', '')}<span className="block text-[10px] font-medium text-slate-500">Account management</span></span>
                      <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="border-[#eadbc9] sm:border-r sm:pr-4">
                <h3 className="mb-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#bd6530]">Marketplace onboarding</h3>
                <p className="mb-3 text-xs leading-5 text-slate-500">Get set up and ready to sell across every supported marketplace.</p>
                <div className="grid gap-1.5">
                  {marketplaceOnboarding.map(service => (
                    <Link key={service.slug} onClick={() => onServicesMenuOpenChange(false)} to={`/services/${service.slug}`} className="group flex min-h-11 items-center gap-2 rounded-lg border border-transparent bg-[#fffdfa] px-2 py-1.5 text-xs font-semibold leading-4 text-[#243141] transition hover:border-[#f0d5bb] hover:bg-[#fff6e8] hover:text-[#a54f21] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#bd6530]">
                      <MarketplaceLogo service={service} />
                      <span>{service.title.replace(' Account Management Services', '')}<span className="block text-[10px] font-medium text-slate-500">Seller onboarding</span></span>
                      <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="border-[#eadbc9] sm:border-r sm:pr-4">
                <h3 className="mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#bd6530]">Seller operations</h3>
                <div className="space-y-3 text-sm leading-6 text-slate-600">
                  <p>Product listings and catalogue updates</p>
                  <p>Seller claims and support requests</p>
                  <p>Returns, refunds, and account health</p>
                  <Link onClick={() => onServicesMenuOpenChange(false)} to="/blog" className="inline-flex items-center gap-1 pt-1 font-bold text-[#243141] hover:text-[#a54f21]">
                    Practical seller guides <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-xl bg-[#243141] p-5 text-white">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#ffc46d]">EcomXtra support</p>
                  <h3 className="mt-3 font-clash text-xl font-bold">A partner for your marketplace operations.</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-200">Tell us where you sell—or want to launch—and we’ll help map the next step.</p>
                </div>
                <Link onClick={() => onServicesMenuOpenChange(false)} to="/contact" className="mt-5 inline-flex items-center justify-between rounded-lg bg-white px-3 py-2.5 text-xs font-bold text-[#243141]">
                  Talk to our team <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden mt-2 bg-white rounded-2xl border border-slate-200 px-6 py-4 flex flex-col gap-3 shadow-2xl pointer-events-auto">
            {navLinks.map(link => link.path === '/services' ? (
              <div key={link.label}>
                <NavLink
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block py-1 text-sm font-semibold transition-colors ${
                      isActive ? 'text-violet-600 font-extrabold' : 'text-slate-800 hover:text-violet-600'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
                <div className="ml-3 mt-2 space-y-1 border-l border-slate-200 pl-3">
                  {marketplaceServiceDefaults.map(service => (
                    <Link
                      key={service.slug}
                      to={`/services/${service.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="block py-1.5 text-xs font-medium text-slate-600 hover:text-[#a54f21]"
                    >
                      <span className="inline-flex items-center gap-2">
                        <MarketplaceLogo service={service} />
                        {service.title.replace(' Account Management Services', '')} account management
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                key={link.label}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-semibold py-1 transition-colors ${
                    isActive ? 'text-violet-600 font-extrabold' : 'text-slate-800 hover:text-violet-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 text-white text-xs font-bold px-5 py-2.5 rounded-full text-center shadow-md shadow-violet-500/20 mt-1"
            >
              Book Consultation
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
